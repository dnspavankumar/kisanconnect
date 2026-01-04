import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { LoadingDots } from '@/components/ui/LoadingSpinner';
import { sendChatMessage, ChatMessage as ChatMessageType } from '@/api/mockApi';
import BottomNav from '@/components/navigation/BottomNav';

interface Message extends ChatMessageType {
  suggestions?: string[];
}

const FloatingParticles = () => (
  <div className="particles">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="particle" />
    ))}
  </div>
);

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting',
      role: 'assistant',
      content: t('chatbot.greeting'),
      timestamp: new Date(),
      suggestions: t('chatbot.suggestedQuestions', { returnObjects: true }) as string[],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
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

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
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

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen hero-bg flex flex-col relative">
      <FloatingParticles />

      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/30 safe-top">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl bg-white/80 border border-border/30 touch-target shadow-soft"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                {t('chatbot.title')}
              </h1>
            </div>
          </div>
          <LanguageSelector variant="compact" />
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 pb-36 space-y-4 scrollbar-hide relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === 'user' 
                    ? 'rounded-2xl rounded-br-md p-4 text-white' 
                    : 'bg-white/90 backdrop-blur-sm text-foreground rounded-2xl rounded-bl-md border border-border/30 shadow-soft p-4'
                }`}
                style={message.role === 'user' ? { background: 'linear-gradient(135deg, hsl(152 60% 36%) 0%, hsl(168 60% 42%) 100%)' } : {}}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>

                {/* Voice button for bot messages */}
                {message.role === 'assistant' && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => speakMessage(message.content)}
                    className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen</span>
                  </motion.button>
                )}

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-bl-md border border-border/30 shadow-soft p-4 flex items-center gap-2">
              <LoadingDots />
              <span className="text-sm text-muted-foreground">{t('chatbot.thinking')}</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 p-4 glass border-t border-border/30 z-20">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleVoiceInput}
            className={`p-3 rounded-xl touch-target transition-colors shadow-soft ${
              isListening
                ? 'bg-destructive text-white'
                : 'bg-white/80 border border-border/30 text-muted-foreground'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbot.placeholder')}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-border/30 bg-white/90 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl touch-target disabled:opacity-50 text-white shadow-medium"
            style={{ background: 'linear-gradient(135deg, hsl(152 60% 36%) 0%, hsl(168 60% 42%) 100%)' }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        {isListening && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-primary flex items-center gap-2 mt-2 justify-center"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            {t('auth.listening')}
          </motion.p>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ChatPage;
