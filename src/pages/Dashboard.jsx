import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Camera,
  Newspaper,
  Cloud,
  Droplets,
  Wind,
  LogOut,
  Sprout,
  ArrowRight,
  Settings,
  User,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { getCurrentLocationWeather, getWeatherAdvice } from '@/services/weatherService';
import BottomNav from '@/components/navigation/BottomNav';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [weather, setWeather] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // TODO: Re-enable authentication later
  // useEffect(() => {
  //   if (!authLoading && !isAuthenticated) {
  //     navigate('/login');
  //   }
  // }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const loadWeather = async () => {
      setIsLoadingWeather(true);
      setWeatherError(null);
      try {
        const data = await getCurrentLocationWeather();
        setWeather(data);
      } catch (error) {
        console.error('Failed to load weather:', error);
        // Error is already handled in the service with mock data
        // So this shouldn't happen, but just in case
        setWeatherError('Using sample weather data');
      } finally {
        setIsLoadingWeather(false);
      }
    };
    loadWeather();
  }, []);

  const handleRefreshWeather = async () => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const data = await getCurrentLocationWeather();
      setWeather(data);
    } catch (error) {
      console.error('Failed to refresh weather:', error);
      setWeatherError('Using sample weather data');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const featureCards = [
    {
      id: 'chat',
      icon: MessageCircle,
      title: t('navigation.chat'),
      description: 'Get instant farming advice and solutions',
      path: '/chat',
      cardClass: 'feature-card-green',
      iconClass: 'icon-circle-green',
      buttonText: 'Ask Now',
    },
    {
      id: 'scan',
      icon: Camera,
      title: t('navigation.scan'),
      description: 'Scan crops to identify diseases early',
      path: '/disease',
      cardClass: 'feature-card-brown',
      iconClass: 'icon-circle-brown',
      buttonText: 'Scan Now',
    },
    {
      id: 'news',
      icon: Newspaper,
      title: t('navigation.news'),
      description: 'Stay updated with latest farming schemes',
      path: '/news',
      cardClass: 'feature-card-gold',
      iconClass: 'icon-circle-gold',
      buttonText: 'Read More',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // TODO: Re-enable authentication loading check later
  // if (authLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center hero-bg">
  //       <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen hero-bg pb-24">
      {/* Header with App Name */}
      <header className="bg-white border-b border-border shadow-sm safe-top">
        <div className="flex items-center justify-between p-4">
          {/* App Logo/Name */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Kisan Connect</h2>
              <p className="text-xs text-muted-foreground">Farming Assistant</p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector variant="compact" />
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 touch-target transition-colors"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                  />
                  
                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-border shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    
                    <div className="h-px bg-border" />
                    
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 space-y-4 pt-4">
        {/* Simple Greeting at Top */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            {t('dashboard.greeting')}, {user?.name?.split(' ')[0] || 'Farmer'}! 👋
          </h1>
        </div>

        {/* Enhanced Interactive Weather Card */}
        {isLoadingWeather ? (
          <div className="simple-card p-8 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Loading weather data...</p>
          </div>
        ) : weatherError ? (
          <div className="simple-card p-6">
            <div className="text-center">
              <Cloud className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">{weatherError}</p>
              <button
                onClick={handleRefreshWeather}
                className="btn-primary px-4 py-2 text-sm flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        ) : weather && (
          <div className="simple-card overflow-hidden">
            {/* Weather Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Today's Weather</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{weather.city}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRefreshWeather}
                  className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  disabled={isLoadingWeather}
                >
                  <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoadingWeather ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Weather Stats Grid */}
            <div className="grid grid-cols-3 divide-x divide-border">
              {/* Temperature */}
              <div className="p-4 text-center hover:bg-primary/5 transition-colors">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{weather.temperature}°C</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {weather.description}
                </p>
              </div>

              {/* Humidity */}
              <div className="p-4 text-center hover:bg-accent/5 transition-colors">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{weather.humidity}%</p>
                <p className="text-xs text-muted-foreground">Humidity</p>
              </div>

              {/* Wind Speed */}
              <div className="p-4 text-center hover:bg-secondary/5 transition-colors">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Wind className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{weather.wind}</p>
                <p className="text-xs text-muted-foreground">km/h Wind</p>
              </div>
            </div>

            {/* Weather Advice Banner */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-4 py-3 border-t border-border">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">💡</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  <span className="font-semibold">Farming Tip:</span> {getWeatherAdvice(weather)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="space-y-4">
          {/* AI Assistant Card - Full Width */}
          {(() => {
            const card = featureCards[0];
            return (
              <div className={`feature-card ${card.cardClass} p-5`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`icon-circle ${card.iconClass} flex-shrink-0`}>
                    <card.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Button */}
                    <button
                      onClick={() => navigate(card.path)}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <span>{card.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Other Cards - 2 Column Grid */}
          <div className="grid grid-cols-2 gap-3">
            {featureCards.slice(1).map((card) => (
              <div
                key={card.id}
                className={`feature-card ${card.cardClass} p-4`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  {/* Icon */}
                  <div className={`icon-circle ${card.iconClass}`}>
                    <card.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground mb-2">{card.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Button */}
                    <button
                      onClick={() => navigate(card.path)}
                      className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
                    >
                      <span>{card.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
