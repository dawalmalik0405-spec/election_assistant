import React from 'react';
import { Vote } from 'lucide-react';

const Header = ({ language, setLanguage }) => {
  const translations = {
    'en-US': { news: 'News', quiz: 'Quiz', assistant: 'Assistant', check: 'Check Registration' },
    'es-ES': { news: 'Noticias', quiz: 'Cuestionario', assistant: 'Asistente', check: 'Verificar Registro' },
    'fr-FR': { news: 'Actualités', quiz: 'Quiz', assistant: 'Assistant', check: 'Vérifier l\'inscription' },
    'hi-IN': { news: 'समाचार', quiz: 'प्रश्नोत्तरी', assistant: 'सहायक', check: 'पंजीकरण जांचें' }
  };

  const t = translations[language] || translations['en-US'];

  return (
    <header style={{
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'var(--primary)',
          padding: '0.5rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Vote size={24} color="white" />
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.025em' }}>
          Civic<span style={{ color: 'var(--primary)' }}>Guide</span>
        </span>
      </div>
      
      <nav style={{ display: 'flex', gap: '2rem' }}>
        <a href="#news" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}>{t.news}</a>
        <a href="#quiz" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}>{t.quiz}</a>
        <a href="#assistant" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}>{t.assistant}</a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text)',
            padding: '0.5rem',
            borderRadius: '8px',
            outline: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <option value="en-US">English</option>
          <option value="es-ES">Español</option>
          <option value="fr-FR">Français</option>
          <option value="hi-IN">हिन्दी</option>
        </select>
        <button className="btn-primary">
          {t.check}
        </button>
      </div>
    </header>
  );
};

export default Header;
