import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Phone, Mic, MicOff, ArrowRight, Loader2, HelpCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { sendOTP, verifyOTP } from '@/api/mockApi';

const FloatingParticles = () => (
  <div className="particles">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="particle" />
    ))}
  </div>
);

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [farmerId, setFarmerId] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError(t('errors.invalidPhone'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await sendOTP(phone);
      if (response.success) {
        setStep('otp');
        setResendTimer(30);
        // Focus first OTP input
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      }
    } catch {
      setError(t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newOtp.every((digit) => digit) && value) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpValue?: string) => {
    const otpToVerify = otpValue || otp.join('');

    if (otpToVerify.length !== 4) {
      setError(t('auth.invalidOtp'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await verifyOTP(phone, otpToVerify);
      if (response.success) {
        await login(phone, farmerId);
        navigate('/dashboard');
      } else {
        setError(t('auth.invalidOtp'));
        setOtp(['', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch {
      setError(t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    await handleSendOtp();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input would be implemented with Web Speech API in production
  };

  return (
    <div className="min-h-screen hero-bg flex flex-col relative">
      <FloatingParticles />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 safe-top">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="sparkle-icon !w-10 !h-10 !rounded-xl"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="text-lg font-bold text-gradient-primary">
            {t('common.appName')}
          </span>
        </div>
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              {t('auth.welcome')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              {t('auth.subtitle')}
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            layout
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-border/30 shadow-medium p-6"
          >
            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.div
                  key="phone-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('auth.loginTitle')}
                  </h2>

                  {/* Farmer ID Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('auth.farmerId')}
                    </label>
                    <input
                      type="text"
                      value={farmerId}
                      onChange={(e) => setFarmerId(e.target.value)}
                      placeholder={t('auth.farmerIdPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  {/* Phone Number Input */}
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
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhone(value);
                          setError('');
                        }}
                        placeholder={t('auth.phonePlaceholder')}
                        className="w-full pl-24 pr-12 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleVoiceInput}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        {isListening ? (
                          <MicOff className="w-5 h-5 text-destructive" />
                        ) : (
                          <Mic className="w-5 h-5 text-muted-foreground" />
                        )}
                      </motion.button>
                    </div>
                    {isListening && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-primary flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        {t('auth.listening')}
                      </motion.p>
                    )}
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-destructive"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={handleSendOtp}
                    disabled={isLoading || phone.length !== 10}
                    className="w-full py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
                    style={{ background: 'linear-gradient(135deg, hsl(150 30% 20%) 0%, hsl(160 25% 25%) 100%)' }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t('auth.getOtp')}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {t('auth.enterOtp')}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('auth.otpSent')} +91 {phone}
                    </p>
                  </div>

                  {/* OTP Inputs */}
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="tel"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`otp-input ${
                          error ? 'border-destructive animate-wiggle' : ''
                        }`}
                      />
                    ))}
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-destructive text-center"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Resend OTP */}
                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t('auth.resendIn')} {resendTimer} {t('auth.seconds')}
                      </p>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleResendOtp}
                        className="text-sm text-primary font-medium"
                      >
                        {t('auth.resendOtp')}
                      </motion.button>
                    )}
                  </div>

                  {/* Verify Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleVerifyOtp()}
                    disabled={isLoading || otp.some((d) => !d)}
                    className="w-full py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
                    style={{ background: 'linear-gradient(135deg, hsl(150 30% 20%) 0%, hsl(160 25% 25%) 100%)' }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t('auth.verifyLogin')}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  {/* Back button */}
                  <button
                    onClick={() => {
                      setStep('phone');
                      setOtp(['', '', '', '']);
                      setError('');
                    }}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('common.back')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Help Link */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-primary transition-colors mx-auto"
          >
            <HelpCircle className="w-4 h-4" />
            {t('common.needHelp')}
          </motion.button>
        </motion.div>
      </main>

      {/* Footer decoration */}
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
    </div>
  );
};

export default AuthPage;
