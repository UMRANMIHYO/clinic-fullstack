import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSettings, FiFolder, FiMapPin } from 'react-icons/fi'; // 🔴 تمت إضافة FiMapPin هنا
import { BsCardList, BsShieldLock } from 'react-icons/bs';
import { AiOutlineQuestionCircle, AiOutlineInfoCircle } from 'react-icons/ai';

const Sidebar = ({ logoUrl, isCollapsed }) => {
  const location = useLocation();

  // 🔴 الروابط بالتركي مباشرة مع إضافة صفحة التواصل
  const menuItems = [
    { path: '/admin', name: 'Ana Sayfa', icon: <FiHome /> },
    { path: '/admin/settings', name: 'Ayarlar', icon: <FiSettings /> },
    { path: '/admin/projects', name: 'Projeler', icon: <FiFolder /> },
    { path: '/admin/services', name: 'Hizmetler', icon: <BsCardList /> },
    { path: '/admin/faq', name: 'SSS', icon: <AiOutlineQuestionCircle /> },
    { path: '/admin/about', name: 'Hakkımızda', icon: <AiOutlineInfoCircle /> },
    { path: '/admin/contact', name: 'İletişim ve Konum', icon: <FiMapPin /> }, // 🔴 الزر الجديد للتواصل والموقع
    { path: '/admin/security', name: 'Güvenlik', icon: <BsShieldLock /> }
  ];

  return (
    <div className="sidebar-container" style={{ 
      width: isCollapsed ? '80px' : '250px', 
      backgroundColor: '#111827', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      overflowX: 'hidden'
    }}>
      
      <div className="sidebar-logo" style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: isCollapsed ? '30px 0' : '30px 10px', marginBottom: '10px', transition: 'padding 0.3s ease'
      }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ maxHeight: '50px', maxWidth: isCollapsed ? '40px' : '100%', objectFit: 'contain', transition: 'max-width 0.3s ease' }} />
        ) : (
          <h2 style={{ color: '#fff', fontSize: isCollapsed ? '1rem' : '1.5rem', fontWeight: 'bold', margin: 0, letterSpacing: '1px', whiteSpace: 'nowrap', transition: 'font-size 0.3s ease' }}>
            {isCollapsed ? 'CMS' : 'Omran CMS'}
          </h2>
        )}
      </div>

      <div className="sidebar-menu" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 15px' }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              to={item.path} 
              key={index}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: isCollapsed ? '0' : '15px', 
                padding: isCollapsed ? '12px 0' : '12px 20px',
                color: isActive ? '#fff' : '#9ca3af',
                backgroundColor: isActive ? '#374151' : 'transparent',
                textDecoration: 'none', borderRadius: '10px',
                transition: 'all 0.3s ease', fontWeight: isActive ? '600' : '400',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if(!isActive) {
                  e.currentTarget.style.backgroundColor = '#1f2937';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if(!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
            >
              <span style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </span>
              <span style={{ 
                display: isCollapsed ? 'none' : 'block',
                opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.3s ease'
              }}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;