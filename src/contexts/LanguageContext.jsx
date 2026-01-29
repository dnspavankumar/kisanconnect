import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n';

const LanguageContext = createContext(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: i18n.language,
        changeLanguage,
        languages,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
