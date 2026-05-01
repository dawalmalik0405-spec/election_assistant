import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Bot, Mic, MicOff, Volume2, VolumeX, Search, Globe, Loader2, Settings, Key, X, AlertCircle } from 'lucide-react';
import { performWebSearch } from '../services/searchService';
import { generateRobustAiResponse } from '../services/aiService';

const VoiceAssistant = ({ language, setLanguage }) => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Welcome to the Voice-Enabled Civic Assistant. I can search the web for real-time election data. Ask me anything about registration, polling places, or candidates!", sources: [] }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mute, setMute] = useState(false);
  // language prop is now received from App.jsx
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY || '';
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const nimKey = import.meta.env.VITE_NVIDIA_NIM_API_KEY || '';
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);

  const stopAi = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsSearching(false);
    setIsTyping(false);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
    
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping, isSearching]);

  const speak = (text) => {
    if (mute || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const simulateWebSearch = async (query) => {
    const normalizedQuery = query.toLowerCase().trim().replace(/[^\w\s]/gi, '');
    const greetings = {
      'en-US': { words: ['hi', 'hello', 'hey', 'greetings', 'howdy', 'yo'], response: "Hello! I am your voice-enabled election assistant. What would you like to know?" },
      'es-ES': { words: ['hola', 'buenas', 'saludos', 'hi', 'hello'], response: "¡Hola! Soy tu asistente electoral. ¿Qué te gustaría saber?" },
      'fr-FR': { words: ['bonjour', 'salut', 'coucou', 'hi', 'hello'], response: "Bonjour ! Je suis votre assistant électoral. Que souhaitez-vous savoir ?" },
      'hi-IN': { words: ['namaste', 'hello', 'hi'], response: "नमस्ते! मैं आपका चुनाव सहायक हूँ। आप क्या जानना चाहेंगे?" }
    };
    
    // Check if it's just a simple greeting
    const currentGreetings = greetings[language] || greetings['en-US'];
    if (currentGreetings.words.includes(normalizedQuery)) {
      const greetingResponse = currentGreetings.response;
      setMessages(prev => [...prev, { type: 'bot', text: greetingResponse, sources: [] }]);
      speak(greetingResponse);
      return;
    }

    setIsSearching(true);
    setError(null);
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      // Real search using Tavily (with AI backup inside the service)
      let searchData;
      try {
        searchData = await performWebSearch(query, apiKey);
      } catch (searchErr) {
        console.warn("Search Tool failed completely. Falling back to AI internal knowledge.");
        // If search fails, we don't throw! We just provide empty results.
        searchData = { answer: null, results: [] };
      }
      
      setIsSearching(false);
      setIsTyping(true);
      
      // Prepare context for AI model
      const context = (searchData.results || []).length > 0 
        ? searchData.results.map(r => `Source: ${r.title}\nContent: ${r.content}`).join('\n\n')
        : "No real-time search data available. Answer based on your internal training data about civic duties and election processes.";
      
      const aiPrompt = `User Query: ${query}\n\nSearch Context:\n${context}\n\nProvide a comprehensive and helpful answer. If search context is provided, prioritize it. If not, use your internal knowledge to assist the user.`;
      
      let aiResponseText;
      try {
        // Automatic robust selection (NIM is preferred as per user request)
        let rawAiResponseText = await generateRobustAiResponse(aiPrompt, 'nim', geminiKey, nimKey, language);
        
        // Final check if aborted during AI generation
        if (abortControllerRef.current.signal.aborted) return;

        aiResponseText = rawAiResponseText.replace(/[*#_`~]/g, '').trim();
      } catch (aiErr) {
        if (aiErr.name === 'AbortError') return;
        throw new Error(`AI Model Error: ${aiErr.message}`);
      }

      const newMessage = { 
        type: 'bot', 
        text: aiResponseText, 
        sources: (searchData.results || []).map(r => r.url.replace('https://', '').split('/')[0]) 
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      speak(aiResponseText);
    } catch (err) {
      if (err.name === 'AbortError') return;
      const displayError = typeof err === 'string' ? err : (err.message || JSON.stringify(err));
      setError(displayError);
      setIsSearching(false);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `⚠️ Search Tool Error: ${displayError}`, 
        sources: [] 
      }]);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    simulateWebSearch(text);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <section id="assistant" style={{
      padding: '4rem 2rem',
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {language === 'es-ES' ? 'Asistente de Voz' : language === 'fr-FR' ? 'Assistant Vocal' : language === 'hi-IN' ? 'आवाज सहायक' : 'Smart Voice Assistant'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {language === 'es-ES' ? 'Búsqueda con IA y datos web en tiempo real.' : language === 'fr-FR' ? 'Recherche IA et données Web en temps réel.' : language === 'hi-IN' ? 'एआई-संचालित खोज और वास्तविक समय वेब डेटा।' : 'AI-powered search with voice interaction and real-time web data.'}
          </p>
        </motion.div>
      </div>

      <div className="glass-card" style={{
        height: '650px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)'
      }}>
        {/* Header/Status */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          opacity: 0.9
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: isSearching ? 'var(--accent)' : '#10b981',
              boxShadow: isSearching ? '0 0 10px var(--accent)' : '0 0 10px #10b981'
            }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              {isSearching ? 'SEARCHING...' : 'AI ONLINE'}
            </span>
          </div>
          <button 
            onClick={() => {
              setMute(!mute);
              if (!mute) window.speechSynthesis.cancel();
            }}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
          >
            {mute ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  gap: '0.75rem',
                  flexDirection: msg.type === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: msg.type === 'user' ? 'var(--primary)' : 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px',
                  color: msg.type === 'user' ? 'white' : 'var(--text-primary)'
                }}>
                  {msg.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    background: msg.type === 'user' ? 'var(--primary)' : 'var(--bg-secondary)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    border: '1px solid var(--glass-border)',
                    color: msg.type === 'user' ? 'white' : 'var(--text-primary)',
                    boxShadow: 'var(--card-shadow)'
                  }}>
                    {msg.text}
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {msg.sources.map((s, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isSearching && (
            <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--primary)', alignItems: 'center', padding: '0.5rem' }}>
              <Loader2 size={16} className="animate-spin" />
              <span style={{ fontSize: '0.85rem' }}>{language === 'hi-IN' ? 'खोज रहे हैं...' : 'Searching...'}</span>
            </div>
          )}

          {isTyping && (
            <div style={{ display: 'flex', gap: '4px', padding: '0.5rem' }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '1.5rem',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {(isSearching || isTyping || isSpeaking) ? (
              <button
                onClick={stopAi}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
                }}
              >
                <X size={20} />
              </button>
            ) : (
              <button
                onClick={toggleListening}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  border: 'none',
                  background: isListening ? '#ef4444' : 'var(--glass-bg)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid var(--glass-border)',
                  boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
                }}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'hi-IN' ? 'सवाल पूछें...' : 'Ask about global elections...'}
                style={{
                  width: '100%',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '14px',
                  padding: '0.85rem 3.5rem 0.85rem 1.25rem',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'var(--primary)',
                  border: 'none',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  opacity: input.trim() ? 1 : 0.5,
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </section>
  );
};

export default VoiceAssistant;
