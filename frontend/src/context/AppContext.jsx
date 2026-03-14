import { createContext, useContext, useMemo, useState } from "react";
import { storage } from "../utils/storage";

const AppContext = createContext(null);
const COMPARE_LIMIT = 2;

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(storage.get("mp_lang", "en"));
  const [compareIds, setCompareIds] = useState(storage.get("mp_compare", []));

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
    storage.set("mp_lang", next);
  };

  const addToCompare = (propertyId) => {
    if (compareIds.includes(propertyId)) {
      return { status: "exists", ids: compareIds };
    }

    if (compareIds.length >= COMPARE_LIMIT) {
      return { status: "limit", ids: compareIds };
    }

    const next = [...compareIds, propertyId];
    setCompareIds(next);
    storage.set("mp_compare", next);
    return { status: "added", ids: next };
  };

  const removeFromCompare = (propertyId) => {
    const next = compareIds.filter((id) => id !== propertyId);
    setCompareIds(next);
    storage.set("mp_compare", next);
    return next;
  };

  const toggleCompare = (propertyId) => {
    if (compareIds.includes(propertyId)) {
      removeFromCompare(propertyId);
      return { status: "removed", ids: compareIds.filter((id) => id !== propertyId) };
    }

    return addToCompare(propertyId);
  };

  const clearCompare = () => {
    setCompareIds([]);
    storage.set("mp_compare", []);
  };

  const value = useMemo(
    () => ({
      language,
      toggleLanguage,
      compareIds,
      compareLimit: COMPARE_LIMIT,
      compareCount: compareIds.length,
      toggleCompare,
      addToCompare,
      removeFromCompare,
      clearCompare
    }),
    [language, compareIds]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
