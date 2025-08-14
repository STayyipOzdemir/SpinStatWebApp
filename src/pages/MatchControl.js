// src/pages/MatchControl.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const MatchControl = () => {
  const { t } = useTranslation("match");
  const { user } = useAuth();
  const [step, setStep] = useState("start");
  const [matchCode, setMatchCode] = useState("");
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleMatchStart = async () => {
    if (!matchCode || !user) {
      alert(t("errors.missingCodeOrAuth", "Kod girin ve giriş yapmış olun."));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`https://e97aeec9e2a3.ngrok-free.app/v1/courts/${matchCode}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          userId: user.uid,
          source: "admin",
          meta: { quality: "1080p", duration: 3600 }
        })
      });

      if (!res.ok) throw new Error(`API failed: ${res.status}`);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let matchHistory = {};
      if (userSnap.exists() && userSnap.data().matchHistory) {
        matchHistory = userSnap.data().matchHistory;
      }

      const matchCount = Object.keys(matchHistory).length;
      const nextMatchKey = `match${matchCount + 1}`;

      matchHistory[nextMatchKey] = {
        kort: matchCode,
        matchStartTime: new Date()
      };

      await updateDoc(userRef, { matchHistory });

      setTimerActive(true);
      setStep("running");
    } catch (error) {
      console.error("Hata:", error);
      alert(t("errors.startFailed", "Maç başlatılamadı. Lütfen tekrar deneyin."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchEnd = async () => {
    if (!matchCode || !user) {
      alert(t("errors.missingCodeOrAuth", "Kod girin ve giriş yapmış olun."));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`https://e97aeec9e2a3.ngrok-free.app/v1/courts/${matchCode}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop", userId: user.uid, source: "admin" })
      });

      if (!res.ok) throw new Error(`API failed: ${res.status}`);

      setTimerActive(false);
      setStep("start");
      setMatchCode("");
      setTime(0);
    } catch (error) {
      console.error("Hata:", error);
      alert(t("errors.endFailed", "Maç bitirilemedi. Lütfen tekrar deneyin."));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerSection}>
        <div style={titleContainer}>
          <span style={titleIcon}>🎾</span>
          <h1 style={pageTitle}>{t("title", "Maç Kontrol")}</h1>
        </div>
        <div style={subtitle}>
          {step === "start"
            ? t("enterCourtCode", "Yeni bir maç başlatmak için kort kodunu girin")
            : t("subtitle.running", "Maçınız devam ediyor")}
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContent}>
        {step === "start" && (
          <div style={startSection}>
            {/* Input Container */}
            <div style={inputSection}>
              <div style={inputContainer}>
                <div style={inputIcon}>🏟️</div>
                <input
                  type="text"
                  placeholder={t("placeholderCode", { defaultValue: "Kort Kodu (örn: court-001)", example: "court-001" })}
                  value={matchCode}
                  onChange={(e) => setMatchCode(e.target.value)}
                  style={inputStyle}
                  disabled={isLoading}
                />
              </div>

              {/* Example Codes */}
              <div style={exampleCodes}>
                <span style={exampleLabel}>{t("exampleCodesLabel", "Sample codes:")}</span>
                <div style={codeButtons}>
                  <button onClick={() => setMatchCode(t("courtCode1", "court-001"))} style={codeButton} disabled={isLoading}>
                    {t("courtCode1", "court-001")}
                  </button>
                  <button onClick={() => setMatchCode(t("courtCode2", "court-002"))} style={codeButton} disabled={isLoading}>
                    {t("courtCode2", "court-002")}
                  </button>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleMatchStart}
              style={{ ...startButton, ...(isLoading || !matchCode ? disabledButton : {}) }}
              disabled={isLoading || !matchCode}
            >
              {isLoading ? (
                <>
                  <span style={loadingSpinner}>⏳</span>
                  {t("starting", "Maç Başlatılıyor...")}
                </>
              ) : (
                <>
                  <span style={buttonIcon}>🚀</span>
                  {t("startMatch", "Maça Başla")}
                </>
              )}
            </button>

            {/* Info Cards */}
            <div style={infoCards}>
              <div style={infoCard}>
                <div style={cardIcon}>📹</div>
                <div style={cardContent}>
                  <h3 style={cardTitle}>{t("autoRecordTitle", "Automatic Recording")}</h3>
                  <p style={cardText}>{t("autoRecordDesc", "Your match will be recorded automatically")}</p>
                </div>
              </div>

              <div style={infoCard}>
                <div style={cardIcon}>📊</div>
                <div style={cardContent}>
                  <h3 style={cardTitle}>{t("liveStatsTitle", "Live Statistics")}</h3>
                  <p style={cardText}>{t("liveStatsDesc", "Track your match duration")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "running" && (
          <div style={runningSection}>
            {/* Match Status */}
            <div style={matchStatusCard}>
              <div style={statusHeader}>
                <div style={statusIcon}>🏃‍♂️</div>
                <div>
                  <h2 style={statusTitle}>{t("runningTitle", "Maç Devam Ediyor")}</h2>
                  <p style={statusSubtitle}>
                    {t("court", "Kort")}: {matchCode}
                  </p>
                </div>
                <div style={liveIndicator}>
                  <span style={liveDot}></span>
                  {t("live", "CANLI")}
                </div>
              </div>
            </div>

            {/* Timer Display */}
            <div style={timerCard}>
              <div style={timerIcon}>⏱️</div>
              <div style={timerDisplay}>
                <div style={timerLabel}>{t("timerLabel", "Maç Süresi")}</div>
                <div style={timerTime}>{formatTime(time)}</div>
              </div>
            </div>

            {/* Match Stats */}
            <div style={statsGrid}>
              <div style={statItem}>
                <div style={statIcon}>🎾</div>
                <div style={statValue}>HD</div>
                <div style={statLabel}>{t("quality", "Kalite")}</div>
              </div>

              <div style={statItem}>
                <div style={statIcon}>📡</div>
                <div style={statValue}>{t("liveShort", "LIVE")}</div>
                <div style={statLabel}>{t("status", "Durum")}</div>
              </div>

              <div style={statItem}>
                <div style={statIcon}>📍</div>
                <div style={statValue}>{matchCode}</div>
                <div style={statLabel}>{t("court", "Kort")}</div>
              </div>
            </div>

            {/* End Match Button */}
            <button
              onClick={handleMatchEnd}
              style={{ ...endButton, ...(isLoading ? disabledButton : {}) }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span style={loadingSpinner}>⏳</span>
                  {t("ending", "Maç Bitiriliyor...")}
                </>
              ) : (
                <>
                  <span style={buttonIcon}>🏁</span>
                  {t("stopMatch", "Maçı Bitir")}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// === Stiller (değişmedi) ===
const containerStyle = {
  padding: "25px",
  background: "linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%)",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};
const headerSection = {
  textAlign: "center",
  marginBottom: "30px",
  padding: "20px",
  background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};
const titleContainer = { display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "10px" };
const titleIcon = { fontSize: "32px", filter: "drop-shadow(0 0 8px rgba(45, 90, 39, 0.3))" };
const pageTitle = { margin: 0, fontSize: "32px", fontWeight: "bold", background: "linear-gradient(135deg, #1b4332, #40916c)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
const subtitle = { color: "#52b788", fontSize: "16px", fontWeight: "500", margin: 0 };
const mainContent = { maxWidth: "600px", margin: "0 auto" };
const startSection = { display: "flex", flexDirection: "column", gap: "25px" };
const inputSection = { background: "white", borderRadius: "20px", padding: "25px", boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)", border: "1px solid rgba(82, 183, 136, 0.2)" };
const inputContainer = { position: "relative", display: "flex", alignItems: "center", marginBottom: "20px" };
const inputIcon = { position: "absolute", left: "15px", fontSize: "20px", color: "#52b788", zIndex: 1 };
const inputStyle = { width: "100%", padding: "15px 15px 15px 50px", fontSize: "16px", border: "2px solid #d1fae5", borderRadius: "15px", outline: "none", transition: "all 0.3s ease", background: "#fafafa", color: "#1b4332" };
const exampleCodes = { display: "flex", flexDirection: "column", gap: "10px" };
const exampleLabel = { fontSize: "14px", color: "#6b7280", fontWeight: "500" };
const codeButtons = { display: "flex", gap: "10px", flexWrap: "wrap" };
const codeButton = { padding: "8px 15px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#166534", cursor: "pointer", fontSize: "14px", fontWeight: "500", transition: "all 0.3s ease" };
const startButton = { width: "100%", padding: "20px", fontSize: "18px", fontWeight: "bold", background: "linear-gradient(135deg, #059669, #10b981)", color: "white", border: "none", borderRadius: "15px", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 8px 25px rgba(5,150,105,.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" };
const disabledButton = { opacity: 0.6, cursor: "not-allowed", transform: "none" };
const buttonIcon = { fontSize: "20px" };
const loadingSpinner = { fontSize: "18px", animation: "spin 1s linear infinite" };
const infoCards = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" };
const infoCard = { display: "flex", alignItems: "center", gap: "15px", padding: "20px", background: "white", borderRadius: "15px", boxShadow: "0 6px 25px rgba(45, 90, 39, 0.1)", border: "1px solid rgba(82, 183, 136, 0.2)" };
const cardIcon = { fontSize: "32px", color: "#40916c" };
const cardContent = { flex: 1 };
const cardTitle = { margin: "0 0 5px 0", fontSize: "16px", fontWeight: "600", color: "#1b4332" };
const cardText = { margin: 0, fontSize: "14px", color: "#6b7280" };
const runningSection = { display: "flex", flexDirection: "column", gap: "25px" };
const matchStatusCard = { background: "linear-gradient(135deg, #40916c, #52b788)", borderRadius: "20px", padding: "25px", color: "white", boxShadow: "0 12px 40px rgba(64,145,108,.3)" };
const statusHeader = { display: "flex", alignItems: "center", gap: "15px" };
const statusIcon = { fontSize: "32px", filter: "drop-shadow(0 0 8px rgba(255,255,255,.3))" };
const statusTitle = { margin: "0 0 5px 0", fontSize: "20px", fontWeight: "bold" };
const statusSubtitle = { margin: 0, fontSize: "14px", opacity: 0.9 };
const liveIndicator = { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "bold", background: "rgba(239,68,68,.2)", padding: "6px 12px", borderRadius: "20px", marginLeft: "auto" };
const liveDot = { width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" };
const timerCard = { display: "flex", alignItems: "center", gap: "20px", padding: "25px", background: "white", borderRadius: "20px", boxShadow: "0 8px 32px rgba(45,90,39,.1)", border: "1px solid rgba(82,183,136,.2)" };
const timerIcon = { fontSize: "40px", color: "#40916c" };
const timerDisplay = { flex: 1 };
const timerLabel = { fontSize: "14px", color: "#6b7280", marginBottom: "5px" };
const timerTime = { fontSize: "36px", fontWeight: "bold", color: "#1b4332", fontFamily: "monospace" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "15px" };
const statItem = { background: "white", borderRadius: "15px", padding: "20px", textAlign: "center", boxShadow: "0 6px 25px rgba(45,90,39,.1)", border: "1px solid rgba(82,183,136,.2)" };
const statIcon = { fontSize: "24px", marginBottom: "8px" };
const statValue = { fontSize: "18px", fontWeight: "bold", color: "#40916c", marginBottom: "5px" };
const statLabel = { fontSize: "12px", color: "#6b7280", fontWeight: "500" };
const endButton = { width: "100%", padding: "20px", fontSize: "18px", fontWeight: "bold", background: "linear-gradient(135deg, #dc2626, #ef4444)", color: "white", border: "none", borderRadius: "15px", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 8px 25px rgba(220,38,38,.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" };

// Animasyon css (tek sefer eklenir)
const styleElement = document.createElement("style");
styleElement.textContent = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: .7; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
  input:focus { border-color: #40916c !important; box-shadow: 0 0 0 3px rgba(64,145,108,.1) !important; }
  button:hover:not(:disabled) { transform: translateY(-2px); }
  [style*="codeButton"]:hover { background: #dcfce7 !important; border-color: #86efac !important; }
`;
document.head.appendChild(styleElement);

export default MatchControl;
