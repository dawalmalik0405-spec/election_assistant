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

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className="dashboard-layout">
        <Sidebar 
          language={language} 
          setLanguage={setLanguage} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="main-content">
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
