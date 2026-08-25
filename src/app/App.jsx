import { lazy, Suspense, useEffect, useLayoutEffect, useState, memo, useRef } from 'react';
import { Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Globe, MoonStar, Plus, Search, Settings, Sun, UserRound } from 'lucide-react';
import BrandMark from '../components/BrandMark';
import SectionChrome from '../components/SectionChrome';
import { useAppData } from './AppDataContext';
import { APP_NAME } from '../config/app';
import { DEFAULT_SECTION_PATH, SECTIONS, SECTION_ORDER } from '../config/sections';
import { getSectionLabels } from '../config/i18n';
import { IaiaIcon } from '../components/universal/UniversalComponents';

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
const ItemDetailSection = lazy(() => import('../sections/detail/ItemDetailSection'));
const PageDetailSection = lazy(() => import('../sections/detail/PageDetailSection'));
const PiPlaVerd = lazy(() => import('../pages/PiPlaVerd'));
const RealitatSection = lazy(() => import('../sections/realitat/RealitatSection'));
import NotFoundPage from '../pages/NotFoundPage';

const NAV_SECTIONS = SECTIONS.filter((section) => SECTION_ORDER.includes(section.id));
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
  const { language, t, status, themeMode } = useAppData();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  
  // Pull to Refresh logic
  const [pullStart, setPullStart] = useState(null);
  const [pullDistance, setPullDistance] = useState(0);
  const PULL_THRESHOLD = 100;

  useLayoutEffect(() => {
    if (mainRef.current) {
      const rootNode = mainRef.current.getRootNode();
      if (rootNode instanceof ShadowRoot) {
        rootNode.host.setAttribute('data-theme', themeMode || 'light');
      } else {
        const root = document.querySelector('.sdp-root') || document.documentElement;
        root.setAttribute('data-theme', themeMode || 'light');
      }
    }
  }, [themeMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (mainRef.current) {
        const rootNode = mainRef.current.getRootNode();
        const host = rootNode instanceof ShadowRoot ? rootNode.host : (document.querySelector('.sdp-root') || document.documentElement);
        host.setAttribute('lang', language || 'ca');
      }
    }
  }, [language]);

  const handleTouchStart = (e) => {
    if (mainRef.current && mainRef.current.scrollTop === 0) {
      setPullStart(e.touches[0].clientY);
    } else {
      setPullStart(null);
    }
  };

  const handleTouchMove = (e) => {
    if (pullStart === null) return;
    const y = e.touches[0].clientY;
    const distance = y - pullStart;
    if (distance > 0) {
      setPullDistance(distance);
      // Only prevent default if we are actively pulling down, to allow normal scrolling otherwise
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > PULL_THRESHOLD) {
      window.dispatchEvent(new Event('sdp:refresh-data'));
    }
    setPullStart(null);
    setPullDistance(0);
  };

  return (
    <>
      <nav id="app-sidebar" className="app-sidebar" aria-label="Navegació principal">
        <div className="brand sdp-cursor-pointer" aria-label="Obrir o tancar menú Sóc de Poble" role="button" tabIndex={0} onClick={(e) => {
          const root = e.target.getRootNode();
          const sidebar = root.querySelector('.app-sidebar') || document.querySelector('.app-sidebar');
          const host = root instanceof ShadowRoot ? root.host : document.body;
          sidebar?.classList.toggle('sidebar-open');
          host.classList.toggle('sidebar-closed');
        }}>
          <BrandMark className="app-brand__mark" />
        </div>

        <button
          type="button"
          className="sidebar-control-btn"
          onClick={() => navigate('/control')}
        >
          <Settings size={22} strokeWidth={2.8} />
          <span>CENTRE DE CONTROL</span>
        </button>

        <div className="sdp-p-4" aria-label="Seccions">
          {NAV_SECTIONS.map((section) => {
            const Icon = section.icon;
            const labels = getSectionLabels(section.id, language);
            return (
              <NavLink key={section.id} to={section.path} className="nav-item" aria-label={labels.label}>
                <Icon className="icona-linia" strokeWidth={2.1} size={20} aria-hidden="true" focusable="false" />
                <span className="nav-item__text">
                  {labels.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <main 
        ref={mainRef}
        className="app-main" 
        aria-busy={status === 'loading' ? 'true' : 'false'} 
        aria-live="polite"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="pull-to-refresh-indicator" 
          style={{ 
            height: `${pullStart !== null ? Math.min(pullDistance, PULL_THRESHOLD + 40) : 0}px`,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--sdp-fons-subtil)',
            color: 'var(--sdp-text-suau)',
            fontSize: '0.85rem',
            fontWeight: '600',
            transition: pullStart === null ? 'height 0.3s ease-out' : 'none'
          }}
        >
          {pullDistance > PULL_THRESHOLD ? t('pull.release', 'Deixa anar per recarregar...') : t('pull.pull', 'Estira per recarregar...')}
        </div>

        <TopBar />
        
        <div className="app-main-content">
          {children}
        </div>
      </main>

      {mobileNav}
    </>
  );
}

const TopBar = memo(function TopBar() {
  const navigate = useNavigate();
  const { t, themeMode, toggleTheme } = useAppData();

  const navigateWithTransition = (path) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  };

  return (
    <header className="bar-black">
      <div className="mobile-logo-wrapper" data-mobile-toggle="true" onClick={(e) => {
        const root = e.target.getRootNode();
        const sidebar = root.querySelector('.app-sidebar') || document.querySelector('.app-sidebar');
        const host = root instanceof ShadowRoot ? root.host : document.body;
        sidebar?.classList.toggle('sidebar-open');
        host.classList.toggle('sidebar-closed');
      }}>
        <BrandMark variant="light" className="mobile-logo" />
      </div>
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
        <button type="button" className="icon sdp-top-bar-btn" onClick={() => navigateWithTransition('/perfil')} aria-label={t('nav.perfil', 'Perfil')} title={t('nav.perfil', 'Perfil')}>
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

function LoadError() {
  const { error, hasSupabaseConfig, dataMode, t } = useAppData();
  return (
    <SectionChrome
      kicker="Base de dades"
      title={t('error.loadPortal', "No s'ha pogut carregar el portal")}
      subtitle={error?.message || (hasSupabaseConfig ? 'Error desconegut.' : 'Falta configurar Supabase.')}
      meta={['Error', hasSupabaseConfig ? 'Supabase' : dataMode || 'seed']}
    />
  );
}

export default function App() {
  return (
    <AppShell mobileNav={<MobileNav />}>
      <AppContent />
    </AppShell>
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
        <Route path="/chat" element={<XatSection />} />
        <Route path="/chat/:threadId" element={<XatSection />} />
        <Route path="/xat" element={<Navigate to="/chat" replace />} />
        <Route path="/xat/:threadId" element={<Navigate to="/chat/:threadId" replace />} />
        <Route path="/chats" element={<Navigate to="/chat" replace />} />
        <Route path="/chats/:threadId" element={<Navigate to="/chat/:threadId" replace />} />
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
        <Route path="/accedir" element={<LoginSection />} />
        <Route path="/registre" element={<LoginSection />} />
        <Route path="/crear-compte" element={<LoginSection />} />
        <Route path="/perfil" element={<ProfileSection agents={agents} />} />
        <Route path="/perfil/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/gent/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/empresa/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/ajuntament/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/grup/:agentId" element={<ProfileSection agents={agents} />} />
          
          <Route path="/arbres/pi-pla-verd" element={<PiPlaVerd />} />
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
          <Route path="/iaia" element={<Navigate to="/chat/iaia-maria" replace />} />
          <Route path="/:sectionId/:itemId" element={<ItemDetailSection />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
  );
}

function MobileNav() {
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
          if (document.startViewTransition) {
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
}
