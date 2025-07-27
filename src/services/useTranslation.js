import { useState, useEffect } from 'react';
import translateText from './googleTranslate';
import useLanguageStore from './languageStore';

const useTranslation = () => {
  const { targetLanguage } = useLanguageStore();
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState({});

  // Clear cache when language changes
  useEffect(() => {
    setTranslations({});
    setIsLoading({});
  }, [targetLanguage]);

  const t = async (text, key = null) => {
    // If target language is English, return the original text
    if (targetLanguage === 'en') {
      return text;
    }

    // Use key if provided, otherwise use text as key
    const translationKey = key || text;
    
    // Check if we already have this translation
    if (translations[translationKey]) {
      return translations[translationKey];
    }

    // Check if translation is in progress
    if (isLoading[translationKey]) {
      return text; // Return original text while loading
    }

    try {
      setIsLoading(prev => ({ ...prev, [translationKey]: true }));
      const translatedText = await translateText(text);
      
      setTranslations(prev => ({ 
        ...prev, 
        [translationKey]: translatedText 
      }));
      
      setIsLoading(prev => ({ ...prev, [translationKey]: false }));
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      setIsLoading(prev => ({ ...prev, [translationKey]: false }));
      return text; // Return original text on error
    }
  };

  const tSync = (text, key = null) => {
    // For synchronous access to cached translations
    const translationKey = key || text;
    return translations[translationKey] || text;
  };

  return { t, tSync, isLoading };
};

export default useTranslation; 