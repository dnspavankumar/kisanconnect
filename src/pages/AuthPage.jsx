import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mic, MicOff, ArrowRight, Loader2, HelpCircle, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { sendOTP, verifyOTP } from '@/services/authService';

const AuthPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState('phone');
  const [farmerId, setFarmerId] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const otpRefs = useRef([]);

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
        setResendTimer(60);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setError(response.message || t('errors.serverError'));
      }
    } catch (err) {
      setError(err.message || t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit) && value) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpValue) => {
    const otpToVerify = otpValue || otp.join('');

    if (otpToVerify.length !== 6) {
      setError(t('auth.invalidOtp'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await verifyOTP(otpToVerify);
      if (response.success) {
        // User is now authenticated, Firebase will handle the state
        // Update user profile with farmer ID if provided
        if (farmerId && response.user) {
          const { updateUserProfile } = await import('@/services/authService');
          await updateUserProfile(response.user.uid, { farmerId });
        }
        // Redirect to onboarding for new users
        navigate('/onboarding');
      } else {
        setError(response.message || t('auth.invalidOtp'));
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err.message || t('errors.serverError'));
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    await handleSendOtp();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="min-h-screen hero-bg flex flex-col">
      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>

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
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('auth.welcome')}
            </h1>
            <p className="text-muted-foreground">
              {t('auth.subtitle')}
            </p>
          </div>

          {/* Form Card */}
          <div className="simple-card p-6">
            {step === 'phone' ? (
              <div className="space-y-5">
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
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
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
                      className="w-full pl-24 pr-12 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                    />
                    <button
                      onClick={toggleVoiceInput}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      {isListening ? (
                        <MicOff className="w-5 h-5 text-destructive" />
                      ) : (
                        <Mic className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {isListening && (
                    <p className="text-sm text-primary flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      {t('auth.listening')}
                    </p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSendOtp}
                  disabled={isLoading || phone.length !== 10}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {t('auth.getOtp')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('auth.enterOtp')}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('auth.otpSent')} +91 {phone}
                  </p>
                </div>

                {/* OTP Inputs - 6 digits for Firebase */}
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-lg border-2 ${
                        error ? 'border-destructive' : 'border-border'
                      } bg-background focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all`}
                    />
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                {/* Resend OTP */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t('auth.resendIn')} {resendTimer} {t('auth.seconds')}
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      {t('auth.resendOtp')}
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  onClick={() => handleVerifyOtp()}
                  disabled={isLoading || otp.some((d) => !d)}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {t('auth.verifyLogin')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Back button */}
                <button
                  onClick={() => {
                    setStep('phone');
                    setOtp(['', '', '', '', '', '']);
                    setError('');
                  }}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('common.back')}
                </button>
              </div>
            )}
          </div>

          {/* Help Link */}
          <button className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-primary transition-colors mx-auto">
            <HelpCircle className="w-4 h-4" />
            {t('common.needHelp')}
          </button>
        </div>
      </main>

      {/* Footer decoration */}
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
    </div>
  );
};

export default AuthPage;
