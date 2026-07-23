import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { email, password });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/admin'); 
      }
    } catch (err) {
      // رسالة الخطأ بالتركية (البريد أو كلمة المرور غير صحيحة)
      setError(err.response?.data?.message || 'Geçersiz e-posta veya şifre');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f1f5f9' 
    }}>
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '40px', 
        borderRadius: '15px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
        width: '100%', 
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        
        <h2 style={{ color: '#1e293b', marginBottom: '5px', fontSize: '1.8rem' }}>Giriş Yap</h2>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Lütfen panel bilgilerinizi girin</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ textAlign: 'left' }}> {/* 🔴 المحاذاة لليسار */}
            <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '0.95rem' }}>
              E-posta
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 15px', borderRadius: '8px',
                border: '1px solid #cbd5e1', backgroundColor: '#eff6ff',
                fontSize: '1rem', color: '#1e293b', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ textAlign: 'left', position: 'relative' }}> {/* 🔴 المحاذاة لليسار */}
            <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '0.95rem' }}>
              Şifre
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 15px', borderRadius: '8px',
                  border: '1px solid #cbd5e1', backgroundColor: '#eff6ff',
                  fontSize: '1rem', color: '#1e293b', outline: 'none', boxSizing: 'border-box',
                  paddingRight: '45px' // 🔴 مساحة الأيقونة أصبحت على اليمين لتناسب الـ LTR
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', // 🔴 نقل الأيقونة لليمين
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748b', fontSize: '1.2rem', display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '1.1rem',
              fontWeight: 'bold', border: 'none', cursor: 'pointer',
              marginTop: '10px', transition: 'background 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Giriş
          </button>

        </form>

        {error && (
          <div style={{ 
            marginTop: '20px', color: '#ef4444', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' 
          }}>
            ❌ {error}
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;