import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';

const RouterContext = createContext();
const RouterPrefixContext = createContext('');

export function RouterProvider({ children, basename = '' }) {
  const base = basename.endsWith('/') ? basename.slice(0, -1) : basename;

  const getNormalizedPath = useCallback(() => {
    let p = window.location.pathname;
    if (base && p.startsWith(base)) {
      p = p.slice(base.length) || '/';
    }
    return p;
  }, [base]);

  const [currentPath, setCurrentPath] = useState(getNormalizedPath());
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getNormalizedPath());
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getNormalizedPath]);

  const navigate = useCallback((to, options = {}) => {
    if (!to) return;
    if (to === -1) {
      window.history.back();
      return;
    }
    
    let targetPath = to;
    if (to.startsWith('/')) {
        targetPath = base + to;
    }

    const state = options.state || null;

    if (options.replace) {
      window.history.replaceState(state, '', targetPath);
    } else {
      window.history.pushState(state, '', targetPath);
    }
    
    // We assume 'to' is a relative or absolute path within the same origin
    const url = new URL(targetPath, window.location.origin);
    setCurrentPath(getNormalizedPath());
    setSearchParams(new URLSearchParams(url.search));
  }, [base, getNormalizedPath]);

  const contextValue = useMemo(() => ({
    currentPath,
    searchParams,
    navigate,
    basename: base
  }), [currentPath, searchParams, navigate, base]);

  return (
    <RouterContext.Provider value={contextValue}>
      <RouterPrefixContext.Provider value="">
        {children}
      </RouterPrefixContext.Provider>
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

export function useLocation() {
  const { currentPath, searchParams } = useRouter();
  return { pathname: currentPath, search: searchParams.toString(), state: window.history.state };
}

export function useSearchParams() {
  const { searchParams, navigate } = useRouter();
  
  const setSearchParams = useCallback((newParams) => {
    const currentUrl = new URL(window.location.href);
    if (newParams instanceof URLSearchParams) {
      currentUrl.search = newParams.toString();
    } else {
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          currentUrl.searchParams.delete(key);
        } else {
          currentUrl.searchParams.set(key, value);
        }
      });
    }
    navigate(currentUrl.pathname + currentUrl.search, { replace: true });
  }, [navigate]);
  
  return [searchParams, setSearchParams];
}

const RouteParamsContext = createContext({});

export function useParams() {
  return useContext(RouteParamsContext);
}

export function Link({ to, children, className, onClick, ...props }) {
  const { navigate } = useRouter();
  
  const handleClick = (e) => {
    if (e.button === 0 && !e.ctrlKey && !e.metaKey) { // Normal left click
      e.preventDefault();
      if (onClick) onClick(e);
      navigate(to);
    }
  };
  
  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

export function NavLink({ to, children, className, activeClassName = 'active', ...props }) {
  const { currentPath } = useRouter();
  const isActive = currentPath === to || currentPath.startsWith(to + '/');
  
  let combinedClassName = typeof className === 'function' ? className({ isActive }) : className;
  if (isActive && typeof className !== 'function') {
    combinedClassName = combinedClassName ? `${combinedClassName} ${activeClassName}` : activeClassName;
  }
  
  return (
    <Link to={to} className={combinedClassName} {...props}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </Link>
  );
}

export function Navigate({ to, replace }) {
  const { navigate } = useRouter();
  useLayoutEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);
  return null;
}

// Convert express style route path to regex
function pathToRegex(path) {
  if (path === '*') return /(.*)/;
  
  let regexStr = path.replace(/\//g, '\\/');
  regexStr = regexStr.replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^\\/]+)');
  
  if (regexStr.endsWith('\\/*')) {
      // Optional trailing slash and wildcard
      regexStr = regexStr.replace(/\\\/\*$/, '(?:\\/(.*))?');
  } else {
      regexStr = regexStr.replace(/\*/g, '(.*)');
  }

  return new RegExp('^' + regexStr + '$');
}

function resolvePath(base, path) {
  if (path.startsWith('/')) return path;
  if (path === '') return base;
  if (base === '/') return '/' + path;
  return base + '/' + path;
}

export function Routes({ children }) {
  const { currentPath } = useRouter();
  const parentPrefix = useContext(RouterPrefixContext);
  
  let matchFound = false;
  let elementToRender = null;
  
  React.Children.forEach(children, child => {
    if (matchFound || !React.isValidElement(child)) return;
    
    if (child.props.path !== undefined) {
      const absolutePath = resolvePath(parentPrefix, child.props.path);
      const regex = pathToRegex(absolutePath);
      const match = currentPath.match(regex);
      
      if (match) {
        matchFound = true;
        const params = match.groups ? { ...match.groups } : {};
        
        if (absolutePath.includes('*')) {
           const vals = Array.from(match);
           const splat = vals.pop();
           params['*'] = splat || '';
        }
        
        let newPrefix = absolutePath.replace(/\*$/, '');
        if (newPrefix.endsWith('/') && newPrefix.length > 1) {
            newPrefix = newPrefix.slice(0, -1);
        }

        elementToRender = (
          <RouteParamsContext.Provider value={params}>
            <RouterPrefixContext.Provider value={newPrefix}>
               {child.props.element}
            </RouterPrefixContext.Provider>
          </RouteParamsContext.Provider>
        );
      }
    } else if (child.props.index) {
       if (currentPath === parentPrefix || currentPath === parentPrefix + '/') {
           matchFound = true;
           elementToRender = child.props.element;
       }
    }
  });

  return elementToRender;
}

export function Route() {
  return null;
}

export function BrowserRouter({ children, basename }) {
  return <RouterProvider basename={basename}>{children}</RouterProvider>;
}

export function MemoryRouter({ children }) {
  // Enrutador simple que només envuelve l'app per retrocompatibilitat
  return <RouterProvider>{children}</RouterProvider>;
}

export function matchPath(pattern, pathname) {
  if (typeof pattern === 'string') {
    pattern = { path: pattern };
  }
  const regex = pathToRegex(pattern.path);
  const match = pathname.match(regex);
  if (!match) return null;
  return {
    params: match.groups || {},
    pathname: match[0],
    pattern
  };
}
