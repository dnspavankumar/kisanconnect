import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowRight, Loader2, HelpCircle, Sprout } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { toast } from 'sonner';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && userProfile?.onboardingCompleted) {
      navigate('/dashboard');
    } else if (isAuthenticated && !userProfile?.onboardingCompleted) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, userProfile, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Temporary: Just navigate to dashboard for now
      // TODO: Implement actual email/password authentication
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5EFE7' }}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-top">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8B9556' }}>
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold" style={{ color: '#8B9556' }}>
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
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
              {t('auth.welcomeBack') || 'Welcome Back'}
            </h1>
            <p className="text-base" style={{ color: '#6B6B6B' }}>
              {t('auth.loginSubtitle') || 'Login to continue to your account'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="space-y-5">
              <h2 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>
                {t('auth.loginTitle')}
              </h2>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                  {t('auth.email') || 'Email'}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder={t('auth.emailPlaceholder') || 'Enter your email'}
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-base outline-none transition-all"
                    style={{ 
                      border: '2px solid #E8DCC8',
                      backgroundColor: '#FAFAF8',
                      color: '#2C2C2C'
                    }}
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                  {t('auth.password') || 'Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && email && password) {
                      handleLogin();
                    }
                  }}
                  placeholder={t('auth.passwordPlaceholder') || 'Enter your password'}
                  className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all"
                  style={{ 
                    border: '2px solid #E8DCC8',
                    backgroundColor: '#FAFAF8',
                    color: '#2C2C2C'
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {/* Submit Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: (email && password) ? '#8B9556' : '#C4C9A8',
                  color: 'white'
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t('auth.login') || 'Login'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Signup Link */}
              <div className="text-center pt-4">
                <p className="text-sm" style={{ color: '#6B6B6B' }}>
                  {t('auth.noAccount') || "Don't have an account?"}{' '}
                  <Link to="/signup" className="font-medium hover:underline" style={{ color: '#8B9556' }}>
                    {t('auth.signupLink') || 'Sign up'}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Help Link */}
          <button className="flex items-center justify-center gap-2 mt-6 text-sm transition-colors mx-auto" style={{ color: '#6B6B6B' }}>
            <HelpCircle className="w-4 h-4" />
            {t('common.needHelp')}
          </button>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
