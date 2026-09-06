import { usePerfil } from './PerfilContext.jsx';

/* Sempre muntat. Quan no hi ha res triat, ensenya el buit; no
   desapareix. Desmuntar-lo és el que costava el cursor a les notes. */
export default function DetallAjust() {
  const { ajust, identitat, panellObert, setPanellObert } = usePerfil();

  return (
    <>
      <header className="perfil-columna-capcalera">
        {panellObert === 'detall' ? (
          <button type="button" className="perfil-ajust" onClick={() => setPanellObert('ajustos')}>
            {identitat?.nom}
          </button>
        ) : null}
        <h2 className="perfil-columna-titol">{ajust ? ajust.titol : 'Detall'}</h2>
      </header>
      <div className="perfil-detall">
        {ajust ? (
          <p className="card__text">{ajust.valor || 'Sense valor encara.'}</p>
        ) : (
          <p className="perfil-detall-buit">Tria un ajust de la llista.</p>
        )}
      </div>
    </>
  );
}
