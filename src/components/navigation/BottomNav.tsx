import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Camera, Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', icon: Home, label: t('navigation.home'), path: '/dashboard' },
    { id: 'chat', icon: MessageCircle, label: t('navigation.chat'), path: '/chat' },
    { id: 'scan', icon: Camera, label: t('navigation.scan'), path: '/disease' },
    { id: 'news', icon: Newspaper, label: t('navigation.news'), path: '/news' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-border/30 safe-bottom shadow-medium">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all touch-target ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                className={`p-2 rounded-xl transition-colors ${
                  isActive ? 'bg-primary/10' : ''
                }`}
              >
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
