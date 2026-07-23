import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; /* 🔴 استدعاء مكتبة الإشعارات */
import './Settings.css';

const Settings = () => {
  const context = useOutletContext();
  const logoUrl = context?.logoUrl || '';
  const setLogoUrl = context?.setLogoUrl || (() => {});
  
  const [whatsapp, setWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb'); 
  const [secondaryColor, setSecondaryColor] = useState('#1e40af'); 
  
  const [sectionsVisibility, setSectionsVisibility] = useState({
    aboutEnabled: true,
    servicesEnabled: true,
    projectsEnabled: true,
    faqEnabled: true
  });
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState('');
  const [existingHeroUrl, setExistingHeroUrl] = useState('');

  // 🔴 ترجمة الثيمات للتركية
  const predefinedThemes = [
    { name: 'Klasik (Mavi)', primary: '#2563eb', secondary: '#1e40af' },
    { name: 'Lüks (Siyah ve Altın)', primary: '#111827', secondary: '#f59e0b' },
    { name: 'Doğa (Yeşil ve Koyu)', primary: '#10b981', secondary: '#064e3b' },
    { name: 'Enerjik (Kırmızı ve Siyah)', primary: '#ef4444', secondary: '#1f2937' },
    { name: 'Modern (Beyaz ve Siyah)', primary: '#ffffff', secondary: '#000000' }
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
         
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
        if (response.data) {
          setWhatsapp(response.data.whatsappNumber || '');
          setDescription(response.data.siteDescription || '');
          setPrimaryColor(response.data.primaryColor || '#2563eb');
          setSecondaryColor(response.data.secondaryColor || '#1e40af');
          setExistingHeroUrl(response.data.heroImageUrl || '');
          
          if (response.data.sectionsVisibility) {
            setSectionsVisibility(response.data.sectionsVisibility);
          }
        }
      } catch (error) {
        toast.error('Ayarlar getirilirken hata oluştu!'); /* 🔴 إشعار خطأ في حال فشل جلب البيانات */
      }
    };
    fetchSettings();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleHeroChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  // 🔴 دالة حذف اللوجو
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setLogoUrl(''); // تفريغ اللوجو الحالي
    const fileInput = document.getElementById('logo-upload-input');
    if (fileInput) fileInput.value = '';
  };

  // 🔴 دالة حذف صورة الهيرو (الخلفية)
  const handleRemoveHero = () => {
    setHeroFile(null);
    setHeroPreview('');
    setExistingHeroUrl(''); // تفريغ الصورة الحالية
    const fileInput = document.getElementById('hero-upload-input');
    if (fileInput) fileInput.value = '';
  };

  const applyTheme = (primary, secondary) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
    toast.success('Tema renkleri uygulandı!'); /* 🔴 إشعار نجاح تطبيق الثيم */
  };

  const handleToggle = (sectionId) => {
    setSectionsVisibility(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // 🔴 تشغيل إشعار "جاري الحفظ" وربطه بـ ID
    const toastId = toast.loading('Değişiklikler kaydediliyor...'); 

    try {
      let currentLogoUrl = logoUrl;
      let currentHeroUrl = existingHeroUrl;

      if (logoFile) {
        toast.loading('Logo yükleniyor...', { id: toastId }); // تحديث حالة الإشعار
        const formData = new FormData();
        formData.append('image', logoFile);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData);
        currentLogoUrl = uploadRes.data.imageUrl;
      }

      if (heroFile) {
        toast.loading('Ana görsel yükleniyor...', { id: toastId }); // تحديث حالة الإشعار
        const formData = new FormData();
        formData.append('image', heroFile);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData);
        currentHeroUrl = uploadRes.data.imageUrl;
      }

      await axios.put(`${import.meta.env.VITE_API_URL}/api/settings`, {
        logoUrl: currentLogoUrl,
        heroImageUrl: currentHeroUrl,
        whatsappNumber: whatsapp,
        siteDescription: description,
        primaryColor, 
        secondaryColor,
        sectionsVisibility
      });

      setLogoUrl(currentLogoUrl); 
      setLogoPreview('');
      setLogoFile(null);
      setExistingHeroUrl(currentHeroUrl);
      setHeroPreview('');
      setHeroFile(null);
      
      // 🔴 تحويل الإشعار الدوار إلى "علامة صح" بنجاح
      toast.success('Ayarlar başarıyla kaydedildi!', { id: toastId }); 
    } catch (error) {
      // 🔴 تحويل الإشعار الدوار إلى "علامة خطأ"
      toast.error('Ayarlar kaydedilirken bir hata oluştu', { id: toastId }); 
    }
  };

  return (
    <div className="settings-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* 🔴 حاوية الإشعارات */}
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* كارت إدارة ظهور الأقسام */}
      <div className="settings-card">
        <h3>Web Sitesi Bölüm Yöneticisi</h3>
        <p className="subtitle">Canlı web sitenizdeki belirli bölümleri gösterin veya gizleyin.</p>
        
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {[
            { id: 'servicesEnabled', label: 'Hizmetler Bölümü (Services)' },
            { id: 'projectsEnabled', label: 'Projeler Bölümü (Projects)' },
            { id: 'faqEnabled', label: 'SSS Bölümü (FAQ)' },
            { id: 'aboutEnabled', label: 'Hakkımızda Bölümü (About Us)' }
          ].map(section => (
            <div key={section.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
              <span style={{ fontWeight: 'bold', color: '#374151', fontSize: '1.1rem' }}>{section.label}</span>
              <button 
                type="button"
                onClick={() => handleToggle(section.id)}
                style={{
                  padding: '8px 25px',
                  borderRadius: '25px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  backgroundColor: sectionsVisibility[section.id] ? '#10b981' : '#ef4444',
                  color: 'white',
                  boxShadow: sectionsVisibility[section.id] ? '0 4px 10px rgba(16, 185, 129, 0.3)' : '0 4px 10px rgba(239, 68, 68, 0.3)'
                }}
              >
                {sectionsVisibility[section.id] ? 'Ziyaretçilere Açık 👁️' : 'Gizli 🚫'}
              </button>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#6b7280' }}>
          * Bu değişiklikleri uygulamak için aşağıdaki "Değişiklikleri Kaydet" butonuna tıklamayı unutmayın.
        </p>
      </div>

      {/* كارت الثيمات والألوان */}
      <div className="settings-card">
        <h3>Web Sitesi Teması ve Renkleri</h3>
        <p className="subtitle">Önceden tanımlanmış bir tema seçin veya kendi renklerinizi özelleştirin.</p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
          {predefinedThemes.map((theme, index) => (
            <button key={index} type="button" onClick={() => applyTheme(theme.primary, theme.secondary)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px',
                borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb',
                cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: 'bold'
              }}>
              <div style={{ display: 'flex', borderRadius: '50%', overflow: 'hidden', width: '24px', height: '24px', border: '1px solid #ccc' }}>
                <div style={{ flex: 1, backgroundColor: theme.primary }}></div>
                <div style={{ flex: 1, backgroundColor: theme.secondary }}></div>
              </div>
              {theme.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ width: '150px' }}>
            <label>Ana Renk</label>
            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '100%', height: '42px', padding: '0', cursor: 'pointer', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
          <div className="input-group" style={{ width: '150px' }}>
            <label>İkincil Renk</label>
            <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} style={{ width: '100%', height: '42px', padding: '0', cursor: 'pointer', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
        </div>
      </div>

      {/* كارت الإعدادات العامة وصور الموقع */}
      <div className="settings-card">
        <h3>Genel Ayarlar ve Medya</h3>
        <form onSubmit={handleSave} className="settings-form">
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            <div className="input-group" style={{ flex: 1, minWidth: '250px' }}>
              <label>Web Sitesi Logosu</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {(logoPreview || logoUrl) && (
                  <img src={logoPreview || logoUrl} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'contain', border: '1px solid #e5e7eb' }} />
                )}
                <input type="file" id="logo-upload-input" accept="image/*" onChange={handleLogoChange} />
                
                {/* زر حذف اللوجو */}
                {(logoPreview || logoUrl) && (
                  <button 
                    type="button" 
                    onClick={handleRemoveLogo}
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

            <div className="input-group" style={{ flex: 1, minWidth: '250px' }}>
              <label>Ana Arka Plan Görseli</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {(heroPreview || existingHeroUrl) && (
                  <img src={heroPreview || existingHeroUrl} alt="Hero" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                )}
                <input type="file" id="hero-upload-input" accept="image/*" onChange={handleHeroChange} />
                
                {/* زر حذف صورة الخلفية */}
                {(heroPreview || existingHeroUrl) && (
                  <button 
                    type="button" 
                    onClick={handleRemoveHero}
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

          </div>

          <div className="input-group">
            <label>WhatsApp Numarası</label>
            <input type="text" placeholder="+90 5XX XXX XX XX" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Site Açıklaması</label>
            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '15px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
              transition: 'background 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Değişiklikleri Kaydet
          </button>
        </form>
      </div>

    </div>
  );
};

export default Settings;