import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Clock, Users } from 'lucide-react';

const Hero = ({ language }) => {
  const translations = {
    'en-US': { 
      badge: 'Election 2026 Assistant',
      title: 'Democracy made Simple.',
      desc: 'Navigate the election process with confidence. Get personalized timelines, step-by-step guides, and instant answers to your voting questions.',
      start: 'Get Started'
    },
    'es-ES': { 
      badge: 'Asistente Electoral 2026',
      title: 'Democracia hecha Simple.',
      desc: 'Navegue por el proceso electoral con confianza. Obtenga cronogramas personalizados, guías paso a paso y respuestas instantáneas a sus preguntas sobre la votación.',
      start: 'Empezar'
    },
    'fr-FR': { 
      badge: 'Assistant Électoral 2026',
      title: 'La démocratie simplifiée.',
      desc: 'Naviguez dans le processus électoral en toute confiance. Obtenez des calendriers personnalisés, des guides étape par étape et des réponses instantanées à vos questions sur le vote.',
      start: 'Commencer'
    },
    'hi-IN': { 
      badge: 'चुनाव 2026 सहायक',
      title: 'लोकतंत्र हुआ सरल।',
      desc: 'आत्मविश्वास के साथ चुनाव प्रक्रिया को नेविगेट करें। व्यक्तिगत समयरेखा, चरण-दर-चरण मार्गदर्शिकाएँ और अपने मतदान संबंधी प्रश्नों के त्वरित उत्तर प्राप्त करें।',
      start: 'शुरू करें'
    }
  };

  const t = translations[language] || translations['en-US'];

  return (
    <section style={{
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span style={{
          background: 'rgba(37, 99, 235, 0.1)',
          color: 'var(--primary)',
          padding: '0.5rem 1rem',
          borderRadius: '999px',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          display: 'inline-block'
        }}>
          {t.badge}
        </span>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          lineHeight: '1.1',
          marginBottom: '1.5rem'
        }}>
          {t.title.split(' ').map((word, i) => i === t.title.split(' ').length - 1 ? <span key={i} className="gradient-text">{word}</span> : word + ' ')}
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-muted)',
          maxWidth: '700px',
          margin: '0 auto 2.5rem',
        }}>
          {t.desc}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
            onClick={() => document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t.start} <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {[
          { icon: ShieldCheck, title: "Verified Info", desc: "Data sourced directly from official election commissions." },
          { icon: Clock, title: "Real-time Timelines", desc: "Never miss a registration or mail-in ballot deadline." },
          { icon: Users, title: "Community Driven", desc: "Helping millions of first-time voters find their way." }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
            style={{ padding: '2rem', textAlign: 'left' }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: 'var(--primary)'
            }}>
              <feature.icon size={24} />
            </div>
            <h3 style={{ marginBottom: '0.75rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
