// src/app/guards/RequireAuth.jsx
import { Navigate, useLocation } from '../contexts/RouterContext';
import { useSession, ESTAT } from '../contexts/SessionContext';

/** Pantalla d'espera. Mai cap redirecció mentre l'estat és 'comprovant'. */
function Comprovant() {
  return (
    <div className="sdp-route-loading-screen" role="status" aria-live="polite">
      <span className="sr-only">Comprovant la sessió…</span>
    </div>
  );
}

function SenseRol({ rol }) {
  return (
    <div className="sdp-buit">
      <div className="sdp-alerta sdp-alerta--error" role="alert">
        <h3>Accés restringit</h3>
        <p>Esta àrea necessita el rol <strong>{rol}</strong>. El teu compte no el té.</p>
      </div>
    </div>
  );
}

/**
 * Barrera de client. NO és seguretat: la seguretat és la RLS de Sollutia.
 * Açò evita muntar vistes que faran 42501 i filtrar-ne l'estructura.
 *
 * `?tornar=` en lloc de state del router: sobreviu a una recàrrega i al
 * viatge d'anada i tornada de l'OAuth, que és quan més falta fa.
 */
export function RequireAuth({ children, rol = null, fallback = '/registre' }) {
  const { currentUser, estat, rol: rolActual } = useSession();
  const location = useLocation();

  if (estat === ESTAT.COMPROVANT) return <Comprovant />;

  if (!currentUser) {
    const desti = location.pathname + (location.search ? `?${location.search}` : '');
    return <Navigate to={`${fallback}?tornar=${encodeURIComponent(desti)}`} replace />;
  }

  if (rol) {
    if (rolActual === null) return <Comprovant />;   // rol encara en vol
    if (rolActual !== rol) return <SenseRol rol={rol} />;
  }

  return children;
}
