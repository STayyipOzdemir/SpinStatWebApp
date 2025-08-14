import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      icon: "📺",
      title: "Canlı Yayın",
      description: "HD kalitesinde tenis maçlarını canlı izleyin",
      link: "/live",
      color: "linear-gradient(135deg, #dc2626, #ef4444)"
    },
    {
      icon: "🎾",
      title: "Maç Kontrolü",
      description: "Maçlarınızı başlatın ve yönetin",
      link: "/matchcontrol",
      color: "linear-gradient(135deg, #059669, #10b981)"
    },
    {
      icon: "🏆",
      title: "Turnuvalar",
      description: "Yakında: Turnuva takip sistemi",
      link: "#",
      color: "linear-gradient(135deg, #7c3aed, #8b5cf6)"
    }
  ];

  const stats = [
    { number: "24/7", label: "Canlı Yayın", icon: "🔴" },
    { number: "2", label: "Aktif Kort", icon: "🏟️" },
    { number: "HD", label: "Video Kalitesi", icon: "📱" },
    { number: "∞", label: "İzleme Süresi", icon: "⏰" }
  ];

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <section style={heroSection}>
        <div style={heroContent}>
          <div style={heroIcon}>🎾</div>
          <h1 style={heroTitle}>Tennis Live'a Hoş Geldiniz</h1>
          <p style={heroSubtitle}>
            Profesyonel tenis deneyimini yaşayın. Canlı maçları izleyin, 
            kendi maçlarınızı yönetin ve tenis dünyasının bir parçası olun.
          </p>
          <div style={heroButtons}>
            <Link to="/live" style={primaryButton}>
              <span style={buttonIcon}>▶️</span>
              Canlı Yayını İzle
            </Link>
            <Link to="/matchcontrol" style={secondaryButton}>
              <span style={buttonIcon}>🚀</span>
              Maça Başla
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={statsSection}>
        <h2 style={sectionTitle}>
          <span style={titleIcon}>📊</span>
          Platform İstatistikleri
        </h2>
        <div style={statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={statCard}>
              <div style={statIcon}>{stat.icon}</div>
              <div style={statNumber}>{stat.number}</div>
              <div style={statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={featuresSection}>
        <h2 style={sectionTitle}>
          <span style={titleIcon}>✨</span>
          Özellikler
        </h2>
        <div style={featuresGrid}>
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.link} 
              style={{
                ...featureCard,
                background: feature.color
              }}
            >
              <div style={featureIcon}>{feature.icon}</div>
              <h3 style={featureTitle}>{feature.title}</h3>
              <p style={featureDescription}>{feature.description}</p>
              {feature.link !== "#" && (
                <div style={featureButton}>
                  <span>Başla</span>
                  <span style={arrowIcon}>→</span>
                </div>
              )}
              {feature.link === "#" && (
                <div style={comingSoon}>
                  <span>Yakında</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section style={infoSection}>
        <div style={infoCard}>
          <div style={infoHeader}>
            <span style={infoIcon}>ℹ️</span>
            <h3 style={infoTitle}>Platform Hakkında</h3>
          </div>
          <div style={infoContent}>
            <div style={infoItem}>
              <span style={checkIcon}>✅</span>
              <span>HD kalitesinde canlı yayın desteği</span>
            </div>
            <div style={infoItem}>
              <span style={checkIcon}>✅</span>
              <span>Gerçek zamanlı maç kontrolü</span>
            </div>
            <div style={infoItem}>
              <span style={checkIcon}>✅</span>
              <span>Kullanıcı dostu arayüz</span>
            </div>
            <div style={infoItem}>
              <span style={checkIcon}>✅</span>
              <span>Mobil uyumlu tasarım</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={quickActionsSection}>
        <h2 style={sectionTitle}>
          <span style={titleIcon}>⚡</span>
          Hızlı İşlemler
        </h2>
        <div style={quickActionsGrid}>
          <Link to="/live" style={quickActionCard}>
            <div style={quickActionIcon}>📺</div>
            <div style={quickActionText}>
              <strong>Kort 1</strong>
              <span>Canlı Yayın</span>
            </div>
            <div style={liveIndicator}>
              <span style={liveDot}></span>
              CANLI
            </div>
          </Link>
          
          <Link to="/live" style={quickActionCard}>
            <div style={quickActionIcon}>📺</div>
            <div style={quickActionText}>
              <strong>Kort 2</strong>
              <span>Canlı Yayın</span>
            </div>
            <div style={liveIndicator}>
              <span style={liveDot}></span>
              CANLI
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

// Stil tanımları
const containerStyle = {
  background: "linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%)",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const heroSection = {
  padding: "60px 25px",
  textAlign: "center",
  background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
  borderRadius: "0 0 30px 30px",
  marginBottom: "40px",
  boxShadow: "0 10px 40px rgba(45, 90, 39, 0.1)"
};

const heroContent = {
  maxWidth: "600px",
  margin: "0 auto"
};

const heroIcon = {
  fontSize: "64px",
  marginBottom: "20px",
  filter: "drop-shadow(0 0 20px rgba(45, 90, 39, 0.3))",
  animation: "bounce 3s infinite"
};

const heroTitle = {
  fontSize: "36px",
  fontWeight: "bold",
  color: "#1b4332",
  marginBottom: "15px",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)"
};

const heroSubtitle = {
  fontSize: "18px",
  color: "#52b788",
  lineHeight: "1.6",
  marginBottom: "30px"
};

const heroButtons = {
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  flexWrap: "wrap"
};

const primaryButton = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "15px 30px",
  background: "linear-gradient(135deg, #40916c, #52b788)",
  color: "white",
  textDecoration: "none",
  borderRadius: "50px",
  fontWeight: "600",
  fontSize: "16px",
  boxShadow: "0 6px 20px rgba(64, 145, 108, 0.3)",
  transition: "all 0.3s ease"
};

const secondaryButton = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "15px 30px",
  background: "transparent",
  color: "#40916c",
  textDecoration: "none",
  borderRadius: "50px",
  fontWeight: "600",
  fontSize: "16px",
  border: "2px solid #40916c",
  transition: "all 0.3s ease"
};

const buttonIcon = {
  fontSize: "18px"
};

const statsSection = {
  padding: "40px 25px",
  marginBottom: "40px"
};

const sectionTitle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1b4332",
  marginBottom: "30px",
  textAlign: "center"
};

const titleIcon = {
  fontSize: "32px"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "20px",
  maxWidth: "800px",
  margin: "0 auto"
};

const statCard = {
  background: "white",
  borderRadius: "20px",
  padding: "25px",
  textAlign: "center",
  boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)",
  transition: "transform 0.3s ease"
};

const statIcon = {
  fontSize: "32px",
  marginBottom: "10px"
};

const statNumber = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#40916c",
  marginBottom: "5px"
};

const statLabel = {
  fontSize: "14px",
  color: "#52b788",
  fontWeight: "500"
};

const featuresSection = {
  padding: "40px 25px",
  marginBottom: "40px"
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "25px",
  maxWidth: "1000px",
  margin: "0 auto"
};

const featureCard = {
  padding: "30px",
  borderRadius: "25px",
  color: "white",
  textDecoration: "none",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden"
};

const featureIcon = {
  fontSize: "48px",
  marginBottom: "15px",
  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))"
};

const featureTitle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "10px",
  margin: "0 0 10px 0"
};

const featureDescription = {
  fontSize: "16px",
  opacity: 0.9,
  marginBottom: "20px",
  lineHeight: "1.5"
};

const featureButton = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: "600",
  background: "rgba(255, 255, 255, 0.2)",
  padding: "8px 15px",
  borderRadius: "20px",
  width: "fit-content"
};

const comingSoon = {
  fontSize: "14px",
  fontWeight: "600",
  background: "rgba(255, 255, 255, 0.2)",
  padding: "8px 15px",
  borderRadius: "20px",
  width: "fit-content",
  opacity: 0.8
};

const arrowIcon = {
  fontSize: "16px"
};

const infoSection = {
  padding: "40px 25px",
  marginBottom: "40px"
};

const infoCard = {
  background: "white",
  borderRadius: "20px",
  padding: "30px",
  maxWidth: "600px",
  margin: "0 auto",
  boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};

const infoHeader = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px"
};

const infoIcon = {
  fontSize: "24px"
};

const infoTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1b4332",
  margin: 0
};

const infoContent = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const infoItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "16px",
  color: "#374151"
};

const checkIcon = {
  fontSize: "16px",
  color: "#10b981"
};

const quickActionsSection = {
  padding: "40px 25px 80px",
};

const quickActionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  maxWidth: "600px",
  margin: "0 auto"
};

const quickActionCard = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "20px",
  background: "white",
  borderRadius: "15px",
  textDecoration: "none",
  color: "inherit",
  boxShadow: "0 6px 25px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)",
  transition: "all 0.3s ease"
};

const quickActionIcon = {
  fontSize: "32px"
};

const quickActionText = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "2px"
};

const liveIndicator = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "11px",
  fontWeight: "bold",
  color: "#ef4444",
  background: "rgba(239, 68, 68, 0.1)",
  padding: "4px 8px",
  borderRadius: "8px"
};

const liveDot = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#ef4444",
  animation: "pulse 2s infinite"
};

// Add keyframes for animations
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-8px); }
    60% { transform: translateY(-4px); }
  }
  
  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  [style*="primaryButton"]:hover,
  [style*="secondaryButton"]:hover,
  [style*="featureCard"]:hover,
  [style*="statCard"]:hover,
  [style*="quickActionCard"]:hover {
    transform: translateY(-5px);
  }
  
  [style*="secondaryButton"]:hover {
    background: #40916c !important;
    color: white !important;
  }
`;
document.head.appendChild(styleElement);

export default Home;