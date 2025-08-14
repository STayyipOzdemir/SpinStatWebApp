// src/pages/Auth.js

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function Auth() {
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (isRegister) {
        const userCredential = await register(email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          isim: user.email,
          createdAt: new Date(),
        });

        console.log("Firestore'a kullanıcı kaydedildi:", user.email);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message.includes("auth/") 
        ? "E-posta veya şifre hatalı. Lütfen kontrol edin." 
        : "Bir hata oluştu: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Background Pattern */}
      <div style={backgroundPattern}></div>
      
      {/* Header */}
      <div style={headerSection}>
        <div style={logoContainer}>
          <div style={tennisIcon}>🎾</div>
          <h1 style={appTitle}>Tennis Live</h1>
        </div>
        <p style={welcomeText}>
          {isRegister 
            ? "Yeni hesap oluşturun ve tenis dünyasına katılın!" 
            : "Hoş geldiniz! Giriş yaparak devam edin."}
        </p>
      </div>

      {/* Form Container */}
      <div style={formContainer}>
        {/* Tab Buttons */}
        <div style={tabContainer}>
          <button
            onClick={() => setIsRegister(false)}
            style={{
              ...tabButton,
              ...(isRegister ? inactiveTab : activeTab)
            }}
          >
            <span style={tabIcon}>🏠</span>
            <span style={tabText}>Giriş Yap</span>
          </button>
          <button
            onClick={() => setIsRegister(true)}
            style={{
              ...tabButton,
              ...(!isRegister ? inactiveTab : activeTab)
            }}
          >
            <span style={tabIcon}>✨</span>
            <span style={tabText}>Kayıt Ol</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputContainer}>
            <div style={inputIcon}>📧</div>
            <input
              type="email"
              placeholder="E-posta adresinizi girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              disabled={isLoading}
            />
          </div>

          <div style={inputContainer}>
            <div style={inputIcon}>🔒</div>
            <input
              type="password"
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...submitButton,
              ...(isLoading ? disabledButton : {})
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={loadingSpinner}>⏳</span>
                <span>{isRegister ? "Kayıt Yapılıyor..." : "Giriş Yapılıyor..."}</span>
              </>
            ) : (
              <>
                <span style={buttonIcon}>
                  {isRegister ? "🚀" : "🔐"}
                </span>
                <span>{isRegister ? "Hesap Oluştur" : "Giriş Yap"}</span>
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div style={errorContainer}>
            <span style={errorIcon}>⚠️</span>
            <span style={errorText}>{error}</span>
          </div>
        )}

        {/* Switch Message */}
        <div style={switchContainer}>
          <p style={switchText}>
            {isRegister ? "Zaten bir hesabın var mı?" : "Hesabın yok mu?"}{" "}
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }} 
              style={switchButton}
              disabled={isLoading}
            >
              {isRegister ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <div style={footerContent}>
          <span style={footerIcon}>🏆</span>
          <span style={footerText}>Tennis Live - Profesyonel Tenis Deneyimi</span>
        </div>
      </div>
    </div>
  );
}

// Responsive Stil tanımları
const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1b4332 0%, #2d5016 25%, #40916c 50%, #52b788 75%, #74c69d 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "clamp(15px, 4vw, 20px)",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const backgroundPattern = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
  opacity: 0.3
};

const headerSection = {
  textAlign: "center",
  marginBottom: "clamp(20px, 5vw, 30px)",
  color: "white",
  width: "100%",
  maxWidth: "500px"
};

const logoContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(10px, 3vw, 15px)",
  marginBottom: "clamp(10px, 3vw, 15px)",
  flexWrap: "wrap"
};

const tennisIcon = {
  fontSize: "clamp(32px, 8vw, 48px)",
  filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))",
  animation: "bounce 2s infinite"
};

const appTitle = {
  margin: 0,
  fontSize: "clamp(24px, 6vw, 42px)",
  fontWeight: "bold",
  textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)",
  background: "linear-gradient(135deg, #ffffff, #b7e4c7)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const welcomeText = {
  fontSize: "clamp(14px, 3vw, 16px)",
  opacity: 0.9,
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
  margin: 0,
  lineHeight: 1.4,
  padding: "0 10px"
};

const formContainer = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "clamp(15px, 4vw, 25px)",
  padding: "clamp(20px, 5vw, 40px)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  width: "100%",
  maxWidth: "420px",
  position: "relative"
};

const tabContainer = {
  display: "flex",
  marginBottom: "clamp(20px, 5vw, 30px)",
  borderRadius: "clamp(10px, 3vw, 15px)",
  overflow: "hidden",
  background: "#f0fdf4"
};

const tabButton = {
  flex: 1,
  padding: "clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)",
  border: "none",
  cursor: "pointer",
  fontSize: "clamp(14px, 3vw, 16px)",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(6px, 2vw, 8px)",
  transition: "all 0.3s ease",
  minHeight: "44px"
};

const activeTab = {
  background: "linear-gradient(135deg, #40916c, #52b788)",
  color: "white",
  boxShadow: "0 4px 15px rgba(64, 145, 108, 0.3)"
};

const inactiveTab = {
  background: "transparent",
  color: "#52b788"
};

const tabIcon = {
  fontSize: "clamp(16px, 4vw, 18px)"
};

const tabText = {
  display: "inline"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(15px, 4vw, 20px)"
};

const inputContainer = {
  position: "relative",
  display: "flex",
  alignItems: "center"
};

const inputIcon = {
  position: "absolute",
  left: "clamp(12px, 3vw, 15px)",
  fontSize: "clamp(16px, 4vw, 18px)",
  zIndex: 1,
  color: "#52b788"
};

const inputStyle = {
  width: "100%",
  padding: "clamp(12px, 3vw, 15px) clamp(12px, 3vw, 15px) clamp(12px, 3vw, 15px) clamp(40px, 10vw, 50px)",
  fontSize: "clamp(14px, 3vw, 16px)",
  border: "2px solid #d1fae5",
  borderRadius: "clamp(10px, 3vw, 15px)",
  outline: "none",
  transition: "all 0.3s ease",
  background: "white",
  color: "#1b4332",
  minHeight: "44px",
  boxSizing: "border-box"
};

const submitButton = {
  width: "100%",
  padding: "clamp(15px, 4vw, 18px)",
  fontSize: "clamp(16px, 4vw, 18px)",
  fontWeight: "bold",
  background: "linear-gradient(135deg, #40916c, #52b788)",
  color: "white",
  border: "none",
  borderRadius: "clamp(10px, 3vw, 15px)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 20px rgba(64, 145, 108, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(8px, 2vw, 10px)",
  minHeight: "50px"
};

const disabledButton = {
  opacity: 0.7,
  cursor: "not-allowed"
};

const buttonIcon = {
  fontSize: "clamp(18px, 4vw, 20px)"
};

const loadingSpinner = {
  fontSize: "clamp(16px, 4vw, 18px)",
  animation: "spin 1s linear infinite"
};

const errorContainer = {
  background: "linear-gradient(135deg, #fee2e2, #fecaca)",
  border: "1px solid #fca5a5",
  borderRadius: "clamp(8px, 2vw, 12px)",
  padding: "clamp(12px, 3vw, 15px)",
  display: "flex",
  alignItems: "center",
  gap: "clamp(8px, 2vw, 10px)",
  marginTop: "clamp(10px, 3vw, 15px)"
};

const errorIcon = {
  fontSize: "clamp(16px, 4vw, 18px)",
  flexShrink: 0
};

const errorText = {
  color: "#dc2626",
  fontSize: "clamp(12px, 3vw, 14px)",
  fontWeight: "500",
  lineHeight: 1.4
};

const switchContainer = {
  textAlign: "center",
  marginTop: "clamp(20px, 5vw, 25px)",
  paddingTop: "clamp(15px, 4vw, 20px)",
  borderTop: "1px solid #e5e7eb"
};

const switchText = {
  color: "#6b7280",
  fontSize: "clamp(12px, 3vw, 14px)",
  margin: 0,
  lineHeight: 1.4
};

const switchButton = {
  background: "none",
  border: "none",
  color: "#40916c",
  cursor: "pointer",
  fontSize: "clamp(12px, 3vw, 14px)",
  fontWeight: "600",
  textDecoration: "underline",
  minHeight: "32px",
  padding: "4px 8px"
};

const footerStyle = {
  marginTop: "clamp(20px, 5vw, 30px)",
  textAlign: "center",
  width: "100%"
};

const footerContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(6px, 2vw, 8px)",
  color: "white",
  opacity: 0.8,
  flexWrap: "wrap"
};

const footerIcon = {
  fontSize: "clamp(16px, 4vw, 20px)",
  flexShrink: 0
};

const footerText = {
  fontSize: "clamp(12px, 3vw, 14px)",
  textAlign: "center"
};

// Mobile responsive animations and effects
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #40916c !important;
    box-shadow: 0 0 0 3px rgba(64, 145, 108, 0.1) !important;
  }
  
  /* Mobile-specific optimizations */
  @media (max-width: 768px) {
    body {
      -webkit-text-size-adjust: 100%;
      -webkit-font-smoothing: antialiased;
    }
    
    * {
      -webkit-tap-highlight-color: transparent;
    }
    
    /* Prevent zoom on input focus */
    input {
      font-size: 16px !important;
    }
    
    /* Better touch targets */
    button, input {
      min-height: 44px;
      min-width: 44px;
    }
  }
  
  /* Small phones (iPhone SE) */
  @media (max-width: 375px) {
    [style*="tabText"] {
      font-size: 12px !important;
    }
    
    [style*="welcomeText"] {
      font-size: 12px !important;
    }
    
    [style*="footerText"] {
      font-size: 10px !important;
    }
  }
  
  /* Large phones and small tablets */
  @media (min-width: 414px) and (max-width: 768px) {
    [style*="formContainer"] {
      padding: 30px !important;
    }
    
    [style*="headerSection"] {
      margin-bottom: 25px !important;
    }
  }
  
  /* Landscape mode on phones */
  @media (max-height: 500px) and (orientation: landscape) {
    [style*="containerStyle"] {
      padding: 10px !important;
    }
    
    [style*="headerSection"] {
      margin-bottom: 15px !important;
    }
    
    [style*="tennisIcon"] {
      font-size: 32px !important;
    }
    
    [style*="appTitle"] {
      font-size: 24px !important;
    }
    
    [style*="footerStyle"] {
      margin-top: 15px !important;
    }
  }
  
  /* iPhone X+ safe areas */
  @supports (padding: max(0px)) {
    [style*="containerStyle"] {
      padding-top: max(20px, env(safe-area-inset-top)) !important;
      padding-bottom: max(20px, env(safe-area-inset-bottom)) !important;
      padding-left: max(15px, env(safe-area-inset-left)) !important;
      padding-right: max(15px, env(safe-area-inset-right)) !important;
    }
  }
  
  /* Hover effects only on non-touch devices */
  @media (hover: hover) {
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(64, 145, 108, 0.4) !important;
    }
  }
  
  /* High DPI displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    [style*="tennisIcon"] {
      filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)) !important;
    }
  }
`;
document.head.appendChild(styleElement);

export default Auth;