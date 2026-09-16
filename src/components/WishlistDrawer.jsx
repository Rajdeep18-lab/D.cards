import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import DebitCardVisual from "./DebitCardVisual";
import BankLogo from "./BankLogo";

function WishlistCardItem({ card, onViewDetails, onClose }) {
  const { removeFromWishlist } = useWishlist();

  const handleRemove = () => {
    removeFromWishlist(card.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{
        background: "linear-gradient(135deg, rgba(239,246,255,0.7), rgba(255,255,255,0.9))",
        border: "1px solid rgba(37,99,235,0.15)",
        borderRadius: "16px",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backdropFilter: "blur(8px)",
      }}
    >
      <DebitCardVisual mode="wishlist" card={card} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: "700", fontSize: "13px", color: "#1F2937", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {card.cardName}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "2px 0 0" }}>
          <BankLogo bankName={card.bank} size="xs" />
          <p style={{ fontSize: "11px", color: "#2563EB", margin: 0, fontWeight: 600 }}>{card.bank}</p>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <span style={{ fontSize: "10px", color: "#555", background: "rgba(37,99,235,0.08)", padding: "1px 6px", borderRadius: "99px" }}>
            ₹{card.annualFee}/yr
          </span>
          <span style={{ fontSize: "10px", color: "#555", background: "rgba(37,99,235,0.08)", padding: "1px 6px", borderRadius: "99px" }}>
            ★ {card.rating}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
        <button
          onClick={() => { onViewDetails(card); onClose(); }}
          style={{
            fontSize: "10px", fontWeight: "600", color: "#2563EB",
            background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)",
            borderRadius: "6px", padding: "3px 8px", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.background = "rgba(37,99,235,0.16)"}
          onMouseLeave={(e) => e.target.style.background = "rgba(37,99,235,0.08)"}
        >
          View
        </button>
        <button
          onClick={handleRemove}
          style={{
            fontSize: "10px", fontWeight: "600", color: "#ef4444",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "6px", padding: "3px 8px", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.background = "rgba(239,68,68,0.16)"}
          onMouseLeave={(e) => e.target.style.background = "rgba(239,68,68,0.08)"}
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
}

function WishlistDrawer({ isOpen, onClose, onViewDetails }) {
  const { wishlist, clearWishlist } = useWishlist();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleClear = () => {
    clearWishlist();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(15,23,42,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
            }}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "min(380px, 92vw)",
              background: 'var(--drawer-bg)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(37,99,235,0.18)',
              boxShadow: '-8px 0 48px rgba(15,23,42,0.18)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 20px 16px",
                borderBottom: "1px solid rgba(37,99,235,0.12)",
                background: "linear-gradient(135deg, rgba(239,246,255,0.8), rgba(248,250,252,0.6))",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                      color: "white",
                    }}
                  >
                    ♥
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#1F2937", fontFamily: "Poppins, sans-serif" }}>
                      Saved Cards
                    </h2>
                    <p style={{ margin: 0, fontSize: "12px", color: "#2563EB" }}>
                      {wishlist.length} {wishlist.length === 1 ? "card" : "cards"} saved
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    border: "1px solid rgba(37,99,235,0.2)",
                    background: "rgba(37,99,235,0.06)",
                    color: "#2563EB", fontSize: "16px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(37,99,235,0.15)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(37,99,235,0.06)"}
                  aria-label="Close wishlist"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {wishlist.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: "center", paddingTop: "60px" }}
                >
                  <div style={{ fontSize: "56px", marginBottom: "16px", opacity: 0.4 }}>♡</div>
                  <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: "#1F2937" }}>
                    No saved cards yet
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#6B7280", lineHeight: 1.6 }}>
                    Tap the heart icon on any card to save it here for easy access later.
                  </p>
                </motion.div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <AnimatePresence>
                    {wishlist.map((card) => (
                      <WishlistCardItem
                        key={card.id}
                        card={card}
                        onViewDetails={onViewDetails}
                        onClose={onClose}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div
                style={{
                  padding: "14px 20px",
                  borderTop: "1px solid rgba(37,99,235,0.12)",
                  background: "rgba(239,246,255,0.5)",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={handleClear}
                  style={{
                    flex: 1, padding: "10px", borderRadius: "12px", fontSize: "13px", fontWeight: "600",
                    border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)",
                    color: "#ef4444", cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(239,68,68,0.15)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(239,68,68,0.08)"}
                >
                  Clear All
                </button>
                <button
                  onClick={onClose}
                  style={{
                    flex: 2, padding: "10px", borderRadius: "12px", fontSize: "13px", fontWeight: "700",
                    background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                    color: "white", border: "none", cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(37,99,235,0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default WishlistDrawer;
