import React, { useState, useEffect } from 'react';
import useTranslation from '../services/useTranslation';
import useLanguageStore from '../services/languageStore';

const TranslatedText = ({ 
  children, 
  as = 'span', 
  className = '', 
  style = {},
  fallback = null,
  ...props 
}) => {
  const [translatedText, setTranslatedText] = useState(children);
  const { t } = useTranslation();
  const { targetLanguage } = useLanguageStore();

  useEffect(() => {
    const translate = async () => {
      if (!children || typeof children !== 'string') {
        setTranslatedText(children);
        return;
      }

      // Skip translation for numbers
      if (!isNaN(children) || /^\d+$/.test(children)) {
        setTranslatedText(children);
        return;
      }

      try {
        const translated = await t(children);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(fallback || children);
      }
    };

    translate();
  }, [children, t, fallback, targetLanguage]);

  const Component = as;

  return (
    <Component 
      className={className}
      style={style}
      {...props}
    >
      {translatedText}
    </Component>
  );
};

export default TranslatedText; 