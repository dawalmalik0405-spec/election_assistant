import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe2, 
  Calendar, 
  Users, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  Newspaper
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats, fetchElectionTimeline, fetchLiveHeadlines, getCachedData, setCachedData } from '../services/dashboardService';
import Assistant from './Assistant';

const Hero = ({ language, theme }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = React.useState(null);
  const [stats, setStats] = React.useState({
    activeElections: '24',
    registeredVoters: '4.2B',
    avgTurnout: '68%'
  });
  const [timeline, setTimeline] = React.useState([]);
  const [headlines, setHeadlines] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdated, setLastUpdated] = React.useState(null);
  
  const translations = {
    'en-US': { 
      greeting: 'Welcome back, Citizen',
      subtitle: 'Global Election Command Center',
      stats: { active: 'Active Elections', voters: 'Registered Voters', turnout: 'Avg. Global Turnout' },
      cta: 'Open Assistant',
      live: 'LIVE DATA',
      timeline: 'Global Election Timeline',
      flashcards: 'Civic IQ: Policy Flashcards',
      close: 'Close'
    },
    'es-ES': { 
      greeting: 'Bienvenido, Ciudadano',
      subtitle: 'Centro de Mando Electoral Global',
      stats: { active: 'Elecciones Activas', voters: 'Votantes Registrados', turnout: 'Promedio Global' },
      cta: 'Abrir Asistente',
      live: 'DATOS EN VIVO',
      timeline: 'Cronología Electoral Global',
      flashcards: 'Civic IQ: Tarjetas de Política',
      close: 'Cerrar'
    },
    'fr-FR': { 
      greeting: 'Bon retour, Citoyen',
      subtitle: 'Centre de commandement électoral mondial',
      stats: { active: 'Élections actives', voters: 'Électeurs inscrits', turnout: 'Participation mondiale' },
      cta: 'Ouvrir l\'Assistant',
      live: 'DONNÉES EN DIRECT',
      timeline: 'Calendrier Électoral Mondial',
      flashcards: 'Civic IQ: Cartes de Politique',
      close: 'Fermer'
    },
    'hi-IN': { 
      greeting: 'वापसी पर स्वागत है, नागरिक',
      subtitle: 'वैश्विक चुनाव कमान केंद्र',
      stats: { active: 'सक्रिय चुनाव', voters: 'पंजीकृत मतदाता', turnout: 'औसत वैश्विक मतदान' },
      cta: 'सहायक खोलें',
      live: 'लाइव डेटा',
      timeline: 'वैश्विक चुनाव समयरेखा',
      flashcards: 'Civic IQ: नीति फ्लैशकार्ड',
      close: 'बंद करें'
    }
  };

  const t = translations[language] || translations['en-US'];

  const policyCards = [
    { title: 'Ranked Choice Voting', desc: 'Allows voters to rank candidates by preference. If no one gets 50%, the last place is eliminated and votes redistributed.', icon: '🎯' },
    { title: 'Filibuster', desc: 'A tactic used in legislatures to delay or block a vote on a bill by speaking for an extended period.', icon: '⏱️' },
    { title: 'Gerrymandering', desc: 'Manipulating the boundaries of an electoral constituency so as to favor one party or class.', icon: '🗺️' }
  ];

  React.useEffect(() => {
    const getData = async () => {
      try {
        const apiKey = import.meta.env.VITE_TAVILY_API_KEY;
        const [statsData, timelineData, headlinesData] = await Promise.all([
          fetchDashboardStats(apiKey),
          fetchElectionTimeline(apiKey),
          fetchLiveHeadlines(apiKey)
        ]);
        setStats(statsData);
        setTimeline(timelineData);
        setHeadlines(headlinesData);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="main-content"
    >
      {/* Header Section */}
      <div style={{ padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap' }}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>
            <Activity size={18} className="animate-pulse-slow" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.1em' }}>{t.live}</span>
          </div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {t.greeting}, <span className="gradient-text">Citizen</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t.subtitle}</p>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card" 
          style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '16px' }}
        >
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Last Sync</p>
            <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{lastUpdated || '--:--:--'}</p>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)' }}></div>
          <button onClick={() => navigate('/assistant')} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
            {t.cta}
          </button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div style={{ padding: '0 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { icon: <Globe2 />, label: t.stats.active, value: stats.activeElections, color: '#3b82f6' },
          { icon: <Users />, label: t.stats.voters, value: stats.registeredVoters, color: '#10b981' },
          { icon: <Activity />, label: t.stats.turnout, value: stats.avgTurnout, color: '#f59e0b' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="stat-card"
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ color: stat.color, background: `${stat.color}15`, padding: '0.75rem', borderRadius: '14px' }}>
                {React.cloneElement(stat.icon, { size: 24 })}
              </div>
              <TrendingUp size={18} color="var(--accent)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>{stat.label}</p>
            <h3 style={{ fontSize: '2.2rem', fontWeight: '800' }}>{loading ? '...' : stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div style={{ padding: '0 2.5rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', flexWrap: 'wrap' }}>
        {/* News Ticker Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-card" 
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Newspaper size={24} className="text-primary" /> 
              Breaking News
            </h3>
            <button onClick={() => navigate('/news')} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              View All
            </button>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {headlines.length > 0 ? (
              headlines.slice(0, 4).map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + (idx * 0.1) }}
                  style={{ 
                    padding: '1.25rem', 
                    borderRadius: '16px', 
                    background: 'var(--glass-highlight)', 
                    border: '1px solid var(--glass-border)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.background = 'var(--glass-highlight)';
                  }}
                >
                  <div style={{ background: 'var(--primary)', width: '4px', height: '40px', borderRadius: '4px' }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.title}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.content}</p>
                  </div>
                  <ArrowUpRight size={18} color="var(--text-muted)" />
                </motion.a>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                {loading ? 'Analyzing live channels...' : 'No headlines found.'}
              </div>
            )}
          </div>
        </motion.div>

        {/* Timeline Sidebar Card */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-card" 
          style={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Calendar size={24} className="text-primary" />
            <h3 style={{ fontSize: '1.5rem' }}>{t.timeline}</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {timeline.slice(0, 4).map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + (idx * 0.1) }}
                style={{ 
                  display: 'flex', 
                  gap: '1.25rem', 
                  position: 'relative',
                  paddingLeft: '0.5rem',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveModal(item)}
              >
                {idx !== timeline.slice(0, 4).length - 1 && (
                  <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-1.25rem', width: '2px', background: 'var(--glass-border)' }}></div>
                )}
                <div style={{ 
                  width: '14px', 
                  height: '14px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  marginTop: '0.4rem',
                  boxShadow: '0 0 10px var(--primary)',
                  zIndex: 1
                }}></div>
                <div>
                  <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{item.date}</p>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.country}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Policy Flashcards Section */}
      <div style={{ padding: '2.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t.flashcards}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {policyCards.map((card, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="glass-card hover-lift" 
              style={{ padding: '2rem', cursor: 'pointer' }}
              onClick={() => setActiveModal(card)}
            >
              <span style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>{card.icon}</span>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{card.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card"
              style={{
                padding: '3rem',
                maxWidth: '650px',
                width: '90%',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ overflowY: 'auto', paddingRight: '1rem', flex: 1 }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>{activeModal.icon || '🌍'}</div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                  {activeModal.title || activeModal.country}
                </h2>
                <div style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '1.1rem', 
                  lineHeight: '1.8', 
                  marginBottom: '2rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {activeModal.fullDetail || activeModal.desc || activeModal.event}
                </div>
              </div>
              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '2rem' }}
                onClick={() => setActiveModal(null)}
              >
                {t.close}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Hero;
