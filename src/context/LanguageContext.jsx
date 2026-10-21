import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { en } from '../locales/en';
import { hi } from '../locales/hi';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'dcard_language';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'hi' || saved === 'en') return saved;
      }
    } catch (e) {
      console.warn('Failed to load language from localStorage', e);
    }
    return 'en';
  });

  const setLanguage = useCallback((newLang) => {
    if (newLang !== 'en' && newLang !== 'hi') return;
    setLanguageState(newLang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, newLang);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
      }
    } catch (e) {
      console.warn('Failed to save language to localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language;
      }
    } catch (e) {}
  }, [language]);

  const activeTranslations = useMemo(() => {
    return language === 'hi' ? hi : en;
  }, [language]);

  const t = useCallback((key, fallbackOrParams = '', params = {}) => {
    if (!key) return '';

    let fallback = '';
    let interpolation = {};

    if (typeof fallbackOrParams === 'string') {
      fallback = fallbackOrParams;
      interpolation = params || {};
    } else if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
      interpolation = fallbackOrParams;
    }

    const keys = key.split('.');
    let val = activeTranslations;
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        val = undefined;
        break;
      }
    }

    // Fallback to English if missing in Hindi
    if (val === undefined) {
      let enVal = en;
      for (const k of keys) {
        if (enVal && typeof enVal === 'object' && k in enVal) {
          enVal = enVal[k];
        } else {
          enVal = undefined;
          break;
        }
      }
      val = enVal !== undefined ? enVal : (fallback || key);
    }

    if (typeof val === 'string' && Object.keys(interpolation).length > 0) {
      return val.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in interpolation ? interpolation[k] : `{{${k}}}`));
    }

    return val;
  }, [activeTranslations]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    isHindi: language === 'hi',
    isEnglish: language === 'en'
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
