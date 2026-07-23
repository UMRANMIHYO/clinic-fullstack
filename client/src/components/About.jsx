/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; 
import './Settings.css';

const About = () => {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [vision, setVision] = useState('');
  
  const [bgFile, setBgFile] = useState(null);
  const [bgPreview, setBgPreview] = useState('');
  const [existingBgUrl, setExistingBgUrl] = useState('');

  // المعرض: كل عنصر يحتوي على { url, title, description, file (اختياري للجديد) }
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
       const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/about`);
        if (response.data) {
          setTitle(response.data.title || '');
          setStory(response.data.story || '');
          setVision(response.data.vision || '');
          setExistingBgUrl(response.data.backgroundImageUrl || '');
          
          // تجهيز البيانات القادمة من الباك إند لتناسب الواجهة
          if (response.data.gallery && response.data.gallery.length > 0) {
            const formattedGallery = response.data.gallery.map(item => ({
              url: item.url,
              preview: item.url,
              title: item.title || '',
              description: item.description || '',
              file: null
            }));
            setGallery(formattedGallery);
          }
        }
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        toast.error('Veri getirme hatası!'); 
      }
    };
    fetchAbout();
  }, []);

  const handleRemoveBg = () => {
    setBgFile(null);
    setBgPreview('');
    setExistingBgUrl('');
    const fileInput = document.getElementById('about-bg-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file),
      url: '',
      title: '',
      description: ''
    }));
    setGallery(prev => [...prev, ...newItems]);
    e.target.value = null;
  };

  const handleGalleryTextChange = (index, field, value) => {
    const updatedGallery = [...gallery];
    updatedGallery[index][field] = value;
    setGallery(updatedGallery);
  };

  const removeGalleryItem = (index) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Kaydediliyor...'); 
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      let finalBgUrl = existingBgUrl;
      let finalGallery = [];

      if (bgFile) {
        toast.loading('Arka plan görseli yükleniyor...', { id: toastId });
        const formData = new FormData();
        formData.append('image', bgFile);
        const res = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        finalBgUrl = res.data.imageUrl;
      }

      // رفع الصور الجديدة التي تم اختيارها فقط، والحفاظ على القديمة
      if (gallery.length > 0) {
        toast.loading('Galeri görselleri işleniyor...', { id: toastId });
        for (let i = 0; i < gallery.length; i++) {
          const item = gallery[i];
          let currentUrl = item.url;

          if (item.file) {
            const formData = new FormData();
            formData.append('image', item.file);
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });
            currentUrl = res.data.imageUrl;
          }

          if (currentUrl) {
            finalGallery.push({
              url: currentUrl,
              title: item.title,
              description: item.description
            });
          }
        }
      }

      // 🔴 إرسال البيانات المحدثة بالكامل للباك إند
     const response = await axios.post('http://localhost:5000/api/about', {
        title, 
        story, 
        vision,
        backgroundImageUrl: finalBgUrl,
        gallery: finalGallery // إرسال مصفوفة الصور والنصوص
      }, config);
      
      toast.success('Hakkımızda bölümü başarıyla güncellendi!', { id: toastId }); 
    } catch (error) {
      console.error('Hata:', error);
      toast.error('Veriler kaydedilirken bir hata oluştu', { id: toastId }); 
    }
  };

  return (
    <div className="settings-container">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="settings-card">
        <h3>Hakkımızda Bölümü</h3>
        <p className="subtitle">Klinik hikayenizi ve görsellerini yönetin.</p>

        <form onSubmit={handleSave} className="settings-form">
          <div className="input-group">
            <label>Bölüm Başlığı</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Arka Plan Görseli (İsteğe Bağlı)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {(bgPreview || existingBgUrl) && (
                <img src={bgPreview || existingBgUrl} alt="Bg" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
              )}
              <input type="file" id="about-bg-upload" accept="image/*" onChange={(e) => {
                if (e.target.files[0]) {
                  setBgFile(e.target.files[0]);
                  setBgPreview(URL.createObjectURL(e.target.files[0]));
                }
              }} />
              {(bgPreview || existingBgUrl) && (
                <button type="button" onClick={handleRemoveBg} className="remove-btn-small">Kaldır</button>
              )}
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <label style={{ fontSize: '1.1rem', marginBottom: '15px', display: 'block', color: '#1f2937' }}>
              Klinik Galerisi (Görsel + Metin)
            </label>
            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} style={{ marginBottom: '20px' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {gallery.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#ffffff', padding: '15px', borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  
                  <img src={item.preview || item.url} alt={`Gallery ${index}`} style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #d1d5db' }} />
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Görsel Başlığı (Örn: Modern Ameliyathane)" 
                      value={item.title} 
                      onChange={(e) => handleGalleryTextChange(index, 'title', e.target.value)}
                      style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    <textarea 
                      placeholder="Kısa Açıklama" 
                      rows="2" 
                      value={item.description} 
                      onChange={(e) => handleGalleryTextChange(index, 'description', e.target.value)}
                      style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'none' }}
                    />
                  </div>

                  <button type="button" onClick={() => removeGalleryItem(index)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '20px' }}>
            <label>Hikayemiz</label>
            <textarea rows="4" value={story} onChange={(e) => setStory(e.target.value)} required></textarea>
          </div>

          <div className="input-group">
            <label>Vizyonumuz</label>
            <textarea rows="4" value={vision} onChange={(e) => setVision(e.target.value)} required></textarea>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', marginTop: '15px', backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '1.1rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s ease' }}>
            Değişiklikleri Kaydet
          </button>
        </form>
      </div>
    </div>
  );
};

export default About;*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; 
import './Settings.css';

const About = () => {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [vision, setVision] = useState('');
  
  const [bgFile, setBgFile] = useState(null);
  const [bgPreview, setBgPreview] = useState('');
  const [existingBgUrl, setExistingBgUrl] = useState('');

  // المعرض: كل عنصر يحتوي على { url, title, description, file (اختياري للجديد) }
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        // 🔴 التعديل الأول: جلب البيانات
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/about`);
        if (response.data) {
          setTitle(response.data.title || '');
          setStory(response.data.story || '');
          setVision(response.data.vision || '');
          setExistingBgUrl(response.data.backgroundImageUrl || '');
          
          // تجهيز البيانات القادمة من الباك إند لتناسب الواجهة
          if (response.data.gallery && response.data.gallery.length > 0) {
            const formattedGallery = response.data.gallery.map(item => ({
              url: item.url,
              preview: item.url,
              title: item.title || '',
              description: item.description || '',
              file: null
            }));
            setGallery(formattedGallery);
          }
        }
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        toast.error('Veri getirme hatası!'); 
      }
    };
    fetchAbout();
  }, []);

  const handleRemoveBg = () => {
    setBgFile(null);
    setBgPreview('');
    setExistingBgUrl('');
    const fileInput = document.getElementById('about-bg-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file),
      url: '',
      title: '',
      description: ''
    }));
    setGallery(prev => [...prev, ...newItems]);
    e.target.value = null;
  };

  const handleGalleryTextChange = (index, field, value) => {
    const updatedGallery = [...gallery];
    updatedGallery[index][field] = value;
    setGallery(updatedGallery);
  };

  const removeGalleryItem = (index) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Kaydediliyor...'); 
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      let finalBgUrl = existingBgUrl;
      let finalGallery = [];

      if (bgFile) {
        toast.loading('Arka plan görseli yükleniyor...', { id: toastId });
        const formData = new FormData();
        formData.append('image', bgFile);
        // 🔴 التعديل الثاني: رفع صورة الخلفية
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        finalBgUrl = res.data.imageUrl;
      }

      // رفع الصور الجديدة التي تم اختيارها فقط، والحفاظ على القديمة
      if (gallery.length > 0) {
        toast.loading('Galeri görselleri işleniyor...', { id: toastId });
        for (let i = 0; i < gallery.length; i++) {
          const item = gallery[i];
          let currentUrl = item.url;

          if (item.file) {
            const formData = new FormData();
            formData.append('image', item.file);
            // 🔴 التعديل الثالث: رفع صور المعرض
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
              headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });
            currentUrl = res.data.imageUrl;
          }

          if (currentUrl) {
            finalGallery.push({
              url: currentUrl,
              title: item.title,
              description: item.description
            });
          }
        }
      }

      // 🔴 التعديل الرابع: حفظ البيانات النهائية للباك إند
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/about`, {
        title, 
        story, 
        vision,
        backgroundImageUrl: finalBgUrl,
        gallery: finalGallery // إرسال مصفوفة الصور والنصوص
      }, config);
      
      toast.success('Hakkımızda bölümü başarıyla güncellendi!', { id: toastId }); 
    } catch (error) {
      console.error('Hata:', error);
      toast.error('Veriler kaydedilirken bir hata oluştu', { id: toastId }); 
    }
  };

  return (
    <div className="settings-container">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="settings-card">
        <h3>Hakkımızda Bölümü</h3>
        <p className="subtitle">Klinik hikayenizi ve görsellerini yönetin.</p>

        <form onSubmit={handleSave} className="settings-form">
          <div className="input-group">
            <label>Bölüm Başlığı</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Arka Plan Görseli (İsteğe Bağlı)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {(bgPreview || existingBgUrl) && (
                <img src={bgPreview || existingBgUrl} alt="Bg" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
              )}
              <input type="file" id="about-bg-upload" accept="image/*" onChange={(e) => {
                if (e.target.files[0]) {
                  setBgFile(e.target.files[0]);
                  setBgPreview(URL.createObjectURL(e.target.files[0]));
                }
              }} />
              {(bgPreview || existingBgUrl) && (
                <button type="button" onClick={handleRemoveBg} className="remove-btn-small">Kaldır</button>
              )}
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <label style={{ fontSize: '1.1rem', marginBottom: '15px', display: 'block', color: '#1f2937' }}>
              Klinik Galerisi (Görsel + Metin)
            </label>
            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} style={{ marginBottom: '20px' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {gallery.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#ffffff', padding: '15px', borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  
                  <img src={item.preview || item.url} alt={`Gallery ${index}`} style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #d1d5db' }} />
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Görsel Başlığı (Örn: Modern Ameliyathane)" 
                      value={item.title} 
                      onChange={(e) => handleGalleryTextChange(index, 'title', e.target.value)}
                      style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    <textarea 
                      placeholder="Kısa Açıklama" 
                      rows="2" 
                      value={item.description} 
                      onChange={(e) => handleGalleryTextChange(index, 'description', e.target.value)}
                      style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'none' }}
                    />
                  </div>

                  <button type="button" onClick={() => removeGalleryItem(index)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '20px' }}>
            <label>Hikayemiz</label>
            <textarea rows="4" value={story} onChange={(e) => setStory(e.target.value)} required></textarea>
          </div>

          <div className="input-group">
            <label>Vizyonumuz</label>
            <textarea rows="4" value={vision} onChange={(e) => setVision(e.target.value)} required></textarea>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', marginTop: '15px', backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '1.1rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s ease' }}>
            Değişiklikleri Kaydet
          </button>
        </form>
      </div>
    </div>
  );
};

export default About;