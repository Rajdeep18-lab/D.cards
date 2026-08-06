import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { wishlistService } from "../services/wishlistService";
import { debitCards } from "../data/mockData";
import { useToast } from "./ToastContext";

const WishlistContext = createContext(null);

const STORAGE_KEY = "dcards_wishlist";

export function WishlistProvider({ children }) {
  const { user, setIsAuthModalOpen } = useAuth();
  const toast = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to load fallback local wishlist for guest sessions
  const getLocalWishlist = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Sync / Load wishlist based on active Auth Session status
  useEffect(() => {
    async function loadAndSync() {
      if (user) {
        setLoading(true);
        try {
          const local = getLocalWishlist();
          if (local.length > 0) {
            await wishlistService.syncWishlist(user.id, local);
            localStorage.removeItem(STORAGE_KEY);
          }
          
          const fetchedItems = await wishlistService.getWishlist(user.id);
          const items = fetchedItems || [];
          const fullCards = items.map(item => {
            const cardId = item.card_id || item.id || item.card?.id;
            const match = debitCards.find(c => String(c.id) === String(cardId));
            return match || item.card || { 
              id: cardId, 
              cardName: item.card_name || 'Debit Card', 
              bank: item.bank_name || 'Listed Bank', 
              annualFee: 0,
              rating: 4.0,
              benefits: "" 
            };
          });
          setWishlist(fullCards);
        } catch (err) {
          console.error("Firestore wishlist load/sync error: ", err);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlist(getLocalWishlist());
      }
    }
    loadAndSync();
  }, [user]);

  // Write to localStorage ONLY when user is guest (offline session)
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = useCallback(async (card) => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast("Please log in to save cards to your wishlist", "warning");
      return;
    }

    try {
      await wishlistService.saveCard(user.id, card);
      setWishlist(prev => [...prev, card]);
      toast(`"${card.cardName || card.name}" saved to your cloud wishlist ♥`, "success");
    } catch (err) {
      console.error("Wishlist error:", err);
      toast(err.message || "Failed to update database wishlist!", "error");
    }
  }, [user, toast, setIsAuthModalOpen]);

  const toggleWishlist = useCallback(async (card) => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast("Please log in to save cards to your wishlist", "warning");
      return;
    }

    const exists = wishlist.some((c) => String(c.id) === String(card.id));
    try {
      if (exists) {
        await wishlistService.removeCard(user.id, card.id);
        setWishlist(prev => prev.filter(c => String(c.id) !== String(card.id)));
        toast(`"${card.cardName || card.name}" removed from your wishlist`, "info");
      } else {
        await addToWishlist(card);
      }
    } catch (err) {
      console.error("Firestore wishlist toggle error: ", err);
      toast(err.message || "Failed to update database wishlist!", "error");
    }
  }, [wishlist, user, toast, setIsAuthModalOpen, addToWishlist]);

  const isWishlisted = useCallback(
    (id) => wishlist.some((c) => String(c.id) === String(id)),
    [wishlist]
  );

  const removeFromWishlist = useCallback(async (id) => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast("Please log in to manage your wishlist", "warning");
      return;
    }

    try {
      await wishlistService.removeCard(user.id, id);
      setWishlist(prev => prev.filter(c => String(c.id) !== String(id)));
      toast("Card removed from your cloud wishlist", "info");
    } catch (err) {
      toast("Failed to delete bookmark from database!", "error");
      console.error("Firestore wishlist remove error: ", err);
    }
  }, [user, toast, setIsAuthModalOpen]);

  const clearWishlist = useCallback(async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast("Please log in to manage your wishlist", "warning");
      return;
    }

    try {
      await wishlistService.clearAllWishlist(user.id);
      setWishlist([]);
      toast("Your cloud wishlist has been cleared", "info");
    } catch (err) {
      toast("Failed to clear database wishlist!", "error");
      console.error("Firestore wishlist clear error: ", err);
    }
  }, [user, toast, setIsAuthModalOpen]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted, removeFromWishlist, clearWishlist, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    return {
      wishlist: [],
      toggleWishlist: () => {},
      isWishlisted: () => false,
      removeFromWishlist: () => {},
      clearWishlist: () => {},
      loading: false
    };
  }
  return ctx;
}
