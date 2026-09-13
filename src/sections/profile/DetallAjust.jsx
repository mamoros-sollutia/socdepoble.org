import { useEffect, useState } from 'react';
import { logout } from '../../data/backendPort.js';
import { useNavigate } from '../../app/contexts/RouterContext';
import { compressImage } from '../../utils/imageUtils.js';
import { sanitizeHtml } from '../../utils/sanitize.js';
import UniversalToolbar from '../../components/universal/UniversalToolbar';
import { UniversalEditorShell } from '../../components/universal/UniversalEditorShell';
import { UniversalPage } from '../../components/universal/UniversalPage';

export default function DetallAjust({ ajust, identitat, guardarAjust, guardarCampPerfil }) {
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
    } catch {
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
      <UniversalPage
        titleText="El Meu Perfil"
        heroImage="/assets/system/ui/login-fons.jpg"
        logoImage="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"
        title={<span dangerouslySetInnerHTML={{ __html: sanitizeHtml("Benvingut al teu perfil") }} />}
        subtitle={<span dangerouslySetInnerHTML={{ __html: sanitizeHtml("L'ànima de la IAIA") }} />}
        lead={<span dangerouslySetInnerHTML={{ __html: sanitizeHtml("Registra't per a tindre la teua pròpia veu, crear targetes i personalitzar el teu entorn.") }} />}
        isPublished={true}
      >
        <div className="perfil-detall-buit">
          Crea el teu compte o inicia sessió per a començar.
        </div>
      </UniversalPage>
    );
  }

  const dades = identitat.dades || {};
  const isPersona = identitat.mena === 'persona';

  return (
    <UniversalEditorShell 
      id={identitat.id}
      topBar={
        <UniversalToolbar 
          onPublish={() => alert("El perfil es desarà automàticament")} 
          isPublished={dades.is_public} 
          publishDisabled={false} 
        />
      }
      titleHtml={identitat.nom || ''}
      subtitleHtml={isPersona ? null : (dades.lema || '')}
      leadHtml={isPersona ? null : (dades.description || '')}
      heroImage={dades.hero_image}
      logoImage={dades.avatar_url || dades.logo_url}
      isPublished={Boolean(dades.is_public)}
      onSaveField={(field, value, identitatId) => {
        if (field === 'title') guardarCampPerfil(isPersona ? 'full_name' : 'name', value, identitatId);
        if (field === 'subtitle' && !isPersona) guardarCampPerfil('lema', value, identitatId);
        if (field === 'lead' && !isPersona) guardarCampPerfil('description', value, identitatId);
        if (field === 'logoImage') guardarCampPerfil(isPersona ? 'avatar_url' : 'logo_url', value, identitatId);
        if (field === 'heroImage') guardarCampPerfil('hero_image', value, identitatId);
      }}
      showStatusToggle={false}
    >
      <div className="perfil-detall">
        {ajust ? (
          renderitzaFormulari()
        ) : (
          <p className="perfil-detall-buit">
            Selecciona un ajust de l'esquerra per a modificar-lo.
          </p>
        )}
      </div>
    </UniversalEditorShell>
  );
}
