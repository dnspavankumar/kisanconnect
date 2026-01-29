import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  Mic, 
  MicOff, 
  ArrowRight, 
  Loader2, 
  Sprout,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const OnboardingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isListeningName, setIsListeningName] = useState(false);
  const [isListeningPhone, setIsListeningPhone] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    language: currentLanguage || 'en',
    location: '',
  });

  // Load existing user data
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.uid) {
        const { getUserProfile } = await import('@/services/authService');
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.name || '',
            phone: profile.phone?.replace('+91', '') || '',
            language: profile.language || currentLanguage || 'en',
            location: profile.location || '',
          }));
        }
      }
    };
    loadUserData();
  }, [user, currentLanguage]);

  // Web Speech API for voice input
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
      setRecognition(recognitionInstance);
    }
  }, [currentLanguage]);

  const startVoiceInput = (field) => {
    if (!recognition) {
      toast.error(t('onboarding.voiceNotSupported') || 'Voice input not supported in this browser');
      return;
    }

    if (field === 'name') {
      setIsListeningName(true);
    } else if (field === 'phone') {
      setIsListeningPhone(true);
    }

    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      
      if (field === 'name') {
        setFormData(prev => ({ ...prev, name: transcript }));
        setIsListeningName(false);
      } else if (field === 'phone') {
        // Extract numbers from transcript
        const numbers = transcript.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, phone: numbers }));
        setIsListeningPhone(false);
      }
    };

    recognition.onerror = () => {
      setIsListeningName(false);
      setIsListeningPhone(false);
      toast.error(t('onboarding.voiceError') || 'Voice input failed. Please try again.');
    };

    recognition.onend = () => {
      setIsListeningName(false);
      setIsListeningPhone(false);
    };

    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListeningName(false);
    setIsListeningPhone(false);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error(t('onboarding.nameRequired') || 'Please enter your name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.phone.length !== 10) {
        toast.error(t('errors.invalidPhone'));
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.location.trim()) {
      toast.error(t('onboarding.locationRequired') || 'Please enter your location');
      return;
    }

    setIsLoading(true);
    try {
      // Update language
      changeLanguage(formData.language);
      
      // Update user profile in Firestore
      const result = await updateProfile({
        name: formData.name,
        phone: `+91${formData.phone}`,
        language: formData.language,
        location: formData.location,
        onboardingCompleted: true,
      });

      if (result.success) {
        toast.success(t('onboarding.success') || 'Profile setup complete!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || t('errors.serverError'));
      }
    } catch (error) {
      toast.error(t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <div className="min-h-screen hero-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-top">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-primary">
            {t('common.appName')}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {t('onboarding.step')} {step}/4
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('onboarding.nameTitle') || "What's your name?"}
                </h2>
                <p className="text-muted-foreground">
                  {t('onboarding.nameSubtitle') || 'Help us personalize your experience'}
                </p>
              </div>

              <div className="simple-card p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('onboarding.fullName') || 'Full Name'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('onboarding.namePlaceholder') || 'Enter your full name'}
                      className="w-full pl-4 pr-12 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                    />
                    <button
                      onClick={() => isListeningName ? stopVoiceInput() : startVoiceInput('name')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      {isListeningName ? (
                        <MicOff className="w-5 h-5 text-destructive animate-pulse" />
                      ) : (
                        <Mic className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {isListeningName && (
                    <p className="text-sm text-primary flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      {t('auth.listening')}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!formData.name.trim()}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {t('common.next')}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Phone Number */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('onboarding.phoneTitle') || 'Your phone number'}
                </h2>
                <p className="text-muted-foreground">
                  {t('onboarding.phoneSubtitle') || 'We use this to keep your account secure'}
                </p>
              </div>

              <div className="simple-card p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('auth.phoneNumber')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData(prev => ({ ...prev, phone: value }));
                      }}
                      placeholder={t('auth.phonePlaceholder')}
                      className="w-full pl-24 pr-12 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                    />
                    <button
                      onClick={() => isListeningPhone ? stopVoiceInput() : startVoiceInput('phone')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      {isListeningPhone ? (
                        <MicOff className="w-5 h-5 text-destructive animate-pulse" />
                      ) : (
                        <Mic className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {isListeningPhone && (
                    <p className="text-sm text-primary flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      {t('auth.listening')}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-4 rounded-lg border-2 border-border bg-background hover:bg-muted transition-colors text-lg font-semibold"
                  >
                    {t('common.back')}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={formData.phone.length !== 10}
                    className="flex-1 btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {t('common.next')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Language */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('onboarding.languageTitle') || 'Choose your language'}
                </h2>
                <p className="text-muted-foreground">
                  {t('onboarding.languageSubtitle') || 'Select your preferred language'}
                </p>
              </div>

              <div className="simple-card p-6 space-y-4">
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setFormData(prev => ({ ...prev, language: lang.code }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                        formData.language === lang.code
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="text-left">
                          <div className="font-semibold text-foreground">{lang.nativeName}</div>
                          <div className="text-sm text-muted-foreground">{lang.name}</div>
                        </div>
                      </div>
                      {formData.language === lang.code && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-4 rounded-lg border-2 border-border bg-background hover:bg-muted transition-colors text-lg font-semibold"
                  >
                    {t('common.back')}
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2"
                  >
                    {t('common.next')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('onboarding.locationTitle') || 'Where are you farming?'}
                </h2>
                <p className="text-muted-foreground">
                  {t('onboarding.locationSubtitle') || 'Help us provide location-specific advice'}
                </p>
              </div>

              <div className="simple-card p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('onboarding.location') || 'Location'}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder={t('onboarding.locationPlaceholder') || 'e.g., Warangal, Telangana'}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-4 rounded-lg border-2 border-border bg-background hover:bg-muted transition-colors text-lg font-semibold"
                  >
                    {t('common.back')}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.location.trim()}
                    className="flex-1 btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t('onboarding.complete') || 'Complete Setup'}
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer decoration */}
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
    </div>
  );
};

export default OnboardingPage;
