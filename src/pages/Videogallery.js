import { useState } from "react";

function VideoGallery() {
  const [selectedCategory, setSelectedCategory] = useState("Tüm Videolar");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "Tüm Videolar",
    "Canlı Yayınlar",
    "Maç Kayıtları",
    "Öne Çıkanlar",
    "Antrenmanlar"
  ];

  const videos = [
    {
      id: 1,
      title: "Ankara Bilkent Sports - Final Maçı",
      category: "Maç Kayıtları",
      duration: "2:45:30",
      date: "2025-01-10",
      thumbnail: "🎾",
      views: "1.2K",
      isLive: false,
      description: "Heyecan dolu final maçının tüm detayları"
    },
    {
      id: 2,
      title: "Kort 1 - Canlı Yayın",
      category: "Canlı Yayınlar",
      duration: "CANLI",
      date: "2025-01-14",
      thumbnail: "📺",
      views: "245",
      isLive: true,
      description: "Kort 1'den canlı maç yayını"
    },
    {
      id: 3,
      title: "Teknik Antrenman Seansı",
      category: "Antrenmanlar",
      duration: "1:15:20",
      date: "2025-01-12",
      thumbnail: "🏃‍♂️",
      views: "856",
      isLive: false,
      description: "Profesyonel antrenman teknikleri"
    },
    {
      id: 4,
      title: "Kort 2 - Canlı Yayın",
      category: "Canlı Yayınlar",
      duration: "CANLI",
      date: "2025-01-14",
      thumbnail: "📺",
      views: "189",
      isLive: true,
      description: "Kort 2'den canlı maç yayını"
    },
    {
      id: 5,
      title: "Haftalık En İyi Anlar",
      category: "Öne Çıkanlar",
      duration: "0:25:45",
      date: "2025-01-13",
      thumbnail: "🏆",
      views: "2.1K",
      isLive: false,
      description: "Bu haftanın en etkileyici anları"
    },
    {
      id: 6,
      title: "Servis Teknikleri Dersi",
      category: "Antrenmanlar",
      duration: "0:45:15",
      date: "2025-01-11",
      thumbnail: "🎯",
      views: "945",
      isLive: false,
      description: "Etkili servis atma teknikleri"
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === "Tüm Videolar" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVideoClick = (video) => {
    if (video.isLive) {
      // Canlı yayın sayfasına yönlendir
      window.location.href = "/live";
    } else {
      // Video oynatma modal'ı açılabilir
      alert(`"${video.title}" videosunu izlemeye başlıyorsunuz...`);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerSection}>
        <div style={titleContainer}>
          <span style={titleIcon}>📚</span>
          <h1 style={pageTitle}>Video Galerisi</h1>
        </div>
        <div style={subtitle}>
          Tüm maç kayıtları, canlı yayınlar ve antrenman videolarını keşfedin
        </div>
      </div>

      {/* Controls */}
      <div style={controlsSection}>
        {/* Search Bar */}
        <div style={searchContainer}>
          <div style={searchIcon}>🔍</div>
          <input
            type="text"
            placeholder="Video ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInput}
          />
        </div>

        {/* Category Filter */}
        <div style={categoryContainer}>
          <span style={categoryLabel}>Kategori:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={categorySelect}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div style={statsContainer}>
        <div style={statItem}>
          <span style={statIcon}>📊</span>
          <div style={statText}>
            <strong>{filteredVideos.length}</strong>
            <span>Video</span>
          </div>
        </div>
        
        <div style={statItem}>
          <span style={statIcon}>🔴</span>
          <div style={statText}>
            <strong>{filteredVideos.filter(v => v.isLive).length}</strong>
            <span>Canlı</span>
          </div>
        </div>
        
        <div style={statItem}>
          <span style={statIcon}>👁️</span>
          <div style={statText}>
            <strong>5.6K</strong>
            <span>Toplam İzlenme</span>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div style={videoGrid}>
        {filteredVideos.length === 0 ? (
          <div style={noResults}>
            <div style={noResultsIcon}>🎬</div>
            <h3 style={noResultsTitle}>Video Bulunamadı</h3>
            <p style={noResultsText}>
              Arama kriterlerinizi değiştirerek tekrar deneyin.
            </p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <div
              key={video.id}
              style={videoCard}
              onClick={() => handleVideoClick(video)}
            >
              {/* Thumbnail */}
              <div style={videoThumbnail}>
                <div style={thumbnailIcon}>{video.thumbnail}</div>
                
                {/* Duration/Live Badge */}
                <div style={{
                  ...durationBadge,
                  ...(video.isLive ? liveBadge : {})
                }}>
                  {video.isLive && <span style={liveDot}></span>}
                  {video.duration}
                </div>

                {/* Play Button */}
                <div style={playButton}>
                  <span style={playIcon}>
                    {video.isLive ? "📺" : "▶️"}
                  </span>
                </div>
              </div>

              {/* Video Info */}
              <div style={videoInfo}>
                <h3 style={videoTitle}>{video.title}</h3>
                <p style={videoDescription}>{video.description}</p>
                
                <div style={videoMeta}>
                  <div style={metaItem}>
                    <span style={metaIcon}>👁️</span>
                    <span>{video.views} izlenme</span>
                  </div>
                  
                  <div style={metaItem}>
                    <span style={metaIcon}>📅</span>
                    <span>{new Date(video.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  
                  <div style={metaItem}>
                    <span style={metaIcon}>📂</span>
                    <span>{video.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div style={quickActions}>
        <h3 style={quickActionsTitle}>
          <span style={quickActionsIcon}>⚡</span>
          Hızlı Erişim
        </h3>
        
        <div style={quickActionsGrid}>
          <button style={quickActionButton} onClick={() => window.location.href = "/live"}>
            <span style={quickActionIcon}>📺</span>
            <div style={quickActionText}>
              <strong>Canlı Yayın</strong>
              <span>Şu anda yayında</span>
            </div>
          </button>
          
          <button style={quickActionButton} onClick={() => setSelectedCategory("Öne Çıkanlar")}>
            <span style={quickActionIcon}>🏆</span>
            <div style={quickActionText}>
              <strong>Öne Çıkanlar</strong>
              <span>En iyi anlar</span>
            </div>
          </button>
          
          <button style={quickActionButton} onClick={() => setSelectedCategory("Maç Kayıtları")}>
            <span style={quickActionIcon}>🎾</span>
            <div style={quickActionText}>
              <strong>Maç Kayıtları</strong>
              <span>Tüm maçlar</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Stil tanımları
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

const controlsSection = {
  display: "flex",
  gap: "20px",
  marginBottom: "25px",
  flexWrap: "wrap",
  alignItems: "center"
};

const searchContainer = {
  position: "relative",
  flex: 1,
  minWidth: "250px"
};

const searchIcon = {
  position: "absolute",
  left: "15px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "18px",
  color: "#52b788",
  zIndex: 1
};

const searchInput = {
  width: "100%",
  padding: "12px 15px 12px 45px",
  fontSize: "16px",
  border: "2px solid #d1fae5",
  borderRadius: "12px",
  outline: "none",
  transition: "all 0.3s ease",
  background: "white"
};

const categoryContainer = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

const categoryLabel = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1b4332"
};

const categorySelect = {
  padding: "12px 16px",
  fontSize: "16px",
  border: "2px solid #d1fae5",
  borderRadius: "12px",
  background: "white",
  color: "#1b4332",
  cursor: "pointer",
  outline: "none"
};

const statsContainer = {
  display: "flex",
  gap: "15px",
  marginBottom: "30px",
  flexWrap: "wrap",
  justifyContent: "center"
};

const statItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "15px 20px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};

const statIcon = {
  fontSize: "20px"
};

const statText = {
  display: "flex",
  flexDirection: "column",
  fontSize: "14px",
  color: "#6b7280"
};

const videoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "20px",
  marginBottom: "40px"
};

const videoCard = {
  background: "white",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

const videoThumbnail = {
  position: "relative",
  height: "180px",
  background: "linear-gradient(135deg, #40916c, #52b788)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden"
};

const thumbnailIcon = {
  fontSize: "64px",
  color: "white",
  filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))"
};

const durationBadge = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  background: "rgba(0, 0, 0, 0.8)",
  color: "white",
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "4px"
};

const liveBadge = {
  background: "linear-gradient(135deg, #dc2626, #ef4444)",
  animation: "pulse 2s infinite"
};

const liveDot = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "white",
  animation: "pulse 2s infinite"
};

const playButton = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  opacity: 0
};

const playIcon = {
  fontSize: "24px",
  marginLeft: "2px"
};

const videoInfo = {
  padding: "20px"
};

const videoTitle = {
  margin: "0 0 8px 0",
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1b4332",
  lineHeight: "1.3"
};

const videoDescription = {
  margin: "0 0 15px 0",
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "1.4"
};

const videoMeta = {
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const metaItem = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
  color: "#9ca3af"
};

const metaIcon = {
  fontSize: "14px"
};

const noResults = {
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "60px 20px",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};

const noResultsIcon = {
  fontSize: "64px",
  marginBottom: "20px",
  opacity: 0.6
};

const noResultsTitle = {
  margin: "0 0 10px 0",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1b4332"
};

const noResultsText = {
  margin: 0,
  fontSize: "16px",
  color: "#6b7280"
};

const quickActions = {
  background: "white",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 8px 32px rgba(45, 90, 39, 0.1)",
  border: "1px solid rgba(82, 183, 136, 0.2)"
};

const quickActionsTitle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  margin: "0 0 20px 0",
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1b4332"
};

const quickActionsIcon = {
  fontSize: "24px"
};

const quickActionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "15px"
};

const quickActionButton = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "15px",
  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
  border: "1px solid #bbf7d0",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "left"
};

const quickActionIcon = {
  fontSize: "24px"
};

const quickActionText = {
  display: "flex",
  flexDirection: "column",
  gap: "2px"
};

// CSS animations ve hover effects
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  [style*="videoCard"]:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(45, 90, 39, 0.2) !important;
  }
  
  [style*="videoCard"]:hover [style*="playButton"] {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  [style*="quickActionButton"]:hover {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0) !important;
    transform: translateY(-2px);
  }
  
  input:focus {
    border-color: #40916c !important;
    box-shadow: 0 0 0 3px rgba(64, 145, 108, 0.1) !important;
  }
  
  select:focus {
    border-color: #40916c !important;
    box-shadow: 0 0 0 3px rgba(64, 145, 108, 0.1) !important;
  }
`;
document.head.appendChild(styleElement);

export default VideoGallery;