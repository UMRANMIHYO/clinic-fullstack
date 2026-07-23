import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // التحقق من وجود التوكن في ذاكرة المتصفح
  const token = localStorage.getItem('adminToken');
  
  // إذا كان موجوداً، اسمح بمروره للمسار المطلوب (Outlet)، وإذا لا، اطرده لصفحة الدخول
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;