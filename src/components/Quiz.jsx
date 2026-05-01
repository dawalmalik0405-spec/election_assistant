import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDynamicQuiz } from '../services/aiService';
import { Loader2, CheckCircle, XCircle, Award, RefreshCw, Brain, ChevronRight } from 'lucide-react';

const Quiz = ({ language }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const translations = {
    'en-US': { title: 'Test Your Civic Knowledge', subtitle: 'Global & Indian Election Masterclass. Take our AI-generated dynamic quiz to find out! Every quiz is uniquely generated.', start: 'Start AI Masterclass', loading: 'AI is drafting your curriculum...', q: 'Question', s: 'Score', complete: 'Mastery Achieved!', result: 'Your Civic IQ Score', again: 'Challenge Yourself Again' },
    'es-ES': { title: 'Prueba tus Conocimientos Cívicos', subtitle: 'Clase Maestra de Elecciones Globales. ¡Toma nuestro cuestionario dinámico generado por IA para averiguarlo!', start: 'Iniciar Clase Maestra', loading: 'La IA está redactando tu currículum...', q: 'Pregunta', s: 'Puntuación', complete: '¡Maestría Alcanzada!', result: 'Tu Puntuación de CI Cívico', again: 'Desafíate de Nuevo' },
    'fr-FR': { title: 'Testez vos Connaissances Civiques', subtitle: 'Masterclass sur les Élections Mondiales. Faites notre quiz dynamique généré par l\'IA pour le découvrir !', start: 'Lancer la Masterclass', loading: 'L\'IA rédige votre programme...', q: 'Question', s: 'Score', complete: 'Maîtrise Atteinte !', result: 'Votre Score de QI Civique', again: 'Relevez le Défi à Nouveau' },
    'hi-IN': { title: 'अपने नागरिक ज्ञान का परीक्षण करें', subtitle: 'वैश्विक और भारतीय चुनाव मास्टरक्लास। पता लगाने के लिए हमारी एआई-जनित गतिशील प्रश्नोत्तरी लें! प्रत्येक प्रश्नोत्तरी विशिष्ट रूप से उत्पन्न होती है।', start: 'एआई मास्टरक्लास शुरू करें', loading: 'एआई आपके पाठ्यक्रम का मसौदा तैयार कर रहा है...', q: 'प्रश्न', s: 'स्कोर', complete: 'निपुणता हासिल की!', result: 'आपका नागरिक आईक्यू स्कोर', again: 'स्वयं को फिर से चुनौती दें' }
  };

  const nimKey = import.meta.env.VITE_NVIDIA_NIM_API_KEY || '';
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const t = translations[language] || translations['en-US'];

  useEffect(() => {
    const checkCacheAndPreFetch = async () => {
      // 1. Check if global background fetch already finished
      const cached = localStorage.getItem(`civicpath_quiz_${language}`);
      if (cached) {
        try {
          const { data } = JSON.parse(cached);
          if (data && data.length > 0) {
            setQuestions(data);
            return;
          }
        } catch (e) { console.error("Cache parse error", e); }
      }

      // 2. If no cache, perform local pre-fetch
      try {
        const generatedQuestions = await generateDynamicQuiz(geminiKey, nimKey, language);
        setQuestions(generatedQuestions);
      } catch (err) {
        console.warn("Background pre-fetch failed", err);
      }
    };
    checkCacheAndPreFetch();
  }, [language]);

  const startQuiz = async () => {
    // If we have questions (from cache or pre-fetch), start immediately
    if (questions.length > 0 && !isFinished) {
      return; 
    }

    setIsLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);

    try {
      const generatedQuestions = await generateDynamicQuiz(geminiKey, nimKey, language);
      setQuestions(generatedQuestions);
      // Update cache for next time
      localStorage.setItem(`civicpath_quiz_${language}`, JSON.stringify({
        data: generatedQuestions,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error(err);
      alert("AI Service currently busy. Please try again in a moment.");
    }
    setIsLoading(false);
  };

  const handleAnswer = (option) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(option);
    setIsAnswerRevealed(true);

    const isCorrect = option === questions[currentIndex].correctAnswer;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
      } else {
        setIsFinished(true);
      }
    }, 1800);
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '3rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
    >
      <div className="glass-card" style={{ padding: '4rem', maxWidth: '800px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {/* Progress Bar */}
        {!isFinished && questions.length > 0 && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'var(--glass-border)' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              style={{ height: '100%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }}
            />
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', letterSpacing: '-0.02em' }}>
            <Brain className="text-primary" size={40} /> {t.title}
          </h2>
          
          {questions.length === 0 && !isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: '1.6' }}>
                {t.subtitle}
              </p>
              <button onClick={startQuiz} className="btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.25rem' }}>
                {t.start} <ChevronRight />
              </button>
            </motion.div>
          )}

          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '4rem 0' }}>
              <Loader2 size={64} className="text-primary" style={{ animation: 'spin 2s linear infinite' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '500' }}>{t.loading}</p>
            </div>
          )}

          {!isLoading && questions.length > 0 && !isFinished && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ textAlign: 'left' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
                  <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
                    {t.q} {currentIndex + 1} / {questions.length}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{t.s}: <span className="text-primary">{score}</span></span>
                </div>

                <h3 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', lineHeight: '1.4', fontWeight: '700' }}>{questions[currentIndex].question}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {questions[currentIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = isAnswerRevealed && option === questions[currentIndex].correctAnswer;
                    const isWrong = isAnswerRevealed && isSelected && option !== questions[currentIndex].correctAnswer;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswerRevealed}
                        style={{
                          width: '100%',
                          padding: '1.25rem 2rem',
                          borderRadius: '16px',
                          border: '2px solid',
                          borderColor: isCorrect ? 'var(--accent)' : isWrong ? '#ef4444' : isSelected ? 'var(--primary)' : 'var(--glass-border)',
                          background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : isWrong ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-highlight)',
                          color: isCorrect ? 'var(--accent)' : isWrong ? '#ef4444' : 'var(--text-primary)',
                          cursor: isAnswerRevealed ? 'default' : 'pointer',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {option}
                        {isCorrect && <CheckCircle className="animate-pulse-slow" />}
                        {isWrong && <XCircle />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {isFinished && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div style={{ marginBottom: '2rem' }}>
                <Award size={100} className="text-primary" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t.complete}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>{t.result}</p>
              </div>

              <div style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '3rem' }}>
                {score} <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/ {questions.length}</span>
              </div>

              <button 
                onClick={startQuiz} 
                className="btn-primary" 
                style={{ padding: '1rem 2rem' }}
              >
                <RefreshCw size={20} /> {t.again}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default Quiz;
