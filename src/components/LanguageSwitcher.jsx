// src/components/LanguageSwitcher.jsx
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const onChange = (e) => i18n.changeLanguage(e.target.value);

  return (
    <select onChange={onChange} value={i18n.resolvedLanguage}>
      <option value="tr">Türkçe</option>
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  );
}
