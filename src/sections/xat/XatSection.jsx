import React, { useState, useRef, useEffect } from 'react';
import { Users, Search, ArrowLeft, Send, MoreVertical, Image as ImageIcon, Settings, X, Plus, Video, Phone, MoreHorizontal } from 'lucide-react';
import { useAppData } from '../../app/AppDataContext';
import { useNavigate, useParams } from 'react-router-dom';
import NotFoundPage from '../../pages/NotFoundPage';
import { ContentProvider } from '../../components/universal/ContentProvider';
import TextSection from '../text/TextSection';

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
  const { chatThreads, getThreadMessages, sendChatMessage, t, pageCopy } = useAppData();
  const { threadId } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('totes'); // totes, no-llegits, grups...
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const threads = chatThreads || [];
  
  const activeThread = threadId 
    ? threads.find(c => String(c.id) === threadId)
    : null; // Si no hi ha thread, deixem el panell dret buit en escriptori

  if (threadId && !activeThread) {
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
    navigate(`/xat/${id}`);
  };

  const handleBackToList = () => {
    navigate('/xat');
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
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button 
                className="pill pill--icon xat-settings-btn" 
                aria-label="Control General" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Settings size={24} color="#ffffff" />
              </button>
              
              {isMenuOpen && (
                <div className="xat-control-dropdown sdp-card">
                  <button className="xat-dropdown-item">⚙️ ENTRAR AL CONTROL GENERAL</button>
                  <button className="xat-dropdown-item">Afegeix membres / Nou Xat</button>
                  <button className="xat-dropdown-item">Informació del grup / Perfil</button>
                  <button className="xat-dropdown-item">Fitxers multimèdia del xat</button>
                  <button className="xat-dropdown-item">Cerca</button>
                  <button className="xat-dropdown-item">Silenciar notificacions</button>
                  <button className="xat-dropdown-item">Missatges temporals</button>
                  <button className="xat-dropdown-item">Fons de pantalla</button>
                </div>
              )}
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

function ChatConversation({ thread, messages, onSendMessage, onBack }) {
  const [text, setText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const chatLogRef = useRef(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

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

  return (
    <>
      <header className="xat-main-header">
        <button className="pill pill--icon mobile-only" onClick={onBack} aria-label="Tornar" style={{ boxShadow: 'none' }}>
          <ArrowLeft size={24} color="var(--sdp-text-invers)" />
        </button>
        <Avatar kind={thread?.type} src={thread?.avatar_url} size={40} />
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '1.05rem' }}>{thread?.name || thread?.title}</strong>
          <span style={{ fontSize: '0.8rem', opacity: 0.8, display: 'block' }}>Prem ací per a més informació</span>
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
                  <button className="xat-dropdown-item">Seleccionar missatges</button>
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

      <div className="xat-messages" ref={chatLogRef}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', margin: 'auto', padding: 16, borderRadius: 8 }}>
            Cap missatge encara. Inicia la conversa!
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={msg.id || i} className={`xat-bubble ${msg.sender === 'me' || msg.is_ai ? 'xat-bubble-me' : 'xat-bubble-other'}`}>
            {msg.sender !== 'me' && !msg.is_ai && (
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--sdp-accent)', marginBottom: 2 }}>
                {msg.author || msg.author_name || 'Usuari'}
              </div>
            )}
            <div>{msg.text ?? msg.content ?? ''}</div>
            <div className="xat-bubble-meta">
              {msg.time_label || 'Ara mateix'} {msg.synthetic && ' (Sintètic)'}
            </div>
          </div>
        ))}
      </div>

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
    </>
  );
}
