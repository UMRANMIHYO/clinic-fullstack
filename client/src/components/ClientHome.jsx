import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientHome.css';
import ContactSection from './ContactSection';

// 🔴 استدعاءات مكتبة السلايدر (Swiper)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ClientHome = () => {
  const [settings, setSettings] = useState({});
  const [about, setAbout] = useState({});
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);

    const fetchAllData = async () => {
      try {
        const [setRes, abtRes, srvRes, projRes, faqRes] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_API_URL}/api/settings`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/about`), 
          axios.get(`${import.meta.env.VITE_API_URL}/api/services`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/projects`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/faq`)
        ]);
        if(setRes.status === 'fulfilled') setSettings(setRes.value.data);
        if(abtRes.status === 'fulfilled') setAbout(abtRes.value.data); 
        if(srvRes.status === 'fulfilled') setServices(srvRes.value.data);
        if(projRes.status === 'fulfilled') setProjects(projRes.value.data);
        if(faqRes.status === 'fulfilled') setFaqs(faqRes.value.data);
        
        // تأخير بسيط لمدة نصف ثانية لإعطاء فرصة لرؤية شاشة التحميل الفخمة
        setTimeout(() => setLoading(false), 500); 
      } catch (error) { 
        console.error("Müşteri verileri alınırken hata oluştu", error);
        setLoading(false); 
      }
    };
    fetchAllData();
  }, []);

  // مراقبة التمرير (Scroll Reveal & Active Nav & Scroll to top)
  useEffect(() => {
    if (loading) return; 

    // 1. Scroll Reveal Logic
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
      threshold: 0.1, 
      rootMargin: "0px 0px -50px 0px" 
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); 
        }
      });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 2. Active Section & Scroll to Top Logic
    const handleScroll = () => {
      const sections = ['services', 'projects', 'faq', 'about', 'contact'];
      let current = '';
      const scrollY = window.scrollY;

      sections.forEach(section => {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 150; 
          const bottom = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            current = section;
          }
        }
      });
      setActiveSection(current);
      setShowScrollTop(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealElements.forEach(el => revealOnScroll.unobserve(el));
    };
  }, [loading, services, projects, faqs, about]); 

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className={`client-website ${isDarkMode ? 'dark-mode' : ''}`} style={{ '--primary-color': settings.primaryColor || '#2563eb' }}>
        <div className="preloader-container">
          <div className="spinner"></div>
          <div className="preloader-text">Harika şeyler hazırlanıyor...</div>
        </div>
      </div>
    );
  }

  const visible = settings.sectionsVisibility || {
    aboutEnabled: true,
    servicesEnabled: true,
    projectsEnabled: true,
    faqEnabled: true
  };

  return (
    <div className={`client-website ${isDarkMode ? 'dark-mode' : ''}`} dir="ltr" style={{ 
      '--primary-color': settings.primaryColor || '#2563eb',
      '--secondary-color': settings.secondaryColor || '#1e40af' 
    }}>
      
      {/* Üst Menü (Navbar) */}
      <nav className="client-nav glass-nav">
        <div className="logo-container">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="client-logo" />
          ) : (
            <h2 className="text-logo">Logo</h2>
          )}
        </div>

        {/* زر قائمة الموبايل */}
        <button 
          className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menü"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* القائمة الجانبية */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {visible.servicesEnabled && services.length > 0 && (
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className={activeSection === 'services' ? 'active' : ''}>Hizmetlerimiz</a>
          )}
          {visible.projectsEnabled && projects.length > 0 && (
            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className={activeSection === 'projects' ? 'active' : ''}>Projelerimiz</a>
          )}
          {visible.faqEnabled && faqs.length > 0 && (
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className={activeSection === 'faq' ? 'active' : ''}>SSS</a>
          )}
          {visible.aboutEnabled && about.title && (
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className={activeSection === 'about' ? 'active' : ''}>Hakkımızda</a>
          )}
          
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className={activeSection === 'contact' ? 'active' : ''}>Bize Ulaşın</a>

          <button onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} className="theme-toggle-btn" title="Temayı Değiştir">
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="theme-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M21 12h-2.25m-13.5 0H3m2.25-5.78l-1.59-1.59m12.38 12.38l-1.59 1.59M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="theme-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          {settings.whatsappNumber && (
            <a href={`https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}`} target="_blank" rel="noreferrer" className="whatsapp-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="whatsapp-icon">
                <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
              Bize Ulaşın
            </a>
          )}
        </div>
      </nav>

      {/* Ana Bölüm (Hero) */}
      <header className="hero-section" style={settings.heroImageUrl ? { backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.8)), url(${settings.heroImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {}}>
        <div className="hero-overlay"></div>
        <div className="hero-content fade-in-up">
          <h1>Web Sitemize Hoş Geldiniz</h1>
          <p>{settings.siteDescription || 'Sizlere en iyi hizmeti, yüksek profesyonellik ve en yeni teknolojilerle sunuyoruz.'}</p>
          <a href="#services" className="cta-btn">Hizmetlerimizi Keşfedin</a>
        </div>
      </header>

      {/* Hizmetler Bölümü */}
      {visible.servicesEnabled && services.length > 0 && (
        <section id="services" className="client-section bg-light">
          <h2 className="section-title text-center reveal">Öne Çıkan Hizmetlerimiz</h2>
          <div className="services-grid stagger-animation">
            {services.map((srv, index) => (
              <div key={srv._id} className="service-card modern-card reveal" style={{ padding: srv.imageUrl ? '0 0 30px 0' : '40px 30px', transitionDelay: `${index * 0.15}s` }}>
                {srv.imageUrl ? (
                  <div className="img-wrapper" style={{ marginBottom: '20px' }}>
                    <img src={srv.imageUrl} alt={srv.name} />
                    <div className="img-overlay"><span>Hizmeti İncele</span></div>
                  </div>
                ) : (
                  <div className="card-icon">✨</div>
                )}
                <h3 style={{ padding: '0 20px' }}>{srv.name || srv.title}</h3> 
                <p style={{ padding: '0 20px' }}>{srv.description}</p>
                {srv.price && <div style={{ padding: '0 20px' }}><span className="service-price">{srv.price}</span></div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔴 المشاريع (قبل وبعد) باستخدام مكتبة Swiper */}
      {visible.projectsEnabled && projects.length > 0 && (
        <section id="projects" className="client-section">
          <h2 className="section-title text-center reveal">Projelerimiz</h2>
          
          <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }} className="reveal">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              style={{ paddingBottom: '50px' }}
            >
              {projects.map((proj) => (
                <SwiperSlide key={proj._id}>
                  <div style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    {proj.imageUrl && (
                      <img 
                        src={proj.imageUrl} 
                        alt={proj.title} 
                        style={{ 
                          width: '100%', 
                          height: 'auto', // 🔴 يمنع قص الصورة ويعرضها بحجمها الحقيقي
                          objectFit: 'contain', 
                          borderRadius: '15px'
                        }} 
                      />
                    )}
                    <div style={{ padding: '15px', textAlign: 'center' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: isDarkMode ? '#f3f4f6' : '#111827' }}>
                        {proj.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
                        {proj.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* SSS Bölümü */}
      {visible.faqEnabled && faqs.length > 0 && (
        <section id="faq" className="client-section bg-light">
          <h2 className="section-title text-center reveal">Sıkça Sorulan Sorular</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <div key={faq._id} className="modern-card reveal" style={{ padding: '25px', marginBottom: '15px', textAlign: 'left', transitionDelay: `${index * 0.1}s` }}>
                <h4 style={{ color: 'var(--primary-color)', margin: '0 0 10px 0', fontSize: '1.2rem' }}>{faq.question}</h4>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

  {/* Hakkımızda Bölümü */}
      {visible.aboutEnabled && about && about.title && (
        <section id="about" className="client-section full-width-section" style={{ backgroundImage: about.backgroundImageUrl ? `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.85)), url(${about.backgroundImageUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', color: about.backgroundImageUrl ? 'white' : 'inherit', transition: 'all 0.3s ease' }}>
          
          {/* سطر الطباعة في الكونسول للمراقبة */}
          {console.log("Data in ClientHome:", about)}

          <div className="section-content about-content" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
            
            <div className="about-text reveal" style={{ flex: '1 1 500px' }}>
              <h2 style={{ color: about.backgroundImageUrl ? '#ffffff' : 'var(--text-color)', fontSize: '2.5rem', marginBottom: '20px' }}>{about.title}</h2>
              <div className="text-box" style={{ color: about.backgroundImageUrl ? '#e5e7eb' : 'var(--text-muted)' }}>
                <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                  <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '8px', color: 'var(--primary-color)' }}>Hikayemiz:</strong> 
                  {about.story}
                </p>
                <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8', marginTop: '20px' }}>
                  <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '8px', color: 'var(--primary-color)' }}>Vizyonumuz:</strong> 
                  {about.vision}
                </p>
              </div>
            </div>

            {/* 🔴 قسم الصور مع فحص الأخطاء (Fallback) */}
            <div className="about-img-container reveal" style={{ flex: '1 1 400px', transitionDelay: '0.2s', maxWidth: '100%', overflow: 'hidden', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', backgroundColor: '#0f172a' }}>
              
              {about.gallery && about.gallery.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation={true}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  className="about-gallery-swiper"
                >
                  {about.gallery.map((item, index) => (
                    <SwiperSlide key={index} style={{ position: 'relative' }}>
                      <img src={item.url} alt={item.title || `Klinik ${index + 1}`} style={{ width: '100%', height: '450px', objectFit: 'cover', display: 'block' }} />
                      
                      {(item.title || item.description) && (
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, width: '100%',
                          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 60%, transparent 100%)',
                          padding: '40px 30px 30px 30px', color: 'white', textAlign: 'left'
                        }}>
                          {item.title && <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', fontWeight: 'bold', color: '#ffffff', textShadow: 'none' }}>{item.title}</h3>}
                          {item.description && <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: '#cbd5e1' }}>{item.description}</p>}
                        </div>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                /* 🔴 إذا كانت المصفوفة فارغة، سيطبع محتوى البيانات هنا لكشف المشكلة */
                <div style={{ padding: '30px', color: 'white', textAlign: 'left', direction: 'ltr', overflowX: 'auto' }}>
                  <h4 style={{ color: '#ef4444' }}>⚠️ Görseller Yüklenemedi! (Veri Kontrolü)</h4>
                  <pre style={{ fontSize: '12px', color: '#10b981' }}>
                    {JSON.stringify(about, null, 2)}
                  </pre>
                </div>
              )}

            </div>

          </div>
        </section>
      )}
      {/* İletişim Bölümü */}
      <section id="contact" className="reveal">
        <ContactSection />
      </section>

      {/* Alt Bilgi (Footer) */}
      <footer className="client-footer">
        <p>Tüm Hakları Saklıdır &copy; 2026</p>
      </footer>

      {/* Yukarı Çık Butonu */}
      <button 
        className={`scroll-to-top-btn ${showScrollTop ? 'visible' : ''}`} 
        onClick={scrollToTop} 
        title="Yukarı Çık"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
        </svg>
      </button>

    </div>
  );
};

export default ClientHome;