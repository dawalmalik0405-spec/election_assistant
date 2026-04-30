import React from 'react';
import { Vote } from 'lucide-react';

const Header = () => {
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
        <a href="#steps" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Process</a>
        <a href="#timeline" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Timeline</a>
        <a href="#assistant" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Assistant</a>
      </nav>

      <button className="btn-primary">
        Check Registration
      </button>
    </header>
  );
};

export default Header;
