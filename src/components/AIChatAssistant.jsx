import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  X, 
  Minus, 
  Maximize2, 
  Trash2, 
  ShieldCheck, 
  CreditCard, 
  Plane, 
  Gift, 
  CheckCircle2, 
  Zap,
  ArrowRight,
  RefreshCw,
  Layers,
  Percent,
  Check,
  Scale,
  Heart,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { aiChatService } from '../services/aiChatService';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';

const QUICK_ACTIONS = [
  { label: "Zero Balance Savings", query: "Which savings account has zero minimum balance?" },
  { label: "Compare Savings", query: "Compare SBI and HDFC savings accounts" },
  { label: "Student Savings Account", query: "Which savings account is suitable for a student?" },
  { label: "Account Debit Card", query: "What debit card comes with SBI Savings Plus Account?" },
  { label: "Online Video KYC", query: "Which savings accounts can be opened online?" },
  { label: "Airport Lounge Cards", query: "Which debit cards offer Airport Lounge Access?" },
  { label: "Zero Annual Fee Cards", query: "Show me Zero Annual Fee Debit Cards" },
  { label: "Cashback Cards", query: "Show me Cashback Debit Cards" },
  { label: "RuPay Cards", query: "Show me the best RuPay Debit Card" },
  { label: "Senior Citizen Accounts", query: "Show me senior citizen savings accounts" }
];

const STARTER_PROMPTS = [
  { label: "Zero Balance Savings", query: "Which savings account has zero minimum balance?" },
  { label: "Compare SBI vs HDFC", query: "Compare SBI and HDFC savings accounts" },
  { label: "Student Savings Account", query: "Which savings account is suitable for a student?" },
  { label: "Account Debit Card Perks", query: "What debit card comes with SBI Savings Plus Account?" },
  { label: "Online Video KYC Accounts", query: "Which savings accounts can be opened online?" }
];

function AIChatAssistant({ 
  onOpenContact, 
  embeddedPage = false, 
  externalQuery = null, 
  isCompareActive = false, 
  compareDockHeight = 0,
  onSelectDebitCard,
  toggleCompareQueue,
  setSavingsCompareQueue
}) {
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(embeddedPage);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [conversationState, setConversationState] = useState({});

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
      const chatContext = { conversationState };
      const response = await aiChatService.sendMessage(query, user, chatContext);

      if (response.conversationState) {
        setConversationState(response.conversationState);
      }

      const botMsg = {
        id: Date.now() + "-bot",
        sender: "bot",
        text: response.text,
        type: response.type,
        matchedAccounts: response.matchedAccounts || [],
        matchedCards: response.matchedCards || [],
        timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedHistory = [...newMessages, botMsg];
      setMessages(updatedHistory);

      if (user?.uid) {
        await aiChatService.saveUserChatHistory(user.uid, updatedHistory);
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + "-error",
        sender: "bot",
        text: "I'm having trouble connecting to the AI service right now. You can still explore D.CARD's verified products manually.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    setConversationState({});
    if (user?.uid) {
      await aiChatService.saveUserChatHistory(user.uid, []);
    }
  };

  return (
    <div
      className={
        embeddedPage
          ? "w-full h-full min-h-[680px] flex flex-col"
          : "fixed right-4 sm:right-6 z-50 select-none transition-[bottom] duration-300 ease-out"
      }
      style={
        embeddedPage
          ? {}
          : {
              bottom: isCompareActive
                ? `calc(1.5rem + var(--compare-dock-height, ${compareDockHeight || 80}px) + 12px + env(safe-area-inset-bottom, 0px))`
                : `calc(1.5rem + env(safe-area-inset-bottom, 0px))`
            }
      }
    >
      {/* Floating Trigger Button (hidden in embedded page mode) */}
      {!isOpen && !embeddedPage && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open D.CARD AI Advisor"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0B3D91] via-[#2563EB] to-[#3B82F6] text-white font-extrabold text-xs shadow-[0_8px_30px_rgba(37,99,235,0.45)] border border-white/20 hover:brightness-110 cursor-pointer transition-all"
        >
          <Bot className="w-4 h-4 text-white" />
          <span>D.CARD AI Advisor</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white shadow-sm" title="AI Advisor Online" />
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
              height: isMinimized ? '64px' : embeddedPage ? '100%' : 'min(680px, calc(85vh - var(--compare-dock-height, 0px)))'
            }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`${
              embeddedPage 
                ? "w-full h-full" 
                : "w-[calc(100vw-16px)] max-w-[430px] sm:w-[500px] lg:w-[900px] sm:max-w-[90vw] max-h-[calc(100vh-var(--compare-dock-height,0px)-32px)] sm:max-h-[calc(100vh-var(--compare-dock-height,0px)-100px)]"
            } rounded-3xl bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.35)] backdrop-blur-2xl flex flex-col overflow-hidden text-left transition-all duration-300`}
          >
            {/* Header Bar */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#0B3D91] via-[#1E3A8A] to-[#1E293B] text-white flex items-center justify-between shadow-md flex-shrink-0 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white border border-[#3B82F6]/40 shadow-sm flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight leading-none text-white flex items-center gap-2">
                    D.CARD AI Advisor
                  </h3>
                  <p className="text-[10.5px] text-[#60A5FA] font-semibold tracking-wide uppercase mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AI Powered Financial Intelligence</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearChat}
                  title="Clear Chat History"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {!embeddedPage && (
                  <>
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      title={isMinimized ? "Maximize" : "Minimize"}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                    >
                      {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setIsOpen(false)}
                      title="Close Assistant"
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Chat Body & Scroll Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar text-xs min-h-0 bg-[#F8FAFC]/50 dark:bg-[#0F172A]/50">
                  {/* Empty / Welcome State */}
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-6 my-auto"
                    >
                      <div className="flex items-center gap-4 border-b border-[#E5E7EB] dark:border-slate-800 pb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-extrabold text-[#1F2937] dark:text-white">
                            Welcome to D.CARD AI Advisor
                          </h4>
                          <p className="text-xs text-[#6B7280] dark:text-slate-400 font-normal">
                            Your verified financial assistant powered by live Indian banking data.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <span className="text-[11px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider block">
                          I can help you with:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-[#1F2937] dark:text-slate-200">
                          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EFF6FF] dark:bg-slate-800/60 border border-[#2563EB]/10">
                            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                            <span>Debit Cards & Features</span>
                          </div>
                          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EFF6FF] dark:bg-slate-800/60 border border-[#2563EB]/10">
                            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                            <span>Savings Accounts & Rates</span>
                          </div>
                          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EFF6FF] dark:bg-slate-800/60 border border-[#2563EB]/10">
                            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                            <span>Savings Account → Debit Card</span>
                          </div>
                          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EFF6FF] dark:bg-slate-800/60 border border-[#2563EB]/10">
                            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                            <span>Airport Lounge & Limits</span>
                          </div>
                          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EFF6FF] dark:bg-slate-800/60 border border-[#2563EB]/10">
                            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                            <span>Side-by-Side Comparisons</span>
                          </div>
                          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EFF6FF] dark:bg-slate-800/60 border border-[#2563EB]/10">
                            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                            <span>Online Video KYC Accounts</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-[#E5E7EB] dark:border-slate-800">
                        <span className="text-[11px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider block">
                          Try asking:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {STARTER_PROMPTS.map((sp, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(sp.query)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 hover:bg-[#2563EB] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              💡 {sp.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Messages Flow */}
                  {messages.map((msg) => {
                    const isUser = msg.sender === "user";

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs flex-shrink-0 shadow-sm ${
                          isUser 
                            ? "bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white font-bold" 
                            : "bg-[#0B3D91] border border-[#2563EB]/40 text-white"
                        }`}>
                          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        {/* Speech Bubble */}
                        <div className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                          isUser
                            ? "bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white rounded-tr-none shadow-md font-medium"
                            : "bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-slate-100 border border-[#E5E7EB] dark:border-slate-800 rounded-tl-none shadow-soft font-normal"
                        }`}>
                          <div className="whitespace-pre-line leading-relaxed font-normal">
                            {msg.text}
                          </div>

                          {/* Action Buttons for Mentioned Accounts */}
                          {!isUser && msg.matchedAccounts && msg.matchedAccounts.length > 0 && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                Quick Account Actions:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {msg.matchedAccounts.map(acc => (
                                  <div key={acc.id} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px]">
                                    <span className="font-extrabold text-slate-800 dark:text-slate-100">{acc.bank}: {acc.accountName}</span>
                                    <button
                                      onClick={() => navigate(`/savings-accounts/${acc.id}`)}
                                      className="px-2 py-0.5 rounded bg-[#2563EB] text-white font-bold text-[10px] hover:bg-blue-700 cursor-pointer"
                                    >
                                      View Account
                                    </button>
                                    <button
                                      onClick={() => toggleWishlist(acc)}
                                      className={`p-1 rounded text-[10px] cursor-pointer ${isWishlisted(acc.id) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                                      title="Save to Favourites"
                                    >
                                      <Heart className={`w-3.5 h-3.5 ${isWishlisted(acc.id) ? 'fill-rose-500' : ''}`} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons for Mentioned Cards */}
                          {!isUser && msg.matchedCards && msg.matchedCards.length > 0 && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                Quick Card Actions:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {msg.matchedCards.map(c => (
                                  <div key={c.id} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px]">
                                    <span className="font-extrabold text-slate-800 dark:text-slate-100">{c.bank}: {c.cardName}</span>
                                    {onSelectDebitCard && (
                                      <button
                                        onClick={() => onSelectDebitCard(c)}
                                        className="px-2 py-0.5 rounded bg-[#2563EB] text-white font-bold text-[10px] hover:bg-blue-700 cursor-pointer"
                                      >
                                        View Debit Card
                                      </button>
                                    )}
                                    {toggleCompareQueue && (
                                      <button
                                        onClick={() => toggleCompareQueue(c)}
                                        className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] cursor-pointer hover:bg-slate-300"
                                      >
                                        Compare
                                      </button>
                                    )}
                                    <button
                                      onClick={() => toggleWishlist(c)}
                                      className={`p-1 rounded text-[10px] cursor-pointer ${isWishlisted(c.id) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                                      title="Save to Favourites"
                                    >
                                      <Heart className={`w-3.5 h-3.5 ${isWishlisted(c.id) ? 'fill-rose-500' : ''}`} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className={`text-[9.5px] font-medium text-right mt-1 ${isUser ? "text-white/80" : "text-[#6B7280] dark:text-slate-400"}`}>
                            {msg.timestamp}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* AI Thinking Animation State */}
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 text-xs pl-2 py-2"
                    >
                      <div className="w-8 h-8 rounded-2xl bg-[#0B3D91] border border-[#2563EB]/40 flex items-center justify-center text-white flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex items-center gap-2 text-[#2563EB] dark:text-[#60A5FA] font-bold">
                        <div className="flex gap-1.5 items-center">
                          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs font-semibold text-[#1F2937] dark:text-slate-200">
                          Searching Firestore & Analyzing Banking Context...
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Action Chips */}
                <div className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-slate-900 border-t border-b border-[#E5E7EB] dark:border-slate-800 overflow-x-auto flex gap-2 custom-scrollbar flex-shrink-0">
                  {QUICK_ACTIONS.map((act) => (
                    <button
                      key={act.label}
                      onClick={() => handleSendMessage(act.query)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 hover:bg-[#2563EB] hover:text-white dark:hover:bg-[#2563EB] transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                {/* Chat Form Controls */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="p-4 bg-white dark:bg-[#0F172A] border-t border-[#E5E7EB] dark:border-slate-800 flex items-center gap-3 flex-shrink-0"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about savings accounts, debit cards, lounge access, zero balance..."
                    className="flex-1 rounded-full bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 px-5 py-3.5 text-xs text-[#1F2937] dark:text-white font-normal outline-none focus:border-[#2563EB] transition-all shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isSearching}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-[0_0_18px_rgba(37,99,235,0.5)] text-white font-bold flex items-center justify-center text-xs shadow-md disabled:opacity-40 cursor-pointer active:scale-95 transition-all flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
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
