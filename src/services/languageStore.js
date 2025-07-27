import { create } from 'zustand';

const useLanguageStore = create((set) => ({
  targetLanguage: 'en',
  setTargetLanguage: (language) => set({ targetLanguage: language }),
}));

// Language data with native script names
export const languages = [
  { name: 'English', code: 'en', nativeName: 'English' },
  { name: 'Hindi', code: 'hi', nativeName: 'हिंदी' },
  { name: 'Kannada', code: 'kn', nativeName: 'ಕನ್ನಡ' },
  { name: 'Telugu', code: 'te', nativeName: 'తెలుగు' },
  { name: 'Bengali', code: 'bn', nativeName: 'বাংলা' },
  { name: 'Marathi', code: 'mr', nativeName: 'मराठी' },
  { name: 'Tamil', code: 'ta', nativeName: 'தமிழ்' },
  { name: 'Gujarati', code: 'gu', nativeName: 'ગુજરાતી' },
  { name: 'Urdu', code: 'ur', nativeName: 'اردو' },
  { name: 'Odia', code: 'or', nativeName: 'ଓଡ଼ିଆ' },
  { name: 'Malayalam', code: 'ml', nativeName: 'മലയാളം' }
];

export default useLanguageStore; 