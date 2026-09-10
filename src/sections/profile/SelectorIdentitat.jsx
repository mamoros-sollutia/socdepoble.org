import { Plus, Users, Inbox, Settings } from 'lucide-react';
import { usePerfil } from './PerfilContext.jsx';
import { useAppGrid } from '../../components/layout/AppGridShell';
import AppGridColumn from '../../components/layout/AppGridColumn';

/* El canviador de compte de WhatsApp: persona, empreses i grups en una
   sola llista. Filtra la columna del costat; no navega enlloc. */
export default function SelectorIdentitat() {
  const { identitats, identitat, triaIdentitat, carregant, error, creaOrganitzacio } = usePerfil();
  const { mida, setPanellObert } = useAppGrid();
  const isCompact = mida !== 'ample';

  const handleSelect = (id) => {
    triaIdentitat(id);
    if (isCompact) setPanellObert('middle');
  };

  return (
    <>
      <AppGridColumn
        titol="Identitats"
        icona={Users}
        accions={[{
          id: 'nova-organitzacio',
          icona: Plus,
          etiqueta: 'Crear una empresa o un grup',
          onAcciona: creaOrganitzacio
        }]}
      />

      <div className="sidebar-actions">
        <button type="button" className="folder-item active">
          <Inbox size={24} strokeWidth={2.1} />
          <span>Tot</span>
        </button>
        <div className="dropdown-container">
          <button type="button" className="btn-icon btn-icon--settings" title="Ajustaments">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="notes-column__body" className="no-padding">
        {carregant ? <p className="perfil-detall-buit">Carregant…</p> : null}
      {error ? <p className="perfil-detall-buit">{error}</p> : null}
      {identitats.map((i) => (
        <button
          key={i.id}
          type="button"
          className="perfil-identitat"
          aria-current={String(i.id === identitat?.id)}
          onClick={() => handleSelect(i.id)}
        >
          <span className="perfil-ajust-cos ident-flex-row">
            {i.avatar ? (
              <img src={i.avatar} alt="" className="perfil-identitat-avatar ident-avatar" />
            ) : (
              <span className="perfil-identitat-inicial">
                {i.nom?.charAt(0) || '?'}
              </span>
            )}
            <div className="ident-flex-col">
              <span className="perfil-identitat-nom">{i.nom}</span>
              <span className="perfil-identitat-rol">{i.rol}</span>
            </div>
          </span>
        </button>
      ))}
      </div>
    </>
  );
}
