import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // 🔴 إضافة useNavigate
import axios from 'axios';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AdminLayout = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate(); // 🔴 استدعاء أداة التوجيه

  useEffect(() => {
    // 🚨 1. حارس البوابة: التحقق من وجود التوكن قبل عرض أي شيء
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // طرد المستخدم لصفحة تسجيل الدخول إذا لم يكن مسجلاً
      return; 
    }

    // 🔴 إجبار الموقع ليكون باللغة التركية من اليسار لليمين دائماً
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'tr';

    const fetchLogo = async () => {
      try {
        // 🚨 2. إرفاق التوكن مع الطلب كأفضل ممارسة
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/adminLayout`, config);
        
        if (response.data && response.data.logoUrl) {
          setLogoUrl(response.data.logoUrl);
        }
      } catch (error) {
        console.error("خطأ في جلب اللوجو:", error);
        
        // 🚨 3. إذا كان التوكن منتهي الصلاحية والباك إند رفضه (401)، يتم تسجيل الخروج تلقائياً
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchLogo();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#202124' }}>
      <Sidebar logoUrl={logoUrl} isCollapsed={isSidebarCollapsed} />
      
      <div style={{ 
        flex: 1, 
        backgroundColor: 'var(--bg-color)', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0', 
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        <Topbar toggleSidebar={toggleSidebar} />
        
        <div style={{ padding: '30px' }}>
          <Outlet context={{ logoUrl, setLogoUrl }} /> 
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;