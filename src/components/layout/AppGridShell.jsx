import { useLayoutEffect, useRef, useState, createContext, useContext } from 'react';
import appGridStyles from './AppGridShell.css?inline';

const AppGridContext = createContext(null);

export function useAppGrid() {
  const ctx = useContext(AppGridContext);
  if (!ctx) throw new Error('useAppGrid ha de ser utilitzat dins de AppGridShell');
  return ctx;
}

export default function AppGridShell({
  children, // Expected to be injected CSS (e.g. page specific styles)
  leftColumn,
  middleColumn,
  rightColumn,
  leftTitle = 'ESQUERRA',
  middleTitle = 'CENTRE',
  initialPane = null,
  'aria-label': ariaLabel = 'Graella de l\'aplicació',
  className = ''
}) {
  const [mida, setMida] = useState('ample'); // 'ample', 'mitja', 'estret'
  const [panellObert, setPanellObert] = useState(initialPane); // null, 'left', 'middle'
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    
    const measure = () => {
      const w = page.clientWidth;
      let novaMida = 'ample';
      if (w < 720) novaMida = 'estret';
      else if (w < 1090) novaMida = 'mitja';
      
      setMida(prev => {
        if (prev !== novaMida) {
           if (novaMida === 'ample') setPanellObert(null);
           if (novaMida === 'estret' && prev === 'ample') setPanellObert(null);
        }
        return novaMida;
      });
    };
    
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  const toggleLeft = () => setPanellObert(p => p === 'left' ? null : 'left');
  const toggleMiddle = () => setPanellObert(p => p === 'middle' ? null : 'middle');

  /* Una columna desplaçada amb translateX(-100%) continua sent focusable i
     visible per al lector de pantalla. Sense `inert`, tabular des de
     l'editor et fica dins de columnes fora de pantalla: canviaries la
     pèrdua de cursor per una trampa de focus més silenciosa. */
  const tancada = {
    left: mida !== 'ample' && panellObert !== 'left',
    middle: mida === 'estret' && panellObert !== 'middle',
    right: mida === 'estret' && panellObert !== null
  };

  return (
    <AppGridContext.Provider value={{ mida, panellObert, setPanellObert, tancaPanells: () => setPanellObert(null) }}>
      <div ref={pageRef} className={`app-grid-page ${className}`}>
        <style data-appgrid-styles>{appGridStyles}</style>
        {children}
        
        <article className="app-grid-shell" data-layout={mida} data-panell={panellObert || ''} aria-label={ariaLabel}>
          {mida !== 'ample' && (
            <div className="app-grid-headers">
              <button 
                type="button" 
                className={`app-grid-header-btn ${panellObert === 'left' ? 'active' : ''}`}
                aria-expanded={panellObert === 'left'}
                aria-controls="app-grid-sidebar"
                onClick={toggleLeft}
              >
                {leftTitle}
              </button>
              {mida === 'estret' && (
                <button 
                  type="button" 
                  className={`app-grid-header-btn ${panellObert === 'middle' ? 'active' : ''}`}
                  aria-expanded={panellObert === 'middle'}
                  aria-controls="app-grid-list"
                  onClick={toggleMiddle}
                >
                  {middleTitle}
                </button>
              )}
            </div>
          )}

          <div className="app-grid-content">
            <section
              className="app-grid-column app-grid-column--left"
              id="app-grid-sidebar"
              inert={tancada.left ? '' : undefined}
              aria-hidden={tancada.left || undefined}
            >
              {leftColumn}
            </section>
            <section
              className="app-grid-column app-grid-column--middle"
              id="app-grid-list"
              inert={tancada.middle ? '' : undefined}
              aria-hidden={tancada.middle || undefined}
            >
              {middleColumn}
            </section>
            <section
              className="app-grid-column app-grid-column--right"
              id="app-grid-main"
              inert={tancada.right ? '' : undefined}
              aria-hidden={tancada.right || undefined}
            >
              {rightColumn}
            </section>
          </div>
        </article>
      </div>
    </AppGridContext.Provider>
  );
}
