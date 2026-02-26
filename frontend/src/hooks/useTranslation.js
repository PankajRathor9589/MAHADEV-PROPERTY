import { useApp } from "../context/AppContext";
import { translations } from "../i18n/translations";

export const useT = () => {
  const { language } = useApp();
  return translations[language];
};
