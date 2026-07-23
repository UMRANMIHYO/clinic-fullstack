import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>{title}</h3>
        <p style={{ color: '#4b5563', marginBottom: '25px', lineHeight: '1.5' }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={cancelBtnStyle}>إلغاء</button>
          <button onClick={onConfirm} style={confirmBtnStyle}>تأكيد الحذف</button>
        </div>
      </div>
    </div>
  );
};

// --- التنسيقات ---
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(4px)', // تأثير الضباب الاحترافي
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999
};

const modalStyle = {
  backgroundColor: '#fff', padding: '25px 30px', borderRadius: '15px',
  width: '90%', maxWidth: '400px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  textAlign: 'right', direction: 'rtl',
  animation: 'fadeIn 0.3s ease'
};

const cancelBtnStyle = {
  padding: '10px 20px', borderRadius: '8px', border: 'none',
  backgroundColor: '#f3f4f6', color: '#374151', cursor: 'pointer', fontWeight: 'bold',
  transition: 'background 0.2s'
};

const confirmBtnStyle = {
  padding: '10px 20px', borderRadius: '8px', border: 'none',
  backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 'bold',
  transition: 'background 0.2s'
};

export default ConfirmModal;