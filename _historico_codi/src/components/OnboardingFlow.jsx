import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Heart, Shield, Users, Zap, Check, ArrowLeft, UserPlus, User } from 'lucide-react';
import { logger } from '../utils/logger';
import './OnboardingFlow.css';

/**
 * 🏺 ONBOARDING FLOW [v10.33.16]
 * Primera experiència d'usuari - Clara, ràpida i amb trellat.
 */
const OnboardingFlow = ({ onComplete }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    onboardingMode: 'user', // 'user' o 'net' (familiar)
    iaiaLevel: 1,
    notifications: true,
    theme: 'auto',
    accessibility: true // Per defecte activada per neuroergonomia
  });

  // [DAD] Passos d'onboarding
  const steps = useMemo(() => [
    {
      id: 'welcome',
      title: t('onboarding.welcome.title', 'Benvingut a Sóc de Poble'),
      description: t('onboarding.welcome.desc', 'La xarxa social rural que batega amb tu.'),
      icon: <Sparkles size={48} className="text-primary" />,
      features: [
        { icon: <Heart size={20} />, text: t('onboarding.welcome.f1', 'Comunitat real, sense algoritmes') },
        { icon: <Shield size={20} />, text: t('onboarding.welcome.f2', 'Les teues dades són teues') },
        { icon: <Users size={20} />, text: t('onboarding.welcome.f3', 'Connecta amb el teu poble') },
        { icon: <Zap size={20} />, text: t('onboarding.welcome.f4', 'Funciona offline, sempre') }
      ]
    },
    {
      id: 'mode_selection',
      title: t('onboarding.mode.title', 'Qui configura el dispositiu?'),
      description: t('onboarding.mode.desc', 'Tria com vols configurar l\'experiència.'),
      icon: <Users size={48} className="text-blue-500" />,
      modeOptions: [
        { id: 'user', title: t('onboarding.mode.user', "Sóc l'usuari"), desc: t('onboarding.mode.userdesc', 'Configuració personal'), icon: <User size={24} /> },
        { id: 'net', title: t('onboarding.mode.net', 'Sóc un familiar (Mode Nét)'), desc: t('onboarding.mode.netdesc', 'Configuració guiada i adaptada per a majors (Trellat màxim)'), icon: <UserPlus size={24} /> }
      ]
    },
    {
      id: 'iaia',
      title: t('onboarding.iaia.title', 'La IAIA, la teua guia'),
      description: t('onboarding.iaia.desc', 'Com vols que la IAIA t\'acompanye?'),
      icon: <Sparkles size={48} className="text-iaia text-blue-500" />,
      options: [
        { level: 0, title: t('onboarding.iaia.l0', 'Només Humans'), desc: t('onboarding.iaia.l0desc', 'Sense IA, només veïns reals') },
        { level: 1, title: t('onboarding.iaia.l1', 'Assistent'), desc: t('onboarding.iaia.l1desc', 'Ajuda amb tràmits i recordatoris') },
        { level: 2, title: t('onboarding.iaia.l2', 'Immersiu'), desc: t('onboarding.iaia.l2desc', 'Personalitat completa amb històries') }
      ]
    },
    {
      id: 'privacy',
      title: t('onboarding.privacy.title', 'Privacitat i Control'),
      description: t('onboarding.privacy.desc', 'Tu decides què compartir i què no.'),
      icon: <Shield size={48} className="text-success text-emerald-500" />,
      toggles: [
        { key: 'notifications', label: t('onboarding.privacy.t1', 'Notificacions push'), default: true },
        { key: 'accessibility', label: t('onboarding.privacy.t2', 'Mode accessibilitat'), default: false }
      ]
    },
    {
      id: 'complete',
      title: t('onboarding.complete.title', 'Tot llest!'),
      description: t('onboarding.complete.desc', 'El poble t\'espera. Comença a bategar!'),
      icon: <Check size={48} className="text-success text-emerald-500" />
    }
  ], [t]);

  // [COMPLETE] Finalitzar onboarding
  const handleComplete = useCallback(async () => {
    try {
      // Guardar preferències
      localStorage.setItem('sp_onboarding_complete', 'true');
      localStorage.setItem('sp_onboarding_mode', preferences.onboardingMode);
      localStorage.setItem('sp_iaia_level', String(preferences.iaiaLevel));
      localStorage.setItem('sp_notifications', String(preferences.notifications));
      localStorage.setItem('sp_accessibility', String(preferences.accessibility));

      logger.info('[Onboarding] Completat amb èxit', preferences);

      if (onComplete) {
        onComplete(preferences);
      } else {
        navigate('/mur');
      }
    } catch (error) {
      logger.error('[Onboarding] Error completant:', error);
    }
  }, [preferences, onComplete, navigate]);

  // [NAV] Anar al següent pas
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, steps.length, handleComplete]);

  // [NAV] Tornar al pas anterior
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // [INPUT] Actualitzar preferències
  const handlePreferenceChange = useCallback((key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="onboarding-overlay fixed inset-0 bg-black/90 backdrop-blur-md z-modal flex items-center justify-center p-4">
      <div 
        className="onboarding-container w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* [PROGRESS] Barra de progrés */}
        <div className="onboarding-progress h-1 bg-gray-200 dark:bg-white/10">
          <div 
            className="h-full bg-blue-600 dark:bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        {/* [CONTENT] Contingut del pas actual */}
        <div className="onboarding-content p-8 text-gray-900 dark:text-white">
          {/* Icon */}
          <div className="onboarding-icon mb-6 flex justify-center">
            {step.icon}
          </div>

          {/* Title */}
          <h2 
            id="onboarding-title"
            className="onboarding-title text-2xl font-black text-center mb-3 text-gray-900 dark:text-white"
          >
            {step.title}
          </h2>

          {/* Description */}
          <p className="onboarding-description text-center text-gray-600 dark:text-gray-400 mb-8">
            {step.description}
          </p>

          {/* [FEATURES] Llista de característiques (pas 1) */}
          {step.features && (
            <div className="onboarding-features space-y-4 mb-8">
              {step.features.map((feature, index) => (
                <div 
                  key={index}
                  className="onboarding-feature flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5"
                >
                  <span className="text-blue-600 dark:text-primary">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* [MODE OPTIONS] Selector de Mode Nét (pas 2) */}
          {step.modeOptions && (
            <div className="onboarding-options space-y-3 mb-8">
              {step.modeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    handlePreferenceChange('onboardingMode', opt.id);
                    if (opt.id === 'net') {
                      handlePreferenceChange('accessibility', true);
                      handlePreferenceChange('iaiaLevel', 1);
                    }
                  }}
                  className={`onboarding-option w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                    preferences.onboardingMode === opt.id
                      ? 'border-blue-600 dark:border-primary bg-blue-50 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-blue-600/50'
                  }`}
                  aria-pressed={preferences.onboardingMode === opt.id}
                >
                  <div className={`text-${preferences.onboardingMode === opt.id ? 'blue-600' : 'gray-500'}`}>
                    {opt.icon}
                  </div>
                  <div>
                    <div className="font-bold text-xl mb-1">{opt.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* [OPTIONS] Selector de nivell IAIA (pas 3) */}
          {step.options && (
            <div className="onboarding-options space-y-3 mb-8">
              {step.options.map((option) => (
                <button
                  key={option.level}
                  onClick={() => handlePreferenceChange('iaiaLevel', option.level)}
                  className={`onboarding-option w-full p-4 rounded-xl border text-left transition-all min-h-[80px] ${
                    preferences.iaiaLevel === option.level
                      ? 'border-blue-600 dark:border-primary bg-blue-50 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-blue-600/50'
                  }`}
                  aria-pressed={preferences.iaiaLevel === option.level}
                >
                  <div className="font-bold text-xl">{option.title}</div>
                  <div className="text-md text-gray-600 dark:text-gray-400 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* [TOGGLES] Interruptors (pas 3) */}
          {step.toggles && (
            <div className="onboarding-toggles space-y-4 mb-8">
              {step.toggles.map((toggle) => (
                <label
                  key={toggle.key}
                  className="onboarding-toggle flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 cursor-pointer"
                >
                  <span className="font-medium">{toggle.label}</span>
                  <input
                    type="checkbox"
                    checked={preferences[toggle.key]}
                    onChange={(e) => handlePreferenceChange(toggle.key, e.target.checked)}
                    className="toggle-checkbox sr-only"
                    aria-label={toggle.label}
                  />
                  <div className={`toggle-switch ${preferences[toggle.key] ? 'active' : ''}`} />
                </label>
              ))}
            </div>
          )}

          {/* [COMPLETE] Missatge final (pas 4) */}
          {step.id === 'complete' && (
            <div className="onboarding-complete text-center mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {t('onboarding.complete.message', 'Les teues preferències han estat guardades.')}
              </p>
              <div className="onboarding-badges flex justify-center gap-2">
                <span className="badge-success px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  ✓ Privacitat Activada
                </span>
                <span className="badge-info px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  ✓ IAIA Configurada
                </span>
              </div>
            </div>
          )}
        </div>

        {/* [NAVIGATION] Botons de navegació */}
        <div className="onboarding-navigation p-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`onboarding-back flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            aria-label={t('common.back', 'Enrere')}
          >
            <ArrowLeft size={18} />
            {t('common.back', 'Enrere')}
          </button>

          {/* Next/Complete Button */}
          <button
            onClick={handleNext}
            className="onboarding-next flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-blue-600 dark:bg-primary text-white dark:text-black hover:opacity-90 transition-all shadow-lg"
            aria-label={currentStep === steps.length - 1 ? t('common.finish', 'Finalitzar') : t('common.next', 'Següent')}
          >
            {currentStep === steps.length - 1 ? (
              <>
                {t('common.finish', 'Finalitzar')}
                <Check size={18} />
              </>
            ) : (
              <>
                {t('common.next', 'Següent')}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
