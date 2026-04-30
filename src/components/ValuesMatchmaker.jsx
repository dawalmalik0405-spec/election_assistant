import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateValuesAnalysis } from '../services/aiService';
import { Scale, ChevronRight, Loader2, RefreshCw, Volume2, VolumeX } from 'lucide-react';

const questions = [
  {
    id: 'economy',
    text: "When it comes to the economy, what is your biggest priority?",
    options: [
      "Lower taxes and less government regulation",
      "Investing in public services and infrastructure",
      "Reducing the national debt",
      "Increasing the minimum wage and workers' rights"
    ]
  },
  {
    id: 'environment',
    text: "How should the government handle environmental issues?",
    options: [
      "Prioritize a rapid transition to renewable energy",
      "Balance environmental protection with economic growth",
      "Let the free market innovate green technologies",
      "Focus primarily on energy independence"
    ]
  },
  {
    id: 'healthcare',
    text: "What is your stance on healthcare?",
    options: [
      "Transition to a universal, government-funded system",
      "Expand current public options like Medicare/Medicaid",
      "Rely on private insurance and free-market competition",
      "Focus on lowering prescription drug costs only"
    ]
  }
];

const ValuesMatchmaker = ({ language }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const translations = {
    'en-US': { title: 'Values Matchmaker', subtitle: 'Answer 3 quick questions to see which civic policies align with your values.', analyzing: 'Analyzing your policy alignments using AI...', profile: 'Your Civic Profile', startOver: 'Start Over', q: 'Question' },
    'es-ES': { title: 'Buscador de Valores', subtitle: 'Responde 3 preguntas rápidas para ver qué políticas cívicas se alinean con tus valores.', analyzing: 'Analizando sus alineaciones políticas con IA...', profile: 'Tu Perfil Cívico', startOver: 'Empezar de Nuevo', q: 'Pregunta' },
    'fr-FR': { title: 'Matchmaker de Valeurs', subtitle: 'Répondez à 3 questions rapides pour voir quelles politiques civiques correspondent à vos valeurs.', analyzing: 'Analyse de vos alignements politiques à l\'aide de l\'IA...', profile: 'Votre Profil Civique', startOver: 'Recommencer', q: 'Question' },
    'hi-IN': { title: 'मूल्य मिलानकर्ता', subtitle: 'यह देखने के लिए 3 त्वरित प्रश्नों के उत्तर दें कि कौन सी नागरिक नीतियां आपके मूल्यों के अनुरूप हैं।', analyzing: 'एआई का उपयोग करके आपके नीतिगत संरेखण का विश्लेषण किया जा रहा है...', profile: 'आपका नागरिक प्रोफ़ाइल', startOver: 'फिर से शुरू करें', q: 'प्रश्न' }
  };

  const t = translations[language] || translations['en-US'];

  const nimKey = import.meta.env.VITE_NVIDIA_NIM_API_KEY || '';

  const handleSelect = async (option) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: option };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      // Finished
      setIsAnalyzing(true);
      if (!nimKey) {
        setAnalysis("Please configure your NVIDIA NIM API key to generate an analysis.");
        setIsAnalyzing(false);
        return;
      }
      
      const result = await generateValuesAnalysis(newAnswers, nimKey, language);
      setAnalysis(result);
      setIsAnalyzing(false);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(analysis);
    utterance.lang = language;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const reset = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentQuestion(0);
    setAnswers({});
    setAnalysis(null);
  };

  return (
    <section id="matchmaker" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Scale className="text-primary" /> {t.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          {t.subtitle}
        </p>

        {!isAnalyzing && !analysis && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t.q} {currentQuestion + 1} of {questions.length}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>
                {questions[currentQuestion].text}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    style={{
                      padding: '1.25rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      color: 'var(--text)',
                      fontSize: '1.1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                  >
                    {option}
                    <ChevronRight size={18} style={{ opacity: 0.5 }} />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {isAnalyzing && (
          <div style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Loader2 size={40} className="text-primary" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-muted)' }}>{t.analyzing}</p>
          </div>
        )}

        {analysis && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'left' }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--primary)', marginBottom: '2rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>{t.profile}</h3>
                <button 
                  onClick={handleSpeak}
                  style={{
                    background: isSpeaking ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                    border: '1px solid var(--primary)',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title={isSpeaking ? "Stop" : "Read aloud"}
                >
                  {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text)' }}>
                {analysis}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={reset} className="btn-primary" style={{ padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={20} /> {t.startOver}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ValuesMatchmaker;
