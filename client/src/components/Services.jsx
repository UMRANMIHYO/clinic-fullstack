import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './Settings.css'; 
import ConfirmModal from './ConfirmModal';

const Services = () => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');

  const [editId, setEditId] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchServices = async () => {
    try {
     
      const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('خطأ في جلب الخدمات:', error);
      toast.error('Hizmetler getirilemedi!');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setExistingImageUrl(''); 
    const fileInput = document.getElementById('service-image-upload');
    if (fileInput) fileInput.value = ''; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Kaydediliyor...'); 
    
    // 🚨 1. جلب التوكن من التخزين المحلي
    const token = localStorage.getItem('token');
    // إعداد الـ Headers للطلبات العادية
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
      let finalImageUrl = existingImageUrl;

      if (imageFile) {
        toast.loading('Görsel yükleniyor...', { id: toastId }); 
        const formData = new FormData();
        formData.append('image', imageFile);
        
        // 🚨 2. إضافة التوكن في طلب رفع الصورة
        const uploadRes = await axios.post( `${import.meta.env.VITE_API_URL}/api/upload`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        finalImageUrl = uploadRes.data.imageUrl;
      }

      const serviceData = { name, price, description, imageUrl: finalImageUrl };
      
      if (editId) {
        // 🚨 3. إضافة التوكن في طلب التعديل
        await axios.put( `${import.meta.env.VITE_API_URL}/api/services/${editId}`, serviceData, config);
        toast.success('Hizmet başarıyla güncellendi!', { id: toastId }); 
      } else {
        // 🚨 4. إضافة التوكن في طلب الإضافة
        await axios.post( `${import.meta.env.VITE_API_URL}/api/services`, serviceData, config);
        toast.success('Hizmet başarıyla eklendi!', { id: toastId }); 
      }
      
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('خطأ في حفظ الخدمة:', error);
      toast.error('Kaydetme sırasında bir hata oluştu', { id: toastId }); 
    }
  };

  const handleEdit = (service) => {
    setEditId(service._id);
    setName(service.name || service.title || ''); 
    setPrice(service.price || '');
    setDescription(service.description || '');
    setExistingImageUrl(service.imageUrl || ''); 
    setImagePreview('');
    setImageFile(null);
    const fileInput = document.getElementById('service-image-upload');
    if (fileInput) fileInput.value = '';
  };

  const triggerDelete = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    const toastId = toast.loading('Siliniyor...');
    
    // 🚨 5. جلب التوكن لإضافته في طلب الحذف
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
      await axios.delete( `${import.meta.env.VITE_API_URL}/api/services${itemToDelete}`, config);
      toast.success('Hizmet başarıyla silindi!', { id: toastId }); 
      fetchServices();
    } catch (error) {
      console.error('خطأ في حذف الخدمة:', error);
      toast.error('Silme işlemi başarısız oldu', { id: toastId }); 
    }
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setPrice('');
    setDescription('');
    setImageFile(null);
    setImagePreview('');
    setExistingImageUrl('');
    const fileInput = document.getElementById('service-image-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="settings-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <Toaster position="bottom-right" reverseOrder={false} /> 

      <div className="settings-card">
        <h3>{editId ? 'Mevcut Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}</h3>
        <p className="subtitle">Müşterilerinize sunduğunuz hizmetleri yönetin.</p>
        
        <form onSubmit={handleSubmit} className="settings-form">
          
          <div className="input-group">
            <label>Hizmet Görseli (İsteğe Bağlı)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              {(imagePreview || existingImageUrl) && (
                <img 
                  src={imagePreview || existingImageUrl} 
                  alt="Preview" 
                  style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e5e7eb' }} 
                />
              )}
              <input type="file" id="service-image-upload" accept="image/*" onChange={handleFileChange} />
              
              {(imagePreview || existingImageUrl) && (
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    backgroundColor: '#fee2e2', color: '#ef4444',
                    border: '1px solid #f87171', padding: '6px 12px',
                    borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.9rem', fontWeight: 'bold', transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                  Görseli Kaldır
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '250px' }}>
              <label>Hizmet Adı</label>
              <input 
                type="text" 
                placeholder="Örn: Web Geliştirme" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-group" style={{ flex: 1, minWidth: '250px' }}>
              <label>Fiyat</label>
              <input 
                type="text" 
                placeholder="Örn: 150$" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Hizmet Detayları</label>
            <textarea 
              rows="4" 
              placeholder="Hizmetin detaylarını girin..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="save-btn" style={{ flex: editId ? 'none' : '1' }}>
              {editId ? 'Hizmeti Güncelle' : 'Kaydet ve Ekle'}
            </button>
            
            {editId && (
              <button 
                type="button" 
                onClick={resetForm}
                style={{
                  padding: '14px',
                  backgroundColor: '#6b7280',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
              >
                Düzenlemeyi İptal Et
              </button>
            )}
          </div>
          
        </form>
      </div>

      <div className="settings-card">
        <h3>Hizmetlerimiz ({services.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {services.map((srv) => (
            <div key={srv._id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {srv.imageUrl ? (
                  <img src={srv.imageUrl} alt={srv.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>✨</div>
                )}
                <div>
                  <h4 style={{ margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {srv.name || srv.title} 
                    {srv.price && (
                      <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '3px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>
                        {srv.price}
                      </span>
                    )}
                  </h4>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {srv.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleEdit(srv)}
                  style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Düzenle
                </button>
                <button 
                  onClick={() => triggerDelete(srv._id)}
                  style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>Henüz eklenmiş hizmet bulunmamaktadır.</p>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete} 
        title="Silme İşlemini Onayla" 
        message="Bu hizmeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz." 
      />

    </div>
  );
};

export default Services;