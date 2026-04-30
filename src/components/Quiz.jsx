import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDynamicQuiz } from '../services/aiService';
import { Loader2, CheckCircle, XCircle, Award, RefreshCw, Brain } from 'lucide-react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const nimKey = import.meta.env.VITE_NVIDIA_NIM_API_KEY || '';

  const startQuiz = async () => {
    if (!nimKey) {
      alert("Please configure your NVIDIA NIM API key to generate dynamic quizzes.");
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
      const generatedQuestions = await generateDynamicQuiz(nimKey, 'en-US');
      setQuestions(generatedQuestions);
    } catch (err) {
      console.error(err);
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
    }, 2000);
  };

  return (
    <section id="quiz" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Brain className="text-primary" /> Test Your Civic Knowledge
        </h2>
        
        {questions.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Think you know everything about the election process? Take our AI-generated dynamic quiz to find out! Every quiz is uniquely generated.
            </p>
            <button onClick={startQuiz} className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start AI Quiz
            </button>
          </motion.div>
        )}

        {isLoading && (
          <div style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Loader2 size={40} className="text-primary" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-muted)' }}>AI is writing your questions...</p>
          </div>
        )}

        {questions.length > 0 && !isFinished && !isLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                {questions[currentIndex].question}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {questions[currentIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectAnswer = isAnswerRevealed && option === questions[currentIndex].correctAnswer;
                  const isWrongAnswer = isSelected && !isCorrectAnswer;
                  
                  let bgStyle = 'rgba(255, 255, 255, 0.05)';
                  let borderStyle = '1px solid var(--glass-border)';
                  
                  if (isAnswerRevealed) {
                    if (isCorrectAnswer) {
                      bgStyle = 'rgba(34, 197, 94, 0.2)';
                      borderStyle = '1px solid rgb(34, 197, 94)';
                    } else if (isWrongAnswer) {
                      bgStyle = 'rgba(239, 68, 68, 0.2)';
                      borderStyle = '1px solid rgb(239, 68, 68)';
                    }
                  } else if (isSelected) {
                    bgStyle = 'rgba(59, 130, 246, 0.2)';
                    borderStyle = '1px solid var(--primary)';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswerRevealed}
                      style={{
                        padding: '1.25rem',
                        background: bgStyle,
                        border: borderStyle,
                        borderRadius: '12px',
                        color: 'var(--text)',
                        fontSize: '1.1rem',
                        textAlign: 'left',
                        cursor: isAnswerRevealed ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {option}
                      {isAnswerRevealed && isCorrectAnswer && <CheckCircle size={20} color="rgb(34, 197, 94)" />}
                      {isAnswerRevealed && isWrongAnswer && <XCircle size={20} color="rgb(239, 68, 68)" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {isFinished && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Award size={64} className="text-primary" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Quiz Complete!</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              You scored {score} out of {questions.length}.
            </p>
            <button onClick={startQuiz} className="btn-primary" style={{ padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={20} /> Take Another Quiz
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Quiz;
