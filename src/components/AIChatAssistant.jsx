import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Sparkles, X, Minus, Maximize2, Trash2, ShieldCheck, CreditCard, Plane, Gift, Award, Zap } from 'lucide-react';
import { aiChatService } from '../services/aiChatService';
import { useAuth } from '../hooks/useAuth';

const QUICK_ACTIONS = [
  { label: "RuPay Cards", query: "Show me the best RuPay Debit Card" },
  { label: "Visa Cards", query: "Show me Visa Debit Cards" },
  { label: "Zero Annual Fee", query: "Show me Zero Annual Fee Debit Cards" },
  { label: "SBI Cards", query: "Show me SBI Debit Cards" },
  { label: "HDFC Cards", query: "Show me HDFC Debit Cards" },
  { label: "ATM Limits", query: "Show me ATM Withdrawal Limits" },
  { label: "Lounge Access", query: "Which cards offer Airport Lounge Access?" },
  { label: "Contactless Cards", query: "Show me Contactless Cards" },
  { label: "Cashback Cards", query: "Show me Cashback Cards" },
  { label: "Platinum Cards", query: "Show me Platinum Cards" },
  { label: "Compare Cards", query: "Compare Debit Cards" }
];

const INITIAL_WELCOME = {
  id: "welcome-1",
  sender: "bot",
  text: "Welcome to D.CARD AI Assistant!\n\nI answer your questions strictly using our verified database with zero bias. Ask me about RuPay, Visa, Zero Fee cards, Lounge Access, ATM limits, or Compare Cards!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

function AIChatAssistant({ onOpenContact, embeddedPage = false, externalQuery = null }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(embeddedPage);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [lastMatchedCards, setLastMatchedCards] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Trigger external query if passed from parent page
  useEffect(() => {
    if (externalQuery) {
      setIsOpen(true);
      setIsMinimized(false);
      handleSendMessage(externalQuery);
    }
  }, [externalQuery]);

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
    <div className={embeddedPage ? "w-full" : "fixed bottom-6 right-6 z-[1200] select-none"}>
      {/* Floating Trigger Button (hidden in embedded page mode) */}
      {!isOpen && !embeddedPage && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] text-white font-extrabold text-xs shadow-[0_8px_30px_rgba(37,99,235,0.45)] border border-white/20 hover:brightness-110 cursor-pointer transition-all"
        >
          <Bot className="w-4 h-4 text-white" />
          <span>Ask Firestore AI</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white shadow-sm" title="Firestore AI Online" />
        </motion.button>
      )}

      {/* Chat Window Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={embeddedPage ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : 'min(530px, 80vh)'
            }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`${embeddedPage ? "w-full" : "w-[360px] sm:w-[430px] max-w-[94vw]"} rounded-3xl bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.35)] backdrop-blur-2xl flex flex-col overflow-hidden text-left transition-all duration-300`}
          >
            {/* Header Bar */}
            <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex items-center justify-between shadow-md flex-shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-[#60A5FA] border border-[#2563EB]/40 shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight leading-none text-white">
                    D.CARD Firestore AI
                  </h3>
                  <p className="text-[9.5px] text-[#60A5FA] font-semibold tracking-wider uppercase mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Financial Assistant
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
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Maximize" : "Minimize"}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
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
                            ? "bg-[#2563EB] text-white font-bold" 
                            : "bg-[#0F172A] border border-[#2563EB]/40 text-[#60A5FA]"
                        }`}>
                          {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        </div>

                        {/* Speech Bubble */}
                        <div className={`max-w-[84%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                          isUser
                            ? "bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white rounded-tr-none shadow-md font-medium"
                            : isNoMatch
                            ? "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20 rounded-tl-none font-medium"
                            : "bg-[#F8FAFC] dark:bg-slate-800 text-[#1F2937] dark:text-slate-100 border border-[#E5E7EB] dark:border-slate-700 rounded-tl-none font-normal"
                        }`}>
                          <div className="whitespace-pre-line">
                            {msg.text}
                          </div>
                          
                          <div className={`text-[9px] font-medium text-right mt-1 ${isUser ? "text-white/70" : "text-[#6B7280]"}`}>
                            {msg.timestamp}
                          </div>

                          {/* Fallback Contact Button */}
                          {isNoMatch && onOpenContact && (
                            <div className="pt-2 border-t border-red-500/20 mt-2">
                              <button
                                onClick={onOpenContact}
                                className="w-full py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-500/20 text-[10.5px] font-semibold cursor-pointer transition-colors text-center"
                              >
                                Ask Support Team to Add This Card
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Loading Animation */}
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-[#6B7280] text-xs pl-9 py-1"
                    >
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px] font-semibold text-[#2563EB] dark:text-[#60A5FA] animate-pulse">
                        Searching database...
                      </span>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Horizontal Tray */}
                <div className="px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border-t border-[#E5E7EB] dark:border-slate-800 overflow-x-auto flex gap-1.5 custom-scrollbar flex-shrink-0">
                  {QUICK_ACTIONS.map((act) => (
                    <button
                      key={act.label}
                      onClick={() => handleSendMessage(act.query)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 hover:bg-[#2563EB]/10 transition-colors cursor-pointer shadow-sm"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                {/* Form Controls */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="p-3 bg-white dark:bg-[#0F172A] border-t border-[#E5E7EB] dark:border-slate-800 flex items-center gap-2 flex-shrink-0"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about RuPay, Visa, Zero Fee, Lounge..."
                    className="flex-1 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 px-3.5 py-2 text-xs text-[#1F2937] dark:text-white font-normal outline-none focus:border-[#2563EB] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isSearching}
                    className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-bold flex items-center justify-center text-xs shadow-md disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
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
