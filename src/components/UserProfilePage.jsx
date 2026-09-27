import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { compareService } from '../services/compareService';
import { debitCards } from '../data/mockData';
import { savingsAccounts } from '../data/mockSavingsAccounts';
import { currentAccounts } from '../data/currentAccounts';
import { INDIAN_LOCATIONS } from '../data/locations';
import { getRecentlyViewed } from '../utils/recentlyViewedUtils';

// Profile sub-components
import ProfileSidebar from './profile/ProfileSidebar';
import ProfileHeader from './profile/ProfileHeader';
import ProfileOverview from './profile/ProfileOverview';
import ProfileSavedAccounts from './profile/ProfileSavedAccounts';
import ProfileSavedDebitCards from './profile/ProfileSavedDebitCards';
import ProfileComparisons from './profile/ProfileComparisons';
import ProfileRecentlyViewed from './profile/ProfileRecentlyViewed';
import ProfilePreferences from './profile/ProfilePreferences';
import ProfileSettings from './profile/ProfileSettings';
import ProfileEditProfile from './profile/ProfileEditProfile';

/* ── Type detection helpers (identical to original) ── */
function isCurrentAccountItem(item) {
  if (!item) return false;
  return (
    item.productType === 'currentAccount' ||
    item.category === 'current_account' ||
    Boolean(item.businessConstitution) ||
    Boolean(item.cashDepositLimit) ||
    (item.product_id && String(item.product_id).toLowerCase().includes('current')) ||
    (item.accountName && String(item.accountName).toLowerCase().includes('current account')) ||
    (item.accountType && String(item.accountType).toLowerCase().includes('current'))
  );
}

function isSavingsAccountItem(item) {
  if (!item) return false;
  if (isCurrentAccountItem(item)) return false;
  return item.productType === 'savingsAccount' || Boolean(item.accountName);
}

function isDebitCardItem(item) {
  if (!item) return false;
  return !isCurrentAccountItem(item) && !isSavingsAccountItem(item);
}

/* ── Member initials helper ── */
function getInitials(fullName, email) {
  if (fullName && fullName.trim().length > 0) {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return 'M';
}

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

/* ═══════════════════════════════════════════════════════════════
   UserProfilePage
   The new two-column dashboard shell. All data/business logic
   preserved from the original implementation.
═══════════════════════════════════════════════════════════════ */
function UserProfilePage({ activeTab = 'overview', onSelectCard, onCompareCards, isDarkMode, toggleDarkMode }) {
  const { user, profile, updateProfile, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const toast = useToast();

  // ── Active section state ──
  const [activeSection, setActiveSection] = useState(activeTab || 'overview');

  // ── Profile form state ──
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('India');
  const [profileState, setProfileState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [profileImage, setProfileImage] = useState('');
  const [occupation, setOccupation] = useState('Working Professional');
  const [primaryNetworkPref, setPrimaryNetworkPref] = useState('Any');
  const [primaryGoalPref, setPrimaryGoalPref] = useState('Maximize Cashback');
  const [preferredCategory, setPreferredCategory] = useState('debitCard');
  const [displayMode, setDisplayMode] = useState('comfortable');

  // ── Notification prefs state ──
  const [notificationPrefs, setNotificationPrefs] = useState({
    feeChangeAlerts: true,
    loungeRuleUpdates: true,
    monthlyAuditReports: true,
    securityLoginAlerts: true,
    email: true,
    inApp: true,
  });

  // ── Save/success state ──
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // ── Comparison history state ──
  const [compareLogs, setCompareLogs] = useState([]);
  const [loadingCompareLogs, setLoadingCompareLogs] = useState(false);

  // ── Recently viewed (localStorage) ──
  const [recentItems, setRecentItems] = useState([]);

  // ── Sync activeTab prop ──
  useEffect(() => {
    if (activeTab) setActiveSection(activeTab);
  }, [activeTab]);

  // ── Sync profile data into form state ──
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || profile.name || '');
      setPhoneNumber(profile.phone || '');
      setCountry(profile.country || 'India');
      setProfileState(profile.state || 'Maharashtra');
      setCity(profile.city || 'Mumbai');
      setProfileImage(profile.profile_image || '');
      setOccupation(profile.occupation || 'Working Professional');
      if (profile.primary_network) setPrimaryNetworkPref(profile.primary_network);
      if (profile.primary_goal) setPrimaryGoalPref(profile.primary_goal);
      if (profile.preferred_category) setPreferredCategory(profile.preferred_category);
      if (profile.display_mode) setDisplayMode(profile.display_mode);
      if (profile.notification_preferences) {
        setNotificationPrefs((prev) => ({ ...prev, ...profile.notification_preferences }));
      }
    }
  }, [profile]);

  // ── Load comparison history when section becomes active ──
  useEffect(() => {
    if (activeSection === 'comparisons' && user?.id) {
      setLoadingCompareLogs(true);
      compareService
        .getComparisonHistory(user.id)
        .then((logs) => setCompareLogs(logs || []))
        .catch((err) => console.warn('Could not load compare history:', err))
        .finally(() => setLoadingCompareLogs(false));
    }
  }, [activeSection, user?.id]);

  // Also pre-load count for overview
  useEffect(() => {
    if (user?.id) {
      compareService
        .getComparisonHistory(user.id)
        .then((logs) => setCompareLogs(logs || []))
        .catch(() => {});
    }
  }, [user?.id]);

  // ── Load recently viewed from localStorage ──
  const refreshRecentItems = () => {
    setRecentItems(getRecentlyViewed());
  };
  useEffect(() => {
    refreshRecentItems();
  }, []);

  // ── Wishlist items with full product data ──
  const savedCardObjects = useMemo(() => {
    return wishlist.map((item) => {
      if (isCurrentAccountItem(item)) {
        const full = currentAccounts.find(
          (c) => String(c.id) === String(item.id) || String(c.product_id) === String(item.product_id)
        );
        return full || item;
      }
      if (isSavingsAccountItem(item)) {
        const full = savingsAccounts.find((s) => String(s.id) === String(item.id));
        return full || item;
      }
      const full = debitCards.find((c) => String(c.id) === String(item.id));
      return full || item;
    });
  }, [wishlist]);

  const savedDebitCardItems = useMemo(() => savedCardObjects.filter(isDebitCardItem), [savedCardObjects]);
  const savedSavingsItems = useMemo(() => savedCardObjects.filter(isSavingsAccountItem), [savedCardObjects]);
  const savedCurrentItems = useMemo(() => savedCardObjects.filter(isCurrentAccountItem), [savedCardObjects]);

  // ── Derived helpers ──
  const memberInitials = useMemo(() => getInitials(fullName, user?.email), [fullName, user?.email]);
  const availableCities = INDIAN_LOCATIONS[profileState] || ['Other'];

  // ── Handlers ──
  const handleSaveProfile = async () => {
    if (savingProfile) return;
    setSavingProfile(true);
    setSavedSuccess(false);
    try {
      const updated = await updateProfile({
        full_name: String(fullName || '').trim(),
        name: String(fullName || '').trim(),
        phone: String(phoneNumber || '').trim(),
        country: String(country || '').trim(),
        state: String(profileState || '').trim(),
        city: String(city || '').trim(),
        profile_image: String(profileImage || '').trim(),
        occupation: String(occupation || '').trim(),
        primary_network: primaryNetworkPref,
        primary_goal: primaryGoalPref,
        preferred_category: preferredCategory,
        display_mode: displayMode,
        notification_preferences: notificationPrefs,
      });
      if (updated) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err) {
      toast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    if (savingProfile) return;
    setSavingProfile(true);
    try {
      await updateProfile({
        primary_network: primaryNetworkPref,
        primary_goal: primaryGoalPref,
        preferred_category: preferredCategory,
        display_mode: displayMode,
        notification_preferences: notificationPrefs,
      });
      toast('Preferences saved!', 'success');
    } catch {
      toast('Failed to save preferences.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleNotificationPref = (key) => {
    setNotificationPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      updateProfile({ notification_preferences: updated }).catch(() => {});
      return updated;
    });
  };

  const handleViewDetails = (item) => {
    if (onSelectCard) onSelectCard(item);
  };

  // ── Recently viewed view handler (also works for any item type) ──
  const handleViewRecentItem = (item) => {
    // Reconstruct product reference from saved product lists
    const id = item.id;
    if (item.type === 'debitCard') {
      const card = debitCards.find((c) => String(c.id) === String(id)) || { id, cardName: item.name, bank: item.bank };
      if (onSelectCard) onSelectCard(card);
    } else if (item.type === 'savingsAccount') {
      const acc = savingsAccounts.find((s) => String(s.id) === String(id)) || { id, accountName: item.name, bank: item.bank };
      if (onSelectCard) onSelectCard(acc);
    } else if (item.type === 'currentAccount') {
      const acc = currentAccounts.find((c) => String(c.id) === String(id) || String(c.product_id) === String(id)) || { id, accountName: item.name, bank: item.bank };
      if (onSelectCard) onSelectCard(acc);
    }
  };

  // ── Render active content section ──
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <ProfileOverview
            key="overview"
            savedSavingsCount={savedSavingsItems.length}
            savedCurrentCount={savedCurrentItems.length}
            savedDebitCardsCount={savedDebitCardItems.length}
            comparisonsCount={compareLogs.length}
            recentlyViewedCount={recentItems.length}
            totalSavedCount={savedCardObjects.length}
            onNavigate={setActiveSection}
          />
        );

      case 'saved-accounts':
        return (
          <ProfileSavedAccounts
            key="saved-accounts"
            savedSavingsItems={savedSavingsItems}
            savedCurrentItems={savedCurrentItems}
            onRemove={removeFromWishlist}
            onViewDetails={handleViewDetails}
          />
        );

      case 'saved-cards':
        return (
          <ProfileSavedDebitCards
            key="saved-cards"
            savedDebitCards={savedDebitCardItems}
            onRemove={removeFromWishlist}
            onViewDetails={handleViewDetails}
          />
        );

      case 'comparisons':
        return (
          <ProfileComparisons
            key="comparisons"
            compareLogs={compareLogs}
            loading={loadingCompareLogs}
          />
        );

      case 'recently-viewed':
        return (
          <ProfileRecentlyViewed
            key="recently-viewed"
            recentItems={recentItems}
            onRefresh={refreshRecentItems}
            onViewDetails={handleViewRecentItem}
          />
        );

      case 'preferences':
        return (
          <ProfilePreferences
            key="preferences"
            preferredCategory={preferredCategory}
            setPreferredCategory={setPreferredCategory}
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            primaryNetworkPref={primaryNetworkPref}
            setPrimaryNetworkPref={setPrimaryNetworkPref}
            primaryGoalPref={primaryGoalPref}
            setPrimaryGoalPref={setPrimaryGoalPref}
            notificationPrefs={notificationPrefs}
            onToggleNotification={toggleNotificationPref}
            onSave={handleSavePreferences}
            saving={savingProfile}
          />
        );

      case 'settings':
        return (
          <ProfileSettings
            key="settings"
            user={user}
            profile={profile}
            onEditProfile={() => setActiveSection('edit')}
            onLogout={logout}
          />
        );

      case 'edit':
        return (
          <ProfileEditProfile
            key="edit"
            user={user}
            fullName={fullName}
            setFullName={setFullName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            memberInitials={memberInitials}
            onSave={handleSaveProfile}
            onCancel={() => setActiveSection('overview')}
            saving={savingProfile}
            savedSuccess={savedSuccess}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 select-none">
      {/* ── Profile Header (full width) ── */}
      <ProfileHeader
        user={user}
        profile={profile}
        memberInitials={memberInitials}
        profileImage={profileImage}
        onEditProfile={() => setActiveSection('edit')}
      />

      {/* ── Main layout wrapper ── */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

        {/* Sidebar: handles both desktop (sticky vertical) + mobile (horizontal scroll tabs) in one component */}
        <ProfileSidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          user={user}
          profile={profile}
          memberInitials={memberInitials}
          profileImage={profileImage}
          wishlistCount={savedCardObjects.length}
          onLogout={logout}
        />

        {/* Main content area */}
        <main className="flex-1 min-w-0 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              {...pageTransition}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default UserProfilePage;
