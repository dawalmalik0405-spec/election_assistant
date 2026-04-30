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
    
    try {
      // Real search using Tavily
      let searchData;
      try {
        searchData = await performWebSearch(query, apiKey);
      } catch (searchErr) {
        throw new Error(`Search Tool Error: ${searchErr.message}`);
      }
      
      setIsSearching(false);
      setIsTyping(true);
      
      // Prepare context for AI model
      const context = searchData.results.map(r => `Source: ${r.title}\nContent: ${r.content}`).join('\n\n');
      const aiPrompt = `User Query: ${query}\n\nSearch Context:\n${context}\n\nProvide a comprehensive, accurate, and concise answer based ONLY on the search context provided above.`;
      
      let aiResponseText;
      try {
        // Automatic robust selection: NIM is much faster right now since Gemini is out of quota
        let rawAiResponseText = await generateRobustAiResponse(aiPrompt, 'nim', geminiKey, nimKey, language);
        
        // Forcefully strip out any markdown characters (*, #, _) that the AI might sneak in
        aiResponseText = rawAiResponseText.replace(/[*#_`~]/g, '').trim();
      } catch (aiErr) {
        throw new Error(`AI Model Error: ${aiErr.message}`);
      }

      const newMessage = { 
        type: 'bot', 
        text: aiResponseText, 
        sources: searchData.results.map(r => r.url.replace('https://', '').split('/')[0]) 
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      speak(aiResponseText);
    } catch (err) {
      setError(err.message);
      setIsSearching(false);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `⚠️ ${err.message}`, 
        sources: [] 
      }]);
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
      padding: '6rem 2rem',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Smart <span className="gradient-text">Voice Assistant</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>AI-powered search with voice interaction and real-time web data.</p>
      </div>

      <div className="glass-card" style={{
        height: '700px',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header/Toolbar */}
        <div style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSearching ? 'var(--accent)' : 'var(--success)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              {isSearching ? 'SEARCHING WEB...' : 'ONLINE'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => {
                setMute(!mute);
                if (!mute) window.speechSynthesis.cancel();
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {mute ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{
          padding: '2rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: msg.type === 'bot' ? 'var(--primary)' : 'var(--surface-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div style={{ maxWidth: '80%' }}>
                <div style={{
                  background: msg.type === 'bot' ? 'var(--surface-light)' : 'var(--primary)',
                  padding: '1rem 1.25rem',
                  borderRadius: msg.type === 'bot' ? '0 18px 18px 18px' : '18px 0 18px 18px',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  {msg.text}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {msg.sources.map((s, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(37, 99, 235, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                        <Globe size={10} style={{ marginRight: '4px' }} /> {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isSearching && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={20} />
              </div>
              <div style={{ background: 'var(--surface-light)', padding: '1rem', borderRadius: '0 18px 18px 18px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Loader2 size={18} className="animate-spin" />
                <span style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Scanning official election databases...</span>
              </div>
            </motion.div>
          )}

          {isTyping && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} />
              </div>
              <div className="typing-indicator" style={{ background: 'var(--surface-light)', padding: '1rem', borderRadius: '0 18px 18px 18px', display: 'flex', gap: '4px' }}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '2rem',
          borderTop: '1px solid var(--glass-border)',
          background: 'rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            background: 'var(--surface)',
            padding: '0.5rem',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            alignItems: 'center'
          }}>
            <button 
              onClick={toggleListening}
              style={{
                background: isListening ? 'var(--error)' : 'var(--glass)',
                border: 'none',
                color: 'white',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask about deadlines, registration, or polling places..."}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: 'white',
                padding: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isSearching}
              style={{
                background: 'var(--primary)',
                border: 'none',
                color: 'white',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: (!input.trim() || isSearching) ? 0.5 : 1
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .typing-indicator .dot {
          width: 8px;
          height: 8px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}} />
    </section>
  );
};

export default VoiceAssistant;
