import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, TrendingUp, FileText, Banknote, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { getNews, NewsItem } from '@/api/mockApi';
import BottomNav from '@/components/navigation/BottomNav';

type TabId = 'schemes' | 'news' | 'prices';

const FloatingParticles = () => (
  <div className="particles">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="particle" />
    ))}
  </div>
);

const NewsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState<TabId>('schemes');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'schemes', label: t('news.schemes'), icon: FileText },
    { id: 'news', label: t('news.agricultural'), icon: TrendingUp },
    { id: 'prices', label: t('news.marketPrices'), icon: Banknote },
  ];

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        const data = await getNews();
        setNews(data);
      } catch {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };
    loadNews();
  }, []);

  const filteredNews = news.filter((item) => {
    if (activeTab === 'schemes') return item.category === 'scheme';
    if (activeTab === 'news') return item.category === 'news';
    if (activeTab === 'prices') return item.category === 'price';
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  return (
    <div className="min-h-screen hero-bg pb-24 relative">
      <FloatingParticles />

      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/30 safe-top">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl bg-white/80 border border-border/30 touch-target shadow-soft"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <h1 className="text-lg font-semibold text-foreground">{t('news.title')}</h1>
          </div>
          <LanguageSelector variant="compact" />
        </div>

        {/* Tabs */}
        <div className="flex px-4 pb-3 gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium text-sm ${
                activeTab === tab.id
                  ? 'text-white shadow-medium'
                  : 'bg-white/80 text-muted-foreground border border-border/30'
              }`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, hsl(150 30% 20%) 0%, hsl(160 25% 25%) 100%)' } : {}}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </header>

      <main className="relative z-10 p-4 space-y-4">
        {isLoading ? (
          // Skeleton Loaders
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium p-4 space-y-3">
                <div className="skeleton h-40 w-full rounded-xl" />
                <div className="skeleton h-6 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </>
        ) : (
          <>
            {filteredNews.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-40 bg-muted">
                  <img
                    src={item.imageUrl}
                    alt={item.title[currentLanguage as 'en' | 'hi' | 'te']}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white ${
                        item.category === 'scheme'
                          ? 'bg-primary'
                          : item.category === 'price'
                          ? 'bg-secondary'
                          : 'bg-accent'
                      }`}
                    >
                      {item.category === 'scheme'
                        ? t('news.schemes')
                        : item.category === 'price'
                        ? t('news.marketPrices')
                        : t('news.agricultural')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-foreground leading-tight">
                    {item.title[currentLanguage as 'en' | 'hi' | 'te']}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.summary[currentLanguage as 'en' | 'hi' | 'te']}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-sm text-primary font-semibold"
                    >
                      {t('news.readMore')}
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}

            {filteredNews.length === 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium p-8 text-center">
                <p className="text-muted-foreground">No items found</p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default NewsPage;
