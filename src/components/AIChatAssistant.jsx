import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiChatService } from '../services/aiChatService';
import { useAuth } from '../hooks/useAuth';

const QUICK_ACTIONS = [
  { label: "RuPay Cards 💳", query: "Show me the best RuPay Debit Card" },
  { label: "Visa Cards 💳", query: "Show me Visa Debit Cards" },
  { label: "Zero Annual Fee 🆓", query: "Show me Zero Annual Fee Debit Cards" },
  { label: "SBI Cards 🏦", query: "Show me SBI Debit Cards" },
  { label: "HDFC Cards 🏦", query: "Show me HDFC Debit Cards" },
  { label: "ATM Limits 🏧", query: "Show me ATM Withdrawal Limits" },
  { label: "Lounge Access ✈️", query: "Which cards offer Airport Lounge Access?" },
  { label: "Contactless Cards 📱", query: "Show me Contactless Cards" },
  { label: "Cashback Cards 🎁", query: "Show me Cashback Cards" },
  { label: "Platinum Cards 💎", query: "Show me Platinum Cards" },
  { label: "Compare Cards 📊", query: "Compare Debit Cards" }
];

const INITIAL_WELCOME = {
  id: "welcome-1",
  sender: "bot",
  text: "👋 Welcome to D.Card AI Assistant!\n\nI answer your questions **strictly using our live Firebase Firestore database** with zero hallucination. Ask me about RuPay, Visa, Zero Fee cards, Lounge Access, ATM limits, or Compare Cards!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

function AIChatAssistant({ onOpenContact }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [lastMatchedCards, setLastMatchedCards] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Restore chat history from Firestore for logged-in users on mount or login
  useEffect(() => {
    let isMounted = true;
    if (user?.uid) {
      aiChatService.loadUserChatHistory(user.uid).then(savedMsgs => {
        if (isMounted && Array.isArray(savedMsgs) && savedMsgs.length > 0) {
          setMessages(savedMsgs);
        }
      });
    }
    return () => { isMounted = false; };
  }, [user?.uid]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isSearching]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isSearching) return;

    const userMsg = {
      id: Date.now() + "-user",
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue("");
    setIsSearching(true);

    try {
      // Pass conversational context (e.g. previous search result set)
      const chatContext = { lastMatchedCards };
      const response = await aiChatService.sendMessage(query, user, chatContext);

      if (response.matchedCards && response.matchedCards.length > 0) {
        setLastMatchedCards(response.matchedCards);
      }

      const botMsg = {
        id: Date.now() + "-bot",
        sender: "bot",
        text: response.text,
        type: response.type,
        timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedHistory = [...newMessages, botMsg];
      setMessages(updatedHistory);

      // Save chat history to Firestore for logged-in users
      if (user?.uid) {
        await aiChatService.saveUserChatHistory(user.uid, updatedHistory);
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + "-error",
        sender: "bot",
        text: "Sorry, I couldn't find any matching debit card in our database.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([INITIAL_WELCOME]);
    setLastMatchedCards([]);
    if (user?.uid) {
      await aiChatService.saveUserChatHistory(user.uid, [INITIAL_WELCOME]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          aria-label="Open AI Assistant Chat"
          className="relative group flex items-center gap-2.5 py-3 px-4 sm:px-5 rounded-full bg-gradient-to-r from-[#860038] via-[#C21875] to-[#A30D62] text-white font-black text-xs sm:text-sm shadow-[0_8px_30px_rgba(194,24,117,0.4)] border border-white/20 cursor-pointer overflow-hidden"
        >
          {/* Ambient Glow Ring */}
          <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-25 pointer-events-none" />
          
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-base sm:text-lg shadow-inner">
            🤖
          </div>

          <span className="hidden sm:inline font-serif font-black tracking-tight">
            Ask Firestore AI
          </span>

          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white shadow-sm" title="Firestore AI Online" />
        </motion.button>
      )}

      {/* Floating Chat Window Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : '530px'
            }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="w-[360px] sm:w-[430px] max-w-[94vw] rounded-3xl bg-white/95 dark:bg-[#0d0714]/95 border border-secondary/25 shadow-[0_24px_80px_rgba(122,15,82,0.35)] backdrop-blur-2xl flex flex-col overflow-hidden text-left font-sans transition-all duration-300"
          >
            {/* Header Bar */}
            <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-[#860038] via-[#C21875] to-[#7A0F52] text-white flex items-center justify-between shadow-md flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg border border-white/20">
                  🤖
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black font-serif tracking-tight leading-none">
                    D.Card Firestore AI Assistant
                  </h3>
                  <p className="text-[9.5px] text-roseGold font-bold tracking-wider uppercase mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Strict Database Engine
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearChat}
                  title="Clear Chat History"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  🧹
                </button>

                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Maximize" : "Minimize"}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  {isMinimized ? "🗖" : "🗕"}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Body & Scroll Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
                  {messages.map((msg) => {
                    const isUser = msg.sender === "user";
                    const isNoMatch = msg.type === "no_match";

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-sm ${
                          isUser 
                            ? "bg-secondary text-white font-black" 
                            : "bg-gradient-to-br from-secondary to-primary text-white"
                        }`}>
                          {isUser ? "👤" : "🤖"}
                        </div>

                        {/* Speech Bubble */}
                        <div className={`max-w-[84%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                          isUser
                            ? "bg-gradient-to-r from-secondary to-primary text-white rounded-tr-none shadow-md font-medium"
                            : isNoMatch
                            ? "bg-rose-950/40 text-rose-200 border border-rose-500/30 rounded-tl-none font-medium"
                            : "bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/10 rounded-tl-none font-medium"
                        }`}>
                          <div className="whitespace-pre-line font-sans">
                            {msg.text}
                          </div>
                          
                          <div className={`text-[9px] font-bold text-right mt-1 ${isUser ? "text-white/70" : "text-slate-400"}`}>
                            {msg.timestamp}
                          </div>

                          {/* Fallback Contact Button if No Match or Support Needed */}
                          {isNoMatch && onOpenContact && (
                            <div className="pt-2 border-t border-rose-500/30 mt-2">
                              <button
                                onClick={onOpenContact}
                                className="w-full py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[10.5px] font-bold cursor-pointer transition-colors text-center"
                              >
                                📩 Ask Support Team to Add This Card
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Loading & Firestore Query Animation */}
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-slate-400 text-xs pl-9 py-1"
                    >
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px] font-bold text-secondary dark:text-roseGold animate-pulse">
                        Searching Firestore database...
                      </span>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Horizontal Tray */}
                <div className="px-3 py-2 bg-slate-50 dark:bg-black/40 border-t border-slate-200/60 dark:border-white/10 overflow-x-auto flex gap-1.5 custom-scrollbar flex-shrink-0">
                  {QUICK_ACTIONS.map((act) => (
                    <button
                      key={act.label}
                      onClick={() => handleSendMessage(act.query)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-black whitespace-nowrap bg-white dark:bg-white/10 text-secondary dark:text-roseGold border border-secondary/20 hover:bg-secondary/15 transition-colors cursor-pointer shadow-2xs"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                {/* Form Controls */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="p-3 bg-white dark:bg-[#0d0714] border-t border-slate-200/60 dark:border-white/10 flex items-center gap-2 flex-shrink-0"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask: RuPay, Visa, Zero Fee, Lounge, SBI..."
                    className="flex-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2 text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-secondary transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isSearching}
                    className="w-8 h-8 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-bold flex items-center justify-center text-xs shadow-md disabled:opacity-40 cursor-pointer"
                  >
                    ➔
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIChatAssistant;
