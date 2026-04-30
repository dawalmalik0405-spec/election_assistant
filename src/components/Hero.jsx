import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Clock, Users } from 'lucide-react';

const Hero = () => {
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
          Election 2026 Assistant
        </span>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          lineHeight: '1.1',
          marginBottom: '1.5rem'
        }}>
          Democracy made <span className="gradient-text">Simple.</span>
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-muted)',
          maxWidth: '700px',
          margin: '0 auto 2.5rem',
        }}>
          Navigate the election process with confidence. Get personalized timelines, 
          step-by-step guides, and instant answers to your voting questions.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
            onClick={() => document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started <ChevronRight size={20} />
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
