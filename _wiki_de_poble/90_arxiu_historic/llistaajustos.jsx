import { usePerfil } from './PerfilContext.jsx';

/* Una fila per ajust. Si està tancada, ho diu i diu per què.
   Cap botó que falle en silenci contra l'RLS. */
export default function LlistaAjustos() {
  const { ajustos, ajust, triaAjust, identitat, panellObert, setPanellObert } = usePerfil();

  return (
    <>
      <header className="perfil-columna-capcalera">
        {panellObert === 'ajustos' ? (
          <button type="button" className="perfil-ajust" onClick={() => setPanellObert('identitats')}>
            Identitats
          </button>
        ) : null}
        <h2 className="perfil-columna-titol">{identitat?.nom}</h2>
      </header>
      {ajustos.map((a) => (
        <button
          key={a.id}
          type="button"
          className="perfil-ajust"
          data-obert={a.obert ? 'si' : 'no'}
          disabled={!a.obert}
          aria-current={String(a.id === ajust?.id)}
          onClick={() => triaAjust(a.id)}
        >
          <span className="perfil-ajust-cos">
            <span className="perfil-ajust-titol">{a.titol}</span>
            {a.valor ? <span className="perfil-ajust-valor">{a.valor}</span> : null}
            {!a.obert && a.motiu ? <span className="perfil-ajust-motiu">{a.motiu}</span> : null}
          </span>
        </button>
      ))}
    </>
  );
}
