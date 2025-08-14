// src/App.js

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import YouTubeLive from "./components/Youtubelive";
import MatchControl from "./pages/MatchControl";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";

// >>> i18n ekleri
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
  const { user, logout } = useAuth();

  // >>> i18n ekleri
  const { t, i18n } = useTranslation("common");
  // html lang
  document.documentElement.lang = i18n.resolvedLanguage;

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
      <div className="tennis-app-container" style={appContainer}>
        {/* Üst Header Bar */}
        <header style={headerStyle}>
          <div style={logoContainer}>
            <div style={tennisIcon}>🎾</div>
            {/* >>> i18n: başlık */}
            <h1 style={appTitle}>{t("appName")}</h1>
          </div>
          
          <div style={userInfoContainer}>
            <div style={userInfoCard}>
              <div style={userIcon}>👤</div>
              <span style={userEmail}>
                <strong>{user.email}</strong>
              </span>
              <button onClick={handleLogout} style={logoutButton}>
                <span>🚪</span> 
                {/* >>> i18n: çıkış */}
                <span style={logoutText}>{t("navbar.logout")}</span>
              </button>
            </div>
            {/* >>> i18n: dil değiştirici (kompakt) */}
            <div style={{ marginLeft: 10 }}>
              <LanguageSwitcher />
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
  const location = useLocation();

  // >>> i18n ekleri
  const { t } = useTranslation("common");
  
  const navItems = [
    { path: "/", icon: "🏠", label: t("navbar.home") },
    { path: "/live", icon: "📺", label: t("navbar.live") },
    { path: "/matchcontrol", icon: "🎾", label: t("navbar.matchControl") }
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
            <div style={navIcon}>{item.icon}</div>
            <span style={navLabel}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

// Responsive Stil tanımları (AYNEN BIRAKILDI)
const appContainer = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column"
};

const headerStyle = {
  background: "linear-gradient(135deg, #1b4332 0%, #2d5016 50%, #40916c 100%)",
  color: "white",
  padding: "clamp(10px, 3vw, 15px) clamp(15px, 4vw, 25px)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  borderBottom: "3px solid #52b788",
  flexWrap: "wrap",
  gap: "10px",
  minHeight: "60px"
};

const logoContainer = {
  display: "flex",
  alignItems: "center",
  gap: "clamp(8px, 2vw, 12px)",
  flex: "1 1 auto"
};

const tennisIcon = {
  fontSize: "clamp(20px, 5vw, 28px)",
  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))"
};

const appTitle = {
  margin: 0,
  fontSize: "clamp(16px, 4vw, 24px)",
  fontWeight: "bold",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  whiteSpace: "nowrap"
};

const userInfoContainer = {
  display: "flex",
  alignItems: "center",
  flex: "0 1 auto"
};

const userInfoCard = {
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "50px",
  padding: "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 20px)",
  display: "flex",
  alignItems: "center",
  gap: "clamp(6px, 2vw, 12px)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  maxWidth: "280px"
};

const userIcon = {
  fontSize: "clamp(16px, 3vw, 20px)",
  opacity: 0.8,
  flexShrink: 0
};

const userEmail = {
  fontSize: "clamp(10px, 2.5vw, 14px)",
  color: "#b7e4c7",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "120px"
};

const logoutButton = {
  background: "linear-gradient(135deg, #dc2626, #ef4444)",
  border: "none",
  borderRadius: "25px",
  color: "white",
  padding: "clamp(4px, 1.5vw, 6px) clamp(8px, 2vw, 15px)",
  cursor: "pointer",
  fontSize: "clamp(10px, 2vw, 12px)",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "clamp(4px, 1vw, 6px)",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)",
  minHeight: "32px",
  flexShrink: 0
};

const logoutText = {
  display: "inline"
};

const mainContent = {
  background: "linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%)",
  flex: 1,
  paddingBottom: "clamp(70px, 15vw, 80px)",
  position: "relative",
  minHeight: "calc(100vh - 140px)"
};

const navStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(135deg, #1b4332 0%, #2d5016 50%, #40916c 100%)",
  borderTop: "3px solid #52b788",
  boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
  paddingBottom: "env(safe-area-inset-bottom)"
};

const navContainer = {
  display: "flex",
  justifyContent: "space-around",
  padding: "clamp(8px, 2vw, 10px) 0",
  maxWidth: "600px",
  margin: "0 auto"
};

const navLink = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "white",
  textDecoration: "none",
  padding: "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)",
  borderRadius: "clamp(15px, 4vw, 20px)",
  transition: "all 0.3s ease",
  minWidth: "clamp(60px, 15vw, 80px)",
  opacity: 0.8,
  minHeight: "44px",
  justifyContent: "center"
};

const activeNavLink = {
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  opacity: 1,
  transform: "translateY(-2px)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
};

const navIcon = {
  fontSize: "clamp(20px, 5vw, 24px)",
  marginBottom: "clamp(2px, 1vw, 4px)",
  filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))"
};

const navLabel = {
  fontSize: "clamp(10px, 2.5vw, 12px)",
  fontWeight: "500",
  textAlign: "center",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
  lineHeight: 1.2
};

// Mobile specific styles (AYNEN BIRAKILDI)
const styleElement = document.createElement('style');
styleElement.textContent = `
  /* Mobile viewport fixes */
  @media (max-width: 768px) {
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
      padding-top: max(15px, env(safe-area-inset-top));
    }
    
    [style*="navStyle"] {
      padding-bottom: max(10px, env(safe-area-inset-bottom));
    }
  }
  
  /* Small phones (iPhone SE, small Android) */
  @media (max-width: 375px) {
    [style*="userEmail"] {
      max-width: 80px !important;
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
      padding: 15px 30px;
    }
    
    [style*="navContainer"] {
      padding: 12px 0;
    }
  }
  
  /* Landscape mode on phones */
  @media (max-height: 500px) and (orientation: landscape) {
    [style*="headerStyle"] {
      padding: 8px 20px;
      min-height: 50px;
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
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
    }
    
    [style*="navLink"]:hover:not([style*="activeNavLink"]) {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;
document.head.appendChild(styleElement);

export default App;
