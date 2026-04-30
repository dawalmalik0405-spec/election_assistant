import React, { useState, useEffect } from 'react';
import { performWebSearch } from '../services/searchService';
import { Newspaper, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LiveNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY || '';

  useEffect(() => {
    const fetchNews = async () => {
      if (!apiKey) {
        setError("Tavily API key is missing. Cannot fetch live news.");
        setLoading(false);
        return;
      }
      
      try {
        const searchData = await performWebSearch("latest top US election news today", apiKey);
        // Take top 3 articles
        setNews(searchData.results.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [apiKey]);

  return (
    <section id="news" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Newspaper className="text-primary" size={28} />
        <h2 style={{ fontSize: '2rem' }}>Live Civic News</h2>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500' }}>
                Read Article <ExternalLink size={16} />
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
};

export default LiveNews;
