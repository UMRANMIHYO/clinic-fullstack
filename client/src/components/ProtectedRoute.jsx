import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // تم تعديل الاسم ليطابق الاسم المحفوظ عند تسجيل الدخول 👈
  const token = localStorage.getItem('token');
  
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;