import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Volume2,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { AnalyzingAnimation } from '@/components/ui/LoadingSpinner';
import { detectDisease, DiseaseResult } from '@/api/mockApi';
import BottomNav from '@/components/navigation/BottomNav';

const FloatingParticles = () => (
  <div className="particles">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="particle" />
    ))}
  </div>
);

const DiseasePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      analyzeImage(file);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const diseaseResult = await detectDisease(file);
      setResult(diseaseResult);
    } catch {
      // Handle error
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'early':
        return {
          icon: CheckCircle,
          class: 'severity-early',
          label: t('disease.early'),
        };
      case 'moderate':
        return {
          icon: AlertTriangle,
          class: 'severity-moderate',
          label: t('disease.moderate'),
        };
      case 'severe':
        return {
          icon: XCircle,
          class: 'severity-severe',
          label: t('disease.severe'),
        };
      default:
        return {
          icon: AlertTriangle,
          class: 'severity-moderate',
          label: severity,
        };
    }
  };

  const speakResults = () => {
    if (!result || !('speechSynthesis' in window)) return;

    const lang = currentLanguage as 'en' | 'hi' | 'te';
    const text = `
      ${result.name[lang]}.
      ${t('disease.severity')}: ${getSeverityConfig(result.severity).label}.
      ${result.description[lang]}.
      ${t('disease.cureSteps')}: ${result.cureSteps[lang].join('. ')}
    `;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
    speechSynthesis.speak(utterance);
  };

  const resetScan = () => {
    setSelectedImage(null);
    setResult(null);
    setIsAnalyzing(false);
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
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {t('disease.title')}
              </h1>
              <p className="text-xs text-muted-foreground">{t('disease.subtitle')}</p>
            </div>
          </div>
          <LanguageSelector variant="compact" />
        </div>
      </header>

      <main className="relative z-10 p-4 space-y-6">
        <AnimatePresence mode="wait">
          {!selectedImage && !isAnalyzing && !result && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Upload Area */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium p-8 flex flex-col items-center gap-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="sparkle-icon"
                >
                  <Sparkles className="w-10 h-10 text-secondary" />
                </motion.div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {t('disease.title')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('disease.subtitle')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => cameraInputRef.current?.click()}
                  className="feature-card feature-card-teal p-6 flex flex-col items-center gap-4"
                >
                  <div className="icon-circle icon-circle-teal">
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className="text-base font-semibold text-foreground">
                    {t('disease.takePhoto')}
                  </span>
                  <div 
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, hsl(150 30% 20%) 0%, hsl(160 25% 25%) 100%)' }}
                  >
                    Capture
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="feature-card feature-card-blue p-6 flex flex-col items-center gap-4"
                >
                  <div className="icon-circle icon-circle-blue">
                    <Upload className="w-7 h-7" />
                  </div>
                  <span className="text-base font-semibold text-foreground">
                    {t('disease.uploadImage')}
                  </span>
                  <div 
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, hsl(150 30% 20%) 0%, hsl(160 25% 25%) 100%)' }}
                  >
                    Upload
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              </div>

              {/* Hidden Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
              />
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium overflow-hidden"
            >
              {selectedImage && (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected plant"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                </div>
              )}
              <AnalyzingAnimation text={t('disease.analyzing')} />
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Image Preview */}
              {selectedImage && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Analyzed plant"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Disease Info Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('disease.diseaseName')}
                    </p>
                    <h2 className="text-xl font-bold text-foreground mt-1">
                      {result.name[currentLanguage as 'en' | 'hi' | 'te']}
                    </h2>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={speakResults}
                    className="p-2 rounded-xl bg-primary/10 text-primary touch-target"
                  >
                    <Volume2 className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Severity Badge */}
                {(() => {
                  const config = getSeverityConfig(result.severity);
                  const Icon = config.icon;
                  return (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${config.class}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {t('disease.severity')}: {config.label}
                      </span>
                    </div>
                  );
                })()}

                {/* Confidence */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {result.confidence}%
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.description[currentLanguage as 'en' | 'hi' | 'te']}
                </p>
              </div>

              {/* Cure Steps */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium p-5 space-y-3">
                <h3 className="font-semibold text-foreground">
                  {t('disease.cureSteps')}
                </h3>
                <div className="space-y-3">
                  {result.cureSteps[currentLanguage as 'en' | 'hi' | 'te'].map(
                    (step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex gap-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <p className="text-sm text-foreground leading-relaxed">{step}</p>
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              {/* Prevention Tips */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium p-5 space-y-3">
                <h3 className="font-semibold text-foreground">
                  {t('disease.prevention')}
                </h3>
                <div className="space-y-2">
                  {result.prevention[currentLanguage as 'en' | 'hi' | 'te'].map(
                    (tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex gap-3 items-start"
                      >
                        <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              {/* Recommended Products */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-medium p-5 space-y-4">
                <h3 className="font-semibold text-foreground">
                  {t('disease.medicines')}
                </h3>
                <div className="space-y-3">
                  {result.medicines.map((medicine, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-muted/50 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{medicine.name}</p>
                        <span className="text-sm font-bold text-primary">
                          {medicine.price}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <motion.a
                          whileTap={{ scale: 0.95 }}
                          href={medicine.amazonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#FF9900] text-white text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Amazon
                        </motion.a>
                        <motion.a
                          whileTap={{ scale: 0.95 }}
                          href={medicine.flipkartLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#2874F0] text-white text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Flipkart
                        </motion.a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scan Again Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                onClick={resetScan}
                className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-white"
                style={{ background: 'linear-gradient(135deg, hsl(168 60% 42%) 0%, hsl(160 55% 38%) 100%)' }}
              >
                <RefreshCw className="w-5 h-5" />
                {t('disease.scanAgain')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default DiseasePage;
