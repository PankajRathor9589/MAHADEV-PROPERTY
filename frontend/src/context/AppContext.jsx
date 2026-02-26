import { createContext, useContext, useMemo, useState } from "react";
import { storage } from "../utils/storage";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(storage.get("mp_lang", "en"));

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
    storage.set("mp_lang", next);
  };

  const value = useMemo(() => ({ language, toggleLanguage }), [language]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
