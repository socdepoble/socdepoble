import { useState } from 'react';
import { ArrowRight, Chrome, Lock, LogIn, Mail, UserPlus, UserRound } from 'lucide-react';
import BrandMark from '../../components/BrandMark';
import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';

function LoginCard({ mode, activeMode, children }) {
  return (
    <article className={`card login-card ${activeMode === mode.id ? 'login-card--active' : ''}`}>
      <div className="card__body login-card__body">{children}</div>
    </article>
  );
}

export default function LoginSection() {
  const { t } = useAppData();
  const [activeMode, setActiveMode] = useState('login');
  const MODES = [
    {
      id: 'login',
      label: t('section.login.loginButton', 'Entrar'),
      title: t('section.login.loginTitle', 'Accés al teu espai'),
      subtitle: t('section.login.loginSubtitle', 'Entra amb el teu compte per a continuar on ho vas deixar.'),
      icon: LogIn,
      meta: [
        t('section.login.meta.session', 'Sessió'),
        t('section.login.loginEmail', 'Correu electrònic'),
        t('section.login.loginPassword', 'Contrasenya')
      ]
    },
    {
      id: 'register',
      label: t('section.login.registerButton', 'Crear compte'),
      title: t('section.login.registerTitle', 'Crea un compte'),
      subtitle: t('section.login.registerSubtitle', 'Dona’t d’alta per a començar a usar el portal amb el teu perfil.'),
      icon: UserPlus,
      meta: [
        t('section.login.registerName', 'Nom'),
        t('section.login.loginEmail', 'Correu electrònic'),
        t('section.login.loginPassword', 'Contrasenya')
      ]
    },
    {
      id: 'google',
      label: t('section.login.googleButton', 'Google'),
      title: t('section.login.googleTitle', 'Accés amb Google'),
      subtitle: t('section.login.googleSubtitle', 'Entra de manera ràpida amb el teu compte de Google.'),
      icon: Chrome,
      meta: [
        t('section.login.meta.oauth', 'OAuth'),
        'Google',
        t('section.login.meta.quick', 'Accés ràpid')
      ]
    }
  ];
  const currentMode = MODES.find((item) => item.id === activeMode) || MODES[0];

  return (
    <SectionChrome
      kicker={t('section.login.kicker', 'Accés')}
      title={t('section.login.title', 'Login, registre i Google')}
      subtitle={t('section.login.subtitle', 'Accés al portal per a entrar, crear un compte o continuar amb Google.')}
      meta={[t('nav.login', 'Accés'), t('section.login.meta.account', 'Compte'), t('section.login.meta.google', 'Google')]}
    >
      <div className="login-layout">
        <div className="login-switcher" role="tablist" aria-label="Opcions d’accés">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                className={`pill ${activeMode === mode.id ? 'pill--active' : ''}`}
                onClick={() => setActiveMode(mode.id)}
                role="tab"
                aria-selected={activeMode === mode.id}
              >
                <Icon size={16} />
                {mode.label}
              </button>
            );
          })}
        </div>

        <section className="card login-hero">
          <div className="login-hero__brand">
            <BrandMark />
          </div>
          <div className="login-hero__copy">
            <span className="pill pill--active">{t('section.login.private', 'Accés privat')}</span>
            <h2 className="card__title">{currentMode.title}</h2>
            <p className="card__text">{currentMode.subtitle}</p>
            <div className="section-hero__meta">
              {currentMode.meta.map((item) => (
                <span key={item} className="pill">{item}</span>
              ))}
            </div>
          </div>
          <div className="login-hero__note">
            <strong>{t('section.login.heroTitle', 'El teu accés, en un sol lloc.')}</strong>
            <p>{t('section.login.heroText', 'Entra, crea el teu compte o continua amb Google segons el que et vaja millor.')}</p>
          </div>
        </section>

        <div className="login-grid">
          <LoginCard mode={MODES[0]} activeMode={activeMode}>
            <form className="login-form" onSubmit={(event) => event.preventDefault()}>
              <div className="login-form__head">
                <LogIn size={18} />
                <h3 className="card__title">{t('section.login.loginTitle', 'Entrar')}</h3>
              </div>
              <p className="card__text">{t('section.login.loginSubtitle', 'Accedeix al teu compte i recupera la teua sessió.')}</p>

              <label className="login-field">
                <span>{t('section.login.loginEmail', 'Correu electrònic')}</span>
                <input className="section-search" type="email" name="email" placeholder={t('section.login.placeholder.email', 'nom@exemple.com')} autoComplete="email" />
              </label>

              <label className="login-field">
                <span>{t('section.login.loginPassword', 'Contrasenya')}</span>
                <input className="section-search" type="password" name="password" placeholder={t('section.login.placeholder.password', '••••••••')} autoComplete="current-password" />
              </label>

              <button type="submit" className="pill pill--primary login-action">
                {t('section.login.loginButton', 'Entrar')}
                <ArrowRight size={16} />
              </button>
            </form>
          </LoginCard>

          <LoginCard mode={MODES[1]} activeMode={activeMode}>
            <form className="login-form" onSubmit={(event) => event.preventDefault()}>
              <div className="login-form__head">
                <UserPlus size={18} />
                <h3 className="card__title">{t('section.login.registerTitle', 'Crear compte')}</h3>
              </div>
              <p className="card__text">{t('section.login.registerSubtitle', 'Obri un compte nou per a tindre el teu espai propi.')}</p>

              <label className="login-field">
                <span>{t('section.login.registerName', 'Nom')}</span>
                <input className="section-search" type="text" name="name" placeholder={t('section.login.placeholder.name', 'Nom i cognoms')} autoComplete="name" />
              </label>

              <label className="login-field">
                <span>{t('section.login.loginEmail', 'Correu electrònic')}</span>
                <input className="section-search" type="email" name="email" placeholder={t('section.login.placeholder.email', 'nom@exemple.com')} autoComplete="email" />
              </label>

              <label className="login-field">
                <span>{t('section.login.loginPassword', 'Contrasenya')}</span>
                <input className="section-search" type="password" name="password" placeholder={t('section.login.placeholder.newPassword', 'Tria una clau')} autoComplete="new-password" />
              </label>

              <button type="submit" className="pill pill--primary login-action">
                {t('section.login.registerButton', 'Crear compte')}
                <ArrowRight size={16} />
              </button>
            </form>
          </LoginCard>

          <LoginCard mode={MODES[2]} activeMode={activeMode}>
            <div className="login-form">
              <div className="login-form__head">
                <Chrome size={18} />
                <h3 className="card__title">{t('section.login.googleTitle', 'Google')}</h3>
              </div>
              <p className="card__text">{t('section.login.googleSubtitle', 'Accés ràpid amb Google per a entrar en un clic.')}</p>

              <div className="login-google">
                <button type="button" className="pill pill--primary login-action">
                  <Chrome size={16} />
                  {t('section.login.googleButton', 'Continuar amb Google')}
                </button>
                <p className="login-note">{t('section.login.googleNote', 'Opció pensada per a un accés més ràpid i còmode.')}</p>
              </div>

              <div className="login-summary">
                <div className="login-summary__item">
                  <UserRound size={16} />
                  <span>{t('section.login.summary.futureUser', 'Usuari futur')}</span>
                </div>
                <div className="login-summary__item">
                  <Mail size={16} />
                  <span>{t('section.login.summary.verifiableEmail', 'Correu verificable')}</span>
                </div>
                <div className="login-summary__item">
                  <Lock size={16} />
                  <span>{t('section.login.summary.protectedAccess', 'Accés protegit')}</span>
                </div>
              </div>
            </div>
          </LoginCard>
        </div>
      </div>
    </SectionChrome>
  );
}
