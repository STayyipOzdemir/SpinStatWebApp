// src/App.js

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import YouTubeLive from "./components/Youtubelive";
import MatchControl from "./pages/MatchControl";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";
import logo from "./assets/logo.png";

// i18n
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
  const { t, i18n } = useTranslation("common");
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="spinstat-app-container" style={appContainer}>
        {/* Üst Header Bar */}
        <header style={headerStyle}>
          <div style={logoContainer}>
            <img src={logo} alt="SpinStat Logo" style={logoStyle} />
            <h1 style={appTitle}>{t("brand", "SpinStat")}</h1>
          </div>

          {/* Dil anahtarı */}
          <div style={langSwitcherWrap}>
            <LanguageSwitcher i18n={i18n} />
          </div>

          <div style={userInfoContainer}>
            <div style={userInfoCard}>
              <div style={userAvatar}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span style={userEmail}>
                <strong>{user.email}</strong>
              </span>
              <button onClick={handleLogout} style={logoutButton}>
                <span style={logoutIcon}>→</span>
                <span style={logoutText}>{t("logout", "Çıkış")}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Ana İçerik */}
        <main style={mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<YouTubeLive />} />
            <Route path="/matchcontrol" element={<MatchControl />} />
          </Routes>
        </main>

        {/* Alt Navigasyon */}
        <NavigationBar />
      </div>
    </Router>
  );
}

const NavigationBar = () => {
  const { t } = useTranslation("common");
  const location = useLocation();

  const navItems = [
    { path: "/", icon: "◉", label: t("nav.home", "Ana Sayfa"), iconType: "circle" },
    { path: "/live", icon: "▶", label: t("nav.live", "Canlı Yayın"), iconType: "play" },
    { path: "/matchcontrol", icon: "⚡", label: t("nav.matchControl", "Maç Kontrolü"), iconType: "bolt" }
  ];

  return (
    <nav style={navStyle}>
      <div style={navContainer}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...navLink,
              ...(location.pathname === item.path ? activeNavLink : {})
            }}
          >
            <div
              style={{
                ...navIcon,
                ...(location.pathname === item.path ? activeNavIcon : {})
              }}
            >
              {item.icon}
            </div>
            <span style={navLabel}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

// Responsive Stil tanımları
const appContainer = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f8fffe",
  fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
};

const headerStyle = {
  background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
  color: "white",
  padding: "clamp(12px, 3vw, 20px) clamp(15px, 4vw, 30px)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  flexWrap: "nowrap",
  gap: "clamp(8px, 2vw, 15px)",
  minHeight: "70px"
};

const logoContainer = {
  display: "flex",
  alignItems: "center",
  gap: "clamp(8px, 2vw, 16px)",
  flex: "1 1 auto",
  minWidth: 0
};

const logoStyle = {
  width: "clamp(60px, 14vw, 120px)",
  height: "clamp(48px, 12vw, 100px)",
  objectFit: "contain",
  borderRadius: "12px",
  filter: "drop-shadow(0 2px 12px rgba(0, 0, 0, 0.25))",
  flexShrink: 0,
  display: "block"
};

const appTitle = {
  margin: 0,
  fontSize: "clamp(16px, 4vw, 28px)",
  fontWeight: "700",
  background: "linear-gradient(135deg, #ffffff, #e2e8f0)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  whiteSpace: "nowrap",
  letterSpacing: "-0.04em",
  fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minWidth: 0
};

const userInfoContainer = {
  display: "flex",
  alignItems: "center",
  flex: "0 0 auto"
};

const userInfoCard = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: "50px",
  padding: "clamp(6px, 1.5vw, 12px) clamp(12px, 2.5vw, 24px)",
  display: "flex",
  alignItems: "center",
  gap: "clamp(6px, 1.5vw, 12px)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  maxWidth: "clamp(200px, 45vw, 320px)",
  minWidth: "120px"
};

const userAvatar = {
  width: "clamp(28px, 7vw, 36px)",
  height: "clamp(28px, 7vw, 36px)",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #40916c, #52b788)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "clamp(12px, 3vw, 16px)",
  fontWeight: "700",
  color: "white",
  flexShrink: 0,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
};

const userEmail = {
  fontSize: "clamp(10px, 2.2vw, 14px)",
  color: "#e2e8f0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "clamp(60px, 15vw, 140px)",
  fontWeight: "500",
  fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
};

const logoutButton = {
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  border: "none",
  borderRadius: "30px",
  color: "white",
  padding: "clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 18px)",
  cursor: "pointer",
  fontSize: "clamp(11px, 2vw, 13px)",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "clamp(4px, 1vw, 6px)",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
  minHeight: "36px",
  flexShrink: 0
};

const logoutIcon = {
  fontSize: "clamp(14px, 3vw, 16px)",
  transform: "rotate(0deg)",
  transition: "transform 0.3s ease"
};

const logoutText = {
  display: "inline",
  letterSpacing: "0.025em",
  fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
};

const mainContent = {
  background: "linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%)",
  flex: 1,
  paddingBottom: "clamp(80px, 15vw, 90px)",
  position: "relative",
  minHeight: "calc(100vh - 150px)"
};

const navStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.12)",
  zIndex: 1000,
  paddingBottom: "env(safe-area-inset-bottom)",
  backdropFilter: "blur(20px)"
};

const navContainer = {
  display: "flex",
  justifyContent: "space-around",
  padding: "clamp(12px, 3vw, 16px) clamp(8px, 2vw, 12px)",
  maxWidth: "600px",
  margin: "0 auto"
};

const navLink = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#94a3b8",
  textDecoration: "none",
  padding: "clamp(8px, 2vw, 12px) clamp(16px, 3vw, 20px)",
  borderRadius: "clamp(16px, 4vw, 20px)",
  transition: "all 0.3s ease",
  minWidth: "clamp(70px, 15vw, 85px)",
  minHeight: "48px",
  justifyContent: "center",
  position: "relative"
};

const activeNavLink = {
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "white",
  transform: "translateY(-2px)",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)"
};

const navIcon = {
  fontSize: "clamp(20px, 5vw, 24px)",
  marginBottom: "clamp(4px, 1vw, 6px)",
  transition: "all 0.3s ease",
  fontWeight: "bold"
};

const activeNavIcon = {
  color: "#52b788",
  textShadow: "0 0 12px rgba(82, 183, 136, 0.5)"
};

const navLabel = {
  fontSize: "clamp(10px, 2.5vw, 12px)",
  fontWeight: "600",
  textAlign: "center",
  lineHeight: 1.2,
  letterSpacing: "0.025em",
  fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
};

/* Dil anahtarı sarmalayıcı */
const langSwitcherWrap = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingRight: "8px"
};

// Mobile specific styles (orijinal stil bloğun)
const styleElement = document.createElement("style");
styleElement.textContent = `
  /* Import Inter font from Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  /* Global font smoothing and rendering */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Mobile header spacing */
  @media (max-width: 768px) {
    [style*="headerStyle"] {
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    body {
      -webkit-text-size-adjust: 100%;
      -webkit-font-smoothing: antialiased;
    }

    * {
      -webkit-tap-highlight-color: transparent;
    }

    /* Prevent zoom on input focus */
    input, select, textarea {
      font-size: 16px !important;
    }

    /* Better touch targets */
    button, a, input, select {
      min-height: 44px;
      min-width: 44px;
    }
  }

  /* iPhone X+ safe areas */
  @supports (padding: max(0px)) {
    [style*="headerStyle"] {
      padding-top: max(20px, env(safe-area-inset-top));
    }

    [style*="navStyle"] {
      padding-bottom: max(16px, env(safe-area-inset-bottom));
    }
  }

  /* Small phones (iPhone SE, small Android) */
  @media (max-width: 375px) {
    [style*="headerStyle"] {
      padding-left: 8px !important;
      padding-right: 8px !important;
      min-height: 60px !important;
    }

    [style*="logoStyle"] {
      width: 32px !important;
      height: 24px !important;
    }

    [style*="appTitle"] {
      font-size: 14px !important;
    }

    [style*="userInfoCard"] {
      padding: 4px 8px !important;
      min-width: 80px !important;
      max-width: 120px !important;
    }

    [style*="userAvatar"] {
      width: 24px !important;
      height: 24px !important;
      font-size: 10px !important;
    }

    [style*="userEmail"] {
      max-width: 40px !important;
      font-size: 9px !important;
    }

    [style*="logoutButton"] {
      padding: 4px 6px !important;
      min-height: 28px !important;
    }

    [style*="logoutText"] {
      display: none !important;
    }

    [style*="navLabel"] {
      font-size: 10px !important;
    }
  }

  /* Large phones (iPhone Plus, large Android) */
  @media (min-width: 414px) and (max-width: 768px) {
    [style*="headerStyle"] {
      padding: 20px 30px;
    }

    [style*="navContainer"] {
      padding: 16px 12px;
    }
  }

  /* Landscape mode on phones */
  @media (max-height: 500px) and (orientation: landscape) {
    [style*="headerStyle"] {
      padding: 10px 25px;
      min-height: 60px;
    }

    [style*="navStyle"] {
      display: none;
    }

    [style*="mainContent"] {
      padding-bottom: 20px !important;
    }
  }

  /* Hover effects only on non-touch devices */
  @media (hover: hover) {
    [style*="logoutButton"]:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    }

    [style*="logoutButton"]:hover [style*="logoutIcon"] {
      transform: rotate(15deg);
    }

    [style*="navLink"]:hover:not([style*="activeNavLink"]) {
      color: #e2e8f0;
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-1px);
    }
  }

  /* Active states for touch devices */
  @media (hover: none) {
    [style*="logoutButton"]:active {
      transform: translateY(1px);
    }

    [style*="navLink"]:active {
      transform: translateY(1px);
    }
  }
`;
document.head.appendChild(styleElement);

export default App;
