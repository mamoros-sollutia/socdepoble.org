import React, { useState, useRef, useEffect } from 'react';
import { Users, Search, ArrowLeft, Send, Image as ImageIcon, Settings, X, Plus, Video, Phone, MoreHorizontal, FileText, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import NotFoundPage from '../../pages/NotFoundPage';
import { ContentProvider } from '../../components/universal/ContentProvider';
import TextSection from '../text/TextSection';
import { useXat } from './XatContext';
import { useUIActions, useUIState } from '../../app/contexts/UIContext';
import { useCoreContent } from '../../app/contexts/CoreContentContext';
import { useNotesData } from '../notes/NotesDataContext';
import { useIdentitat } from '../../app/contexts/IdentitatContext';
import { showToast } from '../../components/universal/AvisadorEfimer';
import { construeixRetall } from './retall.js';

// Component per als avatars
function Avatar({ src, size = 48 }) {
  if (src) {
    return <img src={src} alt="Avatar" className="xat-item-avatar" style={{ width: size, height: size }} />;
  }
  return (
    <div className="xat-item-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Users size={size * 0.5} color="var(--sdp-text-suau)" />
    </div>
  );
}

export default function XatSection() {
  /* `obriFil`, `status` i `avis` porten valor per defecte a propòsit:
     XatSection.test.jsx substituïx el mòdul XatContext sencer per un doble que
     no els té. Sense el defecte, el test peta en `obriFil is not a function`. */
  const {
    chatThreads,
    getThreadMessages,
    sendChatMessage,
    obriFil = () => {},
    status = 'ready',
    avis = null
  } = useXat();
  const { t } = useUIActions();
  const { language } = useUIState();
  const { pageCopy } = useCoreContent();
  const { creaNota } = useNotesData();
  const { actorType, actorId } = useIdentitat();
  const { threadId } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('totes'); // totes, no-llegits, grups...

  const threads = chatThreads || [];

  const activeThread = threadId
    ? threads.find(c => String(c.id) === threadId)
    : null; // Si no hi ha thread, deixem el panell dret buit en escriptori

  /* RUTES ABSOLUTES (P2 · 260908).
     `navigate` resol el relatiu contra la ruta que ha pintat el component, no
     contra el prefix de l'actor. Des de `xat/:threadId`, `navigate('.')` es
     queda on està (el botó «Tornar» del mòbil no feia res) i `navigate('xyz')`
     anava a /jo/xat/<actual>/xyz. Es construïx la base com ja fa enviaAlBloc. */
  const base = actorType === 'entitat' ? `/e/${actorId}` : '/jo';

  /* El fil actiu el mana la URL; el context no veu useParams perquè XatProvider
     viu per damunt de <Routes>. Aquesta és l'única corretja entre els dos.

     VA ABANS DEL RETURN PRIMERENC, NO DESPRÉS. Un hook darrere d'un `return`
     condicional és una violació de les Regles dels Hooks: el dia que es pinte
     NotFound, React compta menys hooks que al render anterior i llança. */
  useEffect(() => {
    obriFil(threadId || null);
  }, [threadId, obriFil]);

  /* Sense la guarda d'estat, entrar directament a /jo/xat/:id (o el redirigit
     /iaia) pintava NotFound mentre la llista encara carregava. */
  if (threadId && !activeThread && status === 'ready') {
    return <NotFoundPage />;
  }

  const messages = activeThread ? getThreadMessages(activeThread.id) : [];

  // Filtrem per cerca
  const filteredThreads = threads.filter(th => {
    if (!searchTerm) return true;
    const name = th.name || th.title || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Funcions
  const handleSelectThread = (id) => {
    navigate(`${base}/xat/${encodeURIComponent(String(id))}`);
  };

  const handleBackToList = () => {
    navigate(`${base}/xat`);
  };

  /**
   * EL PONT. Missatges triats → nota nova → Bloc de Notes obert damunt d'ella.
   *
   * RUTA ABSOLUTA, NO RELATIVA (P2 · 260908): `navigate('../notes')` resol
   * diferent segons si vens de `xat` o de `xat/:threadId` — el mateix defecte
   * que ja pateix `../control-xat` d'ací dalt. Es construïx com a MobileNav.
   *
   * ROLLBACK PESSIMISTA: si la creació falla, es torna a llançar perquè la
   * conversa conserve la selecció i l'usuari puga reintentar sense tornar a
   * triar els missatges un per un.
   */
  const enviaAlBloc = async (triats) => {
    const retall = construeixRetall({
      fil: activeThread,
      missatges: triats,
      locale: language === 'ca' ? 'ca-ES' : 'es-ES'
    });

    try {
      const nota = await creaNota(retall);
      showToast('Retall guardat al Bloc de Notes.', 'success');
      navigate(`${base}/notes?nota=${encodeURIComponent(nota.id)}`);
    } catch (error) {
      console.error('[xat] no s\'ha pogut crear el retall:', error);
      showToast("No s'ha pogut crear la nota. Comprova la connexió i que tingues la sessió iniciada.", 'error');
      throw error;
    }
  };

  const config = {
    title: t('section.xat.kicker', 'Xat'),
    subtitle: t('section.xat.title', 'Converses'),
    lead: t('section.xat.subtitle', 'Connecta amb els veïns i grups del poble.'),
    chrome: "system",
    showLogos: true
  };

  return (
    <ContentProvider initialConfig={config}>
      <div className="xat-layout">

        {/* SIDEBAR (Llista de Xats) */}
        <aside className={`xat-sidebar ${threadId ? 'has-thread' : ''}`}>
          <header className="xat-sidebar-header">
            <div className="search-bar-basic">
              <Search size={18} color="#ffffff" className="search-icon" />
              <input
                type="text"
                placeholder="CERCA UN XAT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="xat-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Netejar cerca"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <button
                className="pill pill--icon xat-settings-btn"
                aria-label="Control General del Xat"
                onClick={() => navigate(`${base}/control-xat`)}
              >
                <Settings size={24} color="#ffffff" />
              </button>
            </div>
          </header>

          {/* FILTRES */}
          <div className="xat-filters">
            <button className={`btn-taronja-fort ${activeFilter === 'totes' ? 'active' : ''}`} onClick={() => setActiveFilter('totes')}>Tot</button>
            <button className={`btn-taronja-fort ${activeFilter === 'no-llegits' ? 'active' : ''}`} onClick={() => setActiveFilter('no-llegits')}>No llegit</button>
            <button className={`btn-taronja-fort ${activeFilter === 'grups' ? 'active' : ''}`} onClick={() => setActiveFilter('grups')}>Grups</button>
            <button className={`btn-taronja-fort ${activeFilter === 'iaies' ? 'active' : ''}`} onClick={() => setActiveFilter('iaies')}>IAIES</button>
            <button className="btn-taronja-fort btn-taronja-fort--icon" aria-label="Afegir filtre"><Plus size={16} /></button>
          </div>

          <div className="xat-list">
            {avis && (
              <div className="xat-item" role="status">
                <div className="xat-item-content">
                  <div className="xat-item-title">No s&apos;ha pogut carregar el xat</div>
                  <div className="xat-item-preview">{avis}</div>
                </div>
              </div>
            )}
            {filteredThreads.map((th) => (
              <div
                key={th.id}
                className={`xat-item ${threadId === String(th.id) ? 'active' : ''}`}
                onClick={() => handleSelectThread(th.id)}
              >
                <Avatar kind={th.type} src={th.avatar_url} />
                <div className="xat-item-content">
                  <div className="xat-item-header">
                    <span className="xat-item-title">{th.name || th.title}</span>
                    <span className="xat-item-time">{th.lastMessageTime || 'Ahir'}</span>
                  </div>
                  <div className="xat-item-preview">
                    {th.lastMessagePreview || 'Cap missatge.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ÀREA PRINCIPAL (Conversa o Buit) */}
        <main className={`xat-main ${!threadId ? 'hidden-on-mobile' : 'active-on-mobile'}`}>
          {activeThread ? (
            <ChatConversation
              thread={activeThread}
              messages={messages}
              onSendMessage={sendChatMessage}
              onBack={handleBackToList}
              onEnviaAlBloc={enviaAlBloc}
            />
          ) : (
            <div className="xat-empty hidden-on-mobile" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
              {pageCopy?.['anima'] ? (
                <TextSection page={pageCopy['anima']} pageKey="anima" />
              ) : (
                <div className="xat-empty-message">
                  <img src="/assets/system/ui/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble" />
                  <h2>Sóc de Poble Desktop</h2>
                  <p>Selecciona una conversa per començar a xatejar amb la gent de La Torre.</p>
                </div>
              )}
            </div>
          )}
        </main>

      </div>
    </ContentProvider>
  );
}

function ChatConversation({ thread, messages, onSendMessage, onBack, onEnviaAlBloc }) {
  const [text, setText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [modeSeleccio, setModeSeleccio] = useState(false);
  const [triats, setTriats] = useState(() => new Set());
  const [creantNota, setCreantNota] = useState(false);
  const chatLogRef = useRef(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  /* Canviar de conversa buida la selecció. Si no, una selecció viva d'un altre
     fil permetria retallar missatges de dues converses dins d'una sola nota. */
  useEffect(() => {
    setModeSeleccio(false);
    setTriats(new Set());
  }, [thread?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    setText('');
    try {
      await onSendMessage(thread, value);
    } catch {
      setText(value); // Restaura
    }
  };

  /* Els missatges del seed porten `id` numèric per fil i els de Supabase un
     uuid. La posició és l'últim recurs, no el primer. */
  const clauDe = (msg, i) => String(msg.id ?? `pos-${i}`);

  const alterna = (clau) => {
    setTriats((previs) => {
      const nous = new Set(previs);
      if (nous.has(clau)) nous.delete(clau);
      else nous.add(clau);
      return nous;
    });
  };

  const surtDeSeleccio = () => {
    setModeSeleccio(false);
    setTriats(new Set());
  };

  const enviaAlBloc = async () => {
    if (creantNota) return;
    /* ORDRE CRONOLÒGIC, NO ORDRE DE CLIC: es recorre `messages`, no el Set. Si
       algú tria l'últim missatge i després el primer, la nota ha d'eixir en
       l'ordre en què es va parlar, no en el que es va polsar. */
    const tria = messages.filter((m, i) => triats.has(clauDe(m, i)));
    if (tria.length === 0) return;

    setCreantNota(true);
    try {
      await onEnviaAlBloc(tria);
      surtDeSeleccio();
    } catch {
      /* El pare ja ha avisat l'usuari. Ací només es conserva la selecció
         perquè puga reintentar sense tornar a triar-ho tot. */
    } finally {
      setCreantNota(false);
    }
  };

  return (
    <>
      {modeSeleccio ? (
        <header className="xat-main-header xat-main-header--seleccio">
          <button type="button" className="xat-header-btn" onClick={surtDeSeleccio} aria-label="Eixir de la selecció">
            <X size={24} color="currentColor" />
          </button>
          <strong style={{ flex: 1 }} aria-live="polite">
            {triats.size === 0 ? 'Tria els missatges' : `${triats.size} triat${triats.size === 1 ? '' : 's'}`}
          </strong>
        </header>
      ) : (
        <header className="xat-main-header">
          <button className="pill pill--icon mobile-only" onClick={onBack} aria-label="Tornar" style={{ boxShadow: 'none' }}>
            <ArrowLeft size={24} color="var(--sdp-text-invers)" />
          </button>
          <Avatar kind={thread?.type} src={thread?.avatar_url} size={40} />
          <div style={{ flex: 1 }}>
            <strong>{thread?.name || thread?.title}</strong>
            <span style={{ opacity: 0.8, display: 'block' }}>Prem ací per a més informació</span>
          </div>
          <div className="xat-header-actions">
            <button className="xat-header-btn"><Video size={20} color="currentColor" /></button>
            <button className="xat-header-btn"><Phone size={20} color="currentColor" /></button>
            <div style={{ position: 'relative' }}>
              <button className={`xat-header-btn ${menuOpen ? 'xat-header-btn--active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}><MoreHorizontal size={20} color="currentColor" /></button>
              {menuOpen && (
                <div className="xat-header-dropdown">
                  <button className="xat-dropdown-item">Info. del contacte</button>
                  <button className="xat-dropdown-item">Cercar</button>
                  <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--sdp-vora-control)' }} />
                  <button
                    type="button"
                    className="xat-dropdown-item"
                    onClick={() => { setModeSeleccio(true); setMenuOpen(false); }}
                  >
                    Seleccionar missatges
                  </button>
                  <button className="xat-dropdown-item">Silenciar</button>
                  <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--sdp-vora-control)' }} />
                  <button className="xat-dropdown-item">Nova telefonada en grup</button>
                  <button className="xat-dropdown-item">Enviar enllaç de telefonada</button>
                  <button className="xat-dropdown-item">Programar telefonada</button>
                  <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid var(--sdp-vora-control)' }} />
                  <button className="xat-dropdown-item">Obrir en una finestra nova</button>
                  <button className="xat-dropdown-item xat-dropdown-item--danger">Tancar xat</button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <div className="xat-messages" ref={chatLogRef}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', margin: 'auto', padding: 16, borderRadius: 8 }}>
            Cap missatge encara. Inicia la conversa!
          </div>
        )}
        {messages.map((msg, i) => {
          const clau = clauDe(msg, i);
          const triat = triats.has(clau);
          const classes = [
            'sdp-chat-bubble',
            /* `--user` és la bombolla de la dreta i `--ai` la de l'esquerra
               (css/index.css:2845-2858). Posar `msg.is_ai` al costat de
               `sender === 'me'` empenyia els missatges de la IAIA a la dreta,
               com si els haguera escrit l'usuari. Qui mana és el remitent. */
            msg.sender === 'me' ? 'sdp-chat-bubble--user' : 'sdp-chat-bubble--ai',
            modeSeleccio ? 'sdp-chat-bubble--triable' : '',
            triat ? 'sdp-chat-bubble--triat' : ''
          ].filter(Boolean).join(' ');

          return (
            <div
              key={clau}
              className={classes}
              role={modeSeleccio ? 'checkbox' : undefined}
              aria-checked={modeSeleccio ? triat : undefined}
              tabIndex={modeSeleccio ? 0 : undefined}
              onClick={modeSeleccio ? () => alterna(clau) : undefined}
              onKeyDown={modeSeleccio ? (e) => {
                if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); alterna(clau); }
              } : undefined}
            >
              {msg.sender !== 'me' && (
                <div style={{ marginBottom: 2 }}>
                  {msg.author || msg.author_name || 'Usuari'}
                </div>
              )}
              <div>{msg.text ?? msg.content ?? ''}</div>
              <div className="sdp-chat-bubble-meta">
                {msg.time_label || ''}{msg.estatEnviament === 'pendent' ? ' · enviant…' : ''}
              </div>
              {modeSeleccio && (
                <span className="xat-marca-tria" aria-hidden="true">
                  {triat ? <Check size={16} /> : null}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {modeSeleccio ? (
        <div className="xat-composer xat-composer--seleccio">
          <button
            type="button"
            className="xat-accio-bloc"
            onClick={enviaAlBloc}
            disabled={triats.size === 0 || creantNota}
          >
            <FileText size={20} />
            <span>{creantNota ? 'Creant la nota…' : 'Enviar al Bloc de Notes'}</span>
          </button>
        </div>
      ) : (
        <form className="xat-composer" onSubmit={handleSubmit}>
          <button type="button" className="pill pill--icon" aria-label="Adjuntar" style={{ boxShadow: 'none' }}>
            <ImageIcon size={24} color="var(--sdp-text-suau)" />
          </button>
          <div className="xat-input-wrap">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escriu un missatge..."
            />
          </div>
          <button type="submit" className="xat-send-btn">
            <Send size={18} />
          </button>
        </form>
      )}
    </>
  );
}
