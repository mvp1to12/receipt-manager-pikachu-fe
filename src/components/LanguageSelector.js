import React from 'react';
import { Globe } from 'lucide-react';
import useLanguageStore, { languages } from '../services/languageStore';
import TranslatedText from './TranslatedText';

const LanguageSelector = ({ isOpen, onClose }) => {
  const { targetLanguage, setTargetLanguage } = useLanguageStore();

  const handleLanguageSelect = (languageCode) => {
    setTargetLanguage(languageCode);
    onClose();
  };

  const getCurrentLanguageName = () => {
    const currentLang = languages.find(lang => lang.code === targetLanguage);
    return currentLang ? currentLang.name : 'English';
  };

  if (!isOpen) return null;

  return (
    <div className="language-modal-overlay">
      <div className="language-modal">
        <div className="language-modal-header">
          <h3><TranslatedText>Select your language</TranslatedText></h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="language-list">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${targetLanguage === language.code ? 'selected' : ''}`}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <div className="language-option-content">
                <span className="language-native-name">{language.nativeName}</span>
                {language.code !== 'en' && (
                  <span className="language-english-name">{language.name}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector; 