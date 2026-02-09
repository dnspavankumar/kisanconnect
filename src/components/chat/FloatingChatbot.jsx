import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Loader2, Mic, MicOff, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const FloatingChatbot = () => {
    const { t } = useTranslation();
    const { currentLanguage } = useLanguage();
    // 1. State for opening/closing the chat window
    const [isOpen, setIsOpen] = useState(false);

    // 2. State for storing chat messages (starts with a greeting)
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: t('chatbot.greeting'),
            suggestions: t('chatbot.suggestedQuestions', { returnObjects: true }),
            timestamp: new Date()
        }
    ]);

    // 3. State for current text in the input box
    const [input, setInput] = useState('');

    // 4. State for showing a loading spinner while waiting for AI
    const [isLoading, setIsLoading] = useState(false);

    // 5. Voice states
    const [isListening, setIsListening] = useState(false);

    // Ref to automatically scroll to the bottom when new messages arrive
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const recognitionTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom whenever messages are updated or chat is opened
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    /**
     * Sends the user's message to our Express backend
     */
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

    const getMockTranslation = (text, targetLang) => {
        return `${text} (${targetLang})`;
    };

    const handleSend = async (text) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        // Detect typed language
        const detectLang = (t) => {
            if (/[\u0900-\u097F]/.test(t)) return 'hi';
            if (/[\u0C00-\u0C7F]/.test(t)) return 'te';
            return 'en';
        };
        const detectedLanguage = detectLang(messageText);
        let finalMessage = messageText;
        let isTranslated = false;

        setIsLoading(true); // Show loading early for transliteration

        // Smart Hinglish -> Hindi Transliteration
        if (currentLanguage === 'hi' && detectedLanguage === 'en') {
            finalMessage = await transliterateToHindi(messageText);
            isTranslated = true;
        }
        // Standard Language Translation
        else if (detectedLanguage !== currentLanguage) {
            finalMessage = getMockTranslation(messageText, currentLanguage);
            isTranslated = true;
        }

        // Add user's message to the chat list immediately
        const userMessage = {
            role: 'user',
            content: finalMessage,
            isTranslated: isTranslated,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput(''); // Clear input box

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081';
            console.log(`[Frontend] 🚀 Sending message to AI Backend: ${backendUrl}/chat`);

            const response = await fetch(`${backendUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: finalMessage,
                    language: currentLanguage, // Standard fallback
                    uiLanguage: currentLanguage,
                    userLanguage: detectedLanguage
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // ADD AI RESPONSE: Update messages with what Gemini said
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.content,
                suggestions: data.suggestions || [],
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please ensure the backend server is running with a valid Gemini API key.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false); // Hide loading spinner
        }
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
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#768870] p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">KisanMitra AI</h3>
                                    <p className="text-[10px] text-white/80">Always active</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-md transition-colors">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-md transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-[#768870] text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                        }`}>
                                        {msg.role === 'user' && msg.isTranslated && (
                                            <span className="block text-[10px] uppercase font-bold text-white/70 mb-1">
                                                {t('chatbot.translated')}
                                            </span>
                                        )}
                                        {msg.content}

                                        {msg.role === 'assistant' && (
                                            <button
                                                onClick={() => speakMessage(msg.content)}
                                                className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#7a8478] hover:text-[#768870] transition-colors uppercase tracking-wider"
                                            >
                                                <Volume2 className="w-3.5 h-3.5" />
                                                <span>Listen</span>
                                            </button>
                                        )}

                                        {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {msg.suggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleSuggestionClick(s)}
                                                        className="px-3 py-1.5 text-[10px] bg-gray-100 hover:bg-[#768870] hover:text-white rounded-lg transition-colors border border-gray-200"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                        <Loader2 className="w-4 h-4 text-[#768870] animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={toggleVoiceInput}
                                    className={`p-2 rounded-full transition-all flex-shrink-0 ${isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={t('chatbot.placeholder')}
                                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#768870]/20"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2 bg-[#768870] text-white rounded-full disabled:opacity-50 hover:opacity-90 transition-all active:scale-90 flex-shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${isOpen ? 'bg-white text-[#768870]' : 'bg-[#768870] text-white'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>
        </div>
    );
};

export default FloatingChatbot;
