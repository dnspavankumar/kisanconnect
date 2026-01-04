import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Sparkles,
  ArrowRight,
  Sun,
  Leaf,
  Sprout,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { getWeather, WeatherData } from '@/api/mockApi';
import BottomNav from '@/components/navigation/BottomNav';

// Generate stable random values for bubbles
const generateBubbleData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 8 + (i * 7) % 24,
    left: (i * 37) % 100,
    top: (i * 23) % 100,
    opacity: 0.2 + ((i * 13) % 30) / 100,
    duration: 4 + (i % 6),
    delay: (i * 0.3) % 3,
    parallaxSpeed: 0.3 + ((i * 11) % 40) / 100,
  }));
};

const generateStarData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 41) % 100,
    top: (i * 29) % 100,
    size: 10 + (i * 5) % 14,
    duration: 2 + (i % 3),
    delay: (i * 0.4) % 4,
    parallaxSpeed: 0.2 + ((i * 7) % 30) / 100,
  }));
};

// Parallax Floating Bubbles Component
const ParallaxBubbles = () => {
  const { scrollY } = useScroll();
  
  const bubbles = useMemo(() => generateBubbleData(20), []);
  const stars = useMemo(() => generateStarData(15), []);
  
  // Create parallax transforms for different layers
  const orbY1 = useTransform(scrollY, [0, 500], [0, -80]);
  const orbY2 = useTransform(scrollY, [0, 500], [0, -120]);
  const orbY3 = useTransform(scrollY, [0, 500], [0, -60]);
  const orbY4 = useTransform(scrollY, [0, 500], [0, -100]);
  const orbY5 = useTransform(scrollY, [0, 500], [0, -140]);
  
  const orbTransforms = [orbY1, orbY2, orbY3, orbY4, orbY5];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large glowing orbs with parallax */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full will-change-transform"
          style={{
            width: `${150 + i * 40}px`,
            height: `${150 + i * 40}px`,
            left: `${10 + i * 18}%`,
            top: `${15 + i * 12}%`,
            background: `radial-gradient(circle at 30% 30%, 
              hsla(var(--primary), 0.15), 
              hsla(var(--accent), 0.08), 
              transparent 70%)`,
            filter: 'blur(40px)',
            y: orbTransforms[i],
          }}
          animate={{
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Small floating bubbles with individual parallax */}
      {bubbles.map((bubble) => {
        const parallaxY = useTransform(
          scrollY,
          [0, 500],
          [0, -50 * bubble.parallaxSpeed]
        );
        
        return (
          <motion.div
            key={`bubble-${bubble.id}`}
            className="absolute rounded-full will-change-transform"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              background: `radial-gradient(circle at 30% 30%, 
                hsla(var(--primary), ${bubble.opacity}), 
                hsla(var(--accent), 0.1), 
                transparent 70%)`,
              boxShadow: `0 0 ${10 + bubble.size}px hsla(var(--primary), 0.2)`,
              y: parallaxY,
            }}
            animate={{
              y: [0, -60 - bubble.size, 0],
              x: [0, 20 - bubble.size, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: bubble.delay,
            }}
          />
        );
      })}

      {/* Sparkling stars with parallax */}
      {stars.map((star) => {
        const starParallaxY = useTransform(
          scrollY,
          [0, 500],
          [0, -30 * star.parallaxSpeed]
        );
        
        return (
          <motion.div
            key={`star-${star.id}`}
            className="absolute will-change-transform"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              y: starParallaxY,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
          >
            <Sparkles 
              className="text-primary/40" 
              style={{ 
                width: `${star.size}px`,
                height: `${star.size}px`,
              }} 
            />
          </motion.div>
        );
      })}
    </div>
  );
};

// Parallax gradient mesh background
const ParallaxGradientMesh = () => {
  const { scrollY } = useScroll();
  
  const meshY1 = useTransform(scrollY, [0, 500], [0, -50]);
  const meshY2 = useTransform(scrollY, [0, 500], [0, -80]);
  const meshY3 = useTransform(scrollY, [0, 500], [0, -30]);
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div 
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        style={{ y: meshY1 }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/15 rounded-full blur-3xl"
        style={{ y: meshY2 }}
      />
      <motion.div 
        className="absolute top-1/2 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
        style={{ y: meshY3 }}
      />
    </div>
  );
};

// Animated Welcome Illustration Component
const WelcomeIllustration = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className="relative w-32 h-32 mb-6"
    >
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Middle pulsing ring */}
      <motion.div
        className="absolute inset-2 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Inner glowing circle */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 backdrop-blur-sm"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-6 rounded-full bg-primary/20 blur-xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Center content - Animated icons */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Sun icon */}
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sun className="w-6 h-6 text-amber-500 drop-shadow-lg" />
          </motion.div>
          
          {/* Main sprout/plant icon */}
          <motion.div
            className="relative z-10"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          {/* Orbiting leaf 1 */}
          <motion.div
            className="absolute top-1/2 left-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '0 0' }}
          >
            <motion.div
              className="absolute"
              style={{ left: '30px', top: '-8px' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Leaf className="w-5 h-5 text-primary" />
            </motion.div>
          </motion.div>
          
          {/* Orbiting leaf 2 */}
          <motion.div
            className="absolute top-1/2 left-1/2"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '0 0' }}
          >
            <motion.div
              className="absolute"
              style={{ left: '-35px', top: '5px' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <Leaf className="w-4 h-4 text-accent rotate-45" />
            </motion.div>
          </motion.div>
          
          {/* Sparkle effects */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.cos((i * Math.PI) / 2) * 45}px`,
                top: `${Math.sin((i * Math.PI) / 2) * 45}px`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            >
              <Sparkles className="w-3 h-3 text-primary/60" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const loadWeather = async () => {
      const data = await getWeather();
      setWeather(data);
    };
    loadWeather();
  }, []);

  const featureCards = [
    {
      id: 'chat',
      icon: MessageCircle,
      title: t('navigation.chat'),
      description: 'Get instant farming advice and solutions',
      path: '/chat',
      cardClass: 'feature-card-teal',
      iconClass: 'icon-circle-teal',
      buttonText: 'Ask Now',
    },
    {
      id: 'scan',
      icon: Camera,
      title: t('navigation.scan'),
      description: 'Scan crops to identify diseases early',
      path: '/disease',
      cardClass: 'feature-card-blue',
      iconClass: 'icon-circle-blue',
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-bg pb-24 relative overflow-hidden">
      <ParallaxBubbles />
      <ParallaxGradientMesh />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 safe-top">
        <LanguageSelector variant="full" />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-border/30 shadow-soft touch-target"
        >
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </header>

      <main className="relative z-10 px-4 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center pt-4 pb-6"
        >
          {/* Welcome Illustration */}
          <WelcomeIllustration />
          {/* Welcome Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-2"
          >
            {t('dashboard.greeting')}, {user?.name?.split(' ')[0] || 'Farmer'}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground"
          >
            Your farming companion for success
          </motion.p>
        </motion.div>

        {/* Enhanced Weather Pill */}
        {weather && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            className="mx-auto max-w-md relative"
          >
            {/* Glow effect behind the pill */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-2xl rounded-full" />
            
            <motion.div
              className="weather-pill relative backdrop-blur-xl bg-white/80 dark:bg-card/80 border border-white/50 shadow-xl"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px hsla(var(--primary), 0.2)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center justify-around py-5 px-6">
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Cloud className="w-7 h-7 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{weather.temperature}°</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {t(`weather.${weather.condition}`)}
                    </p>
                  </div>
                </motion.div>
                
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
                
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Droplets className="w-6 h-6 text-accent" />
                  </motion.div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{weather.humidity}%</p>
                    <p className="text-xs text-muted-foreground">{t('weather.humidity')}</p>
                  </div>
                </motion.div>
                
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
                
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Wind className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{weather.wind} km/h</p>
                    <p className="text-xs text-muted-foreground">{t('weather.wind')}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.6 + index * 0.15,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={`feature-card ${card.cardClass} p-6 relative overflow-hidden group`}
            >
              {/* Card glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              {/* Floating bubbles inside card */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10"
                    style={{
                      width: `${20 + i * 15}px`,
                      height: `${20 + i * 15}px`,
                      right: `${10 + i * 20}%`,
                      top: `${60 + i * 10}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>

              {/* Icon with glow */}
              <motion.div 
                className={`icon-circle ${card.iconClass} mb-6 relative`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-current opacity-20 blur-lg"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <card.icon className="w-7 h-7 relative z-10" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">{card.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed relative z-10">
                {card.description}
              </p>

              {/* Enhanced Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(card.path)}
                className="btn-dark w-full flex items-center justify-center gap-2 relative overflow-hidden group/btn"
              >
                <span className="relative z-10">{card.buttonText}</span>
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  className="relative z-10"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
