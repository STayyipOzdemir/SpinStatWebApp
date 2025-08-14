import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Html5QrcodeScanner } from "html5-qrcode";

const MatchControl = () => {
  const { user } = useAuth();
  const [step, setStep] = useState("start");
  const [matchCode, setMatchCode] = useState("");
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanner, setQrScanner] = useState(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // QR Scanner için kamera başlatma
  const startQRScanner = async () => {
    try {
      setShowQRScanner(true);
      
      // Biraz bekleyip DOM'un hazır olmasını sağla
      setTimeout(() => {
        if (qrScannerRef.current) {
          const scanner = new Html5QrcodeScanner(
            "qr-scanner-container",
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
              showTorchButtonIfSupported: true,
              showZoomSliderIfSupported: true,
              defaultZoomValueIfSupported: 2,
            },
            false
          );

          scanner.render(
            (decodedText, decodedResult) => {
              // QR kod başarıyla okundu
              console.log("QR kod okundu:", decodedText);
              setMatchCode(decodedText);
              stopQRScanner();
              alert(`QR Kod okundu: ${decodedText}`);
            },
            (error) => {
              // QR kod okuma hatası (normal, sürekli dener)
              console.log("QR tarama devam ediyor...", error);
            }
          );

          setQrScanner(scanner);
        }
      }, 100);
    } catch (error) {
      console.error('QR Scanner başlatılamadı:', error);
      alert('QR Scanner başlatılamadı. Lütfen kamera izinlerini kontrol edin.');
      setShowQRScanner(false);
    }
  };

  // QR Scanner kapatma
  const stopQRScanner = () => {
    if (qrScanner) {
      qrScanner.clear().then(() => {
        console.log("QR Scanner temizlendi");
      }).catch(error => {
        console.error("QR Scanner temizlenirken hata:", error);
      });
      setQrScanner(null);
    }
    setShowQRScanner(false);
  };

  // Component unmount olduğunda QR scanner'ı temizle
  useEffect(() => {
    return () => {
      if (qrScanner) {
        qrScanner.clear().catch(console.error);
      }
    };
  }, [qrScanner]);

  const handleMatchStart = async () => {
    if (!matchCode || !user) {
      alert("Kod girin ve giriş yapmış olun.");
      return;
    }

    setIsLoading(true);
    try {
      // 1️⃣ API isteği
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

      if (!res.ok) {
        throw new Error(`API isteği başarısız: ${res.status}`);
      }

      // 2️⃣ Firestore'a maç geçmişini kaydet
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
        matchStartTime: new Date(),
      };

      await updateDoc(userRef, { matchHistory });

      // 3️ Timer başlat
      setTimerActive(true);
      setStep("running");
    } catch (error) {
      console.error("Hata:", error);
      alert("Maç başlatılamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchEnd = async () => {
    if (!matchCode || !user) {
      alert("Kod girin ve giriş yapmış olun.");
      return;
    }

    setIsLoading(true);
    try {
      // 1️ API isteği
      const res = await fetch(`https://e97aeec9e2a3.ngrok-free.app/v1/courts/${matchCode}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stop",
          userId: user.uid,
          source: "admin"
        })
      });

      if (!res.ok) {
        throw new Error(`API isteği başarısız: ${res.status}`);
      }

      // 2️⃣ Timer durdur
      setTimerActive(false);
      setStep("start");
      setMatchCode("");
      setTime(0);
    } catch (error) {
      console.error("Hata:", error);
      alert("Maç bitirilemedi. Lütfen tekrar deneyin.");
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
          <span style={titleIcon}>⚡</span>
          <h1 style={pageTitle}>Maç Kontrol</h1>
        </div>
        <div style={subtitle}>
          {step === "start" 
            ? "Yeni bir maç başlatmak için kort kodunu girin" 
            : "Maçınız devam ediyor"}
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContent}>
        {step === "start" && (
          <div style={startSection}>
            {/* Input Container */}
            <div style={inputSection}>
              {/* QR Scanner Button */}
              <div style={qrButtonContainer}>
                <button
                  onClick={startQRScanner}
                  style={qrScanButton}
                  disabled={isLoading}
                >
                  <span style={qrIcon}>📱</span>
                  <span>Maçı başlatmak için QR kodu tara</span>
                </button>
              </div>

              <div style={inputContainer}>
                <div style={inputIcon}>📍</div>
                <input
                  type="text"
                  placeholder="Kort Kodu (örn: court-001)"
                  value={matchCode}
                  onChange={(e) => setMatchCode(e.target.value)}
                  style={inputStyle}
                  disabled={isLoading}
                />
              </div>
              
              {/* Example Codes */}
              <div style={exampleCodes}>
                <span style={exampleLabel}>Örnek kodlar:</span>
                <div style={codeButtons}>
                  <button 
                    onClick={() => setMatchCode("court-001")}
                    style={codeButton}
                    disabled={isLoading}
                  >
                    court-001
                  </button>
                  <button 
                    onClick={() => setMatchCode("court-002")}
                    style={codeButton}
                    disabled={isLoading}
                  >
                    court-002
                  </button>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button 
              onClick={handleMatchStart} 
              style={{
                ...startButton,
                ...(isLoading || !matchCode ? disabledButton : {})
              }}
              disabled={isLoading || !matchCode}
            >
              {isLoading ? (
                <>
                  <span style={loadingSpinner}>⏳</span>
                  Maç Başlatılıyor...
                </>
              ) : (
                <>
                  <span style={buttonIcon}>▶</span>
                  Maça Başla
                </>
              )}
            </button>

            {/* Info Cards */}
            <div style={infoCards}>
              <div style={infoCard}>
                <div style={cardIcon}>📹</div>
                <div style={cardContent}>
                  <h3 style={cardTitle}>Otomatik Kayıt</h3>
                  <p style={cardText}>Maçınız otomatik olarak kaydedilecek</p>
                </div>
              </div>
              
              <div style={infoCard}>
                <div style={cardIcon}>📊</div>
                <div style={cardContent}>
                  <h3 style={cardTitle}>Anlık İstatistik</h3>
                  <p style={cardText}>Maç süresini takip edin</p>
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
                  <h2 style={statusTitle}>Maç Devam Ediyor</h2>
                  <p style={statusSubtitle}>Kort: {matchCode}</p>
                </div>
                <div style={liveIndicator}>
                  <span style={liveDot}></span>
                  CANLI
                </div>
              </div>
            </div>

            {/* Timer Display */}
            <div style={timerCard}>
              <div style={timerIcon}>⏱️</div>
              <div style={timerDisplay}>
                <div style={timerLabel}>Maç Süresi</div>
                <div style={timerTime}>{formatTime(time)}</div>
              </div>
            </div>

            {/* Match Stats */}
            <div style={statsGrid}>
              <div style={statItem}>
                <div style={statIcon}>🎾</div>
                <div style={statValue}>HD</div>
                <div style={statLabel}>Kalite</div>
              </div>
              
              <div style={statItem}>
                <div style={statIcon}>📡</div>
                <div style={statValue}>LIVE</div>
                <div style={statLabel}>Durum</div>
              </div>
              
              <div style={statItem}>
                <div style={statIcon}>📍</div>
                <div style={statValue}>{matchCode}</div>
                <div style={statLabel}>Kort</div>
              </div>
            </div>

            {/* End Match Button */}
            <button 
              onClick={handleMatchEnd} 
              style={{
                ...endButton,
                ...(isLoading ? disabledButton : {})
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span style={loadingSpinner}>⏳</span>
                  Maç Bitiriliyor...
                </>
              ) : (
                <>
                  <span style={buttonIcon}>◼</span>
                  Maçı Bitir
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div style={qrModal}>
          <div style={qrModalContent}>
            <div style={qrHeader}>
              <h3 style={qrTitle}>QR Kod Tara</h3>
              <button onClick={stopQRScanner} style={closeButton}>✕</button>
            </div>
            
            <div style={qrScannerContainer}>
              <div 
                id="qr-scanner-container" 
                ref={qrScannerRef}
                style={qrScannerElement}
              ></div>
            </div>
            
            <div style={qrActions}>
              <button onClick={stopQRScanner} style={qrCancelButton}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stil tanımları
const containerStyle = {
  padding: "25px",
  background: "linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%)",
  minHeight: "100vh",
  fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
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

const titleContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "10px"
};

const titleIcon = {
  fontSize: "32px",
  filter: "drop-shadow(0 0 8px rgba(45, 90, 39, 0.3))"
};

const pageTitle = {
  margin: 0,
  fontSize: "32px",
  fontWeight: "bold",
  background: "linear-gradient(135deg, #1b4332, #40916c)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const subtitle = {
  color: "#52b788",
  fontSize: "16px",
  fontWeight: "500",
  margin: 0
};

const mainContent = {
  maxWidth: "600px",
  margin: "0 auto"
};

const startSection = {
  display: "flex",
  flexDirection: "column",
  gap: "25px"
};

const inputSection = {
  background: "white",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};

const inputContainer = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  marginBottom: "20px"
};

const inputIcon = {
  position: "absolute",
  left: "15px",
  fontSize: "20px",
  color: "#52b788",
  zIndex: 1
};

const inputStyle = {
  width: "100%",
  padding: "15px 15px 15px 50px", // Normal padding'e geri döndü
  fontSize: "16px",
  border: "2px solid #d1fae5",
  borderRadius: "15px",
  outline: "none",
  transition: "all 0.3s ease",
  background: "#fafafa",
  color: "#1b4332"
};

const qrButtonContainer = {
  marginBottom: "20px"
};

const qrScanButton = {
  width: "100%",
  padding: "15px 20px",
  background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)"
};

const qrIcon = {
  fontSize: "20px"
};

const qrButton = {
  position: "absolute",
  right: "10px",
  background: "linear-gradient(135deg, #40916c, #52b788)",
  border: "none",
  borderRadius: "8px",
  color: "white",
  width: "40px",
  height: "40px",
  cursor: "pointer",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(64, 145, 108, 0.3)"
};

const exampleCodes = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const exampleLabel = {
  fontSize: "14px",
  color: "#6b7280",
  fontWeight: "500"
};

const codeButtons = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
};

const codeButton = {
  padding: "8px 15px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  color: "#166534",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s ease"
};

const startButton = {
  width: "100%",
  padding: "20px",
  fontSize: "18px",
  fontWeight: "bold",
  background: "linear-gradient(135deg, #059669, #10b981)",
  color: "white",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 8px 25px rgba(5, 150, 105, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px"
};

const disabledButton = {
  opacity: 0.6,
  cursor: "not-allowed",
  transform: "none"
};

const buttonIcon = {
  fontSize: "20px"
};

const loadingSpinner = {
  fontSize: "18px",
  animation: "spin 1s linear infinite"
};

const infoCards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "15px"
};

const infoCard = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "20px",
  background: "white",
  borderRadius: "15px",
  boxShadow: "0 6px 25px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};

const cardIcon = {
  fontSize: "32px",
  color: "#40916c"
};

const cardContent = {
  flex: 1
};

const cardTitle = {
  margin: "0 0 5px 0",
  fontSize: "16px",
  fontWeight: "600",
  color: "#1b4332"
};

const cardText = {
  margin: 0,
  fontSize: "14px",
  color: "#6b7280"
};

const runningSection = {
  display: "flex",
  flexDirection: "column",
  gap: "25px"
};

const matchStatusCard = {
  background: "linear-gradient(135deg, #40916c, #52b788)",
  borderRadius: "20px",
  padding: "25px",
  color: "white",
  boxShadow: "0 12px 40px rgba(64, 145, 108, 0.3)"
};

const statusHeader = {
  display: "flex",
  alignItems: "center",
  gap: "15px"
};

const statusIcon = {
  fontSize: "32px",
  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
};

const statusTitle = {
  margin: "0 0 5px 0",
  fontSize: "20px",
  fontWeight: "bold"
};

const statusSubtitle = {
  margin: 0,
  fontSize: "14px",
  opacity: 0.9
};

const liveIndicator = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  fontWeight: "bold",
  background: "rgba(239, 68, 68, 0.2)",
  padding: "6px 12px",
  borderRadius: "20px",
  marginLeft: "auto"
};

const liveDot = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#ef4444",
  animation: "pulse 2s infinite"
};

const timerCard = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  padding: "25px",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};

const timerIcon = {
  fontSize: "40px",
  color: "#40916c"
};

const timerDisplay = {
  flex: 1
};

const timerLabel = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "5px"
};

const timerTime = {
  fontSize: "36px",
  fontWeight: "bold",
  color: "#1b4332",
  fontFamily: "monospace"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "15px"
};

const statItem = {
  background: "white",
  borderRadius: "15px",
  padding: "20px",
  textAlign: "center",
  boxShadow: "0 6px 25px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};

const statIcon = {
  fontSize: "24px",
  marginBottom: "8px"
};

const statValue = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#40916c",
  marginBottom: "5px"
};

const statLabel = {
  fontSize: "12px",
  color: "#6b7280",
  fontWeight: "500"
};

const endButton = {
  width: "100%",
  padding: "20px",
  fontSize: "18px",
  fontWeight: "bold",
  background: "linear-gradient(135deg, #dc2626, #ef4444)",
  color: "white",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 8px 25px rgba(220, 38, 38, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px"
};

// QR Scanner Modal Styles
const qrModal = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const qrModalContent = {
  background: "white",
  borderRadius: "20px",
  padding: "20px",
  maxWidth: "400px",
  width: "90%",
  maxHeight: "90vh",
  overflow: "hidden"
};

const qrHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px"
};

const qrTitle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "600",
  color: "#1b4332"
};

const closeButton = {
  background: "#ef4444",
  border: "none",
  borderRadius: "50%",
  color: "white",
  width: "30px",
  height: "30px",
  cursor: "pointer",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const qrScannerContainer = {
  width: "100%",
  maxWidth: "400px",
  margin: "15px 0"
};

const qrScannerElement = {
  width: "100%",
  borderRadius: "15px",
  overflow: "hidden"
};

const qrVideoContainer = {
  position: "relative",
  width: "100%",
  aspectRatio: "1",
  background: "#000",
  borderRadius: "15px",
  overflow: "hidden",
  marginBottom: "15px"
};

const qrVideo = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const scanOverlay = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0, 0, 0, 0.3)"
};

const scanFrame = {
  width: "200px",
  height: "200px",
  border: "3px solid #40916c",
  borderRadius: "15px",
  position: "relative",
  animation: "scanPulse 2s infinite"
};

const scanText = {
  color: "white",
  fontSize: "14px",
  textAlign: "center",
  marginTop: "15px",
  textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)"
};

const qrActions = {
  display: "flex",
  justifyContent: "center"
};

const qrCancelButton = {
  background: "#6b7280",
  border: "none",
  borderRadius: "10px",
  color: "white",
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500"
};

// Add CSS animations
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes scanPulse {
    0% { box-shadow: 0 0 0 0 rgba(64, 145, 108, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(64, 145, 108, 0); }
    100% { box-shadow: 0 0 0 0 rgba(64, 145, 108, 0); }
  }
  
  input:focus {
    border-color: #40916c !important;
    box-shadow: 0 0 0 3px rgba(64, 145, 108, 0.1) !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  [style*="codeButton"]:hover {
    background: #dcfce7 !important;
    border-color: #86efac !important;
  }
  
  [style*="qrScanButton"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4) !important;
  }
  
  [style*="qrButton"]:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(64, 145, 108, 0.4) !important;
  }

  /* HTML5 QR Code Scanner stilleri */
  #qr-scanner-container {
    border-radius: 15px !important;
    overflow: hidden !important;
  }
  
  #qr-scanner-container video {
    border-radius: 15px !important;
  }
  
  #qr-scanner-container > div {
    border: none !important;
  }
  
  /* QR Scanner butonlarını özelleştir */
  #qr-scanner-container button {
    background: #40916c !important;
    border: none !important;
    border-radius: 8px !important;
    color: white !important;
    padding: 8px 16px !important;
    margin: 5px !important;
    font-weight: 500 !important;
  }
  
  #qr-scanner-container button:hover {
    background: #52b788 !important;
  }
`;
document.head.appendChild(styleElement);

export default MatchControl;