// src/components/LanguageSwitcher.jsx
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const current = i18n.resolvedLanguage || i18n.language || "tr";
  const Btn = ({ code, label }) => (
    <button
      onClick={() => i18n.changeLanguage(code)}
      style={{
        background: current === code ? "rgba(255,255,255,0.9)" : "transparent",
        color: current === code ? "#0f172a" : "#e2e8f0",
        border: "none",
        borderRadius: 999,
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.04em",
        marginLeft: 6,
      }}
      aria-pressed={current === code}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      display: "flex",
      gap: 6,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: 999,
      padding: 4,
      backdropFilter: "blur(10px)",
      marginRight: 8
    }}>
      <Btn code="tr" label="TR" />
      <Btn code="en" label="EN" />
      <Btn code="fr" label="FR" />
    </div>
  );
}
