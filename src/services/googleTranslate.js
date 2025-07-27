import axios from "axios";
import useLanguageStore from "./languageStore";

const API_KEY = "AIzaSyBiqFNemZUR9VkeZ51n49tJ14Hu-uZZrzE";
const API_URL = "https://translation.googleapis.com/language/translate/v2";

// Create a cache object to store translations
const translationCache = {};

const translateText = async (text) => {
  const { targetLanguage } = useLanguageStore.getState();
  try {
    // Create a unique key for the cache based on text and target language
    const cacheKey = `${text}-${targetLanguage}`;

    // Check if the translation is already in the cache
    if (translationCache[cacheKey]) {
      console.log("Returning cached translation for:", cacheKey);
      return translationCache[cacheKey];
    }

    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      q: text,
      target: targetLanguage,
    });

    const translatedText = response.data.data.translations[0].translatedText;
    translationCache[cacheKey] = translatedText;
    return translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
  }
  return text;
};

export default translateText;
