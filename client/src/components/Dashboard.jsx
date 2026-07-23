import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; 

const Dashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    faqs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [srvRes, projRes, faqRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/services`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/projects`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/faq`)
        ]);
        
        setStats({
          services: srvRes.data.length,
          projects: projRes.data.length,
          faqs: faqRes.data.length
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      
      {/* 1. البانر الترحيبي الأنيق */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Tekrar hoş geldin, Omran! 👋</h1>
          <p>
            Bu sizin yönetim paneliniz. Buradan sitenizin tüm detaylarını kolayca yönetebilir, istatistikleri takip edebilir ve içerikleri tek tıkla güncelleyebilirsiniz.
          </p>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
          alt="Workspace" 
          className="welcome-image" 
        />
      </div>

      {/* 2. كروت الإحصائيات الديناميكية */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            💼
          </div>
          <div className="stat-info">
            <h4>Toplam Hizmet</h4>
            <h2>{loading ? '...' : stats.services}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>
            🚀
          </div>
          <div className="stat-info">
            <h4>Tamamlanan Projeler</h4>
            <h2>{loading ? '...' : stats.projects}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fdf2f8', color: '#ec4899' }}>
            ❓
          </div>
          <div className="stat-info">
            <h4>Sıkça Sorulan Sorular</h4>
            <h2>{loading ? '...' : stats.faqs}</h2>
          </div>
        </div>
      </div>

      {/* 3. أزرار الوصول السريع */}
      <div className="quick-actions">
        <h3>Hızlı İşlemler</h3>
        <div className="actions-grid">
          <Link to="/admin/services" className="action-btn">
            <span>➕</span> Hizmet Ekle
          </Link>
          <Link to="/admin/projects" className="action-btn">
            <span>➕</span> Proje Ekle
          </Link>
          <Link to="/admin/settings" className="action-btn">
            <span>🎨</span> Tema ve Bölümleri Özelleştir
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="action-btn" style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#0f172a' }}>
            <span>👁️</span> Canlı Siteyi Görüntüle
          </a>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;