import { lazy, Suspense, useEffect, useLayoutEffect, useRef, memo, StrictMode } from 'react';
import { Navigate, NavLink, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Globe, MoonStar, Plus, Search, Settings, Sun, UserRound } from '../icons.jsx';
import BrandMark from '../components/BrandMark';
import { useAppData } from './AppDataContext';
import { APP_NAME } from '../config/app';
import { DEFAULT_SECTION_PATH, SECTIONS, SECTION_ORDER } from '../config/sections';
import { getSectionLabels } from '../config/i18n';
import { IaiaIcon, UniversalPage } from '../components/universal/UniversalComponents';
import { recullTornadaOAuth } from '../data/backendPort.js';
import { reclamaContingutDelConvidat } from '../data/identitat.js';
import { showToast } from '../components/universal/AvisadorEfimer';
import { delVal } from '../config/storage';

const XatSection = lazy(() => import('../sections/xat/XatSection'));
const MurSection = lazy(() => import('../sections/mur/MurSection'));
const MercatSection = lazy(() => import('../sections/mercat/MercatSection'));
const PoblesSection = lazy(() => import('../sections/pobles/PoblesSection'));
const PoblacioSection = lazy(() => import('../sections/poblacio/PoblacioSection'));
const MultimediaSection = lazy(() => import('../sections/multimedia/MultimediaSection'));
const NotesSection = lazy(() => import('../sections/notes/NotesSection'));
const DevicesSection = lazy(() => import('../sections/dispositius/DevicesSection'));
const ConnectarSection = lazy(() => import('../sections/connectar/ConnectarSection'));
const ControlSection = lazy(() => import('../sections/control/ControlSection'));
const LoginSection = lazy(() => import('../sections/login/LoginSection'));

const TranslationsSection = lazy(() => import('../sections/translations/TranslationsSection'));
const TextSection = lazy(() => import('../sections/text/TextSection'));
const DesignSection = lazy(() => import('../sections/disseny/DesignSection'));
const SearchSection = lazy(() => import('../sections/search/SearchSection'));
const ProfileSection = lazy(() => import('../sections/profile/ProfileSection'));
const MyProfileSection = lazy(() => import('../sections/profile/MyProfileSection'));
const ItemDetailSection = lazy(() => import('../sections/detail/ItemDetailSection'));
const PageDetailSection = lazy(() => import('../sections/detail/PageDetailSection'));
const RealitatSection = lazy(() => import('../sections/realitat/RealitatSection'));
import NotFoundPage from '../pages/NotFoundPage';

const ALL_NAV_SECTIONS = SECTIONS.filter((section) => SECTION_ORDER.includes(section.id));
const NAV_SECTIONS = ALL_NAV_SECTIONS.filter(s => s.id !== 'versions' && s.id !== 'legal');
const SYSTEM_SECTIONS = ALL_NAV_SECTIONS.filter(s => s.id === 'versions' || s.id === 'legal');

const MOBILE_NAV_LEADING = NAV_SECTIONS.slice(0, 2);
const MOBILE_NAV_TRAILING = NAV_SECTIONS.slice(2, 4);

function RouteFallback() {
  const { t } = useAppData();
  return (
    <div className="sdp-route-loading-screen" role="status" aria-live="polite" aria-label="Carregant secció">
      <div className="sdp-route-loading-screen__glow sdp-route-loading-screen__glow--left" />
      <div className="sdp-route-loading-screen__glow sdp-route-loading-screen__glow--right" />
      <div className="sdp-route-loading-screen__panel">
        <BrandMark variant="light" className="sdp-route-loading-screen__logo" />
        <strong className="sdp-route-loading-screen__title">{APP_NAME}</strong>
        <span className="sdp-route-loading-screen__subtitle">{t('loading.content', 'Carregant contingut del poble...')}</span>
        <div className="sdp-route-loading-screen__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function AppShell({ children, mobileNav }) {
  const { language, t, status, themeMode, externalConfig } = useAppData();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const contentRef = useRef(null);
  
  // Pull to Refresh logic optimitzat natiu
  const indicatorRef = useRef(null);
  const PULL_THRESHOLD = 100;

  // Restaurar el focus a main en canviar de ruta (A11y)
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus({ preventScroll: true });
    }
  }, [location.pathname]);

  useEffect(() => {
    delVal('socdepoble-app-snapshot-v1');
    delVal('socdepoble-section-submissions-v1');
  }, []);

  const tornadaFeta = useRef(false);
  useEffect(() => {
    if (tornadaFeta.current) return;
    tornadaFeta.current = true;
    recullTornadaOAuth(externalConfig)
      .then((sessio) => { if (sessio) showToast(t('section.login.success.login', 'Benvingut de nou!'), 'success'); })
      .catch((e) => showToast(e.message, 'error'));
  }, [externalConfig, t]);

  useEffect(() => {
    const onCanviAuth = (e) => {
      const id = e?.detail?.user?.id;
      if (!id) return;
      reclamaContingutDelConvidat(String(id))
        .then(({ migrat }) => { if (migrat) window.dispatchEvent(new CustomEvent('sdp:refresh-data')); })
        .catch(() => {});
    };
    window.addEventListener('sdp:auth-change', onCanviAuth);

    const onRebuig = (e) => {
      showToast(t('error.rejected', `La publicació ha sigut rebutjada: ${e.detail.error}`), 'error');
    };
    const onXatRebuig = (e) => {
      showToast(t('error.chat.rejected', `El missatge no s'ha pogut enviar: ${e.detail.error}`), 'error');
    };
    window.addEventListener('sdp:submission-rejected', onRebuig);
    window.addEventListener('sdp:chat-rejected', onXatRebuig);

    return () => {
      window.removeEventListener('sdp:auth-change', onCanviAuth);
      window.removeEventListener('sdp:submission-rejected', onRebuig);
      window.removeEventListener('sdp:chat-rejected', onXatRebuig);
    };
  }, [t]);

  useLayoutEffect(() => {
    if (mainRef.current) {
      const rootNode = mainRef.current.getRootNode();
      if (rootNode instanceof ShadowRoot) {
        rootNode.host.setAttribute('data-theme', themeMode || 'light');
      } else {
        document.documentElement.setAttribute('data-theme', themeMode || 'light');
      }
    }
  }, [themeMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (mainRef.current) {
        const rootNode = mainRef.current.getRootNode();
        const host = rootNode instanceof ShadowRoot ? rootNode.host : document.documentElement;
        host.setAttribute('lang', language || 'ca');
      }
    }
  }, [language]);

  useEffect(() => {
    const mainEl = mainRef.current;
    const contentEl = contentRef.current;
    const indicatorEl = indicatorRef.current;
    if (!mainEl || !contentEl || !indicatorEl) return;

    let pullStart = null;
    let pullDistance = 0;
    let rafId = null;
    let state = ''; // '', 'pulling', 'ready'

    const updateUI = (distance, newState) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const translateY = Math.min(distance, PULL_THRESHOLD + 40);
        contentEl.style.transform = `translateY(${translateY}px)`;
        indicatorEl.style.transform = `translateY(${translateY}px)`;
        
        if (state !== newState) {
          state = newState;
          if (state === 'ready') {
            indicatorEl.innerText = t('pull.release', 'Deixa anar per recarregar...');
          } else if (state === 'pulling') {
            indicatorEl.innerText = t('pull.pull', 'Estira per recarregar...');
          } else {
            indicatorEl.innerText = '';
          }
        }
        rafId = null;
      });
    };

    const onTouchStart = (e) => {
      if (mainEl.scrollTop === 0) {
        pullStart = e.touches[0].clientY;
        pullDistance = 0;
        contentEl.style.transition = 'none';
        indicatorEl.style.transition = 'none';
      } else {
        pullStart = null;
      }
    };

    const onTouchMove = (e) => {
      if (pullStart === null) return;
      const y = e.touches[0].clientY;
      const distance = y - pullStart;
      if (distance > 0) {
        if (e.cancelable) e.preventDefault();
        pullDistance = distance;
        updateUI(distance, distance > PULL_THRESHOLD ? 'ready' : 'pulling');
      }
    };

    const onTouchEnd = () => {
      if (pullStart === null) return;
      if (pullDistance > PULL_THRESHOLD) {
        window.dispatchEvent(new CustomEvent('sdp:refresh-data', { bubbles: true, composed: true }));
      }
      pullStart = null;
      pullDistance = 0;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      state = '';
      contentEl.style.transition = 'transform 0.3s ease-out';
      contentEl.style.transform = 'translateY(0px)';
      indicatorEl.style.transition = 'transform 0.3s ease-out';
      indicatorEl.style.transform = 'translateY(0px)';
      indicatorEl.innerText = '';
    };

    mainEl.addEventListener('touchstart', onTouchStart, { passive: true });
    mainEl.addEventListener('touchmove', onTouchMove, { passive: false });
    mainEl.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      mainEl.removeEventListener('touchstart', onTouchStart);
      mainEl.removeEventListener('touchmove', onTouchMove);
      mainEl.removeEventListener('touchend', onTouchEnd);
    };
  }, [t]);

  return (
    <>
      <nav id="app-sidebar" className="app-sidebar" aria-label="Navegació principal">
        <button type="button" className="brand sdp-cursor-pointer sdp-unstyled-btn" aria-label="Obrir o tancar menú Sóc de Poble" onClick={(e) => {
          const root = e.target.getRootNode();
          const sidebar = root.querySelector('.app-sidebar') || document.querySelector('.app-sidebar');
          const host = root instanceof ShadowRoot ? root.host : document.body;
          sidebar?.classList.toggle('sidebar-open');
          host.classList.toggle('sidebar-closed');
        }}>
          <BrandMark className="app-brand__mark" />
        </button>

        <button
          type="button"
          className="sidebar-control-btn"
          onClick={() => navigate('/control')}
        >
          <Settings className="icona-linia" size={24} strokeWidth={2.1} aria-hidden="true" focusable="false" />
          <span className="nav-item__text">PANELL DE CONTROL</span>
        </button>

        <div className="app-sidebar-nav" aria-label="Seccions">
          {NAV_SECTIONS.map((section) => {
            const Icon = section.icon;
            const labels = getSectionLabels(section.id, language);
            return (
              <NavLink key={section.id} to={section.path} className="nav-item" aria-label={labels.label}>
                <Icon className="icona-linia" strokeWidth={2.1} size={24} aria-hidden="true" focusable="false" />
                <span className="nav-item__text">
                  {labels.label}
                </span>
              </NavLink>
            );
          })}
          
          <div className="app-sidebar-nav-footer">
            {SYSTEM_SECTIONS.map((section) => {
              const Icon = section.icon;
              const labels = getSectionLabels(section.id, language);
              return (
                <NavLink key={section.id} to={section.path} className="nav-item nav-item--system" aria-label={labels.label}>
                  <Icon className="icona-linia" strokeWidth={2.1} size={24} aria-hidden="true" focusable="false" />
                  <span className="nav-item__text">
                    {labels.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      <main 
        id="main-content"
        ref={mainRef}
        tabIndex="-1"
        className="app-main" 
        aria-busy={status === 'loading' ? 'true' : 'false'}
      >
        <TopBar />
        
        <div 
          ref={indicatorRef}
          className="pull-to-refresh-indicator sdp-ptr-indicator" 
          aria-hidden="true"
        >
        </div>

        <div ref={contentRef} className="app-main-content">
          {children}
        </div>
      </main>

      {mobileNav}
    </>
  );
}

const TopBar = memo(function TopBar() {
  const navigate = useNavigate();
  const { t, themeMode, toggleTheme, currentUser } = useAppData();
  const navigateWithTransition = (path) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !prefersReducedMotion) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  };

  return (
    <header className="bar-black">
      <button type="button" className="mobile-logo-wrapper sdp-unstyled-btn" aria-label="Obrir menú" onClick={(e) => {
        const root = e.target.getRootNode();
        const sidebar = root.querySelector('.app-sidebar') || document.querySelector('.app-sidebar');
        const host = root instanceof ShadowRoot ? root.host : document.body;
        sidebar?.classList.toggle('sidebar-open');
        host.classList.toggle('sidebar-closed');
      }}>
        <BrandMark variant="light" className="mobile-logo" />
      </button>

      <div className="right-icons">
        <button type="button" className="icon sdp-top-bar-btn" onClick={() => navigateWithTransition('/traduccions')} aria-label={t('nav.idioma', 'Idioma')} title={t('nav.idioma', 'Idioma')}>
          <Globe aria-hidden="true" focusable="false" />
        </button>
        <button type="button" className="icon sdp-top-bar-btn" onClick={() => navigateWithTransition('/realitat')} aria-label="IAIA" title="IAIA">
          <IaiaIcon className="iaia-icon" />
        </button>
        <button type="button" className="icon sdp-top-bar-btn" onClick={() => navigateWithTransition('/cerca')} aria-label={t('nav.cerca', 'Cerca')} title={t('nav.cerca', 'Cerca')}>
          <Search aria-hidden="true" focusable="false" />
        </button>
        <button type="button" className="icon sdp-top-bar-btn" onClick={toggleTheme} aria-label={t('nav.tema', 'Tema')} title={t('nav.tema', 'Tema')}>
          {themeMode === 'dark' ? <Sun aria-hidden="true" focusable="false" /> : <MoonStar aria-hidden="true" focusable="false" />}
        </button>
        <button type="button" className="icon sdp-top-bar-btn" onClick={() => navigateWithTransition(currentUser ? '/el-meu-perfil' : '/login')} aria-label={t('nav.perfil', 'Perfil')} title={t('nav.perfil', 'Perfil')}>
          <UserRound aria-hidden="true" focusable="false" />
        </button>
      </div>
    </header>
  );
});

function TextRoute({ pageKey }) {
  const { pageCopy } = useAppData();
  const page = pageCopy?.[pageKey];
  if (!page) {
    return <Navigate to={DEFAULT_SECTION_PATH} replace />;
  }
  return (
    <Suspense fallback={<RouteFallback />}>
      <TextSection page={page} pageKey={pageKey} />
    </Suspense>
  );
}


function LegacySectionDetailRedirect({ sectionId }) {
  const { itemId } = useParams();
  return <Navigate to={`/${sectionId}/${itemId}`} replace />;
}

function ThreadRedirect() {
  const { threadId } = useParams();
  return <Navigate to={`/xat/${threadId}`} replace />;
}

function LoadError() {
  const { error, isBackendConfigurat, dataMode, t } = useAppData();
  return (
    <UniversalPage
      title={t('error.loadPortal', "No s'ha pogut carregar el portal")}
      subtitle={error?.message || (isBackendConfigurat ? 'Error desconegut.' : "No s'ha configurat el backend.")}
      labels={['Error', isBackendConfigurat ? 'Xarxa Remota' : dataMode || 'desconnectat']}
    />
  );
}

export default function App() {
  useEffect(() => {
    // Inject global styles to fix #root height dynamically via HMR without requiring a hard refresh
    if (typeof document !== 'undefined') {
      let style = document.getElementById('sdp-hmr-layout-fix');
      if (!style) {
        style = document.createElement('style');
        style.id = 'sdp-hmr-layout-fix';
        document.head.appendChild(style);
      }
      style.textContent = `
        html, body { height: 100%; width: 100%; margin: 0; padding: 0; }
        #root { height: 100%; width: 100%; display: flex; flex-direction: column; }
      `;
    }
  }, []);

  return (
    <StrictMode>
      <style>{`
        :host { height: 100% !important; display: block !important; }
        .sdp-root { height: 100% !important; display: flex !important; flex-direction: row !important; }
        .app-main { flex: 1 1 0% !important; min-height: 0 !important; }
      `}</style>
      <AppShell mobileNav={<MobileNav />}>
        <AppContent />
      </AppShell>
    </StrictMode>
  );
}

function AppContent() {
  const { status } = useAppData();

  if (status === 'loading') return <RouteFallback />;
  if (status === 'error') return <LoadError />;
  return <AppRoutes />;
}

function AppRoutes() {
  const { agents = [] } = useAppData();
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to={DEFAULT_SECTION_PATH} replace />} />
        <Route path="/xat" element={<XatSection />} />
        <Route path="/xat/:threadId" element={<XatSection />} />
        <Route path="/chat" element={<Navigate to="/xat" replace />} />
        <Route path="/chat/:threadId" element={<ThreadRedirect />} />
        <Route path="/chats" element={<Navigate to="/xat" replace />} />
        <Route path="/chats/:threadId" element={<ThreadRedirect />} />
        <Route path="/mur" element={<MurSection />} />
        <Route path="/post/:itemId" element={<LegacySectionDetailRedirect sectionId="mur" />} />
        <Route path="/mercat" element={<MercatSection />} />
        <Route path="/multimedia" element={<MultimediaSection />} />
        <Route path="/pobles" element={<PoblesSection />} />
        <Route path="/poblacio" element={<PoblacioSection />} />
        <Route path="/events" element={<Navigate to="/mur" replace />} />
        <Route path="/calendar" element={<Navigate to="/mur" replace />} />
        <Route path="/calendari" element={<Navigate to="/mur" replace />} />
        <Route path="/mapa" element={<Navigate to="/mur" replace />} />
        <Route path="/notes" element={<NotesSection />} />
        <Route path="/dispositius" element={<DevicesSection />} />
        <Route path="/connectivitat" element={<Navigate to="/dispositius" replace />} />
        <Route path="/cerca" element={<SearchSection />} />
        <Route path="/login" element={<LoginSection />} />
        <Route path="/accedir" element={<Navigate to="/login" replace />} />
        <Route path="/registre" element={<Navigate to="/login" replace />} />
        <Route path="/crear-compte" element={<Navigate to="/login" replace />} />
        <Route path="/el-meu-perfil" element={<MyProfileSection />} />
        <Route path="/perfil" element={<ProfileSection agents={agents} />} />
        <Route path="/perfil/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/gent/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/empresa/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/ajuntament/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/grup/:agentId" element={<ProfileSection agents={agents} />} />
          
          <Route path="/control" element={<ControlSection />} />
          <Route path="/connectar" element={<ConnectarSection agents={agents} />} />
          <Route path="/projecte" element={<TextRoute pageKey="projecte" />} />
          <Route path="/page/:slug" element={<PageDetailSection />} />
          <Route path="/el-projecte" element={<Navigate to="/projecte" replace />} />
          <Route path="/skills" element={<TextRoute pageKey="skills" />} />
          <Route path="/constitucio" element={<TextRoute pageKey="constitucio" />} />
          <Route path="/disseny" element={<DesignSection />} />

          <Route path="/legal" element={<TextRoute pageKey="legal" />} />
          <Route path="/roadmap" element={<TextRoute pageKey="roadmap" />} />
          <Route path="/ruta" element={<Navigate to="/roadmap" replace />} />
          <Route path="/versions" element={<TextRoute pageKey="versions" />} />
          <Route path="/traduccions" element={<TranslationsSection />} />
          <Route path="/realitat" element={<RealitatSection />} />
          <Route path="/ia" element={<TextRoute pageKey="anima" />} />
          <Route path="/anima" element={<Navigate to="/ia" replace />} />
          <Route path="/iaia" element={<Navigate to="/xat/iaia-maria" replace />} />
          <Route path="/:sectionId/:itemId" element={<ItemDetailSection />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
  );
}

const MobileNav = memo(function MobileNav() {
  const { language, t } = useAppData();
  const navigate = useNavigate();
  return (
      <nav className="mobile-nav" aria-label="Navegació mòbil">
        {MOBILE_NAV_LEADING.map((section) => {
          const Icon = section.icon;
          const labels = getSectionLabels(section.id, language);
          return (
            <NavLink key={section.id} to={section.path} className="nav-item" aria-label={labels.label}>
              <Icon className="nav-item__icon" strokeWidth={2.1} aria-hidden="true" focusable="false" />
              <span className="nav-item__text">
                <strong>{labels.shortLabel}</strong>
              </span>
            </NavLink>
          );
        })}
        <button type="button" className="mobile-nav__cta" onClick={() => {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (document.startViewTransition && !prefersReducedMotion) {
            document.startViewTransition(() => navigate('/connectar'));
          } else {
            navigate('/connectar');
          }
        }} aria-label={t('nav.connectar', 'Connectar')}>
          <Plus size={20} strokeWidth={2.8} />
        </button>
        {MOBILE_NAV_TRAILING.map((section) => {
          const Icon = section.icon;
          const labels = getSectionLabels(section.id, language);
          return (
            <NavLink key={section.id} to={section.path} className="nav-item" aria-label={labels.label}>
              <Icon className="nav-item__icon" strokeWidth={2.1} aria-hidden="true" focusable="false" />
              <span className="nav-item__text">
                <strong>{labels.shortLabel}</strong>
              </span>
            </NavLink>
          );
        })}
      </nav>
  );
});
