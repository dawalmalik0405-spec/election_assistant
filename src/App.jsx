import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Header';
import Hero from './components/Hero';
import LiveNews from './components/LiveNews';
import ValuesMatchmaker from './components/ValuesMatchmaker';
import Quiz from './components/Quiz';
import Assistant from './components/Assistant';

function App() {
  const [language, setLanguage] = React.useState('en-US');
  const [theme, setTheme] = React.useState('dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global Background Pre-fetch for Quiz to eliminate load times
  React.useEffect(() => {
    const preFetchQuiz = async () => {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const nimKey = import.meta.env.VITE_NVIDIA_NIM_API_KEY;
      const cached = localStorage.getItem(`civicpath_quiz_${language}`);
      
      // Only fetch if not cached or cache is old
      if (!cached) {
        try {
          const { generateDynamicQuiz } = await import('./services/aiService');
          const questions = await generateDynamicQuiz(geminiKey, nimKey, language);
          localStorage.setItem(`civicpath_quiz_${language}`, JSON.stringify({
            data: questions,
            timestamp: Date.now()
          }));
        } catch (err) {
          console.warn("Global pre-fetch failed", err);
        }
      }
    };
    preFetchQuiz();
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className="dashboard-layout">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Sidebar 
          language={language} 
          setLanguage={setLanguage} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main id="main-content" className="main-content">
          <Routes>
            <Route path="/" element={<Hero language={language} theme={theme} />} />
            <Route path="/news" element={<LiveNews language={language} />} />
            <Route path="/matchmaker" element={<ValuesMatchmaker language={language} />} />
            <Route path="/quiz" element={<Quiz language={language} />} />
            <Route path="/assistant" element={<Assistant language={language} setLanguage={setLanguage} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
