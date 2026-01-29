import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Camera, Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border safe-bottom shadow-md">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors touch-target min-w-0 ${
                isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] sm:text-xs font-medium truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
