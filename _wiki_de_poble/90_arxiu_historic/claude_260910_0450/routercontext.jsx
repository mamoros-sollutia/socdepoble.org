/**
 * RouterContext.jsx — ENRUTADOR NATIU (recanvi complet, 260910)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * QUÈ ES CORREGEIX RESPECTE DE LA VERSIÓ AUDITADA
 * ───────────────────────────────────────────────
 *
 * P0-A · `pathToRegex()` construïa grups amb nom DESPRÉS d'escapar les barres.
 *        `:([^/]+)` s'emportava la contrabarra de l'escapada, així que
 *        `/e/:slug/*` generava `(?<slug\>…)` → SyntaxError. Peta tot paràmetre
 *        que no siga l'últim segment. `IdentitatContext.jsx` crida
 *        `matchPath('/e/:slug/*', …)` en CADA render, sense condició: l'app no
 *        arribava a pintar mai.
 *        Ara els segments es tallen per `/` i s'escapen d'un en un, i els
 *        paràmetres van a grups NUMERATS amb una llista de noms al costat
 *        (a més, els grups amb nom són ES2018: fora dels iPads més vells).
 *
 * P0-B · Cap suport de rutes NIADES. `ActorRoutes` declara rutes relatives
 *        (`multimedia`, `perfil/:agentId`, `*`) en idioma react-router v6, però
 *        `Routes` casava contra el `pathname` sencer amb àncores `^…$`. Cap
 *        ruta relativa casava mai i el comodí final se les enduia totes: TOTA
 *        la secció `/jo/**` pintava `NotFoundPage`. Ara `Routes` consumeix el
 *        prefix ja casat i les filles casen contra la resta.
 *
 * P0-C · `basename` era codi mort. `PedraSecaEmbed` el calculava i el passava a
 *        `<BrowserRouter basename=…>`, i `BrowserRouter` només llegia
 *        `children`. Incrustats sota `sollutia.example/algun-poble/`, cap ruta
 *        casava i cada `navigate()` reescrivia la URL del host cap a una que
 *        el seu servidor no serveix. Ara el basename es lleva a l'entrada i es
 *        torna a posar a l'eixida.
 *
 * P0-D · `/xat/*` no casava `/xat`. `TextRoute` redirigeix a
 *        `DEFAULT_SECTION_PATH` (`/xat`) i el mur enllaça `/notes`, `/mercat`…
 *        sense barra final. El comodí ara és opcional: `/xat/*` casa `/xat`.
 *
 * P0-E · Primer-que-casa per ordre de declaració. La taula de rutes està
 *        escrita per a la classificació per especificitat de react-router
 *        (`/jo` abans que `/jo/*`, `perfil` abans que `:sectionId/:itemId`).
 *        Ara es puntua: estàtic 10, paràmetre 3, comodí −2. Empat → ordre.
 *
 * P1-F · `navigate` es tornava a crear en cada render i l'objecte de context
 *        també. Tot consumidor de `useRouter()` es repintava sempre, i
 *        `<Navigate>` —amb `useEffect(…, [navigate, to, replace])`— es
 *        reactivava en cada render. Si el destí era la ruta actual,
 *        `setCurrentPath` es curtcircuitava però `setSearchParams(new
 *        URLSearchParams(…))` mai (objecte nou), i el bucle no s'aturava:
 *        «Maximum update depth exceeded». Ara `navigate` és estable i l'estat
 *        de la cerca és una CADENA; l'objecte es deriva amb `useMemo`.
 *
 * P1-G · `pushState`/`replaceState` fets des de fora (el host, una analítica)
 *        no disparen `popstate` i deixaven l'enrutador desincronitzat. Ara
 *        s'instrumenten una sola vegada per a emetre `sdp:navegacio`.
 *
 * P1-H · `Link` segrestava Cmd/Ctrl/Maj/Alt-clic i `target="_blank"`, i cridava
 *        `preventDefault()` ABANS del `onClick` del consumidor, que per tant no
 *        podia cancel·lar res. Ara es respecten els modificadors, `target`, els
 *        enllaços externs i `defaultPrevented`.
 *
 * P1-I · `MemoryRouter` era un àlies de `BrowserRouter`: tocava la URL de
 *        veritat. Ara és de veres en memòria. I s'afig `HashRouter`, que és el
 *        que vol un mòdul incrustat en una pàgina que no controlem.
 */

import React, {
  createContext, useContext, useState, useEffect, useMemo, useCallback, useRef,
} from 'react';

/* ═════════════════════════ Patrons ═════════════════════════ */

const escapa = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Compila un patró a { rx, noms, comodi, puntuacio }.
 * Accepta patrons absoluts (`/jo/*`) i relatius (`perfil/:agentId`) igual:
 * es normalitza sempre a segments.
 */
export function compilaPatro(patro) {
  const brut = String(patro ?? '');
  const comodi = brut === '*' || brut.endsWith('/*');
  const nucli = comodi ? brut.slice(0, brut.length - (brut === '*' ? 1 : 2)) : brut;
  const segments = nucli.split('/').filter(Boolean);

  let font = '^';
  const noms = [];
  let puntuacio = 0;

  for (const seg of segments) {
    if (seg.startsWith(':')) {
      noms.push(seg.slice(1));
      font += '/([^/]+)';
      puntuacio += 3;
    } else {
      font += '/' + escapa(seg);
      puntuacio += 10;
    }
  }

  if (comodi) {
    font += '(?:/(.*))?';   // el comodí NO obliga la barra: /xat/* casa /xat
    puntuacio -= 2;
  } else {
    font += '/?';           // tolerància a la barra final
  }
  font += '$';

  return { rx: new RegExp(font), noms, comodi, puntuacio, patro: brut };
}

const memoPatrons = new Map();
function patroDe(p) {
  let c = memoPatrons.get(p);
  if (!c) { c = compilaPatro(p); memoPatrons.set(p, c); }
  return c;
}

/**
 * Casa un camí contra un patró.
 * @returns {null | {params, consumit, resta}}
 */
export function casa(patro, cami) {
  const { rx, noms, comodi } = patroDe(patro);
  const m = rx.exec(cami || '/');
  if (!m) return null;

  const params = {};
  noms.forEach((nom, i) => {
    const v = m[i + 1];
    params[nom] = v === undefined ? undefined : decodeURIComponent(v);
  });

  let consumit = m[0];
  let resta = '';
  if (comodi) {
    const cua = m[noms.length + 1] || '';
    params['*'] = cua;
    resta = cua ? '/' + cua : '';
    consumit = m[0].slice(0, m[0].length - resta.length);
  }
  return { params, consumit: consumit || '', resta };
}

/** Compatibilitat amb l'API antiga de react-router. */
export function matchPath(patro, cami) {
  const p = typeof patro === 'string' ? { path: patro } : patro;
  const r = casa(p.path, cami);
  if (!r) return null;
  return { params: r.params, pathname: r.consumit, pattern: p };
}

/* ═════════════════════════ Base URL ═════════════════════════ */

const netejaBase = (b) => {
  if (!b || b === '/') return '';
  let s = String(b).trim();
  if (!s.startsWith('/')) s = '/' + s;
  return s.replace(/\/+$/, '');
};

const lleva = (cami, base) => {
  if (!base) return cami || '/';
  if (cami === base) return '/';
  if (cami.startsWith(base + '/')) return cami.slice(base.length) || '/';
  return cami || '/';
};

/* ═════════════ Instrumentació d'history (una sola volta) ═════════════ */

const SENYAL = 'sdp:navegacio';
let historyInstrumentada = false;

function instrumentaHistory() {
  if (historyInstrumentada || typeof window === 'undefined' || !window.history) return;
  historyInstrumentada = true;
  for (const nom of ['pushState', 'replaceState']) {
    const original = window.history[nom];
    if (typeof original !== 'function') continue;
    window.history[nom] = function instrumentat(...args) {
      const r = original.apply(this, args);
      try { window.dispatchEvent(new Event(SENYAL)); } catch { /* entorns sense CustomEvent */ }
      return r;
    };
  }
}

/* ═════════════════════════ Contextos ═════════════════════════ */

const RouterContext = createContext(null);
const RouteParamsContext = createContext({});
const RouteBaseContext = createContext('');   // prefix ja consumit per rutes pare

/* ═════════════════════════ Proveïdor ═════════════════════════ */

/**
 * @param {'browser'|'hash'|'memory'} mode
 * @param {string} basename  prefix del host (p. ex. '/el-meu-poble')
 */
export function RouterProvider({ children, basename = '', mode = 'browser', inicial = '/' }) {
  const base = netejaBase(basename);
  const memoria = useRef({ cami: inicial, pila: [inicial], i: 0 });

  const llig = useCallback(() => {
    if (mode === 'memory' || typeof window === 'undefined') {
      const [p, q = ''] = memoria.current.cami.split('?');
      return { pathname: p || '/', search: q ? '?' + q : '' };
    }
    if (mode === 'hash') {
      const brut = window.location.hash.replace(/^#/, '') || '/';
      const [p, q = ''] = brut.split('?');
      return { pathname: p.startsWith('/') ? p : '/' + p, search: q ? '?' + q : '' };
    }
    return {
      pathname: lleva(window.location.pathname, base),
      search: window.location.search || '',
    };
  }, [mode, base]);

  const [ubicacio, setUbicacio] = useState(llig);

  const sincronitza = useCallback(() => {
    setUbicacio((prev) => {
      const nou = llig();
      // Comparació per VALOR: sense això, cada sincronització és un objecte
      // nou i tot consumidor es repinta. Ací naixia el bucle de <Navigate>.
      if (prev.pathname === nou.pathname && prev.search === nou.search) return prev;
      return nou;
    });
  }, [llig]);

  useEffect(() => {
    if (mode === 'memory' || typeof window === 'undefined') return undefined;
    instrumentaHistory();
    window.addEventListener('popstate', sincronitza);
    window.addEventListener(SENYAL, sincronitza);
    if (mode === 'hash') window.addEventListener('hashchange', sincronitza);
    sincronitza();   // per si la URL ha canviat entre el primer render i l'efecte
    return () => {
      window.removeEventListener('popstate', sincronitza);
      window.removeEventListener(SENYAL, sincronitza);
      if (mode === 'hash') window.removeEventListener('hashchange', sincronitza);
    };
  }, [mode, sincronitza]);

  /* `navigate` ha de tindre IDENTITAT ESTABLE: si canvia en cada render,
     qualsevol useEffect que en depenga es reactiva en cada render. */
  const navigate = useCallback((to, opcions = {}) => {
    if (to === -1 || to === '-1') {
      if (mode === 'memory') {
        const m = memoria.current;
        if (m.i > 0) { m.i -= 1; m.cami = m.pila[m.i]; sincronitza(); }
      } else if (typeof window !== 'undefined') {
        window.history.back();
      }
      return;
    }
    if (to === null || to === undefined || to === '') return;

    const desti = String(to);
    const [cami, cerca = ''] = desti.split('?');
    const net = (cami.startsWith('/') ? cami : '/' + cami) + (cerca ? '?' + cerca : '');

    if (mode === 'memory') {
      const m = memoria.current;
      if (opcions.replace) { m.pila[m.i] = net; } else { m.pila = m.pila.slice(0, m.i + 1).concat(net); m.i += 1; }
      m.cami = net;
      sincronitza();
      return;
    }
    if (typeof window === 'undefined') return;

    if (mode === 'hash') {
      const url = window.location.pathname + window.location.search + '#' + net;
      if (opcions.replace) window.history.replaceState(opcions.state ?? null, '', url);
      else window.history.pushState(opcions.state ?? null, '', url);
    } else {
      const url = (base + net) || '/';
      if (opcions.replace) window.history.replaceState(opcions.state ?? null, '', url);
      else window.history.pushState(opcions.state ?? null, '', url);
    }
    sincronitza();
  }, [mode, base, sincronitza]);

  /* La cerca es guarda com a CADENA i l'objecte es deriva: així
     `searchParams` només canvia d'identitat quan canvia de valor. */
  const searchParams = useMemo(() => new URLSearchParams(ubicacio.search), [ubicacio.search]);

  const valor = useMemo(() => ({
    currentPath: ubicacio.pathname,
    location: { pathname: ubicacio.pathname, search: ubicacio.search, hash: '' },
    searchParams,
    navigate,
    basename: base,
    mode,
  }), [ubicacio.pathname, ubicacio.search, searchParams, navigate, base, mode]);

  return <RouterContext.Provider value={valor}>{children}</RouterContext.Provider>;
}

export function BrowserRouter({ children, basename }) {
  return <RouterProvider basename={basename} mode="browser">{children}</RouterProvider>;
}
export function HashRouter({ children, basename }) {
  return <RouterProvider basename={basename} mode="hash">{children}</RouterProvider>;
}
export function MemoryRouter({ children, initialEntries }) {
  return (
    <RouterProvider mode="memory" inicial={(initialEntries && initialEntries[0]) || '/'}>
      {children}
    </RouterProvider>
  );
}

/* ═════════════════════════ Hooks ═════════════════════════ */

export function useRouter() {
  const c = useContext(RouterContext);
  if (!c) throw new Error('useRouter fora de RouterProvider: cap component pot navegar sense proveïdor.');
  return c;
}
export function useNavigate() { return useRouter().navigate; }
export function useLocation() { return useRouter().location; }
export function useParams() { return useContext(RouteParamsContext); }

export function useSearchParams() {
  const { searchParams, currentPath, navigate } = useRouter();

  const setSearchParams = useCallback((nous, opcions = { replace: true }) => {
    const seguents = new URLSearchParams(
      nous instanceof URLSearchParams ? nous.toString() : searchParams.toString(),
    );
    if (!(nous instanceof URLSearchParams)) {
      const obj = typeof nous === 'function' ? nous(searchParams) : nous;
      Object.entries(obj || {}).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '') seguents.delete(k);
        else seguents.set(k, String(v));
      });
    }
    const q = seguents.toString();
    navigate(currentPath + (q ? `?${q}` : ''), { replace: opcions.replace !== false });
  }, [searchParams, currentPath, navigate]);

  return [searchParams, setSearchParams];
}

/* ═════════════════════════ Components ═════════════════════════ */

const esExtern = (to) => typeof to === 'string' && /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(to);

export function Link({ to, children, className, onClick, target, replace, ...props }) {
  const { navigate, basename, mode } = useRouter();

  const href = esExtern(to)
    ? to
    : mode === 'hash' ? `#${to}` : `${basename}${to}`;

  const gestiona = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;                       // el consumidor mana
    if (esExtern(to)) return;                             // enllaç de fora: el navegador
    if (target && target !== '_self') return;             // pestanya nova
    if (e.button !== undefined && e.button !== 0) return; // no és clic esquerre
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // obrir en finestra/baixar
    e.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a href={href} onClick={gestiona} className={className} target={target} {...props}>
      {children}
    </a>
  );
}

export function NavLink({ to, children, className, activeClassName = 'active', end = false, ...props }) {
  const { currentPath } = useRouter();
  const isActive = end ? currentPath === to : (currentPath === to || currentPath.startsWith(to + '/'));

  const resolt = typeof className === 'function'
    ? className({ isActive })
    : [className, isActive ? activeClassName : null].filter(Boolean).join(' ') || undefined;

  return (
    <Link to={to} className={resolt} aria-current={isActive ? 'page' : undefined} {...props}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </Link>
  );
}

/**
 * `navigate` és estable i el destí es compara amb la ubicació actual abans de
 * moure's: sense les dues coses, redirigir a la ruta on ja ets és un bucle.
 */
export function Navigate({ to, replace = true, state }) {
  const { navigate, currentPath, location } = useRouter();
  const actual = currentPath + (location.search || '');
  useEffect(() => {
    if (to === actual) return;
    navigate(to, { replace, state });
  }, [navigate, to, actual, replace, state]);
  return null;
}

export function Route() { return null; }

export function Routes({ children }) {
  const { currentPath } = useRouter();
  const basePare = useContext(RouteBaseContext);

  const resta = (currentPath.startsWith(basePare) ? currentPath.slice(basePare.length) : currentPath) || '/';

  const { element, params, nouBase } = useMemo(() => {
    const candidats = [];
    let ordre = 0;
    React.Children.forEach(children, (fill) => {
      if (!React.isValidElement(fill) || !fill.props) return;
      const patro = fill.props.path ?? (fill.props.index ? '/' : null);
      if (patro === null || patro === undefined) return;
      let compilat;
      try { compilat = patroDe(patro); } catch { return; } // patró impossible: s'ignora, no tomba l'app
      const r = casa(patro, resta);
      if (r) candidats.push({ fill, r, puntuacio: compilat.puntuacio, ordre: ordre += 1 });
    });

    if (!candidats.length) return { element: null, params: {}, nouBase: basePare };

    candidats.sort((a, b) => (b.puntuacio - a.puntuacio) || (a.ordre - b.ordre));
    const guanyador = candidats[0];
    return {
      element: guanyador.fill.props.element ?? null,
      params: guanyador.r.params,
      nouBase: basePare + guanyador.r.consumit,
    };
  }, [children, resta, basePare]);

  if (!element) return null;

  return (
    <RouteBaseContext.Provider value={nouBase}>
      <RouteParamsContext.Provider value={params}>
        {element}
      </RouteParamsContext.Provider>
    </RouteBaseContext.Provider>
  );
}
