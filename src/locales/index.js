import { en } from './en';
import { hi } from './hi';

export { en, hi };
export const locales = { en, hi };
export const defaultLanguage = 'en';
export const supportedLanguages = [
  { code: 'en', label: 'English', nativeLabel: 'English', shortLabel: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', shortLabel: 'हिं' }
];
