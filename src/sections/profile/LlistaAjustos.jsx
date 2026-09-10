import { SlidersHorizontal, Search } from 'lucide-react';
import { usePerfil } from './PerfilContext.jsx';
import { useAppGrid } from '../../components/layout/AppGridShell';
import AppGridColumn from '../../components/layout/AppGridColumn';

/* Una fila per ajust. Si està tancada, ho diu i diu per què.
   Cap botó que falle en silenci contra l'RLS. */
export default function LlistaAjustos() {
  const { ajustos, ajust, triaAjust, identitat } = usePerfil();
  const { tancaPanells } = useAppGrid();

  const handleSelect = (id) => {
    triaAjust(id);
    tancaPanells();
  };

  return (
    <>
      <AppGridColumn titol={identitat?.nom || 'Ajustos'} icona={SlidersHorizontal} />
      
      <div className="notes-list-actions">
        <div className="notes-actions-left">
          <button type="button" className="btn-icon" title="Cercar">
            <Search size={20} />
          </button>
        </div>
        <button type="button" className="btn-create">
          CREAR
        </button>
      </div>

      <div className="notes-column__body no-padding">
      {ajustos.map((a) => (
        <button
          key={a.id}
          type="button"
          className="perfil-ajust"
          data-obert={a.obert ? 'si' : 'no'}
          disabled={!a.obert}
          aria-current={String(a.id === ajust?.id)}
          onClick={() => handleSelect(a.id)}
        >
          <span className="perfil-ajust-cos">
            <span className="perfil-ajust-titol">{a.titol}</span>
            {a.valor ? <span className="perfil-ajust-valor">{a.valor}</span> : null}
            {!a.obert && a.motiu ? <span className="perfil-ajust-motiu">{a.motiu}</span> : null}
          </span>
        </button>
      ))}
      </div>
    </>
  );
}
