import { useEffect, useState } from 'react';
import { logout } from '../../data/backendPort.js';
import { useNavigate } from '../../app/contexts/RouterContext';
import { compressImage } from '../../utils/imageUtils.js';
import UniversalToolbar from '../../components/universal/UniversalToolbar';
import UniversalEditorShell from '../../components/universal/UniversalEditorShell';
import { FileText } from 'lucide-react';

export default function DetallAjust({ ajust, identitat, guardarAjust }) {
  const navigate = useNavigate();

  const [valorTemp, setValorTemp] = useState('');
  const [desant, setDesant] = useState(false);
  const [missatge, setMissatge] = useState(null);

  useEffect(() => {
    setValorTemp(ajust?.valor || '');
    setMissatge(null);
  }, [ajust?.id, identitat?.id]);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const dataUrl = await compressImage(file, { maxSize: 600, format: 'image/webp' });
      setValorTemp(dataUrl);
    } catch (error) {
      setMissatge({ tipus: 'error', text: 'S\'ha produït un error processant la imatge.' });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!ajust) return;
    
    setDesant(true);
    setMissatge(null);
    try {
      await guardarAjust(ajust.id, valorTemp);
      setMissatge({ tipus: 'exit', text: 'Desat correctament.' });
      
      setTimeout(() => setMissatge(null), 3000);
    } catch (error) {
      setMissatge({ tipus: 'error', text: error.message || 'Error en desar.' });
    } finally {
      setDesant(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  function renderitzaFormulari() {
    if (!ajust.obert) {
      return (
        <p className="perfil-detall-buit">
          {ajust.motiu || 'Aquest ajust no es pot modificar.'}
        </p>
      );
    }

    if (ajust.accio === 'logout') {
      return (
        <div className="sdp-buit">
          <button type="button" className="sdp-boto sdp-boto--perill" onClick={handleLogout}>
            Confirmar eixida
          </button>
        </div>
      );
    }

    const esMultilinia = ajust.id === 'descripcio' || ajust.id === 'biografia';
    const esContrasenya = ajust.id === 'contrasenya';
    const esAvatar = ajust.id === 'avatar';

    return (
      <form onSubmit={handleSubmit} className="form-trellat">
        <div className="sdp-camp">
          <label className="sdp-camp__etiqueta" htmlFor={`ajust-${ajust.id}`}>
            Nou valor per a {ajust.titol.toLowerCase()}:
          </label>
          
          {esAvatar ? (
            <div className="sdp-alerta__accions">
              {valorTemp && (
                <div className="sdp-avatar sdp-avatar--xl">
                  <img 
                    src={valorTemp} 
                    alt="Previsualització" 
                    className="sdp-avatar__imatge" 
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id={`ajust-${ajust.id}`}
                className="sdp-control"
                onChange={handleFileChange}
              />
            </div>
          ) : esMultilinia ? (
            <textarea
              id={`ajust-${ajust.id}`}
              className="sdp-control sdp-control--area"
              rows="5"
              value={valorTemp}
              onChange={(e) => setValorTemp(e.target.value)}
            />
          ) : (
            <input
              type={esContrasenya ? 'password' : 'text'}
              id={`ajust-${ajust.id}`}
              className="sdp-control"
              value={valorTemp}
              onChange={(e) => setValorTemp(e.target.value)}
              placeholder={esContrasenya ? 'Introdueix nova contrasenya...' : ''}
            />
          )}

          {missatge && (
            <p className={missatge.tipus === 'exit' ? 'sdp-text-exit' : 'sdp-camp__error'}>
              {missatge.text}
            </p>
          )}

          <div className="sdp-alerta__accions">
            <button type="submit" className="sdp-boto sdp-boto--primari" disabled={desant}>
              {desant ? 'Desant...' : 'Guardar'}
            </button>
          </div>
        </div>
      </form>
    );
  }

  if (!identitat) {
    return (
      <section className="notes-column">
        <div className="sdp-buit">
          <FileText size={64} />
          <h2>Sense Identitat</h2>
        </div>
      </section>
    );
  }

  const dades = identitat.dades || {};
  const isPersona = identitat.mena === 'persona';

  return (
    <UniversalEditorShell
      topBar={
        <UniversalToolbar 
          onPublish={() => alert("El perfil es desarà automàticament")} 
          isPublished={dades.is_public} 
          publishDisabled={false} 
        />
      }
      titleText={identitat.nom || 'Sense nom'}
      heroImage={dades.hero_image}
      logoImage={dades.avatar_url || dades.logo_url}
      isPublished={dades.is_public}
      titleHtml={identitat.nom || ''}
      subtitleHtml={isPersona ? '' : (dades.lema || '')}
      leadHtml={isPersona ? '' : (dades.description || '')}
      onSaveField={(field, value) => {
        if (field === 'title') guardarAjust(isPersona ? 'nom' : 'nom', value);
        if (field === 'subtitle' && !isPersona) guardarAjust('lema', value);
        if (field === 'lead' && !isPersona) guardarAjust('descripcio', value);
        if (field === 'logoImage') guardarAjust('avatar', value);
        if (field === 'heroImage') guardarAjust('hero_image', value);
      }}
      labels={[{ id: 'tipus', etiqueta: identitat.mena, color: 'gris' }]}
    >
      <div className="perfil-detall">
        {ajust ? (
          renderitzaFormulari()
        ) : (
          <p className="perfil-detall-buit">
            Estàs modificant la teua fitxa de perfil. Pots editar els camps a la capçalera (títol, subtítol, text inicial, i imatges) directament. O bé, selecciona un ajust a l'esquerra (com Contrasenya o Privacitat) per a modificar-lo aquí.
          </p>
        )}
      </div>
    </UniversalEditorShell>
  );
}
