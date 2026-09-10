import { usePerfil } from './PerfilContext.jsx';

/* El canviador de compte de WhatsApp: persona, empreses i grups en una
   sola llista. Filtra la columna del costat; no navega enlloc. */
export default function SelectorIdentitat() {
  const { identitats, identitat, triaIdentitat, carregant, error } = usePerfil();

  return (
    <>
      <header className="perfil-columna-capcalera">
        <h2 className="perfil-columna-titol">Identitats</h2>
      </header>
      {carregant ? <p className="perfil-detall-buit">Carregant…</p> : null}
      {error ? <p className="perfil-detall-buit">{error}</p> : null}
      {identitats.map((i) => (
        <button
          key={i.id}
          type="button"
          className="perfil-identitat"
          aria-current={String(i.id === identitat?.id)}
          onClick={() => triaIdentitat(i.id)}
        >
          <span className="perfil-ajust-cos">
            <span className="perfil-identitat-nom">{i.nom}</span>
            <span className="perfil-identitat-rol">{i.rol}</span>
          </span>
        </button>
      ))}
    </>
  );
}
