import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast'; 
import './Settings.css';

const Security = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const navigate = useNavigate();

  // 🔴 إضافة التوكن لجلب الإيميل الحالي من الباك إند
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // 🚨 إرسال التوكن مع طلب جلب البيانات
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/security`, config);
        
        if (response.data && response.data.email) {
          setEmail(response.data.email); // تعبئة الحقل بالإيميل الحقيقي
        }
      } catch (error) {
        console.error('Yönetici bilgileri alınamadı:', error);
      }
    };
    fetchAdminData();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    const toastId = toast.loading('Güvenlik bilgileri güncelleniyor...');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // 🚨 إرسال التوكن مع طلب تحديث البيانات
      await axios.put(`${import.meta.env.VITE_API_URL}/api/security`, { 
        email, 
        currentPassword, 
        newPassword 
      }, config);

      toast.success('Bilgiler başarıyla güncellendi! Yönlendiriliyorsunuz...', { id: toastId });

      setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message, { id: toastId });
      } else {
        toast.error('Bilgiler güncellenirken bir hata oluştu', { id: toastId });
      }
    }
  };

  return (
    <div className="settings-container">
      
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="settings-card" style={{ maxWidth: '550px' }}>
        <h3>Güvenlik ve Giriş</h3>
        <p className="subtitle">Yönetici paneli erişim bilgilerinizi güncelleyin.</p>
        
        <form onSubmit={handleSave} className="settings-form">
          
          <div className="input-group">
            <label>Yönetici E-postası</label>
            <input 
              type="email" // 🔴 تغيير النوع إلى email للتحقق من الصيغة
              placeholder="admin@ornek.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              autoComplete="off"
              spellCheck="false"
              autoCapitalize="off"
              required // 🔴 منع إرسال الفورم إذا كان الحقل فارغاً
            />
          </div>

          <div className="input-group">
            <label>Mevcut Şifre</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="••••••••" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                autoComplete="off"
                spellCheck="false"
                autoCapitalize="off"
                required // 🔴 منع إرسال الفورم إذا كان الحقل فارغاً
                style={{ 
                  WebkitTextSecurity: showCurrent ? 'none' : 'disc', 
                  width: '100%', 
                  paddingRight: '45px', 
                  boxSizing: 'border-box'
                }} 
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748b', fontSize: '1.2rem', display: 'flex', alignItems: 'center'
                }}
              >
                {showCurrent ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Yeni Şifre</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="••••••••" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                autoComplete="off"
                spellCheck="false"
                autoCapitalize="off"
                required // 🔴 منع إرسال الفورم إذا كان الحقل فارغاً
                style={{ 
                  WebkitTextSecurity: showNew ? 'none' : 'disc', 
                  width: '100%', 
                  paddingRight: '45px', 
                  boxSizing: 'border-box'
                }} 
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748b', fontSize: '1.2rem', display: 'flex', alignItems: 'center'
                }}
              >
                {showNew ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '15px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)',
              transition: 'background 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            Bilgileri Güncelle
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Security;