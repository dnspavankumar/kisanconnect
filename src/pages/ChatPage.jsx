import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Mic, MicOff, Volume2, MessageCircle } from 'lucide-react';
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messageText, currentLanguage);

      const botMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: t('errors.serverError'),
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
    setIsListening(!isListening);
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen hero-bg flex flex-col">
      <header className="sticky top-0 z-30 bg-white border-b border-border safe-top shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 touch-target transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                {t('chatbot.title')}
              </h1>
            </div>
          </div>
          <LanguageSelector variant="compact" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-36 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.role === 'user'
                  ? 'chat-bubble-user p-4'
                  : 'chat-bubble-bot p-4'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>

              {message.role === 'assistant' && (
                <button
                  onClick={() => speakMessage(message.content)}
                  className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </button>
              )}

              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
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
            <div className="chat-bubble-bot p-4 flex items-center gap-2">
              <LoadingDots />
              <span className="text-sm text-muted-foreground">{t('chatbot.thinking')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-border z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoiceInput}
            className={`p-3 rounded-lg touch-target transition-colors shadow-sm ${
              isListening
                ? 'bg-destructive text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbot.placeholder')}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
            />
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="btn-primary p-3 touch-target disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {isListening && (
          <p className="text-sm text-primary flex items-center gap-2 mt-2 justify-center">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            {t('auth.listening')}
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ChatPage;
