import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; 
import './Settings.css'; 
import ConfirmModal from './ConfirmModal'; 

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Genel'); 
  
  const [editId, setEditId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchFaqs = async () => {
    try {
      // 🔴 تم توحيد المسار هنا ليصبح faq بحرف صغير
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/faq`);
      setFaqs(response.data);
    } catch (error) {
      console.error('SSS getirilirken hata oluştu:', error);
      toast.error('SSS getirilemedi!'); 
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const toastId = toast.loading('Kaydediliyor...'); 
    
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    
    try {
      const faqData = { question, answer, category };
      
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/faq/${editId}`, faqData, config);
        toast.success('SSS başarıyla güncellendi!', { id: toastId }); 
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/faq`, faqData, config);
        toast.success('SSS başarıyla eklendi!', { id: toastId }); 
      }
      
      resetForm();
      fetchFaqs();
    } catch (error) {
      console.error('SSS kaydedilirken hata oluştu:', error);
      toast.error('Kaydetme sırasında bir hata oluştu', { id: toastId }); 
    }
  };

  const handleEdit = (faq) => {
    setEditId(faq._id);
    setQuestion(faq.question || '');
    setAnswer(faq.answer || '');
    setCategory(faq.category || 'Genel');
  };

  const triggerDelete = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    const toastId = toast.loading('Siliniyor...'); 
    
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/faq/${itemToDelete}`, config);
      toast.success('SSS başarıyla silindi!', { id: toastId }); 
      fetchFaqs();
    } catch (error) {
      console.error('SSS silinirken hata oluştu:', error);
      toast.error('Silme işlemi başarısız oldu', { id: toastId }); 
    }
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const resetForm = () => {
    setEditId(null);
    setQuestion('');
    setAnswer('');
    setCategory('Genel');
  };

  return (
    <div className="settings-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <Toaster position="bottom-right" reverseOrder={false} /> 

      <div className="settings-card">
        <h3>{editId ? 'Mevcut SSS\'yi Düzenle' : 'Yeni SSS Ekle'}</h3>
        <p className="subtitle">Web sitenizdeki sıkça sorulan soruları yönetin.</p>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 2, minWidth: '250px' }}>
              <label>Soru</label>
              <input 
                type="text" 
                placeholder="Örn: Kargo ne kadar sürer?" 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-group" style={{ flex: 1, minWidth: '150px' }}>
              <label>Kategori</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              >
                <option value="Genel">Genel</option>
                <option value="Fiyatlandırma">Fiyatlandırma</option>
                <option value="Destek">Destek</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Cevap</label>
            <textarea 
              rows="4" 
              placeholder="Detaylı cevabı buraya girin..." 
              value={answer} 
              onChange={(e) => setAnswer(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="save-btn" style={{ flex: editId ? 'none' : '1' }}>
              {editId ? 'SSS\'yi Güncelle' : 'Kaydet ve Ekle'}
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
        <h3>SSS Kataloğu ({faqs.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {faqs.map((faq) => (
            <div key={faq._id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div>
                <h4 style={{ margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {faq.question} 
                  <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid #d1d5db' }}>
                    {faq.category}
                  </span>
                </h4>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#6b7280' }}>
                  {faq.answer}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleEdit(faq)}
                  style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Düzenle
                </button>
                <button 
                  onClick={() => triggerDelete(faq._id)}
                  style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}

          {faqs.length === 0 && (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>Henüz eklenmiş bir SSS bulunmamaktadır.</p>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete} 
        title="Silme İşlemini Onayla" 
        message="Bu soruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz." 
      />

    </div>
  );
};

export default Faq;