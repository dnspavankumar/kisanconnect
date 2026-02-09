import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Mic, MicOff, Volume2, MessageCircle, Sprout, Settings, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { LoadingDots } from '@/components/ui/LoadingSpinner';
import { sendChatMessage } from '@/api/mockApi';
import BottomNav from '@/components/navigation/BottomNav';

const ChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: 'greeting',
      role: 'assistant',
      content: t('chatbot.greeting'),
      timestamp: new Date(),
      suggestions: t('chatbot.suggestedQuestions', { returnObjects: true }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to detect language
  const detectLanguage = (text) => {
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    return 'en';
  };

  // Helper for Hinglish to Hindi Conversion
  const transliterateToHindi = async (text) => {
    try {
      const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`;
      const res = await fetch(url);
      const data = await res.json();
      if (data[0] === 'SUCCESS') {
        return data[1][0][1][0];
      }
    } catch (e) {
      console.error("Transliteration error:", e);
    }
    return text;
  };

  // Mock translation function for demonstration
  const getMockTranslation = (text, targetLang) => {
    return `${text} (${targetLang})`;
  };

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userLanguage = detectLanguage(messageText);
    let finalMessage = messageText;
    let isTranslated = false;

    setIsLoading(true);

    // Smart Hinglish -> Hindi Script Conversion
    if (currentLanguage === 'hi' && userLanguage === 'en') {
      finalMessage = await transliterateToHindi(messageText);
      isTranslated = true;
    }
    // Other Translations
    else if (userLanguage !== currentLanguage) {
      finalMessage = getMockTranslation(messageText, currentLanguage);
      isTranslated = true;
    }

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: finalMessage,
      isTranslated: isTranslated,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      console.log(`[ChatPage] 📤 Sending translated message: "${finalMessage}" to AI Service`);
      const response = await sendChatMessage(finalMessage, currentLanguage);

      const botMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: error.message || t('errors.serverError'),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      if (recognitionTimeoutRef.current) clearTimeout(recognitionTimeoutRef.current);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      // Auto-stop after 5 seconds of silence if no result
      recognitionTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) recognitionRef.current.stop();
      }, 5000);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (recognitionTimeoutRef.current) clearTimeout(recognitionTimeoutRef.current);
    };

    recognition.onerror = () => {
      setIsListening(false);
      if (recognitionTimeoutRef.current) clearTimeout(recognitionTimeoutRef.current);
    };

    recognition.onresult = (event) => {
      if (recognitionTimeoutRef.current) clearTimeout(recognitionTimeoutRef.current);
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
      utterance.rate = 0.9; // Slightly slower for better clarity
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col overflow-hidden bg-[#fdfbf7] text-[#2a3328]">
      {/* 1. Header (Fixed) */}
      <header className="app-header px-4 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 hover:bg-[#f4f2eb] rounded-full text-[#7a8478] transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-[#768870] rounded-lg flex items-center justify-center flex-shrink-0">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight truncate whitespace-nowrap">AI Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <LanguageSelector variant="compact" />
          <button onClick={() => navigate('/news')} className="p-1.5 hover:bg-[#f4f2eb] rounded-full text-[#7a8478] flex-shrink-0"><Bell className="w-4 h-4" /></button>
          <button onClick={() => navigate('/profile')} className="p-1.5 hover:bg-[#f4f2eb] rounded-full text-[#7a8478] flex-shrink-0"><Settings className="w-4 h-4" /></button>
        </div>
      </header>

      {/* 2. Main Chat Area (Flex-1) */}
      <main className="flex-1 flex flex-col min-h-0 relative max-w-[1200px] mx-auto w-full">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-[2rem] p-5 shadow-sm ${message.role === 'user'
                  ? 'bg-[#768870] text-white shadow-[#768870]/20'
                  : 'bg-white border border-[#eeede6] text-[#2a3328]'
                  }`}
              >
                <div className="text-sm sm:text-base leading-relaxed font-medium">
                  {message.role === 'user' && message.isTranslated && (
                    <span className="block text-[10px] uppercase tracking-wider opacity-70 mb-1 font-bold">
                      {t('chatbot.translated')}
                    </span>
                  )}
                  {message.content}
                </div>

                {message.role === 'assistant' && (
                  <button
                    onClick={() => speakMessage(message.content)}
                    className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#7a8478] hover:text-[#768870] transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen</span>
                  </button>
                )}

                {message.suggestions && message.suggestions.length > 0 && message.role === 'assistant' && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 text-[11px] font-bold rounded-xl bg-[#f4f2eb] text-[#768870] hover:bg-[#768870] hover:text-white transition-all border border-[#eeede6] active:scale-95"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#eeede6] rounded-[2rem] px-6 py-4 flex items-center gap-4 shadow-sm">
                <LoadingDots />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7a8478]">{t('chatbot.thinking')}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar - Unified and Padded */}
        <div className="p-4 sm:p-6 bg-transparent">
          <div className="bg-white border border-[#eeede6] rounded-[2.5rem] p-2 flex items-center gap-2 shadow-xl shadow-black/5">
            <button
              onClick={toggleVoiceInput}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-[#f4f2eb] text-[#7a8478] hover:bg-[#eeede6]'
                }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 bg-transparent text-sm sm:text-base font-semibold focus:outline-none px-3 placeholder:text-[#7a8478]/40"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-[#768870] rounded-full flex items-center justify-center text-white disabled:opacity-30 hover:opacity-90 transition-all shadow-lg shadow-[#768870]/20 active:scale-90"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* 3. Footer Navigation (Fixed) */}
      <footer className="app-footer flex-shrink-0">
        <BottomNav />
      </footer>
    </div>
  );
};

export default ChatPage;
