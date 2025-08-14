// src/components/Youtubelive.js
import { useState } from "react";
import { useTranslation } from "react-i18next";

const YouTubeLive = () => {
  const { t } = useTranslation("live");

  const [selectedCategory, setSelectedCategory] = useState("Ankara Bilkent Sports International");
  const [selectedCourt, setSelectedCourt] = useState("Kort 1");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Kategoriler (özel isim, çevrilmez)
  const categories = ["Ankara Bilkent Sports International"];

  // İç değerler aynen kalsın (video mapping ile uyum için)
  const courts = ["Kort 1", "Kort 2"];

  // Kortlara göre video ID'leri (İÇ DEĞERLERİ KULLANIYOR)
  const videos = {
    "Kort 1": "aK4V24r1ioU",
    "Kort 2": "mKCieTImjvU"
  };

  // Görünen etiket çevirisi — iç değeri değiştirme
  const courtLabel = (c) => {
    if (c === "Kort 1") return t("court1", "Kort 1");
    if (c === "Kort 2") return t("court2", "Kort 2");
    return c;
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerSection}>
        <div style={titleContainer}>
          <span style={titleIcon}>📺</span>
          <h1 style={pageTitle}>{t("title")}</h1>
        </div>
        <div style={subtitle}>{t("subtitle")}</div>
      </div>

      {/* Kontrol Paneli */}
      <div style={controlPanel}>
        {/* Kategori Seçimi */}
        <div style={selectorGroup}>
          <label style={labelStyle}>
            <span style={labelIcon}>🏆</span>
            <span style={labelText}>{t("categoryLabel")}</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={selectStyle}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Kort Seçimi */}
        <div style={selectorGroup}>
          <label style={labelStyle}>
            <span style={labelIcon}>🎾</span>
            <span style={labelText}>{t("courtLabel")}</span>
          </label>
          <select
            value={selectedCourt}
            onChange={(e) => setSelectedCourt(e.target.value)}
            style={selectStyle}
          >
            {courts.map((court, index) => (
              <option key={index} value={court}>{courtLabel(court)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Seçilen Kort Bilgisi */}
      <div style={courtInfo}>
        <div style={courtInfoIcon}>🏟️</div>
        <div style={courtInfoText}>
          <strong>{selectedCategory}</strong> - {courtLabel(selectedCourt)}
          <div style={liveIndicator}>
            <span style={liveDot}></span>
            <span style={liveText}>{t("liveBadge")}</span>
          </div>
        </div>
      </div>

      {/* Video Player Container */}
      <div style={{ ...videoContainer, ...(isFullscreen ? fullscreenContainer : {}) }}>
        <div style={videoWrapper}>
          <iframe
            src={`https://www.youtube.com/embed/${videos[selectedCourt]}?autoplay=1&rel=0&showinfo=0`}
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            style={videoFrame}
            title={`${courtLabel(selectedCourt)} ${t("title")}`}
          />

          {/* Video Controls Overlay */}
          <div style={videoOverlay}>
            <div style={overlayCorner}>
              <span style={overlayText}>{t("hd")}</span>
            </div>

            <div style={videoControls}>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                style={fullscreenButton}
                title={isFullscreen ? t("fullscreenExit") : t("fullscreenEnter")}
              >
                <span style={fullscreenIcon}>{isFullscreen ? "📉" : "📈"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen Exit Button */}
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            style={exitFullscreenButton}
            title={t("close")}
          >
            <span style={exitIcon}>✕</span>
            <span style={exitText}>{t("close")}</span>
          </button>
        )}
      </div>

      {/* Alt Bilgi Paneli */}
      <div style={infoPanel}>
        <div style={infoItem}>
          <span style={infoIcon}>📊</span>
          <div style={infoText}>
            <strong>{t("qualityLabel")}</strong> HD 1080p
          </div>
        </div>
        <div style={infoItem}>
          <span style={infoIcon}>🌐</span>
          <div style={infoText}>
            <strong>{t("platformLabel")}</strong> YouTube Live
          </div>
        </div>
        <div style={infoItem}>
          <span style={infoIcon}>⚡</span>
          <div style={infoText}>
            <strong>{t("latencyLabel")}</strong> {t("latencyApprox")}
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------ Stil tanımları (aynı) ------------------
const containerStyle = {
  padding: "clamp(15px, 4vw, 25px)",
  background: "linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%)",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const headerSection = {
  textAlign: "center",
  marginBottom: "clamp(20px, 5vw, 30px)",
  padding: "clamp(15px, 4vw, 20px)",
  background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
  borderRadius: "clamp(15px, 4vw, 20px)",
  boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};

const titleContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(8px, 2vw, 12px)",
  marginBottom: "clamp(8px, 2vw, 10px)",
  flexWrap: "wrap"
};

const titleIcon = {
  fontSize: "clamp(24px, 6vw, 32px)",
  filter: "drop-shadow(0 0 8px rgba(45, 90, 39, 0.3))"
};

const pageTitle = {
  margin: 0,
  fontSize: "clamp(20px, 5vw, 32px)",
  fontWeight: "bold",
  background: "linear-gradient(135deg, #1b4332, #40916c)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
};

const subtitle = {
  color: "#52b788",
  fontSize: "clamp(14px, 3vw, 16px)",
  fontWeight: "500",
  margin: 0
};

const controlPanel = {
  display: "flex",
  gap: "clamp(15px, 4vw, 20px)",
  marginBottom: "clamp(20px, 5vw, 25px)",
  flexWrap: "wrap",
  justifyContent: "center"
};

const selectorGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(6px, 2vw, 8px)",
  minWidth: "clamp(200px, 40vw, 250px)",
  flex: "1 1 200px",
  maxWidth: "300px"
};

const labelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "clamp(6px, 2vw, 8px)",
  fontSize: "clamp(14px, 3vw, 16px)",
  fontWeight: "600",
  color: "#1b4332"
};

const labelIcon = { fontSize: "clamp(16px, 4vw, 18px)", flexShrink: 0 };
const labelText = { whiteSpace: "nowrap" };

const selectStyle = {
  padding: "clamp(10px, 3vw, 12px) clamp(12px, 3vw, 16px)",
  fontSize: "clamp(14px, 3vw, 16px)",
  border: "2px solid #95d5b2",
  borderRadius: "clamp(8px, 2vw, 12px)",
  background: "white",
  color: "#1b4332",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(45, 90, 39, 0.1)",
  outline: "none",
  minHeight: "44px"
};

const courtInfo = {
  display: "flex",
  alignItems: "center",
  gap: "clamp(10px, 3vw, 15px)",
  padding: "clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)",
  background: "linear-gradient(135deg, #40916c, #52b788)",
  borderRadius: "clamp(10px, 3vw, 15px)",
  color: "white",
  marginBottom: "clamp(20px, 5vw, 25px)",
  boxShadow: "0 6px 25px rgba(64, 145, 108, 0.3)",
  flexWrap: "wrap"
};

const courtInfoIcon = {
  fontSize: "clamp(20px, 5vw, 24px)",
  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))",
  flexShrink: 0
};

const courtInfoText = { flex: 1, fontSize: "clamp(14px, 3vw, 16px)", minWidth: "200px" };

const liveIndicator = {
  display: "flex",
  alignItems: "center",
  gap: "clamp(6px, 2vw, 8px)",
  fontSize: "clamp(10px, 2.5vw, 12px)",
  fontWeight: "bold",
  marginTop: "clamp(3px, 1vw, 5px)",
  opacity: 0.9
};

const liveDot = {
  width: "clamp(6px, 2vw, 8px)",
  height: "clamp(6px, 2vw, 8px)",
  borderRadius: "50%",
  background: "#ef4444",
  animation: "pulse 2s infinite",
  boxShadow: "0 0 10px #ef4444",
  flexShrink: 0
};

const liveText = { whiteSpace: "nowrap" };

const videoContainer = {
  marginBottom: "clamp(20px, 5vw, 25px)",
  borderRadius: "clamp(15px, 4vw, 20px)",
  overflow: "hidden",
  boxShadow: "0 12px 40px rgba(45, 90, 39, 0.2)",
  position: "relative",
  maxWidth: "600px",
  margin: "0 auto clamp(20px, 5vw, 25px) auto"
};

const fullscreenContainer = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  background: "#000",
  maxWidth: "none",
  margin: 0,
  borderRadius: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

const videoWrapper = { position: "relative", paddingBottom: "56.25%", height: 0, background: "#000" };
const videoFrame = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "clamp(15px, 4vw, 20px)" };
const videoOverlay = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", borderRadius: "clamp(15px, 4vw, 20px)" };

const overlayCorner = {
  position: "absolute",
  top: "clamp(10px, 3vw, 15px)",
  right: "clamp(10px, 3vw, 15px)",
  background: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(10px)",
  borderRadius: "clamp(4px, 1vw, 6px)",
  padding: "clamp(3px, 1vw, 4px) clamp(6px, 2vw, 8px)"
};

const overlayText = { color: "white", fontSize: "clamp(10px, 2.5vw, 12px)", fontWeight: "bold" };
const videoControls = { position: "absolute", bottom: "clamp(10px, 3vw, 15px)", right: "clamp(10px, 3vw, 15px)", pointerEvents: "all" };

const fullscreenButton = {
  background: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(10px)",
  border: "none",
  borderRadius: "clamp(6px, 2vw, 8px)",
  color: "white",
  padding: "clamp(6px, 2vw, 8px) clamp(8px, 2vw, 10px)",
  cursor: "pointer",
  fontSize: "clamp(14px, 3vw, 16px)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  minHeight: "32px"
};

const fullscreenIcon = { fontSize: "clamp(16px, 4vw, 18px)" };

const exitFullscreenButton = {
  position: "absolute",
  top: "20px",
  right: "20px",
  background: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(10px)",
  border: "none",
  borderRadius: "clamp(8px, 2vw, 10px)",
  color: "white",
  padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 15px)",
  cursor: "pointer",
  fontSize: "clamp(14px, 3vw, 16px)",
  fontWeight: "600",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "clamp(6px, 2vw, 8px)",
  zIndex: 10000,
  minHeight: "40px"
};

const exitIcon = { fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "bold" };
const exitText = { whiteSpace: "nowrap" };

const infoPanel = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "clamp(12px, 3vw, 15px)",
  marginBottom: "clamp(40px, 10vw, 60px)"
};

const infoItem = {
  display: "flex",
  alignItems: "center",
  gap: "clamp(8px, 2vw, 10px)",
  padding: "clamp(10px, 3vw, 12px) clamp(12px, 3vw, 18px)",
  background: "white",
  borderRadius: "clamp(8px, 2vw, 12px)",
  boxShadow: "0 4px 15px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)",
  minHeight: "60px",
  justifyContent: "center",
  textAlign: "center"
};

const infoIcon = { fontSize: "clamp(16px, 4vw, 20px)", flexShrink: 0 };
const infoText = { fontSize: "clamp(12px, 3vw, 14px)", color: "#1b4332", lineHeight: 1.3 };

// Animasyon stilleri (modül yüklenirken 1 kez eklenir)
const styleElement = document.createElement("style");
styleElement.textContent = `
  @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: .7; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
  @media (max-width: 768px) { body { -webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; } * { -webkit-tap-highlight-color: transparent; } select { font-size: 16px !important; } select, button { min-height: 44px; min-width: 44px; } }
  @media (max-width: 375px) { [style*="controlPanel"] { flex-direction: column !important; align-items: center !important; } [style*="selectorGroup"] { width: 100% !important; max-width: none !important; } [style*="courtInfo"] { flex-direction: column !important; text-align: center !important; gap: 8px !important; } [style*="infoPanel"] { grid-template-columns: 1fr !important; } }
  @media (min-width: 376px) and (max-width: 480px) { [style*="infoPanel"] { grid-template-columns: repeat(2, 1fr) !important; } }
  @media (min-width: 481px) and (max-width: 768px) { [style*="controlPanel"] { justify-content: space-around !important; } [style*="infoPanel"] { grid-template-columns: repeat(3, 1fr) !important; } }
  @media (max-height: 500px) and (orientation: landscape) { [style*="headerSection"] { padding: 10px 20px !important; margin-bottom: 15px !important; } [style*="controlPanel"] { margin-bottom: 15px !important; } [style*="courtInfo"] { padding: 10px 15px !important; margin-bottom: 15px !important; } [style*="videoContainer"] { margin-bottom: 15px !important; } }
  @supports (padding: max(0px)) { [style*="containerStyle"] { padding-left: max(15px, env(safe-area-inset-left)) !important; padding-right: max(15px, env(safe-area-inset-right)) !important; } }
  select:focus { border-color: #40916c !important; box-shadow: 0 0 0 3px rgba(64, 145, 108, 0.1) !important; }
  @media (hover: hover) { [style*="infoItem"]:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45, 90, 39, 0.15) !important; } [style*="fullscreenButton"]:hover { background: rgba(0,0,0,0.9) !important; transform: scale(1.05); } [style*="exitFullscreenButton"]:hover { background: rgba(0,0,0,0.95) !important; transform: scale(1.05); } }
  [style*="fullscreenContainer"] [style*="videoFrame"] { border-radius: 0 !important; }
  [style*="fullscreenContainer"] [style*="videoOverlay"] { border-radius: 0 !important; }
  @media (max-width: 768px) { [style*="exitFullscreenButton"] { top: 10px !important; right: 10px !important; padding: 6px 10px !important; } [style*="exitText"] { display: none !important; } [style*="fullscreenButton"] { padding: 4px 6px !important; } }
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { [style*="titleIcon"] { filter: drop-shadow(0 0 8px rgba(45, 90, 39, 0.3)) !important; } }
`;
document.head.appendChild(styleElement);

export default YouTubeLive;
