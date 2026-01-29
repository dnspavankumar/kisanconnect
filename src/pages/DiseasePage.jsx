import React, { useState, useRef } from 'react';
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
  Leaf,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { AnalyzingAnimation } from '@/components/ui/LoadingSpinner';
import { detectDisease } from '@/api/mockApi';
import BottomNav from '@/components/navigation/BottomNav';

const DiseasePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result);
      analyzeImage(file);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (file) => {
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

  const getSeverityConfig = (severity) => {
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

    const lang = currentLanguage;
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
    <div className="min-h-screen hero-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-border safe-top shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 touch-target transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
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

      <main className="p-4 space-y-6">
        {!selectedImage && !isAnalyzing && !result && (
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="simple-card p-8 flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
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
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="feature-card feature-card-green p-6 flex flex-col items-center gap-4"
              >
                <div className="icon-circle icon-circle-green">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-base font-semibold text-foreground">
                  {t('disease.takePhoto')}
                </span>
                <div className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                  Capture
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="feature-card feature-card-brown p-6 flex flex-col items-center gap-4"
              >
                <div className="icon-circle icon-circle-brown">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-base font-semibold text-foreground">
                  {t('disease.uploadImage')}
                </span>
                <div className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                  Upload
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
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
          </div>
        )}

        {isAnalyzing && (
          <div className="simple-card overflow-hidden">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected plant"
                className="w-full h-48 object-cover"
              />
            )}
            <AnalyzingAnimation text={t('disease.analyzing')} />
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Image Preview */}
            {selectedImage && (
              <div className="simple-card overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Analyzed plant"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Disease Info Card */}
            <div className="simple-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('disease.diseaseName')}
                  </p>
                  <h2 className="text-xl font-bold text-foreground mt-1">
                    {result.name[currentLanguage]}
                  </h2>
                </div>
                <button
                  onClick={speakResults}
                  className="p-2 rounded-lg bg-primary/10 text-primary touch-target hover:bg-primary/20 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Severity Badge */}
              {(() => {
                const config = getSeverityConfig(result.severity);
                const Icon = config.icon;
                return (
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${config.class}`}
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
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {result.confidence}%
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.description[currentLanguage]}
              </p>
            </div>

            {/* Cure Steps */}
            <div className="simple-card p-5 space-y-3">
              <h3 className="font-semibold text-foreground">
                {t('disease.cureSteps')}
              </h3>
              <div className="space-y-3">
                {result.cureSteps[currentLanguage].map(
                  (step, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <p className="text-sm text-foreground leading-relaxed">{step}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Prevention Tips */}
            <div className="simple-card p-5 space-y-3">
              <h3 className="font-semibold text-foreground">
                {t('disease.prevention')}
              </h3>
              <div className="space-y-2">
                {result.prevention[currentLanguage].map(
                  (tip, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Recommended Products */}
            <div className="simple-card p-5 space-y-4">
              <h3 className="font-semibold text-foreground">
                {t('disease.medicines')}
              </h3>
              <div className="space-y-3">
                {result.medicines.map((medicine, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{medicine.name}</p>
                      <span className="text-sm font-bold text-primary">
                        {medicine.price}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={medicine.amazonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#FF9900] text-white text-sm font-medium hover:bg-[#FF9900]/90 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Amazon
                      </a>
                      <a
                        href={medicine.flipkartLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#2874F0] text-white text-sm font-medium hover:bg-[#2874F0]/90 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Flipkart
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scan Again Button */}
            <button
              onClick={resetScan}
              className="btn-primary w-full py-4 font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              {t('disease.scanAgain')}
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default DiseasePage;
