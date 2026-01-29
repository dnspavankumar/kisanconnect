import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  MessageCircle, 
  Camera, 
  Newspaper, 
  Cloud, 
  Users, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone,
  Zap
} from 'lucide-react';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: MessageCircle,
      title: t('landing.features.chat.title') || 'AI Agricultural Advisory',
      description: t('landing.features.chat.desc') || 'Get instant answers to your farming questions from our AI assistant',
      color: 'bg-primary/10 text-primary'
    },
    {
      icon: Camera,
      title: t('landing.features.disease.title') || 'Disease Detection',
      description: t('landing.features.disease.desc') || 'Identify crop diseases instantly with photo analysis',
      color: 'bg-secondary/10 text-secondary'
    },
    {
      icon: Cloud,
      title: t('landing.features.weather.title') || 'Weather Insights',
      description: t('landing.features.weather.desc') || 'Real-time weather updates and farming recommendations',
      color: 'bg-accent/10 text-accent'
    },
    {
      icon: Newspaper,
      title: t('landing.features.news.title') || 'Agricultural News',
      description: t('landing.features.news.desc') || 'Stay updated with latest schemes, prices, and farming news',
      color: 'bg-primary/10 text-primary'
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: t('landing.benefits.multilingual') || 'Multilingual Support',
      description: 'Available in English, Hindi, and Telugu'
    },
    {
      icon: Smartphone,
      title: t('landing.benefits.mobile') || 'Mobile First',
      description: 'Designed for easy use on any device'
    },
    {
      icon: Zap,
      title: t('landing.benefits.instant') || 'Instant Answers',
      description: 'Get farming advice in seconds'
    },
    {
      icon: Shield,
      title: t('landing.benefits.secure') || 'Secure & Private',
      description: 'Your data is safe with us'
    }
  ];

  const stats = [
    { value: '10K+', label: t('landing.stats.farmers') || 'Farmers' },
    { value: '50K+', label: t('landing.stats.queries') || 'Queries Solved' },
    { value: '3', label: t('landing.stats.languages') || 'Languages' },
    { value: '24/7', label: t('landing.stats.support') || 'Support' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">
                {t('common.appName') || 'KisanMitra'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <button
                onClick={() => navigate('/auth')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t('landing.getStarted') || 'Get Started'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sprout className="w-4 h-4" />
                {t('landing.hero.badge') || 'Your Digital Farming Companion'}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {t('landing.hero.title') || 'Empowering Farmers with'}{' '}
                <span className="text-primary">
                  {t('landing.hero.highlight') || 'Smart Agriculture'}
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground">
                {t('landing.hero.subtitle') || 'Get instant farming advice, disease detection, weather updates, and more - all in your language'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  {t('landing.hero.cta') || 'Start Free'}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-border bg-background hover:bg-muted transition-colors text-lg font-semibold"
                >
                  {t('landing.hero.learn') || 'Learn More'}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <Sprout className="w-32 h-32 text-primary mx-auto" />
                    <p className="text-xl font-semibold text-foreground">
                      {t('landing.hero.imageText') || 'Smart Farming Made Simple'}
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">24/7 Support</div>
                    <div className="text-xs text-muted-foreground">Always Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('landing.features.title') || 'Powerful Features for Modern Farmers'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle') || 'Everything you need to make informed farming decisions'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('landing.benefits.title') || 'Why Choose KisanMitra?'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.benefits.subtitle') || 'Built specifically for Indian farmers'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('landing.cta.title') || 'Ready to Transform Your Farming?'}
          </h2>
          <p className="text-lg text-white/90 mb-8">
            {t('landing.cta.subtitle') || 'Join thousands of farmers already using KisanMitra'}
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-primary hover:bg-white/90 transition-colors text-lg font-semibold shadow-xl"
          >
            {t('landing.cta.button') || 'Get Started Now'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-primary" />
                </div>
                <span className="text-lg font-bold text-primary">KisanMitra</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('landing.footer.tagline') || 'Empowering farmers with technology'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>AI Chat Assistant</li>
                <li>Disease Detection</li>
                <li>Weather Updates</li>
                <li>News & Schemes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Feedback</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Languages</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🇬🇧 English</li>
                <li>🇮🇳 हिंदी (Hindi)</li>
                <li>🇮🇳 తెలుగు (Telugu)</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 KisanMitra. {t('landing.footer.rights') || 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
