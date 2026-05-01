import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Vote, 
  LayoutDashboard, 
  Newspaper, 
  BrainCircuit, 
  Target, 
  MessageSquare, 
  Globe, 
  UserCircle,
  ChevronUp,
  Check,
  Sun,
  Moon
} from 'lucide-react';

const Sidebar = ({ language, setLanguage, theme, toggleTheme }) => {
  const location = useLocation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  const translations = {
    'en-US': { home: 'Dashboard', news: 'Live News', quiz: 'AI Quiz', matchmaker: 'Matchmaker', assistant: 'Assistant', profile: 'Profile' },
    'es-ES': { home: 'Panel', news: 'Noticias', quiz: 'Cuestionario', matchmaker: 'Buscador', assistant: 'Asistente', profile: 'Perfil' },
    'fr-FR': { home: 'Tableau de bord', news: 'Actualités', quiz: 'Quiz', matchmaker: 'Matchmaker', assistant: 'Assistant', profile: 'Profil' },
    'hi-IN': { home: 'डैशबोर्ड', news: 'समाचार', quiz: 'प्रश्नोत्तरी', matchmaker: 'मिलानकर्ता', assistant: 'सहायक', profile: 'प्रोफ़ाइल' }
  };

  const languages = [
    { code: 'en-US', label: 'English' },
    { code: 'es-ES', label: 'Español' },
    { code: 'fr-FR', label: 'Français' },
    { code: 'hi-IN', label: 'हिन्दी' }
  ];

  const t = translations[language] || translations['en-US'];

  const navItems = [
    { path: '/', label: t.home, icon: LayoutDashboard },
    { path: '/news', label: t.news, icon: Newspaper },
    { path: '/quiz', label: t.quiz, icon: BrainCircuit },
    { path: '/matchmaker', label: t.matchmaker, icon: Target },
    { path: '/assistant', label: t.assistant, icon: MessageSquare },
  ];

  return (
    <aside className="sidebar">
      <Link to="/" aria-label="Go to Dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none', color: 'inherit', marginBottom: '3.5rem', padding: '0 0.5rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
          <Vote size={22} color="white" />
        </div>
        <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
          Civic<span className="gradient-text">Guide</span>
        </span>
      </Link>

      <nav style={{ flex: 1 }} aria-label="Main Navigation">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            aria-label={item.label}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
        {/* Language & Theme Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="glass-card"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            {theme === 'dark' ? <Sun size={18} className="text-primary" /> : <Moon size={18} className="text-primary" />}
            <span style={{ flex: 1, textAlign: 'left' }}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="glass-card"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              <Globe size={18} color="var(--text-muted)" />
              <span style={{ flex: 1, textAlign: 'left' }}>
                {languages.find(l => l.code === language)?.label}
              </span>
              <ChevronUp size={16} style={{ transform: isLangOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 0.5rem)',
                    left: 0,
                    width: '100%',
                    padding: '0.5rem',
                    zIndex: 100,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
                  }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: language === lang.code ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        color: language === lang.code ? 'var(--primary)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {lang.label}
                      {language === lang.code && <Check size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="nav-link" style={{ marginBottom: 0, cursor: 'pointer', color: 'var(--text-primary)' }}>
            <UserCircle size={20} />
            <span>{t.profile}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
