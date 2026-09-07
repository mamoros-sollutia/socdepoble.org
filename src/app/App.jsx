import React, { lazy, Suspense, useEffect, useRef, memo, StrictMode } from 'react';
import { Navigate, NavLink, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Globe, MoonStar, Plus, Search, Settings, Sun, UserRound } from '../icons.jsx';
import BrandMark from '../components/BrandMark';
import { APP_NAME } from '../config/app';
import { DEFAULT_SECTION_PATH, SECTIONS, SECTION_ORDER } from '../config/sections';
import { getSectionLabels } from '../config/i18n';
import { IaiaIcon, UniversalPage } from '../components/universal/UniversalComponents';
import { recullTornadaOAuth } from '../data/backendPort.js';
import { reclamaContingutDelConvidat } from '../data/identitat.js';
import { showToast } from '../components/universal/AvisadorEfimer';
import { delVal } from '../config/storage';
import { useIdentitat } from './contexts/IdentitatContext';

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
const OnboardingSection = lazy(() => import('../sections/onboarding/OnboardingSection'));

const TranslationsSection = lazy(() => import('../sections/translations/TranslationsSection'));
const TextSection = lazy(() => import('../sections/text/TextSection'));
const DesignSection = lazy(() => import('../sections/disseny/DesignSection'));
const SearchSection = lazy(() => import('../sections/search/SearchSection'));
const ProfileSection = lazy(() => import('../sections/profile/ProfileSection'));
const PerfilShell = lazy(() => import('../sections/profile/PerfilShell'));
const ItemDetailSection = lazy(() => import('../sections/detail/ItemDetailSection'));
const PageDetailSection = lazy(() => import('../sections/detail/PageDetailSection'));
const RealitatSection = lazy(() => import('../sections/realitat/RealitatSection'));
import NotFoundPage from '../pages/NotFoundPage';
import { CoreContentProvider, useCoreContent } from './contexts/CoreContentContext';
import { MurProvider, useMur } from '../sections/mur/MurContext';
import { NotesDataProvider } from '../sections/notes/NotesDataContext';
import { XatProvider, useXat } from '../sections/xat/XatContext';
import { MultimediaProvider } from '../sections/multimedia/MultimediaContext';
import { useUIActions, useUIState } from './contexts/UIContext';
import { useSession } from './contexts/SessionContext';

const ALL_NAV_SECTIONS = SECTIONS.filter((section) => SECTION_ORDER.includes(section.id));
const NAV_SECTIONS = ALL_NAV_SECTIONS.filter(s => s.id !== 'versions' && s.id !== 'legal');
const SYSTEM_SECTIONS = ALL_NAV_SECTIONS.filter(s => s.id === 'versions' || s.id === 'legal');

const MOBILE_NAV_LEADING = NAV_SECTIONS.slice(0, 2);
const MOBILE_NAV_TRAILING = NAV_SECTIONS.slice(2, 4);

function RouteFallback() {
  const { t } = useUIActions();
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
  const { language, status, themeMode, externalConfig } = useUIState();
  const { t } = useUIActions();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const contentRef = useRef(null);
  const { actorType, actorId } = useIdentitat();
  
  const buildPath = (basePath) => {
    // Les rutes de sistema o estàtiques que no canvien d'actor podrien no usar buildPath,
    // però si formen part de NAV_SECTIONS assumirem que pertanyen a l'actor.
    if (actorType === 'entitat') {
      return `/e/${actorId}${basePath}`;
    }
    return `/jo${basePath}`;
  };
  
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

  useEffect(() => {
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
        window.location.reload();
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
              <NavLink key={section.id} to={buildPath(section.path)} className="nav-item" aria-label={labels.label}>
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
  const { t, toggleTheme } = useUIActions();
  const { themeMode } = useUIState();
  const { currentUser } = useSession();
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
        <button 
          type="button" 
          className="icon sdp-top-bar-btn" 
          onClick={() => navigateWithTransition(currentUser ? '/el-meu-perfil' : '/registre')} 
          aria-label={t('nav.perfil', 'Perfil')} 
          title={t('nav.perfil', 'Perfil')}
        >
          {currentUser ? (
            currentUser.avatar_url ? (
              <img src={currentUser.avatar_url} alt="El meu perfil" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--sdp-accio)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserRound size={18} aria-hidden="true" focusable="false" />
              </div>
            )
          ) : (
            <UserRound aria-hidden="true" focusable="false" />
          )}
        </button>
      </div>
    </header>
  );
});

function TextRoute({ pageKey }) {
  const { pageCopy } = useCoreContent();
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



function LoadError() {
  const { error, isBackendConfigurat, dataMode } = useUIState();
  const { t } = useUIActions();
  return (
    <UniversalPage
      title={t('error.loadPortal', "No s'ha pogut carregar el portal")}
      subtitle={error?.message || (isBackendConfigurat ? 'Error desconegut.' : "No s'ha configurat el backend.")}
      labels={['Error', isBackendConfigurat ? 'Xarxa Remota' : dataMode || 'desconnectat']}
    />
  );
}

export default function App({ config }) {

  return (
    <StrictMode>
      <AppShell mobileNav={<MobileNav />}>
        <AppContent config={config} />
      </AppShell>
    </StrictMode>
  );
}

function AppContent({ config }) {
  const { actorKey } = useIdentitat();

  return (
    <CoreContentProvider key={`core-${actorKey}`} config={config}>
      <MurProvider key={`mur-${actorKey}`} config={config}>
        <NotesDataProvider key={`notes-${actorKey}`} config={config}>
          <XatProvider key={`xat-${actorKey}`} config={config}>
            <MultimediaProvider key={`media-${actorKey}`} config={config}>
              <AppDataLoader />
            </MultimediaProvider>
          </XatProvider>
        </NotesDataProvider>
      </MurProvider>
    </CoreContentProvider>
  );
}

function AppDataLoader() {
  const core = useCoreContent();
  const mur = useMur();
  const xat = useXat();
  
  const hasError = core.status === 'error' || mur.status === 'error' || xat.status === 'error';
  const isLoading = core.status === 'loading' || mur.status === 'loading' || xat.status === 'loading';

  if (hasError) return <LoadError />;
  if (isLoading) return <RouteFallback />;

  return (
    <RouteErrorBoundary>
      <AppRoutes />
    </RouteErrorBoundary>
  );
}

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[RouteErrorBoundary] Error capturat a la ruta:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="sdp-route-error" style={{ padding: '2rem', textAlign: 'center', background: 'var(--sdp-bg-alt)' }}>
          <h2 style={{ color: 'var(--sdp-danger)' }}>Hi ha hagut un problema</h2>
          <p>Aquesta secció no ha pogut carregar-se correctament.</p>
          <pre style={{ textAlign: 'left', background: '#222', color: '#f88', padding: '1rem', overflowX: 'auto' }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}>
            Intentar de nou
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppRoutes() {
  const { agents = [] } = useCoreContent();
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to={`/jo${DEFAULT_SECTION_PATH}`} replace />} />
        
        {/* Rutes per a Identitat Activa */}
        <Route path="/jo/*" element={<ActorRoutes agents={agents} />} />
        <Route path="/e/:slug/*" element={<ActorRoutes agents={agents} />} />

        {/* Redirects globals per a suportar links vells */}
        <Route path="/xat/*" element={<Navigate to="/jo/xat" replace />} />
        <Route path="/chat/*" element={<Navigate to="/jo/xat" replace />} />
        <Route path="/chats/*" element={<Navigate to="/jo/xat" replace />} />
        <Route path="/mur/*" element={<Navigate to="/jo/mur" replace />} />
        <Route path="/post/:itemId" element={<Navigate to={`/jo/mur/${window.location.pathname.split('/').pop()}`} replace />} />
        <Route path="/mercat/*" element={<Navigate to="/jo/mercat" replace />} />
        <Route path="/multimedia/*" element={<Navigate to="/jo/multimedia" replace />} />
        <Route path="/pobles/*" element={<Navigate to="/jo/pobles" replace />} />
        <Route path="/poblacio/*" element={<Navigate to="/jo/poblacio" replace />} />
        <Route path="/events/*" element={<Navigate to="/jo/mur" replace />} />
        <Route path="/calendar/*" element={<Navigate to="/jo/mur" replace />} />
        <Route path="/calendari/*" element={<Navigate to="/jo/mur" replace />} />
        <Route path="/mapa/*" element={<Navigate to="/jo/mur" replace />} />
        <Route path="/notes/*" element={<Navigate to="/jo/notes" replace />} />
        <Route path="/dispositius/*" element={<Navigate to="/jo/dispositius" replace />} />
        <Route path="/connectivitat/*" element={<Navigate to="/jo/dispositius" replace />} />
        <Route path="/el-meu-perfil/*" element={<Navigate to="/jo/el-meu-perfil" replace />} />
        <Route path="/jo" element={<Navigate to="/jo/el-meu-perfil" replace />} />
        <Route path="/perfil/*" element={<Navigate to="/jo/perfil" replace />} />
        <Route path="/gent/*" element={<Navigate to="/jo/gent" replace />} />
        <Route path="/empresa/*" element={<Navigate to="/jo/empresa" replace />} />
        <Route path="/ajuntament/*" element={<Navigate to="/jo/ajuntament" replace />} />
        <Route path="/grup/*" element={<Navigate to="/jo/grup" replace />} />

        {/* Rutes globals i administratives */}
        <Route path="/cerca" element={<SearchSection />} />
        <Route path="/login" element={<Navigate to="/registre" replace />} />
        <Route path="/accedir" element={<Navigate to="/registre" replace />} />
        <Route path="/registre" element={<OnboardingSection />} />
        <Route path="/crear-compte" element={<Navigate to="/registre" replace />} />
        
        <Route path="/control" element={<ControlSection />} />
        <Route path="/connectar" element={<ConnectarSection agents={agents} />} />
        <Route path="/projecte" element={<Navigate to="/jo/projecte" replace />} />
        <Route path="/page/:slug" element={<PageDetailSection />} />
        <Route path="/el-projecte" element={<Navigate to="/jo/projecte" replace />} />
        <Route path="/skills" element={<Navigate to="/jo/skills" replace />} />
        <Route path="/constitucio" element={<Navigate to="/jo/constitucio" replace />} />
        <Route path="/disseny" element={<Navigate to="/jo/disseny" replace />} />
        <Route path="/legal" element={<TextRoute pageKey="legal" />} />
        <Route path="/roadmap" element={<Navigate to="/jo/roadmap" replace />} />
        <Route path="/ruta" element={<Navigate to="/jo/roadmap" replace />} />
        <Route path="/versions" element={<TextRoute pageKey="versions" />} />
        <Route path="/traduccions" element={<TranslationsSection />} />
        <Route path="/realitat" element={<RealitatSection />} />
        <Route path="/ia" element={<Navigate to="/jo/ia" replace />} />
        <Route path="/anima" element={<Navigate to="/jo/ia" replace />} />
        <Route path="/iaia" element={<Navigate to="/jo/xat/iaia-maria" replace />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

function ActorRoutes({ agents }) {
  // Aquestes rutes són relatives a `/jo` o `/e/:slug`. 
  // No necessiten la / inicial.
  return (
    <Routes>
      <Route path="/" element={<Navigate to={DEFAULT_SECTION_PATH.replace('/', '')} replace />} />
      <Route path="xat" element={<XatSection />} />
      <Route path="xat/:threadId" element={<XatSection />} />
      <Route path="mur" element={<MurSection />} />
      <Route path="mercat" element={<MercatSection />} />
      <Route path="multimedia" element={<MultimediaSection />} />
      <Route path="pobles" element={<PoblesSection />} />
      <Route path="poblacio" element={<PoblacioSection />} />
      <Route path="notes" element={<NotesSection />} />
      <Route path="dispositius" element={<DevicesSection />} />
      
      <Route path="el-meu-perfil" element={<PerfilShell />} />
      <Route path="perfil" element={<ProfileSection agents={agents} />} />
      <Route path="perfil/:agentId" element={<ProfileSection agents={agents} />} />
      <Route path="gent/:agentId" element={<ProfileSection agents={agents} />} />
      <Route path="empresa/:agentId" element={<ProfileSection agents={agents} />} />
      <Route path="ajuntament/:agentId" element={<ProfileSection agents={agents} />} />
      <Route path="grup/:agentId" element={<ProfileSection agents={agents} />} />
      
      <Route path="projecte" element={<TextRoute pageKey="projecte" />} />
      <Route path="skills" element={<TextRoute pageKey="skills" />} />
      <Route path="constitucio" element={<TextRoute pageKey="constitucio" />} />
      <Route path="disseny" element={<DesignSection />} />
      <Route path="roadmap" element={<TextRoute pageKey="roadmap" />} />
      <Route path="ia" element={<TextRoute pageKey="anima" />} />
      
      <Route path=":sectionId/:itemId" element={<ItemDetailSection />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

const MobileNav = memo(function MobileNav() {
  const { language } = useUIState();
  const { t } = useUIActions();
  const navigate = useNavigate();
  const { actorType, actorId } = useIdentitat();
  
  const buildPath = (basePath) => {
    if (actorType === 'entitat') {
      return `/e/${actorId}${basePath}`;
    }
    return `/jo${basePath}`;
  };

  return (
      <nav className="mobile-nav" aria-label="Navegació mòbil">
        {MOBILE_NAV_LEADING.map((section) => {
          const Icon = section.icon;
          const labels = getSectionLabels(section.id, language);
          return (
            <NavLink key={section.id} to={buildPath(section.path)} className="nav-item" aria-label={labels.label}>
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
            <NavLink key={section.id} to={buildPath(section.path)} className="nav-item" aria-label={labels.label}>
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
