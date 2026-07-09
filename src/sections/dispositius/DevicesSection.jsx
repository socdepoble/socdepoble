import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Link2, MessageSquare, Plus, RefreshCcw, ShieldCheck, Wifi, X } from 'lucide-react';
import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';
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
    id: 'mock-device-socdepoble-a',
    name: 'Portal de prova A',
    kind: 'mock',
    lastSeen: Date.now()
  },
  {
    id: 'mock-device-socdepoble-b',
    name: 'Portal de prova B',
    kind: 'mock',
    lastSeen: Date.now()
  }
];

const MOCK_REPLIES = {
  'mock-device-socdepoble-a': [
    'Ací Portal de prova A. Canal disponible i operatiu.',
    'Rebut en A. El flux de proves continua bé.',
    'Això arriba correcte. Ja tens una conversa oberta amb el node A.'
  ],
  'mock-device-socdepoble-b': [
    'Portal de prova B en línia. He rebut el missatge.',
    'Resposta del node B. El segon canal també està viu.',
    'Perfecte. Pots anar canviant entre converses i seguir enviant.'
  ]
};

export default function DevicesSection() {
  const navigate = useNavigate();
  const { t } = useAppData();
  const [profile, setProfile] = useState(() => loadDeviceProfile());
  const [draftName, setDraftName] = useState(() => loadDeviceProfile().name);
  const [devices, setDevices] = useState({});
  const [connections, setConnections] = useState(() => loadDeviceConnections(loadDeviceProfile().id));
  const [messagesByPeer, setMessagesByPeer] = useState(() => loadDeviceChats(loadDeviceProfile().id));
  const [selectedPeerId, setSelectedPeerId] = useState(() => loadSelectedPeer(loadDeviceProfile().id));
  const [draftMessage, setDraftMessage] = useState('');
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
    const mockDevices = MOCK_DEVICES.filter((device) => !visibleIds.has(device.id)).map((device) => ({
      ...device,
      lastSeen: Date.now()
    }));
    return [...mockDevices, ...visibleDevices];
  }, [visibleDevices]);

  const connectedPeers = useMemo(
    () => mergedDevices.filter((device) => connections[device.id]?.state === 'connected'),
    [connections, mergedDevices]
  );
  const activeChatPeer = connectedPeers.find((device) => device.id === selectedPeerId) || null;

  const selectedDevice =
    mergedDevices.find((device) => device.id === selectedPeerId) ||
    Object.values(devices).find((device) => device.id === selectedPeerId) ||
    null;
  const selectedConnection = selectedPeerId ? connections[selectedPeerId] : null;
  const activeChatConnection = activeChatPeer ? connections[activeChatPeer.id] : null;
  const activeChatMessages = activeChatPeer ? messagesByPeer[activeChatPeer.id] || [] : [];

  const appendMessage = (peerId, message) => {
    setMessagesByPeer((current) => {
      const next = {
        ...current,
        [peerId]: [...(current[peerId] || []), message]
      };
      saveDeviceChats(profile.id, next);
      return next;
    });
  };

  useEffect(() => {
    saveDeviceProfile(profile);
    setDraftName(profile.name);
  }, [profile]);

  useEffect(() => {
    saveDeviceConnections(profile.id, connections);
  }, [connections, profile.id]);

  useEffect(() => {
    saveSelectedPeer(profile.id, selectedPeerId);
  }, [profile.id, selectedPeerId]);

  useEffect(() => {
    if (!supportsBridge) return undefined;

    bridgeRef.current?.destroy?.();
    bridgeRef.current = createDeviceBridge(profile, {
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
  }, [profile, supportsBridge]);

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
        appendMessage(
          peerId,
          createChatMessage({
            sender: 'other',
            text: 'Connexió simulada acceptada. Ja pots provar el xat directe.',
            author: mockDevice?.name || 'Dispositiu de prova'
          })
        );
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
    <SectionChrome
      kicker={t('section.dispositius.kicker', 'Dispositius')}
      title={t('section.dispositius.title', 'Dispositius i connexions directes')}
      subtitle={t(
        'section.dispositius.subtitle',
        'Descobrix instàncies obertes del portal, llança una connexió i envia missatges directes des d’esta mateixa pantalla.'
      )}
      meta={[supportsBridge ? 'Temps real local' : 'Navegador limitat', 'Descoberta en viu', '/dispositius']}
    >
      <div className="devices-shell">
        <div className="devices-summary-grid">
          {summary.map((item) => (
            <article key={item.label} className="card card--soft">
              <div className="card__body" style={{ display: 'grid', gap: 8 }}>
                <span className="devices-summary-label">{item.label}</span>
                <strong className="devices-summary-value">{item.value}</strong>
              </div>
            </article>
          ))}
        </div>

        <div className="devices-layout">
          <section className="devices-panel">
            <div className="devices-panel__head">
              <div>
                <h2 className="section-title">Este dispositiu</h2>
                <p className="card__text">Canvia el nom visible i publica la teua presència per a la resta d’instàncies obertes.</p>
              </div>
              <button type="button" className="pill" onClick={refreshDiscovery}>
                <RefreshCcw size={16} /> Refrescar
              </button>
            </div>
            <div className="devices-panel__body">
              <article className="card card--soft">
                <div className="card__body" style={{ display: 'grid', gap: 14 }}>
                  <div className="badge-row">
                    <span className="badge">
                      <Wifi size={14} />
                      ID {profile.id.slice(0, 8)}
                    </span>
                    <span className="badge">
                      <ShieldCheck size={14} />
                      Sessio local
                    </span>
                  </div>
                  <div className="devices-name-row">
                    <input
                      type="text"
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      className="section-search"
                      placeholder="Nom del dispositiu"
                    />
                    <button type="button" className="pill pill--primary" onClick={saveName}>
                      <Check size={16} /> Guardar
                    </button>
                  </div>
                  {!supportsBridge ? <div className="note-card">Este navegador no suporta la descoberta en viu per BroadcastChannel.</div> : null}
                </div>
              </article>
            </div>
          </section>

          <section className="devices-panel">
            <div className="devices-panel__head">
              <div>
                <h2 className="section-title">Dispositius trobats</h2>
                <p className="card__text">Instàncies obertes del portal que estan anunciant presència ara mateix.</p>
              </div>
            </div>
            <div className="devices-panel__body">
              <div className="devices-list">
                {mergedDevices.length === 0 ? <div className="note-card">Encara no hi ha altres instàncies visibles.</div> : null}
                {mergedDevices.map((device) => {
                  const state = connections[device.id]?.state || 'idle';
                  return (
                    <article key={device.id} className={`card device-card ${selectedPeerId === device.id ? 'device-card--active' : ''}`}>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        <div className="devices-row">
                          <div>
                            <strong className="card__title" style={{ fontSize: '1rem' }}>{device.name}</strong>
                            <p className="card__text">
                              ID curt {device.id.slice(0, 8)}
                              {MOCK_DEVICES.some((entry) => entry.id === device.id) ? ' · Banc de proves' : ''}
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
                            <button type="button" className="pill" onClick={() => disconnectPeer(device.id)}>
                              <X size={16} /> Desconnectar
                            </button>
                          ) : null}
                          {state === 'pending' ? <span className="pill">Esperant resposta</span> : null}
                          {state === 'incoming' ? (
                            <>
                              <button type="button" className="pill pill--primary" onClick={() => acceptConnection(device.id)}>
                                <Check size={16} /> Acceptar
                              </button>
                              <button type="button" className="pill" onClick={() => declineConnection(device.id)}>
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
                <h2 className="section-title">Canal directe</h2>
                <p className="card__text">
                  {activeChatPeer
                    ? `Canal actiu amb ${activeChatPeer.name}.`
                    : 'Selecciona un dispositiu per a veure el fil directe i enviar missatges.'}
                </p>
              </div>
              <div className="badge-row">
                <button type="button" className="pill" onClick={() => navigate('/connectar')}>
                  <Plus size={16} /> Connectar
                </button>
                <button type="button" className="pill" onClick={() => navigate('/chats')}>
                  <ArrowRight size={16} /> Xat general
                </button>
              </div>
            </div>
            <div className="devices-panel__body">
              {!activeChatPeer ? <div className="note-card">No hi ha cap dispositiu connectat en el canal inferior.</div> : null}
              {activeChatPeer ? (
                <div className="devices-chat-shell">
                  <article className="card card--soft">
                    <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                      <div className="devices-row">
                        <div>
                          <strong className="card__title" style={{ fontSize: '1rem' }}>{activeChatPeer.name}</strong>
                          <p className="card__text">Estat: {connectionLabel(activeChatPeer.id)}</p>
                        </div>
                        <div className="badge-row">
                          <span className="badge">{activeChatPeer.id.slice(0, 8)}</span>
                          <span className="badge">{MOCK_DEVICES.some((entry) => entry.id === activeChatPeer.id) ? 'Prova' : 'Directe'}</span>
                          {activeChatConnection?.state === 'connected' ? (
                            <button type="button" className="pill" onClick={() => disconnectPeer(activeChatPeer.id)}>
                              <X size={16} /> Desconnectar
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {activeChatConnection?.state !== 'connected' ? (
                        <div className="note-card">
                          {activeChatConnection?.state === 'pending'
                            ? 'Has enviat una petició. Esperant acceptació.'
                            : activeChatConnection?.state === 'incoming'
                            ? 'Este dispositiu vol connectar amb tu. Pots acceptar-lo des del llistat.'
                            : 'Encara no hi ha connexió acceptada. Primer cal establir el vincle.'}
                        </div>
                      ) : null}

                    </div>
                  </article>

                  {connectedPeers.length > 0 ? (
                    <div className="badge-row">
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

                  <div ref={chatLogRef} className="devices-chat-log">
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

                  <div className="devices-compose">
                    <input
                      type="text"
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && activeChatConnection?.state === 'connected') {
                          sendMessage(draftMessage);
                        }
                      }}
                      className="section-search"
                      placeholder="Escriu un missatge directe..."
                    />
                    <button
                      type="button"
                      className="pill pill--primary"
                      onClick={() => sendMessage(draftMessage)}
                      disabled={activeChatConnection?.state !== 'connected'}
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
    </SectionChrome>
  );
}
