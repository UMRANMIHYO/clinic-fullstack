import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiBell, FiMenu, FiLogOut, FiMessageSquare, FiSettings, FiInfo } from 'react-icons/fi';
import './Topbar.css';

const Topbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // 🔴 حالات الإشعارات الحقيقية
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const dropdownRef = useRef(null); 
  const notifRef = useRef(null); 
  const navigate = useNavigate();

  // 🔴 جلب الإشعارات من الباك إند
  const fetchNotifications = async () => {
    try {
      // افترضنا وجود توكن للحماية
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data;
      setNotifications(data);
      
      // حساب الإشعارات غير المقروءة
      const unread = data.filter(notif => !notif.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Bildirimler getirilemedi:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // اختياري: يمكنك تشغيل دالة الجلب كل دقيقة لتحديث الإشعارات تلقائياً
    // const interval = setInterval(fetchNotifications, 60000);
    // return () => clearInterval(interval);
  }, []);

  // 🔴 دالة تحديد الكل كمقروء
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // تحديث الواجهة مباشرة
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Okundu işaretlenirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsDropdownOpen(false);
    navigate('/login'); 
  };

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isNotifOpen) setIsNotifOpen(false);
  };

  // دالة لاختيار الأيقونة واللون بناءً على نوع الإشعار
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'system':
        return { icon: <FiSettings size={18} />, bg: '#dbeafe', color: '#3b82f6' };
      case 'message':
        return { icon: <FiMessageSquare size={18} />, bg: '#d1fae5', color: '#10b981' };
      default:
        return { icon: <FiInfo size={18} />, bg: '#fef3c7', color: '#f59e0b' };
    }
  };

  // دالة لتنسيق التاريخ (مثلاً: منذ ساعتين) - يمكنك تطويرها لاحقاً
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      <div className="topbar-left">
        <button 
          onClick={toggleSidebar}
          style={{
            background: 'none', border: 'none', color: '#1f2937',
            fontSize: '1.8rem', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '5px'
          }}
        >
          <FiMenu />
        </button>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* جرس الإشعارات */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <div 
            className="notification" 
            onClick={handleNotifClick} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
          >
            <FiBell className="bell-icon" style={{ fontSize: '1.4rem', color: '#4b5563' }} />
            {/* إظهار النقطة الحمراء مع العدد إذا كان هناك إشعارات غير مقروءة */}
            {unreadCount > 0 && (
              <span className="badge" style={{ 
                position: 'absolute', top: '2px', right: '2px', 
                backgroundColor: '#ef4444', color: 'white', 
                fontSize: '0.65rem', fontWeight: 'bold',
                padding: '2px 5px', borderRadius: '10px', border: '2px solid #fff' 
              }}>
                {unreadCount}
              </span>
            )}
          </div>

          {/* نافذة الإشعارات المنسدلة */}
          {isNotifOpen && (
            <div style={{
              position: 'absolute', top: '45px', right: '-10px', 
              backgroundColor: '#ffffff', borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)', width: '320px',
              overflow: 'hidden', zIndex: 1000, border: '1px solid #e5e7eb',
              animation: 'fadeIn 0.2s ease-in-out'
            }}>
              
              <div style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <h4 style={{ margin: 0, color: '#111827', fontSize: '1rem' }}>Bildirimler</h4>
                {unreadCount > 0 && (
                  <span onClick={markAllAsRead} style={{ fontSize: '0.8rem', color: '#3b82f6', cursor: 'pointer', fontWeight: '500' }}>
                    Tümünü Okundu İşaretle
                  </span>
                )}
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                
                {notifications.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>
                    <p style={{ margin: 0 }}>Yeni bildiriminiz yok.</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const styleData = getNotificationIcon(notif.type);
                    return (
                      <div key={notif._id} style={{ 
                        padding: '15px', 
                        borderBottom: '1px solid #f3f4f6', 
                        display: 'flex', gap: '15px', 
                        cursor: 'pointer', 
                        backgroundColor: notif.isRead ? 'transparent' : '#f0f9ff', // تمييز الإشعار الجديد
                        transition: 'background 0.2s' 
                      }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: styleData.bg, color: styleData.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {styleData.icon}
                        </div>
                        <div>
                          <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#1f2937', fontWeight: notif.isRead ? '500' : 'bold' }}>{notif.title}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', lineHeight: '1.4' }}>{notif.message}</p>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginTop: '5px' }}>{formatDate(notif.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}

              </div>
              
              <div style={{ padding: '12px', textAlign: 'center', backgroundColor: '#f9fafb', cursor: 'pointer', borderTop: '1px solid #e5e7eb', transition: 'background 0.2s' }}>
                <span style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: '600' }}>Tüm Bildirimleri Gör</span>
              </div>
            </div>
          )}
        </div>

        {/* قائمة البروفايل */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          
          <div 
            className="profile" 
            onClick={handleProfileClick}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="Profile" 
              className="profile-img" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #e5e7eb', objectFit: 'cover' }}
            />
          </div>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute', top: '55px', right: '0', 
              backgroundColor: '#ffffff', borderRadius: '10px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '180px',
              overflow: 'hidden', zIndex: 1000, border: '1px solid #e5e7eb',
              animation: 'fadeIn 0.2s ease-in-out'
            }}>
              
              <div style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#1f2937', fontSize: '0.9rem' }}>Omran Mihyo</p>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.8rem' }}>Yönetici</p>
              </div>

              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '12px 15px', background: 'transparent',
                  border: 'none', cursor: 'pointer', color: '#ef4444', 
                  fontSize: '1rem', fontWeight: '500', transition: 'background 0.2s ease'
                }}
              >
                <FiLogOut />
                <span>Çıkış Yap</span>
              </button>
              
            </div>
          )}
        </div> 

      </div>
    </div>
  );
};

export default Topbar;