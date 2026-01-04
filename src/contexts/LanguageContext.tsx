import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { languages, LanguageCode } from '@/i18n';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  changeLanguage: (code: LanguageCode) => void;
  languages: typeof languages;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: i18n.language as LanguageCode,
        changeLanguage,
        languages,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
