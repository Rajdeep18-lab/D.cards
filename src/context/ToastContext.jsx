import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext(null);

const ICONS = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const COLORS = {
  success: {
    bg: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(22,163,74,0.1))",
    border: "rgba(34,197,94,0.35)",
    icon: "#22c55e",
    text: "#15803d",
  },
  error: {
    bg: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(185,28,28,0.1))",
    border: "rgba(239,68,68,0.35)",
    icon: "#ef4444",
    text: "#b91c1c",
  },
  info: {
    bg: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(59,130,246,0.08))",
    border: "rgba(37,99,235,0.3)",
    icon: "#2563EB",
    text: "#1D4ED8",
  },
  warning: {
    bg: "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(161,98,7,0.1))",
    border: "rgba(234,179,8,0.35)",
    icon: "#eab308",
    text: "#92400e",
  },
};

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3200) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const c = COLORS[toast.type] || COLORS.info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  backdropFilter: "blur(16px)",
                  borderRadius: "14px",
                  padding: "12px 16px",
                  minWidth: "260px",
                  maxWidth: "340px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  pointerEvents: "all",
                  cursor: "pointer",
                }}
                onClick={() => removeToast(toast.id)}
              >
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: `${c.icon}22`,
                    border: `1.5px solid ${c.icon}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    color: c.icon,
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  {ICONS[toast.type]}
                </span>
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: "500",
                    color: c.text,
                    lineHeight: "1.4",
                  }}
                >
                  {toast.message}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return (message, type) => console.log(`[Toast Fallback - ${type || 'info'}]:`, message);
  }
  return ctx;
}
