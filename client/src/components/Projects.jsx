import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; 
import ConfirmModal from './ConfirmModal';
import './Settings.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); 
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const [editId, setEditId] = useState(null); 

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('خطأ في جلب المشاريع:', error);
      toast.error('Projeler getirilemedi!'); 
    }
  };

  useEffect(() => {
    fetchProjects();
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
    setCurrentImageUrl(''); 
    const fileInput = document.getElementById('project-image-upload');
    if (fileInput) fileInput.value = ''; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const toastId = toast.loading('Kaydediliyor...'); 

    // 🚨 1. جلب التوكن من المتصفح
    const token = localStorage.getItem('token');
    
    // 🚨 2. إعداد الـ Headers للطلبات العادية
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
      let finalImageUrl = currentImageUrl; 

      if (imageFile) {
        toast.loading('Görsel yükleniyor...', { id: toastId }); 
        const formData = new FormData();
        formData.append('image', imageFile);

        // 🚨 3. إرسال التوكن مع طلب رفع الصورة
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        finalImageUrl = uploadRes.data.imageUrl; 
      }

      const projectData = { title, description, imageUrl: finalImageUrl };

      if (editId) {
        // 🚨 4. إرسال التوكن مع طلب التعديل
        await axios.put(`${import.meta.env.VITE_API_URL}/api/projects/${editId}`, projectData, config);
        toast.success('Proje başarıyla güncellendi!', { id: toastId }); 
      } else {
        // 🚨 5. إرسال التوكن مع طلب الإضافة
        await axios.post(`${import.meta.env.VITE_API_URL}/api/projects`, projectData, config);
        toast.success('Proje başarıyla eklendi!', { id: toastId }); 
      }

      resetForm();
      fetchProjects();

    } catch (error) {
      console.error('خطأ في حفظ المشروع:', error);
      toast.error('Kaydetme sırasında bir hata oluştu', { id: toastId }); 
    }
  };

  const handleEdit = (project) => {
    setEditId(project._id);
    setTitle(project.title);
    setDescription(project.description);
    setCurrentImageUrl(project.imageUrl || '');
    setImagePreview(''); 
    setImageFile(null);
    const fileInput = document.getElementById('project-image-upload');
    if (fileInput) fileInput.value = '';
  };

  const triggerDelete = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    const toastId = toast.loading('Siliniyor...'); 
    
    // 🚨 6. جلب التوكن لإضافته في طلب الحذف
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
      // 🚨 7. إرسال التوكن مع طلب الحذف
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${itemToDelete}`, config);
      toast.success('Proje başarıyla silindi!', { id: toastId }); 
      fetchProjects();
    } catch (error) {
      console.error('خطأ في حذف المشروع:', error);
      toast.error('Silme işlemi başarısız oldu', { id: toastId }); 
    }
    setIsModalOpen(false); 
    setItemToDelete(null); 
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setImageFile(null);
    setImagePreview('');
    setCurrentImageUrl('');
    const fileInput = document.getElementById('project-image-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="settings-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <Toaster position="bottom-right" reverseOrder={false} /> 

      <div className="settings-card">
        <h3>{editId ? 'Mevcut Projeyi Düzenle' : 'Yeni Proje Ekle'}</h3>
        <p className="subtitle">Portföyünüzü yönetmek için aşağıdaki bilgileri doldurun.</p>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="input-group">
            <label>Proje Başlığı</label>
            <input 
              type="text" 
              placeholder="Örnek: Kapsamlı E-ticaret Sitesi" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Proje Görseli</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              
              {(imagePreview || currentImageUrl) && (
                <img 
                  src={imagePreview || currentImageUrl} 
                  alt="Project Preview" 
                  style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e5e7eb' }} 
                />
              )}
              
              <input 
                type="file" 
                id="project-image-upload"
                accept="image/*" 
                onChange={handleFileChange} 
              />

              {(imagePreview || currentImageUrl) && (
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                  Kaldır
                </button>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>Proje Açıklaması</label>
            <textarea 
              rows="4" 
              placeholder="Kullanılan teknolojiler ve proje detaylarını yazın..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="save-btn" style={{ flex: editId ? 'none' : '1' }}>
              {editId ? 'Projeyi Güncelle' : 'Kaydet ve Ekle'}
            </button>
            {editId && (
              <button 
                type="button" 
                onClick={resetForm}
                style={{
                  padding: '14px', backgroundColor: '#6b7280', color: '#ffffff',
                  fontSize: '1.1rem', fontWeight: 'bold', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s ease'
                }}
              >
                Düzenlemeyi İptal Et
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="settings-card">
        <h3>Mevcut Eklenen Projeler ({projects.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {projects.map((proj) => (
            <div key={proj._id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {proj.imageUrl && (
                  <img 
                    src={proj.imageUrl} 
                    alt={proj.title} 
                    style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} 
                  />
                )}
                <div>
                  <h4 style={{ margin: 0, color: '#111827' }}>{proj.title}</h4>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {proj.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleEdit(proj)}
                  style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Düzenle
                </button>
                <button 
                  onClick={() => triggerDelete(proj._id)}
                  style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>Şu anda eklenmiş proje bulunmamaktadır.</p>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete} 
        title="Silme İşlemini Onayla" 
        message="Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz." 
      />
    </div>
  );
};

export default Projects;