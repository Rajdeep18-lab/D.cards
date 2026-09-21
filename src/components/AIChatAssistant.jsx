import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, User, Send, X, Minus, Maximize2, Trash2,
  ShieldCheck, CreditCard, Plane, CheckCircle2,
  Heart, ChevronRight, Scale, Building2, RefreshCw,
} from 'lucide-react';
import { aiChatService } from '../services/aiChatService';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import BankLogo from './BankLogo';

/* ─── Static data ──────────────────────────────────────────────────────────── */

const QUICK_ACTIONS = [
  { label: 'Zero Balance Savings',  query: 'Which savings account has zero minimum balance?'         },
  { label: 'Student Account',       query: 'Which savings account is suitable for a student?'         },
  { label: 'SBI vs HDFC',           query: 'Compare SBI and HDFC savings accounts'                    },
  { label: 'Account Debit Card',    query: 'What debit card comes with SBI Savings Plus Account?'     },
  { label: 'Lounge Access',         query: 'Which debit cards offer airport lounge access?'            },
  { label: 'Online KYC Accounts',   query: 'Which savings accounts can be opened online via Video KYC?'},
  { label: 'Zero Annual Fee Cards', query: 'Show me zero annual fee debit cards'                      },
  { label: 'IDFC FIRST Tiers',      query: 'What are the IDFC FIRST Bank savings account tiers?'      },
];

const STARTER_PROMPTS = [
  { label: 'Zero Balance Savings',  query: 'Which savings account has zero minimum balance?'          },
  { label: 'Student Account',       query: 'Which savings account is suitable for a student?'         },
  { label: 'SBI vs HDFC',           query: 'Compare SBI and HDFC savings accounts'                    },
  { label: 'Account Debit Card',    query: 'What debit card comes with SBI Savings Plus Account?'     },
  { label: 'Lounge Access',         query: 'Which debit cards offer airport lounge access?'            },
  { label: 'Video KYC Accounts',    query: 'Which savings accounts can be opened online?'             },
];

/* ─── Sub-components ────────────────────────────────────────────────────────── */

/**
 * Compact inline product card shown inside an AI message bubble.
 * Used for both savings accounts and debit cards.
 */
function ProductMiniCard({ item, type, onView, onCompare, onSave, wishlisted }) {
  const isAccount = type === 'account';
  const name      = isAccount
    ? (item.accountName || item.variant_name || 'Account')
    : (item.cardName    || item.name          || 'Card');
  const bankName  = item.bank_name || item.bank || '';

  const m1Label = isAccount ? 'Interest'    : 'Annual Fee';
  const m1Value = isAccount
    ? (item.interest_rate  || item.interestRate || '—')
    : (item.annualFee      || item.annual_fee   || '—');
  const m2Label = isAccount ? 'Min Balance' : 'ATM Limit';
  const m2Value = isAccount
    ? (item.minimum_balance     || item.minimumBalance    || '—')
    : (item.cashWithdrawalLimit || item.atm_limit         || '—');

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
      <BankLogo bankName={bankName} size="sm" className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider truncate">{bankName}</p>
        <p className="text-xs font-bold text-gray-900 leading-snug truncate">{name}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">
          {m1Label}:{' '}
          <span className="font-semibold text-gray-700">{m1Value}</span>
          {' · '}
          {m2Label}:{' '}
          <span className="font-semibold text-gray-700">{m2Value}</span>
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onView}
          className="px-2.5 py-1 text-[10px] font-bold text-[#2563EB] bg-blue-50 rounded-lg hover:bg-[#2563EB] hover:text-white transition-all active:scale-95"
        >
          View
        </button>
        {onCompare && (
          <button
            onClick={onCompare}
            title="Add to compare"
            className="p-1 text-gray-300 hover:text-[#2563EB] transition-colors"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onSave}
          title={wishlisted ? 'Remove from saved' : 'Save'}
          className="p-1 transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-300 hover:text-rose-400'}`} />
        </button>
      </div>
    </div>
  );
}

/** Animated "Analyzing D.CARD product data..." indicator */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-200 shadow-sm inline-flex items-center gap-3">
        <div className="flex gap-1">
          {[0, 150, 300].map(delay => (
            <span
              key={delay}
              className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-gray-500">
          Analyzing D.CARD product data...
        </span>
      </div>
    </motion.div>
  );
}

function renderFormattedText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/** Welcome / empty state shown before first message */
function WelcomeState({ onPromptClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full py-12 px-6 space-y-6 text-center max-w-lg mx-auto"
    >
      {/* Bot Icon */}
      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-xs">
        <Bot className="w-6 h-6" />
      </div>

      {/* Heading */}
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-gray-900">What banking product are you looking for?</h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
          Ask questions about interest rates, zero-balance accounts, ATM limits, lounge access, or compare products side-by-side.
        </p>
      </div>

      {/* Starter Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-left pt-2">
        {STARTER_PROMPTS.slice(0, 4).map((sp, idx) => (
          <button
            key={idx}
            onClick={() => onPromptClick(sp.query)}
            className="p-3 rounded-xl bg-white border border-gray-200 hover:border-[#2563EB]/40 hover:bg-blue-50/30 hover:shadow-xs transition-all group flex flex-col justify-between gap-1 text-left active:scale-98"
          >
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider group-hover:text-[#2563EB] transition-colors">
              {sp.label}
            </span>
            <span className="text-xs font-semibold text-gray-700 leading-snug">
              "{sp.query}"
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */

function AIChatAssistant({
  onOpenContact,
  embeddedPage        = false,
  externalQuery       = null,
  isCompareActive     = false,
  compareDockHeight   = 0,
  onSelectDebitCard,
  toggleCompareQueue,
  setSavingsCompareQueue,
  onProductsFound,        // NEW: (payload: {accounts, cards, query}) → void
}) {
  const { user }                    = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate                    = useNavigate();

  const [isOpen,             setIsOpen]             = useState(embeddedPage);
  const [isMinimized,        setIsMinimized]         = useState(false);
  const [messages,           setMessages]            = useState([]);
  const [inputValue,         setInputValue]          = useState('');
  const [isSearching,        setIsSearching]         = useState(false);
  const [conversationState,  setConversationState]   = useState({});
  const [lastQuery,          setLastQuery]           = useState('');

  const chatContainerRef  = useRef(null);
  const inputRef          = useRef(null);

  /**
   * Scroll ONLY the chat container to the bottom.
   * Uses scrollTop on the container element — never touches window or document.
   * This prevents the page-level auto-scroll bug.
   */
  const scrollToBottom = useCallback(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  /* Handle query injected from parent page (sidebar prompt clicks) */
  useEffect(() => {
    if (externalQuery) {
      setIsOpen(true);
      setIsMinimized(false);
      handleSendMessage(externalQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalQuery]);

  /* Restore Firestore chat history for logged-in users */
  useEffect(() => {
    let alive = true;
    if (user?.uid) {
      aiChatService.loadUserChatHistory(user.uid).then(saved => {
        if (!alive || !Array.isArray(saved) || saved.length === 0) return;
        setMessages(saved);
        // Restore insights panel with the last bot response that had products
        if (onProductsFound) {
          const lastBot = [...saved].reverse().find(m => m.sender === 'bot');
          if (lastBot) {
            const accs   = lastBot.matchedAccounts  || [];
            const cards  = lastBot.matchedCards      || [];
            if (accs.length > 0 || cards.length > 0) {
              onProductsFound({ accounts: accs, cards });
            }
          }
        }
      });
    }
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  /* Auto-scroll ONLY when a new message is added — NOT on open/close/search state changes.
   * Gated by messages.length > 0 so it never fires on initial mount with an empty array.
   * The chat container scrolls; the page never moves. */
  const prevMessageCountRef = useRef(0);
  useEffect(() => {
    const current = messages.length;
    if (current > 0 && current !== prevMessageCountRef.current) {
      scrollToBottom();
    }
    prevMessageCountRef.current = current;
  }, [messages, scrollToBottom]);

  /* ── Core send handler ── */
  const handleSendMessage = useCallback(async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isSearching) return;

    setLastQuery(query);

    const userMsg = {
      id:        `${Date.now()}-user`,
      sender:    'user',
      text:      query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsSearching(true);

    try {
      const context  = { conversationState, conversationHistory: newMessages };
      const response = await aiChatService.sendMessage(query, user, context);

      if (response.conversationState) setConversationState(response.conversationState);

      const matchedAccounts = [
        ...(response.matchedAccounts        || []),
        ...(response.matchedCurrentAccounts || []),
      ];
      const matchedCards = response.matchedCards || [];

      const botMsg = {
        id:              `${Date.now()}-bot`,
        sender:          'bot',
        text:            response.text,
        type:            response.type,
        matchedAccounts,
        matchedCards,
        disclaimer:      response.disclaimer,
        timestamp:       response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedHistory = [...newMessages, botMsg];
      setMessages(updatedHistory);

      // Lift matched products to parent (for right-side insights panel)
      if (onProductsFound && (matchedAccounts.length > 0 || matchedCards.length > 0)) {
        onProductsFound({ accounts: matchedAccounts, cards: matchedCards, query });
      }

      if (user?.uid) aiChatService.saveUserChatHistory(user.uid, updatedHistory);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id:        `${Date.now()}-error`,
          sender:    'bot',
          type:      'error',
          text:      "Sorry, I couldn't process that request right now.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, isSearching, messages, conversationState, user, onProductsFound]);

  const handleClearChat = useCallback(async () => {
    setMessages([]);
    setConversationState({});
    if (user?.uid) await aiChatService.saveUserChatHistory(user.uid, []);
  }, [user]);

  const handleRetry = useCallback(() => {
    if (lastQuery) handleSendMessage(lastQuery);
  }, [lastQuery, handleSendMessage]);

  /* ── Shared: message list ── */
  const renderMessages = () => (
    <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5 min-h-0 bg-[#F9FAFB]">
      {messages.length === 0 && !isSearching && (
        <WelcomeState onPromptClick={handleSendMessage} />
      )}

      {messages.map(msg => {
        const isUser  = msg.sender === 'user';
        const isError = msg.type   === 'error';

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                isUser
                  ? 'bg-[#2563EB]'
                  : isError
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-[#2563EB]'
              }`}
            >
              {isUser
                ? <User className="w-4 h-4 text-white" />
                : isError
                ? <Bot className="w-4 h-4 text-amber-500" />
                : <Bot className="w-4 h-4 text-white" />
              }
            </div>

            {/* Content column */}
            <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>

              {/* Main bubble */}
              <div
                className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                  isUser
                    ? 'bg-[#2563EB] text-white rounded-tr-sm shadow-sm'
                    : isError
                    ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{renderFormattedText(msg.text)}</div>

                {/* Error actions */}
                {isError && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-amber-200">
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold hover:bg-amber-200 transition-colors active:scale-95"
                    >
                      <RefreshCw className="w-3 h-3" /> Try Again
                    </button>
                    <button
                      onClick={() => navigate('/debit-cards')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-50 transition-colors active:scale-95"
                    >
                      Continue Exploring
                    </button>
                  </div>
                )}
              </div>

              {/* Matched Savings / Current Accounts */}
              {!isUser && (msg.matchedAccounts?.length ?? 0) > 0 && (
                <div className="w-full space-y-1.5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-0.5">
                    Matching Accounts ({msg.matchedAccounts.length})
                  </p>
                  {msg.matchedAccounts.slice(0, 3).map(acc => (
                    <ProductMiniCard
                      key={acc.id}
                      item={acc}
                      type="account"
                      onView={() => navigate(`/savings-accounts/${acc.product_id || acc.id}`)}
                      onCompare={setSavingsCompareQueue ? () =>
                        setSavingsCompareQueue(prev => {
                          if (prev.some(a => String(a.id) === String(acc.id))) return prev;
                          if (prev.length >= 3) return prev;
                          return [...prev, acc];
                        }) : null
                      }
                      onSave={() => toggleWishlist(acc)}
                      wishlisted={isWishlisted(acc.id)}
                    />
                  ))}
                  {msg.matchedAccounts.length > 3 && (
                    <p className="text-[10px] text-gray-400 font-semibold px-0.5">
                      +{msg.matchedAccounts.length - 3} more accounts match your query
                    </p>
                  )}
                </div>
              )}

              {/* Matched Debit Cards */}
              {!isUser && (msg.matchedCards?.length ?? 0) > 0 && (
                <div className="w-full space-y-1.5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-0.5">
                    Matching Debit Cards ({msg.matchedCards.length})
                  </p>
                  {msg.matchedCards.slice(0, 3).map(card => (
                    <ProductMiniCard
                      key={card.id}
                      item={card}
                      type="card"
                      onView={() => {
                        if (onSelectDebitCard) onSelectDebitCard(card);
                        else navigate(`/debit-cards/${card.card_id || card.id}`);
                      }}
                      onCompare={toggleCompareQueue ? () => toggleCompareQueue(card) : null}
                      onSave={() => toggleWishlist(card)}
                      wishlisted={isWishlisted(card.id)}
                    />
                  ))}
                  {msg.matchedCards.length > 3 && (
                    <p className="text-[10px] text-gray-400 font-semibold px-0.5">
                      +{msg.matchedCards.length - 3} more cards match your query
                    </p>
                  )}
                </div>
              )}

              {/* Source / disclaimer */}
              {!isUser && msg.disclaimer && (
                <p className="text-[10px] text-gray-400 italic leading-snug px-0.5 max-w-sm">
                  {msg.disclaimer}
                </p>
              )}

              {/* Timestamp */}
              <p className={`text-[10px] font-medium px-0.5 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                {msg.timestamp}
              </p>
            </div>
          </motion.div>
        );
      })}

      {isSearching && <TypingIndicator />}
    </div>
  );

  /* ── Shared: quick action chips ── */
  const renderQuickChips = () => (
    <div className="px-4 py-2 border-t border-gray-100 overflow-x-auto flex gap-1.5 shrink-0 bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {QUICK_ACTIONS.map(act => (
        <button
          key={act.label}
          onClick={() => handleSendMessage(act.query)}
          disabled={isSearching}
          className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-[#F8FAFC] border border-gray-200 text-gray-600 hover:border-[#2563EB]/40 hover:text-[#2563EB] hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          {act.label}
        </button>
      ))}
    </div>
  );

  /* ── Shared: input form ── */
  const renderInput = () => (
    <form
      onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
      className="px-4 py-3 border-t border-gray-200/80 bg-white flex items-center gap-2.5 shrink-0"
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
        }}
        placeholder="Ask about savings accounts, debit cards or current accounts..."
        disabled={isSearching}
        className="flex-1 rounded-full bg-[#F8FAFC] border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#2563EB] focus:bg-white transition-all disabled:opacity-60"
        aria-label="Type your banking question"
      />
      {messages.length > 0 && (
        <button
          type="button"
          onClick={handleClearChat}
          title="Clear conversation"
          className="w-9 h-9 rounded-full border border-gray-200 bg-[#F8FAFC] hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all shrink-0 active:scale-95"
          aria-label="Clear conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
      <button
        type="submit"
        disabled={!inputValue.trim() || isSearching}
        title={isSearching ? 'Thinking…' : 'Send message'}
        className="w-10 h-10 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white flex items-center justify-center shadow-sm disabled:opacity-40 active:scale-95 transition-all shrink-0"
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );

  /* ══════════════════════════════════════════════════════════════════════════
   * EMBEDDED MODE  (on the AI Advisor page — no floating chrome needed)
   * ══════════════════════════════════════════════════════════════════════════ */
  if (embeddedPage) {
    return (
      <div className="w-full h-full flex flex-col min-h-0 rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
        {renderMessages()}
        {renderQuickChips()}
        {renderInput()}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
   * FLOATING WIDGET MODE  (appears on all other pages, bottom-right)
   * ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div
      className="fixed right-4 sm:right-6 z-50 select-none transition-[bottom] duration-300 ease-out"
      style={{
        bottom: isCompareActive
          ? `calc(1.5rem + ${compareDockHeight || 80}px + 12px + env(safe-area-inset-bottom, 0px))`
          : `calc(1.5rem + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      {/* Trigger button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open D.CARD AI Advisor"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 border border-blue-500/30 cursor-pointer transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>D.CARD AI Advisor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 border border-white shadow-sm" title="Online" />
        </motion.button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{
              opacity: 1, y: 0, scale: 1,
              height: isMinimized
                ? '60px'
                : 'min(660px, calc(85vh - var(--compare-dock-height, 0px)))',
            }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="w-[calc(100vw-16px)] max-w-[400px] sm:w-[460px] rounded-2xl bg-white border border-gray-200 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#2563EB] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/60 border border-blue-400/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-white leading-none">D.CARD AI Advisor</h3>
                  <p className="text-[10px] text-blue-200 font-semibold mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Banking Product Discovery
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Maximize' : 'Minimize'}
                  className="w-7 h-7 rounded-full bg-blue-500/60 hover:bg-blue-400/80 flex items-center justify-center text-white transition-colors"
                  aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="w-7 h-7 rounded-full bg-blue-500/60 hover:bg-blue-400/80 flex items-center justify-center text-white transition-colors"
                  aria-label="Close AI Advisor"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMinimized && (
              <>
                {renderMessages()}
                {renderQuickChips()}
                {renderInput()}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIChatAssistant;
