import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { wishlistService } from "../services/wishlistService";
import { debitCards } from "../data/mockData";
import { savingsAccounts } from "../data/mockSavingsAccounts";
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
          const fullItems = items.map(item => {
            const itemId = item.card_id || item.id || item.card?.id;
            const isSavings = item.productType === 'savingsAccount' || !!item.card?.accountName || !!item.accountName;
            if (isSavings) {
              const matchSavings = savingsAccounts.find(s => String(s.id) === String(itemId));
              return matchSavings || item.card || {
                id: itemId,
                accountName: item.card_name || item.accountName || 'Savings Account',
                bank: item.bank_name || 'Listed Bank',
                productType: 'savingsAccount'
              };
            }
            const matchCard = debitCards.find(c => String(c.id) === String(itemId));
            return matchCard || item.card || { 
              id: itemId, 
              cardName: item.card_name || 'Debit Card', 
              bank: item.bank_name || 'Listed Bank', 
              annualFee: 0,
              rating: 4.0,
              benefits: "",
              productType: 'debitCard'
            };
          });
          setWishlist(fullItems);
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

  const addToWishlist = useCallback(async (product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast("Please log in to save items to your wishlist", "warning");
      return;
    }

    const title = product.accountName || product.cardName || product.name || 'Product';
    try {
      await wishlistService.saveCard(user.id, product);
      setWishlist(prev => [...prev, product]);
      toast(`"${title}" saved to your cloud wishlist ♥`, "success");
    } catch (err) {
      console.error("Wishlist error:", err);
      toast(err.message || "Failed to update database wishlist!", "error");
    }
  }, [user, toast, setIsAuthModalOpen]);

  const toggleWishlist = useCallback(async (product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast("Please log in to save items to your wishlist", "warning");
      return;
    }

    const title = product.accountName || product.cardName || product.name || 'Product';
    const exists = wishlist.some((c) => String(c.id) === String(product.id));
    try {
      if (exists) {
        await wishlistService.removeCard(user.id, product.id);
        setWishlist(prev => prev.filter(c => String(c.id) !== String(product.id)));
        toast(`"${title}" removed from your wishlist`, "info");
      } else {
        await addToWishlist(product);
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
      toast("Item removed from your cloud wishlist", "info");
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
