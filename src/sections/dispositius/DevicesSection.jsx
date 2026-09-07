import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Link2, MessageSquare, Plus, RefreshCcw, ShieldCheck, Wifi, X, Eye, EyeOff } from 'lucide-react';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { useUIState } from '../../app/contexts/UIContext';
import { useCoreContent } from '../../app/contexts/CoreContentContext';
import { useIdentitat } from '../../app/contexts/IdentitatContext';
import {
  PRESENCE_STALE_MS,
  createChatMessage,
  createDeviceBridge,
  loadDeviceChats,
  loadDeviceConnections,
  loadDeviceProfile,
  loadSelectedPeer,
  saveDeviceConnections,
  saveDeviceChats,
  saveDeviceProfile,
  saveSelectedPeer
} from './devicesRuntime';

const MOCK_DEVICES = [
  {
    id: 'E9B234F1-mock-a',
    name: 'Mòbil de prova',
    kind: 'mock',
    lastSeen: Date.now()
  },
  {
    id: '4A1D8F2C-mock-b',
    name: 'Tauleta de prova',
    kind: 'mock',
    lastSeen: Date.now()
  },
  {
    id: 'B8C1D9F4-mock-c',
    name: 'Ordinador de prova',
    kind: 'mock',
    lastSeen: Date.now()
  }
];

const MOCK_REPLIES = {
  'E9B234F1-mock-a': [
    'Ací el Mòbil de prova. Canal disponible i operatiu.',
    'Rebut en el mòbil. El flux de proves continua bé.',
    'Això arriba correcte al telèfon.'
  ],
  '4A1D8F2C-mock-b': [
    'Tauleta de prova connectada.',
    'Verificant paquets des de la tauleta... Tot verd.',
    'Dispositiu actiu i responent al missatge.'
  ],
  'B8C1D9F4-mock-c': [
    'Ordinador de prova en línia.',
    'Connexió estable des de l\'escriptori.',
    'Perfecte, l\'ordinador rep correctament.'
  ]
};

export default function DevicesSection() {
  const { externalConfig } = useUIState();
  const { agents } = useCoreContent();
  const { ownerUserId } = useIdentitat();
  const tenantId = externalConfig?.tenantId || 'default-tenant';
  const activeAgent = agents?.find(a => String(a.id) === String(ownerUserId));
  const activeName = activeAgent?.name || 'Mestre Poble';
  
  const [profile, setProfile] = useState(() => loadDeviceProfile(tenantId, activeName));
  const [draftName, setDraftName] = useState(() => loadDeviceProfile(tenantId, activeName).name);
  const [devices, setDevices] = useState({});
  const [connections, setConnections] = useState(() => loadDeviceConnections(tenantId, loadDeviceProfile(tenantId, activeName).id));
  const [messagesByPeer, setMessagesByPeer] = useState(() => loadDeviceChats(tenantId, loadDeviceProfile(tenantId, activeName).id));
  const [selectedPeerId, setSelectedPeerId] = useState(() => loadSelectedPeer(tenantId, loadDeviceProfile(tenantId, activeName).id));
  const [draftMessage, setDraftMessage] = useState('');
  const [isSimulationEnabled, setIsSimulationEnabled] = useState(false);
  const bridgeRef = useRef(null);
  const mockReplyTimerRef = useRef(null);
  const chatLogRef = useRef(null);

  const supportsBridge = typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined';

  const visibleDevices = useMemo(
    () =>
      Object.values(devices)
        .filter((device) => device.id !== profile.id)
        .filter((device) => Date.now() - (device.lastSeen || 0) < PRESENCE_STALE_MS)
        .sort((left, right) => (right.lastSeen || 0) - (left.lastSeen || 0)),
    [devices, profile.id]
  );

  const mergedDevices = useMemo(() => {
    const visibleIds = new Set(visibleDevices.map((device) => device.id));
    const mockDevices = isSimulationEnabled
      ? MOCK_DEVICES.filter((device) => !visibleIds.has(device.id)).map((device) => ({
          ...device,
          lastSeen: Date.now()
        }))
      : [];
    return [...mockDevices, ...visibleDevices];
  }, [visibleDevices, isSimulationEnabled]);

  const connectedPeers = useMemo(
    () => mergedDevices.filter((device) => connections[device.id]?.state === 'connected'),
    [connections, mergedDevices]
  );
  const activeChatPeer = connectedPeers.find((device) => device.id === selectedPeerId) || null;

  const activeChatConnection = activeChatPeer ? connections[activeChatPeer.id] : null;
  const activeChatMessages = activeChatPeer ? messagesByPeer[activeChatPeer.id] || [] : [];

  const appendMessage = (peerId, message) => {
    setMessagesByPeer((current) => {
      const next = {
        ...current,
        [peerId]: [...(current[peerId] || []), message]
      };
      saveDeviceChats(tenantId, profile.id, next);
      return next;
    });
  };

  useEffect(() => {
    saveDeviceProfile(tenantId, profile);
    setDraftName(profile.name);
  }, [profile, tenantId]);

  useEffect(() => {
    saveDeviceConnections(tenantId, profile.id, connections);
  }, [connections, profile.id, tenantId]);

  useEffect(() => {
    saveSelectedPeer(tenantId, profile.id, selectedPeerId);
  }, [profile.id, selectedPeerId, tenantId]);

  useEffect(() => {
    if (!supportsBridge) return undefined;

    bridgeRef.current?.destroy?.();
    bridgeRef.current = createDeviceBridge(tenantId, profile, {
      onPresence(device) {
        setDevices((current) => ({
          ...current,
          [device.id]: {
            ...current[device.id],
            ...device,
            lastSeen: Date.now()
          }
        }));
      },
      onConnectRequest(fromId) {
        setConnections((current) => ({
          ...current,
          [fromId]: { state: 'incoming', updatedAt: Date.now() }
        }));
        setSelectedPeerId((current) => current || fromId);
      },
      onConnectAccept(fromId) {
        setConnections((current) => ({
          ...current,
          [fromId]: { state: 'connected', updatedAt: Date.now() }
        }));
        setSelectedPeerId(fromId);
      },
      onConnectDecline(fromId) {
        setConnections((current) => ({
          ...current,
          [fromId]: { state: 'declined', updatedAt: Date.now() }
        }));
      },
      onMessage(fromId, message) {
        setConnections((current) => ({
          ...current,
          [fromId]: { state: 'connected', updatedAt: Date.now() }
        }));
        appendMessage(fromId, { ...message, sender: 'other' });
        setSelectedPeerId((current) => current || fromId);
      },
      onDisconnect(fromId) {
        setConnections((current) => ({
          ...current,
          [fromId]: { state: 'idle', updatedAt: Date.now() }
        }));
        appendMessage(
          fromId,
          createChatMessage({
            sender: 'other',
            text: 'La connexió s’ha tancat des de l’altre dispositiu.',
            author: mergedDevices.find((device) => device.id === fromId)?.name || 'Dispositiu'
          })
        );
      }
    });

    return () => {
      bridgeRef.current?.destroy?.();
      bridgeRef.current = null;
    };
  }, [profile, supportsBridge, tenantId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDevices((current) =>
        Object.fromEntries(
          Object.entries(current).filter(([, device]) => Date.now() - (device.lastSeen || 0) < PRESENCE_STALE_MS * 2)
        )
      );
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => () => {
    if (mockReplyTimerRef.current) {
      window.clearTimeout(mockReplyTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!selectedPeerId && connectedPeers.length > 0) {
      setSelectedPeerId(connectedPeers[0].id);
    }
  }, [connectedPeers, selectedPeerId]);

  useEffect(() => {
    if (selectedPeerId && connections[selectedPeerId]?.state === 'connected') return;
    if (connectedPeers.length > 0) {
      setSelectedPeerId(connectedPeers[0].id);
      return;
    }
    if (selectedPeerId) {
      setSelectedPeerId('');
    }
  }, [connectedPeers, connections, selectedPeerId]);

  useEffect(() => {
    if (!chatLogRef.current) return;
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [activeChatMessages, activeChatPeer]);

  const refreshDiscovery = () => {
    bridgeRef.current?.announcePresence?.();
    bridgeRef.current?.requestPresence?.();
  };

  const saveName = () => {
    const nextName = draftName.trim();
    if (!nextName) return;
    setProfile((current) => ({ ...current, name: nextName }));
    window.setTimeout(() => {
      bridgeRef.current?.announcePresence?.();
    }, 0);
  };

  const requestConnection = (peerId) => {
    setConnections((current) => ({
      ...current,
      [peerId]: { state: 'pending', updatedAt: Date.now() }
    }));
    if (MOCK_DEVICES.some((device) => device.id === peerId)) {
      const mockDevice = MOCK_DEVICES.find((device) => device.id === peerId);
      mockReplyTimerRef.current = window.setTimeout(() => {
        setConnections((current) => ({
          ...current,
          [peerId]: { state: 'connected', updatedAt: Date.now() }
        }));
        
        // Evitar duplicar el missatge de benvinguda si ja hem interactuat
        setMessagesByPeer((current) => {
          const currentMsgs = current[peerId] || [];
          if (currentMsgs.length === 0) {
            return {
              ...current,
              [peerId]: [
                ...currentMsgs,
                createChatMessage({
                  sender: 'other',
                  text: 'Connexió simulada acceptada. Tot el que escrigues ací anirà directament a la safata de xat d\'aquest usuari.',
                  author: mockDevice?.name || 'Dispositiu de prova'
                })
              ]
            };
          }
          return current;
        });
      }, 700);
      setSelectedPeerId(peerId);
      return;
    }
    bridgeRef.current?.requestConnection?.(peerId);
    setSelectedPeerId(peerId);
  };

  const acceptConnection = (peerId) => {
    setConnections((current) => ({
      ...current,
      [peerId]: { state: 'connected', updatedAt: Date.now() }
    }));
    bridgeRef.current?.acceptConnection?.(peerId);
    setSelectedPeerId(peerId);
  };

  const declineConnection = (peerId) => {
    setConnections((current) => ({
      ...current,
      [peerId]: { state: 'idle', updatedAt: Date.now() }
    }));
    bridgeRef.current?.declineConnection?.(peerId);
  };

  const disconnectPeer = (peerId) => {
    setConnections((current) => ({
      ...current,
      [peerId]: { state: 'idle', updatedAt: Date.now() }
    }));
    if (!MOCK_DEVICES.some((device) => device.id === peerId)) {
      bridgeRef.current?.disconnectConnection?.(peerId);
    }
  };

  const sendMessage = (text) => {
    if (!selectedPeerId || !text.trim()) return;
    const message = createChatMessage({
      sender: 'me',
      text: text.trim(),
      author: profile.name
    });
    appendMessage(selectedPeerId, message);
    if (MOCK_DEVICES.some((device) => device.id === selectedPeerId)) {
      const deviceReplies = MOCK_REPLIES[selectedPeerId] || ['Rebut.'];
      const mockDevice = MOCK_DEVICES.find((device) => device.id === selectedPeerId);
      const replyText = deviceReplies[Math.floor(Math.random() * deviceReplies.length)];
      mockReplyTimerRef.current = window.setTimeout(() => {
        appendMessage(
          selectedPeerId,
          createChatMessage({
            sender: 'other',
            text: replyText,
            author: mockDevice?.name || 'Dispositiu de prova'
          })
        );
      }, 800);
      setDraftMessage('');
      return;
    }
    bridgeRef.current?.sendMessage?.(selectedPeerId, message);
    setDraftMessage('');
  };

  const connectionLabel = (peerId) => {
    const state = connections[peerId]?.state || 'idle';
    if (state === 'connected') return 'Connectat';
    if (state === 'pending') return 'Pendent';
    if (state === 'incoming') return 'Vol connectar';
    if (state === 'declined') return 'Rebutjat';
    if (MOCK_DEVICES.some((device) => device.id === peerId)) return 'Prova';
    return 'Disponible';
  };

  const summary = [
    { label: 'Dispositiu actual', value: profile.name },
    { label: 'Dispositius visibles', value: String(mergedDevices.length) },
    { label: 'Connexions actives', value: String(Object.values(connections).filter((entry) => entry.state === 'connected').length) }
  ];

  return (
    <UniversalPage
      chrome="system"
      showLogos={true}

    >
      <div className="devices-shell">
        <div>
          <h2>Descobrix instàncies del portal</h2>
          <p className="lead">
            Llança una connexió i envia missatges directes des d’esta mateixa pantalla.
          </p>
          {/*
          <div>
            <h3>Per a què servix açò?</h3>
            <p>
              Sóc de Poble està dissenyada com a una xarxa <em>Offline-First</em>. Esta pantalla usa la tecnologia <strong>WebRTC</strong> perquè qualsevol parell de dispositius que estiguen prop o connectats a la mateixa xarxa Wi-Fi puguen descobrir-se i xatejar directament entre ells, sense passar per cap servidor central. <br /><br />
              <strong>Per exemple:</strong> Pots obrir el portal al teu ordinador i al mateix temps al mòbil, o connectar-te amb la tauleta d'una veïna. Si ambdós esteu en la mateixa xarxa o a poca distància, podreu comunicar-vos i passar-vos informació en temps real.
            </p>
          </div>
          */}
        </div>

        <div className="sdp-stat-grid">
          {summary.map((item) => (
            <article key={item.label} className="sdp-stat-card">
              <div className="sdp-stat-info">
                <div className="sdp-stat-value">{item.value}</div>
                <div className="sdp-stat-label">{item.label}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="devices-layout">
          <section className="devices-panel">
            <div className="devices-panel__head">
              <div>
                <h2>Este dispositiu</h2>
                <p className="lead">Canvia el nom visible i publica la teua presència per a la resta d’instàncies obertes.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  title={profile.isVisible ? "Mode públic (A un clic de passar a privat)" : "Mode privat (A un clic de passar a públic)"}
                  className={`pill ${profile.isVisible ? 'pill--primary' : ''}`}
                  onClick={() => {
                    const next = { ...profile, isVisible: !profile.isVisible };
                    setProfile(next);
                    if (next.isVisible) {
                      bridgeRef.current?.requestPresence?.();
                    }
                  }}
                >
                  {profile.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  {profile.isVisible ? 'Visible (Públic)' : 'Invisible (Privat)'}
                </button>
                <button type="button" className="pill pill--accent" onClick={refreshDiscovery}>
                  <RefreshCcw size={16} /> Refrescar
                </button>
              </div>
            </div>
            <div className="devices-panel__body">
              <article className="card card--soft">
                <div className="card__body">
                  <div className="badge-row">
                    <span className="badge">
                      <Wifi size={14} />
                      ID {profile.id.slice(0, 8)}
                    </span>
                    <span className="badge">
                      <ShieldCheck size={14} />
                      Sessió local
                    </span>
                  </div>
                  <div className="devices-name-row">
                    <input
                      type="text"
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      className="form-control"
                      placeholder="Nom del dispositiu"
                    />
                    <button type="button" className="pill pill--primary" onClick={saveName}>
                      <Check size={16} /> Guardar
                    </button>
                    <p>
                      Este és el nom que es mostrarà a la resta de dispositius connectats. Pots canviar-lo pel nom que vulgues.
                    </p>
                  </div>
                  {!supportsBridge ? <div className="note-card">Este navegador no suporta la descoberta en viu per BroadcastChannel.</div> : null}
                </div>
              </article>
            </div>
          </section>

          <section className="devices-panel">
            <div className="devices-panel__head">
              <div>
                <h2>Dispositius trobats</h2>
                <p className="lead">
                  Llistat de tots els ordinadors, tauletes o mòbils que ara mateix tenen la pàgina de Sóc de Poble oberta a prop teu i s'estan anunciant. Selecciona'n un per demanar de connectar-vos.
                </p>
              </div>
              <div style={{ marginTop: 16 }}>
                  <button type="button" className="pill pill--primary" onClick={() => setIsSimulationEnabled(!isSimulationEnabled)}>
                    Simular connexions de prova
                  </button>
                </div>
            </div>
            <div className="devices-panel__body">
              <div className="devices-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {mergedDevices.length === 0 ? <div className="note-card">Encara no hi ha altres instàncies visibles.</div> : null}
                {mergedDevices.map((device) => {
                  const state = connections[device.id]?.state || 'idle';
                  return (
                    <article key={device.id} className={`card card--soft`} style={{ margin: 0 }}>
                      <div className="card__body">
                        <div className="devices-row">
                          <div>
                            <strong className="card__title">{device.name}</strong>
                            <p className="card__text">
                              ID curt: {device.id.slice(0, 8)}
                            </p>
                          </div>
                          <span className={`devices-status devices-status--${state}`}>{connectionLabel(device.id)}</span>
                        </div>
                        <div className="badge-row">
                          {(state === 'idle' || state === 'declined') ? (
                            <button type="button" className="pill pill--primary" onClick={() => requestConnection(device.id)}>
                              <Link2 size={16} /> Connectar
                            </button>
                          ) : null}
                          {state === 'connected' ? (
                            <button type="button" className="pill pill--accent" onClick={() => disconnectPeer(device.id)}>
                              <X size={16} /> Desconnectar
                            </button>
                          ) : null}
                          {state === 'pending' ? <span className="pill">Esperant resposta</span> : null}
                          {state === 'incoming' ? (
                            <>
                              <button type="button" className="pill pill--primary" onClick={() => acceptConnection(device.id)}>
                                <Check size={16} /> Acceptar
                              </button>
                              <button type="button" className="pill pill--primary" onClick={() => declineConnection(device.id)}>
                                <X size={16} /> Rebutjar
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="devices-panel devices-panel--wide">
            <div className="devices-panel__head">
              <div>
                <h2>Canal directe</h2>
                <p className="lead">
                  {activeChatPeer
                    ? `Canal actiu i privat establert amb ${activeChatPeer.name}.`
                    : 'Un colp hages connectat amb algú dalt, obrireu un canal de comunicació efímer. És un xat 100% privat que viatja directament entre els vostres dos aparells (sense xafar cap servidor ni núvol). En tancar la pestanya, els missatges s\'esvaïxen completament.'}
                </p>
              </div>
              <div className="badge-row">
                <button type="button" className="pill pill--primary" onClick={() => setIsSimulationEnabled(true)}>
                  <Plus size={16} /> Simular connexió de prova
                </button>
              </div>
            </div>
            <div className="devices-panel__body">
              {!activeChatPeer ? <div className="note-card">No hi ha cap dispositiu connectat en el canal inferior.</div> : null}
              {activeChatPeer ? (
                <div className="devices-chat-shell">
                  <article className="card card--soft" style={{ margin: 0, marginBottom: 16 }}>
                    <div className="card__body">
                      <div className="devices-row">
                        <div>
                          <strong className="card__title">{activeChatPeer.name}</strong>
                          <p className="card__text">
                            ID curt: {activeChatPeer.id.slice(0, 8)}
                          </p>
                        </div>
                        <span className={`devices-status devices-status--${activeChatConnection?.state || 'idle'}`}>{connectionLabel(activeChatPeer.id)}</span>
                      </div>
                      <div className="badge-row">
                        {activeChatConnection?.state === 'connected' ? (
                          <button type="button" className="pill pill--accent" onClick={() => disconnectPeer(activeChatPeer.id)}>
                            <X size={16} /> Desconnectar
                          </button>
                        ) : null}
                      </div>

                      {activeChatConnection?.state !== 'connected' ? (
                        <div className="note-card" style={{ marginTop: 12 }}>
                          {activeChatConnection?.state === 'pending'
                            ? 'Has enviat una petició. Esperant acceptació.'
                            : activeChatConnection?.state === 'incoming'
                            ? 'Este dispositiu vol connectar amb tu. Pots acceptar-lo des del llistat dalt.'
                            : 'Encara no hi ha connexió acceptada. Primer cal establir el vincle.'}
                        </div>
                      ) : null}
                    </div>
                  </article>

                  {connectedPeers.length > 0 ? (
                    <div className="badge-row" style={{ justifyContent: 'center' }}>
                      {connectedPeers.map((peer) => (
                        <button
                          key={peer.id}
                          type="button"
                          className={`pill ${selectedPeerId === peer.id ? 'pill--primary' : ''}`}
                          onClick={() => setSelectedPeerId(peer.id)}
                        >
                          <MessageSquare size={16} /> {peer.name}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div ref={chatLogRef} className="devices-chat-log" style={{ margin: '16px 0' }}>
                    {activeChatMessages.length === 0 ? <div className="note-card">Encara no hi ha missatges en este canal.</div> : null}
                    {activeChatMessages.map((message) => (
                      <article
                        key={message.id}
                        className={`devices-bubble ${message.sender === 'me' ? 'devices-bubble--me' : 'devices-bubble--other'}`}
                      >
                        <strong>{message.sender === 'me' ? profile.name : message.author || activeChatPeer.name}</strong>
                        <p>{message.text}</p>
                      </article>
                    ))}
                  </div>

                  <div className="search-bar-basic" style={{ marginBottom: 0 }}>
                    <input
                      type="text"
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && activeChatConnection?.state === 'connected') {
                          sendMessage(draftMessage);
                        }
                      }}
                      placeholder="Escriu un missatge directe..."
                    />
                    <button
                      type="button"
                      onClick={() => sendMessage(draftMessage)}
                      disabled={activeChatConnection?.state !== 'connected'}
                      style={activeChatConnection?.state !== 'connected' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      <ArrowRight size={16} /> Enviar
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </UniversalPage>
  );
}
