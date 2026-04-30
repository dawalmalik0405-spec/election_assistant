import React, { useState, useEffect } from 'react';
import { performWebSearch } from '../services/searchService';
import { Newspaper, ExternalLink, Loader2, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const LiveNews = ({ language }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const searchData = await performWebSearch("latest news about US elections, voting, and civic duties", apiKey);
        // Show all retrieved articles (default 5 from searchService)
        setNews(searchData.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [apiKey]);

  const handleSpeak = (e, item, idx) => {
    e.preventDefault(); // Don't open the article link
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
    <section id="news" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Newspaper className="text-primary" size={28} />
        <h2 style={{ fontSize: '2rem' }}>{t.title}</h2>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <Loader2 size={32} className="text-primary" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', padding: '1rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {!loading && !error && news.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
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
              style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s' }}
            >
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', lineHeight: '1.4' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.content}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500' }}>
                  {t.read} <ExternalLink size={16} />
                </div>
                <button 
                  onClick={(e) => handleSpeak(e, item, idx)}
                  style={{
                    background: speakingItem === idx ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid var(--glass-border)',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    color: speakingItem === idx ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={speakingItem === idx ? t.stop : t.readAloud}
                >
                  {speakingItem === idx ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
};

export default LiveNews;
