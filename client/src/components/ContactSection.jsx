import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi';

const ContactSection = () => {
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contact`);
        setContactData(response.data);
      } catch (error) {
        console.error('İletişim bilgileri yüklenemedi:', error);
      }
    };
    fetchContactData();
  }, []);

  if (!contactData) return null;

  return (
    <div style={{ padding: '80px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <h2 className="section-title text-center" style={{ marginBottom: '50px' }}>
          Bize Ulaşın
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px', 
          marginBottom: '50px' 
        }}>
          
          {/* بطاقة العنوان */}
          {contactData.address && (
            <div className="contact-card modern-card">
              <div className="contact-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                <FiMapPin size={32} />
              </div>
              <h3>Adres</h3>
              <p>{contactData.address}</p>
            </div>
          )}

          {/* بطاقة الهاتف */}
          {contactData.phone && (
            <div className="contact-card modern-card">
              <div className="contact-icon-wrapper" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
                <FiPhone size={32} />
              </div>
              <h3>Telefon</h3>
              <a href={`tel:${contactData.phone}`} style={{ direction: 'ltr', display: 'inline-block' }}>
                {contactData.phone}
              </a>
            </div>
          )}

          {/* بطاقة الإيميل */}
          {contactData.email && (
            <div className="contact-card modern-card">
              <div className="contact-icon-wrapper" style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}>
                <FiMail size={32} />
              </div>
              <h3>E-posta</h3>
              <a href={`mailto:${contactData.email}`}>
                {contactData.email}
              </a>
            </div>
          )}
        </div>

      {/* السوشيال ميديا */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
          
          {contactData.instagram && (
            <a className="social-link-card" href={contactData.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#e1306c' }}>
              <FiInstagram size={28} />
            </a>
          )}
          
          {contactData.linkedin && (
            <a className="social-link-card" href={contactData.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5' }}>
              <FiLinkedin size={28} />
            </a>
          )}
          
          {contactData.github && (
            <a className="social-link-card" href={contactData.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-color)' }}>
              <FiGithub size={28} />
            </a>
          )}
          
        </div>

        {/* خريطة جوجل */}
        {contactData.mapUrl && (
          <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '5px solid var(--card-bg)' }}>
            <iframe
              title="Şirket Konumu"
              src={contactData.mapUrl.includes('<iframe') ? contactData.mapUrl.match(/src="([^"]+)"/)[1] : contactData.mapUrl}
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ContactSection;