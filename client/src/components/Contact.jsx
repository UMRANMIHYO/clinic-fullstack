import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './Settings.css';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState(''); 
  
  // وسائل التواصل الاجتماعي
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contact`);
        if (response.data) {
          setEmail(response.data.email || '');
          setPhone(response.data.phone || '');
          setAddress(response.data.address || '');
          setMapUrl(response.data.mapUrl || '');
          setInstagram(response.data.instagram || '');
          setLinkedin(response.data.linkedin || '');
          setGithub(response.data.github || '');
        }
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        toast.error('İletişim bilgileri getirilemedi!');
      }
    };
    fetchContactInfo();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    
    const toastId = toast.loading('Kaydediliyor...');
    
    // 🚨 1. جلب التوكن من المتصفح
    const token = localStorage.getItem('token');
    
    // 🚨 2. إعداد الـ Headers
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
      // 🚨 3. إرسال التوكن مع طلب الحفظ (POST)
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, { 
        email, phone, address, mapUrl, instagram, linkedin, github 
      }, config);
      
      toast.success('İletişim bilgileri başarıyla güncellendi!', { id: toastId });
    } catch (error) {
      console.error('Hata:', error);
      toast.error('Bilgiler güncellenirken bir hata oluştu', { id: toastId });
    }
  };

  return (
    <div className="settings-container">
      
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="settings-card">
        <h3>İletişim ve Konum</h3>
        <p className="subtitle">Müşterilerinizin size ulaşabileceği iletişim bilgilerini ve adresinizi yönetin.</p>
        
        <form onSubmit={handleSave} className="settings-form" autoComplete="off">
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '250px' }}>
              <label>İşletme E-postası</label>
              <input 
                type="email" 
                placeholder="ornek@sirket.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="input-group" style={{ flex: 1, minWidth: '250px' }}>
              <label>Telefon Numarası</label>
              <input 
                type="text" 
                placeholder="+90 5XX XXX XX XX"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Açık Adres (Konum)</label>
            <textarea 
              rows="3" 
              placeholder="Şirketinizin açık adresini buraya girin..."
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            ></textarea>
          </div>

          <div className="input-group">
            <label>Google Maps Bağlantısı (Iframe veya URL)</label>
            <input 
              type="text" 
              placeholder="Google Haritalar'dan aldığınız paylaşım bağlantısını yapıştırın"
              value={mapUrl} 
              onChange={(e) => setMapUrl(e.target.value)} 
            />
            {mapUrl && (
               <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                 <iframe 
                   title="Google Map Preview"
                   src={mapUrl.includes('<iframe') ? mapUrl.match(/src="([^"]+)"/)[1] : mapUrl}
                   width="100%" 
                   height="200" 
                   style={{ border: 0 }} 
                   allowFullScreen="" 
                   loading="lazy"
                 ></iframe>
               </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />
          <h4 style={{ marginBottom: '15px', color: '#374151' }}>Sosyal Medya Hesapları</h4>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
              <label>Instagram URL</label>
              <input 
                type="text" 
                placeholder="https://instagram.com/..."
                value={instagram} 
                onChange={(e) => setInstagram(e.target.value)} 
              />
            </div>

            <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
              <label>LinkedIn URL</label>
              <input 
                type="text" 
                placeholder="https://linkedin.com/in/..."
                value={linkedin} 
                onChange={(e) => setLinkedin(e.target.value)} 
              />
            </div>

            <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
              <label>GitHub URL</label>
              <input 
                type="text" 
                placeholder="https://github.com/..."
                value={github} 
                onChange={(e) => setGithub(e.target.value)} 
              />
            </div>
          </div>

          <button type="submit" className="save-btn">
            Değişiklikleri Kaydet
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Contact;