import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Projects from './components/Projects';
import Services from './components/Services';
import Faq from './components/Faq';
import About from './components/About';
import Security from './components/Security';
import ClientHome from './components/ClientHome';
import Contact from './components/Contact';
import Login from './components/Login'; // استدعاء صفحة الدخول
import ProtectedRoute from './components/ProtectedRoute'; // استدعاء الحارس
import './App.css';
import axios from 'axios';

// ==========================================
// 🛡️ إعداد مُعترض الطلبات (Axios Interceptor)
// ==========================================
axios.interceptors.request.use(
  (config) => {
    // 1. جلب التوكن من التخزين المحلي (LocalStorage)
    const token = localStorage.getItem('token');
    
    // 2. إذا التوكن موجود، أضفه لترويسة الطلب
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* الموقع العام */}
        <Route path="/" element={<ClientHome />} />
        
        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />

        {/* مسارات لوحة التحكم محمية بـ ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="projects" element={<Projects />} />
            <Route path="services" element={<Services />} />
            <Route path="faq" element={<Faq />} />
            <Route path="about" element={<About />} />
            <Route path="security" element={<Security />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;