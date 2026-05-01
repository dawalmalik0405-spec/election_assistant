import React, { useState, useEffect } from 'react';
import { performWebSearch } from '../services/searchService';
import { Newspaper, ExternalLink, Loader2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCachedData, setCachedData } from '../services/dashboardService';

const LiveNews = ({ language }) => {
  const [news, setNews] = useState(getCachedData(`news_${language}`) || []);
  const [loading, setLoading] = useState(!getCachedData(`news_${language}`));
  const [error, setError] = useState(null);
  const [speakingItem, setSpeakingItem] = useState(null);

  const translations = {
    'en-US': { title: 'Live Civic News', read: 'Read Article', readAloud: 'Read aloud', stop: 'Stop reading' },
    'es-ES': { title: 'Noticias Cívicas en Vivo', read: 'Leer Artículo', readAloud: 'Leer en voz alta', stop: 'Detener lectura' },
    'fr-FR': { title: 'Actualités Cíviques en Direct', read: 'Lire l\'article', readAloud: 'Lire à haute voix', stop: 'Arrêter la lecture' },
    'hi-IN': { title: 'लाइव नागरिक समाचार', read: 'लेख पढ़ें', readAloud: 'ज़ोर से पढ़ें', stop: 'पढ़ना बंद करें' }
  };

  const t = translations[language] || translations['en-US'];
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY || '';

  useEffect(() => {
    const fetchNews = async () => {
      if (!apiKey) {
        setError("Tavily API key is missing. Cannot fetch live news.");
        setLoading(false);
        return;
      }
      
      try {
        const query = language === 'hi-IN' 
          ? "भारत चुनाव समाचार 2026, latest global election news, and voting updates"
          : "latest global election news, India election updates 2026, and international civic duties";
        const searchData = await performWebSearch(query, apiKey);
        
        setNews(searchData.results);
        setCachedData(`news_${language}`, searchData.results);
      } catch (err) {
        if (news.length === 0) setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [apiKey, language]);

  const handleSpeak = (e, item, idx) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (speakingItem === idx) {
      window.speechSynthesis.cancel();
      setSpeakingItem(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${item.title}. ${item.content}`);
    utterance.lang = language;
    utterance.onend = () => setSpeakingItem(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingItem(idx);
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="main-content"
      style={{ padding: '3rem' }}
    >
      <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.75rem', borderRadius: '16px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' }}>
          <Newspaper size={32} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em' }}>{t.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time verified civic intelligence</p>
        </div>
      </header>

      {loading && news.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '5rem 0' }}>
          <Loader2 size={48} className="text-primary" style={{ animation: 'spin 2s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Scanning global frequencies...</p>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        <AnimatePresence>
          {news.map((item, idx) => (
            <motion.a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
              className="glass-card hover-lift"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ padding: '2rem', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ background: 'var(--glass-highlight)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', border: '1px solid var(--glass-border)' }}>
                  NEWS
                </span>
                <button 
                  onClick={(e) => handleSpeak(e, item, idx)}
                  style={{
                    background: speakingItem === idx ? 'var(--primary)' : 'var(--glass-highlight)',
                    border: '1px solid var(--glass-border)',
                    padding: '0.6rem',
                    borderRadius: '12px',
                    color: speakingItem === idx ? 'white' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  title={speakingItem === idx ? t.stop : t.readAloud}
                >
                  {speakingItem === idx ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', lineHeight: '1.3', fontWeight: '700' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.content}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '1rem', fontWeight: '600' }}>
                {t.read} <ExternalLink size={18} />
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default LiveNews;
