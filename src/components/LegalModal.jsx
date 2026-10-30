import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Lock, Scale, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function LegalModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { isHindi } = useLanguage();

  const tabs = [
    { id: 'privacy', label: isHindi ? 'गोपनीयता नीति' : 'Privacy Policy', icon: Lock, emoji: '🔒' },
    { id: 'terms', label: isHindi ? 'नियम व शर्तें' : 'Terms & Conditions', icon: Scale, emoji: '⚖️' },
    { id: 'disclaimer', label: isHindi ? 'अस्वीकरण' : 'Disclaimer', icon: AlertTriangle, emoji: '⚠️' }
  ];

  // Sync tab state when modal is opened from different links
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent scroll propagation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay Container */}
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-auto select-none">
            {/* Backdrop */}
            <motion.div
              key="legal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-0"
            />

            {/* Modal Box */}
            <motion.div
              key="legal-modal"
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-[740px] max-h-[88vh] my-auto flex flex-col rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.35)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 pb-3 sm:pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0 bg-slate-50/60 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white text-lg sm:text-xl shadow-md shadow-[#2563EB]/25 flex-shrink-0">
                    ⚖️
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg sm:text-xl font-black text-[#0B3D91] dark:text-white tracking-tight leading-snug">
                      {isHindi ? 'D.Card कानूनी व अनुपालन केंद्र' : 'D.Card Trust Center'}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      {isHindi ? 'कानूनी मानक और डेटा प्रकटीकरण' : 'Startup-ready Legal Standards & Data Disclosures'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 hover:scale-105 active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="px-4 sm:px-6 pt-3.5 sm:pt-4 flex items-center gap-2 overflow-x-auto custom-scrollbar flex-shrink-0 pb-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5 flex-shrink-0 select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white shadow-md shadow-[#2563EB]/25 border border-transparent'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mt-3 flex-shrink-0" />

              {/* Scrollable Content Area */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-left text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 custom-scrollbar space-y-4">
                {activeTab === 'privacy' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <h3 className="text-base sm:text-lg font-black text-[#0B3D91] dark:text-white mb-3">
                      {isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      {isHindi ? (
                        <>
                          <strong className="text-slate-900 dark:text-white font-extrabold">D.Card</strong> में हम पूर्ण पारदर्शिता में विश्वास करते हैं। D.CARD बचत खातों और डेबिट कार्डों के लिए एक स्वतंत्र वित्तीय सूचना और तुलना मंच है, जो उपयोगकर्ताओं को खाता खोलने से पहले ब्याज दरों, शुल्कों, सीमाओं और सुविधाओं की तुलना करने में सहायता करता है। यह नीति स्पष्ट करती है कि हम कौन सा डेटा एकत्र करते हैं और कौन सी संवेदनशील जानकारी हम कभी एकत्र नहीं करते हैं।
                        </>
                      ) : (
                        <>
                          At <strong className="text-slate-900 dark:text-white font-extrabold">D.Card</strong>, we believe in radical transparency. D.CARD is an independent financial information and comparison platform for Savings Accounts and Debit Cards, designed to help users evaluate and compare savings account interest rates, debit card charges, limits, and features prior to opening a bank account. This policy outlines exactly what data we collect, where it resides, and what sensitive information we strictly do not collect.
                        </>
                      )}
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '1. हमारे द्वारा एकत्रित जानकारी' : '1. Information We Collect'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      {isHindi
                        ? 'क्लाउड-सिंक्रनाइज़्ड तुलना लॉग और सहेजे गए उत्पाद प्रदान करने के लिए, D.Card निम्नलिखित जानकारी एकत्र करता है:'
                        : 'To deliver cloud-synchronized comparison logs and wishlists, D.Card gathers the following categories of information:'}
                    </p>
                    <ul className="list-disc pl-5 mb-4 space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                      <li>
                        <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? 'खाता विवरण:' : 'Account Details:'}</strong>{' '}
                        {isHindi ? 'नाम, ईमेल और वैकल्पिक फ़ोन नंबर (पंजीकरण या प्रोफ़ाइल के दौरान)।' : 'Name, Email, and optional Phone number (provided during registration or update profile queries).'}
                      </li>
                      <li>
                        <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? 'सहेजे गए कार्ड:' : 'Saved Cards:'}</strong>{' '}
                        {isHindi ? 'आपकी पसंदीदा सूची में जोड़े गए चयनित डेबिट कार्ड और बैंक खाते।' : 'Selected debit cards added to your personalized Wishlist.'}
                      </li>
                      <li>
                        <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? 'तुलना इतिहास:' : 'Compare Activity:'}</strong>{' '}
                        {isHindi ? 'आपके द्वारा आमने-सामने तुलना किए गए कार्डों के पैरामीटर।' : 'Logged historical card parameters you evaluated side-by-side.'}
                      </li>
                      <li>
                        <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? 'संपर्क संदेश:' : 'Contact Messages:'}</strong>{' '}
                        {isHindi ? 'संपर्क फ़ॉर्म के माध्यम से भेजे गए प्रश्न, फ़ीडबैक या रिपोर्ट।' : 'Inquiries, feedback, and report logs dispatched via the contact forms.'}
                      </li>
                    </ul>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '2. Firebase में डेटा का सुरक्षित भंडारण' : '2. Data Stored Securely in Firebase'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      {isHindi ? (
                        <>
                          एकत्रित किया गया संपूर्ण डेटा हमारे <strong className="text-slate-900 dark:text-white font-bold">Firebase Firestore</strong> क्लाउड डेटाबेस में सुरक्षित और एन्क्रिप्टेड रूप से संग्रहीत होता है। आपका व्यक्तिगत डेटा कभी भी किसी तीसरे पक्ष के विज्ञापनदाताओं को नहीं बेचा जाता है।
                        </>
                      ) : (
                        <>
                          All gathered data is securely stored, authenticated, and guarded in our <strong className="text-slate-900 dark:text-white font-bold">Firebase Firestore</strong> cloud database layer. Your data is encrypted in transit and at rest using banking-standard secure access protocols. No profile datasets or log arrays are shared with third-party advertising brokers.
                        </>
                      )}
                    </p>

                    <div className="p-4 rounded-2xl mb-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs">
                      <h4 className="font-extrabold text-rose-700 dark:text-rose-400 uppercase text-xs tracking-wider mb-2 flex items-center gap-1.5">
                        {isHindi ? '❌ सुरक्षा प्रतिज्ञा: हम क्या कभी एकत्र नहीं करते' : '❌ Critical Security Pledge: What We Do NOT Collect'}
                      </h4>
                      <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-semibold">
                        {isHindi ? (
                          <>
                            D.CARD बचत खातों और डेबिट कार्डों के लिए एक स्वतंत्र वित्तीय सूचना मंच है। हम कोई बैंक या वित्तीय संस्थान नहीं हैं। हम निम्नलिखित संवेदनशील जानकारी <strong className="font-extrabold underline">कभी नहीं</strong> मांगते या संग्रहीत करते:
                          </>
                        ) : (
                          <>
                            D.CARD is an independent comparison and financial information platform covering Savings Accounts and Debit Cards. We are not a bank, NBFC, or financial institution. We will <strong className="font-extrabold underline">never</strong> ask for, collect, or store the following sensitive records:
                          </>
                        )}
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-rose-850 dark:text-rose-300 font-semibold">
                        <li>{isHindi ? 'एटीएम पिन नंबर (ATM PIN)' : 'ATM PIN numbers'}</li>
                        <li>{isHindi ? 'डेबिट कार्ड नंबर (PAN, CVV, समाप्ति तिथि)' : 'Debit card numbers (PAN/CVV/Expiry)'}</li>
                        <li>{isHindi ? 'इंटरनेट बैंकिंग पासवर्ड या क्रेडेंशियल' : 'Online bank passwords or credentials'}</li>
                        <li>{isHindi ? 'आधार नंबर (Aadhaar)' : 'Aadhaar number'}</li>
                        <li>{isHindi ? 'पैन कार्ड नंबर (PAN)' : 'PAN card number'}</li>
                        <li>{isHindi ? 'बैंक खाता संख्या या बैलेंस' : 'Bank account numbers'}</li>
                      </ul>
                    </div>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '3. हमसे संपर्क करें' : '3. Contacting Us & Privacy Inquiries'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-2 font-medium">
                      {isHindi ? 'गोपनीयता संबंधी प्रश्नों या डेटा हटाने के अनुरोध के लिए, कृपया संपर्क करें:' : 'For privacy clarifications, data deletion requests, or compliance inquiries, please contact our team at'}{' '}
                      <a href="mailto:dcard.website@gmail.com" className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline break-all">
                        dcard.website@gmail.com
                      </a>.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-6 font-medium">
                      {isHindi ? 'अंतिम अद्यतन: जून 2026' : 'Last updated: June 2026'}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'terms' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <h3 className="text-base sm:text-lg font-black text-[#0B3D91] dark:text-white mb-3">
                      {isHindi ? 'नियम व शर्तें (Terms & Conditions)' : 'Terms & Conditions'}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      {isHindi ? (
                        <>
                          <strong className="text-slate-900 dark:text-white font-extrabold">D.Card</strong> में आपका स्वागत है। ये नियम व शर्तें D.Card वेब इंटरफ़ेस के आपके उपयोग को नियंत्रित करती हैं। हमारी वेबसाइट का उपयोग करके आप इन शर्तों को स्वीकार करते हैं।
                        </>
                      ) : (
                        <>
                          Welcome to <strong className="text-slate-900 dark:text-white font-extrabold">D.Card</strong>. These Terms & Conditions govern your access to and usage of the D.Card web interface. By browsing, comparison-shopping, or logging into our application, you formally accept these terms.
                        </>
                      )}
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '1. सेवा का दायरा' : '1. Scope of Service'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      {isHindi
                        ? 'D.CARD बचत खातों और डेबिट कार्डों के लिए एक स्वतंत्र सूचना मंच है। D.CARD कोई बैंक, एनबीएफसी या भुगतान प्रणाली संचालक नहीं है। हम न तो ऋण या खाता आवेदन स्वीकृत करते हैं और न ही डेबिट कार्ड जारी करते हैं।'
                        : 'D.CARD is an independent financial information and comparison platform for Savings Accounts and Debit Cards. D.CARD is not a bank, NBFC, financial institution, payment system operator, or representative of any bank unless explicitly stated. We do not approve applications, nor do we issue cards.'}
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '2. उपयोगकर्ता आचरण' : '2. User Conduct & Accounts'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      {isHindi
                        ? 'आप अपने लॉगिन क्रेडेंशियल की गोपनीयता बनाए रखने के लिए पूरी तरह ज़िम्मेदार हैं। आप प्लेटफ़ॉर्म डेटा की अनधिकृत स्क्रैपिंग या स्वचालित बॉट चलाने से बचने के लिए सहमत हैं।'
                        : 'You are solely responsible for maintaining the privacy of your account login information. You agree not to engage in malicious scraping of card rates, scraping database content, or deploying automated bots to query the platform features.'}
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '3. तृतीय-पक्ष बैंकिंग सेवाएं' : '3. Third-Party Banking Services'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      {isHindi
                        ? 'हमारा मंच आधिकारिक बैंक वेबसाइटों के लिंक प्रदान करता है। बैंकों के ब्याज नियमों, सेवा शर्तों या संचालन पर हमारा कोई नियंत्रण नहीं है। किसी भी बैंक के साथ आपका संबंध उनके अपने नियमों द्वारा शासित होता है।'
                        : 'Our platform references links and redirect coordinates to official banking pages. We have no authority over the service level agreements, underwriting guidelines, interest structures, or operations of third-party banks. Your relationships with external banks are governed strictly by their respective terms of service.'}
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '4. देयता की सीमा' : '4. Limitation of Liability'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      {isHindi
                        ? 'किसी भी स्थिति में D.Card या इसके संस्थापक D.Card पर प्रदर्शित जानकारी के आधार पर किए गए वित्तीय निर्णयों से होने वाले किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए उत्तरदायी नहीं होंगे।'
                        : 'In no event shall D.Card, its founders, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from choices, deposits, or applications completed based on parameters shown on D.Card.'}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-6 font-medium">
                      {isHindi ? 'अंतिम अद्यतन: जून 2026' : 'Last updated: June 2026'}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'disclaimer' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <h3 className="text-base sm:text-lg font-black text-[#0B3D91] dark:text-white mb-3">
                      {isHindi ? 'नियामक एवं सूचना अस्वीकरण (Disclaimer)' : 'Regulatory & Information Disclaimer'}
                    </h3>
                    
                    <div className="p-4 rounded-2xl mb-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 shadow-xs">
                      <p className="text-xs font-extrabold text-amber-850 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        {isHindi ? '⚠️ महत्वपूर्ण अस्वीकरण: आवेदन करने से पहले सत्यापित करें' : '⚠️ Critical Disclaimer: Verify Before Applying'}
                      </p>
                      <p className="text-xs leading-relaxed font-semibold text-amber-900 dark:text-amber-200">
                        {isHindi
                          ? 'बचत खाता और डेबिट कार्ड की ब्याज दरें, शुल्क, पात्रता आवश्यकताएं, सीमाएं, लाभ और लाउंज एक्सेस नियम किसी भी समय बदल सकते हैं। वित्तीय निर्णय लेने से पहले सभी जानकारी की सीधे संबंधित बैंक की आधिकारिक वेबसाइट पर पुष्टि अवश्य करें।'
                          : 'Savings Account and Debit Card interest rates, fees, charges, eligibility requirements, limits, benefits, features, lounge access, and other product terms may change at any time. Users should verify all product details, eligibility requirements, fees, charges, benefits, and terms directly with the respective bank before opening an account, applying for a product, or making a financial decision.'}
                      </p>
                    </div>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '1. सामान्य सूचनात्मक उद्देश्य' : '1. Standard Platform Disclaimer'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      {isHindi
                        ? 'D.CARD पर प्रदर्शित जानकारी केवल सामान्य सूचना और तुलनात्मक उद्देश्यों के लिए प्रदान की जाती है। D.CARD किसी भी प्रकार की व्यक्तिगत वित्तीय, निवेश या कर सलाह प्रदान नहीं करता है।'
                        : 'The information displayed on D.CARD is provided for general informational and comparison purposes only. D.CARD does not guarantee product approval, eligibility, availability, pricing, benefits, or suitability for any individual. D.CARD does not provide personalized financial, investment, legal, or tax advice.'}
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '2. बौद्धिक संपदा प्रकटीकरण' : '2. Intellectual Property Disclaimer'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                      {isHindi
                        ? 'सभी बैंक लोगो, ब्रांड नाम और ट्रेडमार्क (जैसे Visa, Mastercard, RuPay) उनके संबंधित स्वामियों की संपत्ति हैं। D.CARD इन पर किसी स्वामित्व का दावा नहीं करता है।'
                        : 'All bank brand logos, product tags, registered trademarks (Visa, Mastercard, RuPay, etc.) remain the exclusive property of their respective corporate owners. D.CARD does not claim ownership, nor does listing them imply any form of official bank sponsorship or direct financial compensation from primary banks listed here.'}
                    </p>

                    <h4 className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-5 mb-2 uppercase text-xs tracking-wider">
                      {isHindi ? '3. त्रुटि सुधार संपर्क' : '3. Inquiries & Corrections Contact'}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                      {isHindi ? 'यदि आपको कोई अप्रचलित या गलत बैंकिंग जानकारी दिखाई दे, तो कृपया हमें रिपोर्ट करें:' : 'If you notice any outdated or inaccurate banking information, please report it to our team at'}{' '}
                      <a href="mailto:dcard.website@gmail.com" className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline break-all">
                        dcard.website@gmail.com
                      </a>.
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-6 font-medium">
                      {isHindi ? 'अंतिम अद्यतन: अगस्त 2026' : 'Last updated: August 2026'}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer buttons */}
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-end flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#2563EB]/25 cursor-pointer transition-all active:scale-95 select-none"
                >
                  {isHindi ? 'स्वीकार करें और बंद करें' : 'Close & Accept Terms'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LegalModal;
