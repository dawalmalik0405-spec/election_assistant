import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LiveNews from './components/LiveNews';
import ValuesMatchmaker from './components/ValuesMatchmaker';
import Quiz from './components/Quiz';
import Assistant from './components/Assistant';

function App() {
  const [language, setLanguage] = React.useState('en-US');

  return (
    <div className="app-container">
      <Header language={language} setLanguage={setLanguage} />
      <main>
        <Hero language={language} />
        <LiveNews language={language} />
        <ValuesMatchmaker language={language} />
        <Quiz language={language} />
        <Assistant language={language} setLanguage={setLanguage} />
      </main>
      
      <footer style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--glass-border)',
        marginTop: '4rem'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          &copy; 2026 CivicPath Assistant. Empowering voters through information.
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Official Source: Vote.gov</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
