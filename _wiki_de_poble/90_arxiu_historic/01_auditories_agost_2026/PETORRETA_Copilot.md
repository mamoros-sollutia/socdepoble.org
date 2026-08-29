---
doc_id: SDP-DOC-260829_0305
doc_type: "[WIKI_DOC]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "03:05"
academic_metadata:
  data_creacio: "2026-08-29"
  nivell_maduresa: "Esborrany"
---

# Petorreta per a Copilot DAFO

> **Anclatge de Seguretat**: Aquest document està ancorat a l'índex central [[00_INDEX_ESCRIPTORI]] / [[00_index]] per evitar l'orfenesa i garantir la consciència de la IA en futures auditories.

[INSERIU EL CONTINGUT ACÍ]



# CONTEXT GLOBAL DE SÓC DE POBLE (MOLT IMPORTANT)

**La Veritat Actual:** Actualment estem col·laborant amb la nostra empresa sòcia, Sollutia. Ells ens ofereixen un sistema excel·lent que funciona completament *online* i ens permet validar la viabilitat del projecte de forma sòlida. **MOLT IMPORTANT: SOLLUTIA NO TÉ RES A VEURE AMB WORDPRESS.** Quan parlem de l'entorn de proves en WordPress on estem incrustant l'App (l'embed), eixe és un projecte paral·lell nostre per provar l'aïllament; no ho barregeu mai amb el sistema de Sollutia en les vostres conclusions.

**L'Aspiració:** L'objectiu a llarg termini és, justament amb l'ajuda de Sollutia, poder independitzar-nos d'Internet (ser 100% Offline-First, a l'estil d'Obsidian). Som un projecte de "des-escalada" (una xarxa anti-xarxa social) i estem preparant el terreny perquè en el futur Sollutia puga mantindre eixa versió descentralitzada i offline. El codi que propose el Consell ha d'afavorir aquesta transició conjunta de forma pacífica i mantenible per ells.

**Arquitectura i CSS (Pedra Seca):** El disseny utilitza el sistema "Pedra Seca". Està totalment prohibit l'ús d'estils en línia (inline styles) o de Tailwind. Tot el CSS s'ha de fer mitjançant classes globals estandarditzades a `index.css`. Els components de React han de ser purament semàntics i delegar la presentació al CSS.


# FITXERS INCLOSOS EN AQUESTA PETORRETA

## Fitxer: package.json

```javascript
{
  "name": "socdepoble-react",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/pedraseca.umd.cjs",
  "module": "dist/pedraseca.js",
  "exports": {
    ".": {
      "import": "./dist/pedraseca.js",
      "require": "./dist/pedraseca.umd.cjs"
    }
  },
  "sideEffects": [
    "*.css",
    "src/PedraSecaEmbed.jsx",
    "src/main.jsx"
  ],
  "scripts": {
    "despertar": "node tooling/brain/despertar.mjs",
    "porta:shim": "node tooling/gates/tractor-shim.mjs",
    "porta:outbox": "node tooling/gates/tractor-outbox.mjs",
    "porta:manual": "node tooling/gates/tractor-manual.mjs",
    "porta:consell": "node tooling/gates/tractor-consell.mjs",
    "porta:rutes": "node tooling/gates/tractor-rutes.mjs",
    "porta:vocabulari": "node tooling/gates/tractor-vocabulari.mjs",
    "porta:baseline": "node tooling/brain/tractor-pedra-seca.mjs --baseline && node tooling/gates/design_guard.mjs --baseline && node tooling/gates/tractor-vocabulari.mjs --baseline",
    "porta": "npm run porta:rutes && node tooling/wiki/tractor-cognitiu.mjs --arrel=. && npm run porta:manual && npm run porta:consell && node tooling/gates/tractor-registre.mjs && node tooling/gates/tractor-doctrina.mjs && node tooling/brain/tractor-pedra-seca.mjs && node tooling/gates/design_guard.mjs --arrel=src && npm run porta:vocabulari && npm run porta:outbox && node tooling/gates/tractor-persistencia.mjs && npm run porta:shim && node tooling/gates/build-seo-manifest.mjs --verifica",
    "gate": "npm run porta",
    "dev": "vite --host 0.0.0.0 --port 3340 --strictPort",
    "rag:build": "node -e \"import('./tooling/wiki/core/build_rag_index.mjs').then(m => m.run({root: '.'}))\"",
    "slugs:build": "node tooling/wiki/core/build_slug_index.mjs",
    "bundle": "node tooling/brain/generar_bundle.mjs",
    "build": "npm run gate && npm run rag:build && npm run slugs:build && npm run build:web && npm run build:wp && npm run build:seo",
    "build:seo": "node tooling/gates/build-seo-manifest.mjs --escriu",
    "build:web": "vite build",
    "build:wp": "vite build -c vite.standalone.config.js && mkdir -p wordpress-plugin/assets/fonts wordpress-plugin/assets/img && cp -r src/assets/fonts/* wordpress-plugin/assets/fonts/ && cp -r assets/img/* wordpress-plugin/assets/img/",
    "prepare": "husky",
    "time-machine": "sh tooling/gates/estela.sh",
    "preview": "vite preview --host 0.0.0.0",
    "db:seed:generate": "sh scripts/generate-supabase-seed.sh",
    "brain:maintain": "sh tooling/brain/maintain.sh .",
    "brain:audit": "python3 tooling/brain/brain_audit.py . --policy tooling/brain/brain_policy.json",
    "brain:distill": "python3 tooling/brain/brain_distill.py",
    "pdf:render": "sh tooling/pdf/render_pdf.sh",
    "test": "vitest",
    "lint": "eslint src tooling scripts"
  },
  "dependencies": {
    "dompurify": "^3.4.14",
    "lucide-react": "^1.35.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "react-router-dom": ">=6.0.0"
  },
  "devDependencies": {
    "@babel/parser": "^8.0.4",
    "@eslint/js": "^9.39.5",
    "@testing-library/react": "^16.3.2",
    "@vitejs/plugin-react": "^5.1.1",
    "css": "^3.0.0",
    "eslint": "^9.39.5",
    "eslint-plugin-react": "^7.37.5",
    "fake-indexeddb": "^6.2.5",
    "globals": "^17.9.0",
    "husky": "^9.1.7",
    "jsdom": "^29.1.1",
    "knip": "^6.32.2",
    "lint-staged": "^17.3.0",
    "postcss-prefix-selector": "^2.1.0",
    "puppeteer": "^25.5.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.12.0",
    "vite": "^7.1.0",
    "vitest": "^4.1.10"
  },
  "engines": {
    "node": ">=20"
  }
}

```

## Fitxer: vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => ({
  plugins: [
    react()
  ],
  define: command === 'build' ? {
    'import.meta.env.VITE_SUPABASE_URL': '""',
    'import.meta.env.VITE_SUPABASE_ANON_KEY': '""'
  } : {},
  server: {
    host: true,
    port: 3340,
    strictPort: true,
    watch: {
      ignored: ['**/.agents/**', '**/_wiki_de_poble/**', '**/.gemini/**', '**/scripts/**']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true
  }
}));

```

## Fitxer: src/sections/connectar/ConnectarSection.jsx

```javascript
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Globe, Lock, Plus, Tag } from 'lucide-react';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';

const TAGS = ['Història local', 'Patrimoni', 'Gent del poble', 'Debat', 'Mercat', 'Tecnologia'];

const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2);
};

export default function ConnectarSection({ agents = [] }) {
  const { t, sendSectionSubmission } = useAppData();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('xat');
  const [isPrivate, setIsPrivate] = useState(true);
  const [customTags, setCustomTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || '');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryDescription, setEntryDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const QUICK_AREAS = [
    { id: 'xat', label: t('nav.xat', 'Xat'), description: t('section.connectar.area.xat', 'Obri una conversa amb la gent del poble.') },
    { id: 'mur', label: t('nav.mur', 'Mur'), description: t('section.connectar.area.mur', 'Publica o revisa el mur públic.') },
    { id: 'mercat', label: t('nav.mercat', 'Mercat'), description: t('section.connectar.area.mercat', 'Explora productes i intercanvis.') },
    { id: 'events', label: t('nav.events', 'Events'), description: t('section.connectar.area.events', 'Mira sessions, cites i rituals.') },
    { id: 'multimedia', label: t('nav.multimedia', 'Multimèdia'), description: t('section.connectar.area.multimedia', 'Puge fotos i recursos visuals.') },
    { id: 'notes', label: t('nav.notes', 'Notes'), description: t('section.connectar.area.notes', 'Afig una nova nota a la llibreta.') }
  ];

  const agentOptions = useMemo(() => agents.slice(0, 8), [agents]);
  const selectedAgentData = useMemo(
    () => agentOptions.find((agent) => agent.id === selectedAgent) || agentOptions[0] || null,
    [agentOptions, selectedAgent]
  );
  const selectedLabel = QUICK_AREAS.find((item) => item.id === selectedArea)?.label || t('nav.xat', 'Xat');
  const supportsPublishing = ['mur', 'mercat', 'events', 'multimedia', 'notes'].includes(selectedArea);
  const canConnect = selectedArea === 'xat' || (entryTitle.trim() && entryDescription.trim());

  const addTag = (tag) => {
    const value = String(tag || '').trim();
    if (!value || customTags.includes(value)) return;
    setCustomTags((current) => [...current, value]);
    setTagInput('');
  };

  const buildSubmissionPayload = () => {
    const now = new Date().toISOString();
    const title = entryTitle.trim();
    const description = entryDescription.trim();
    const authorName = selectedAgentData?.name || 'Foraster';
    const authorAvatar = selectedAgentData?.avatar_url || null;
    const authorTown = selectedAgentData?.town_name || 'La Torre de les Maçanes';

    if (selectedArea === 'mur') {
      return {
        id: generateId(),
        sectionId: 'mur',
        type: 'post',
        title,
        post_subtitle: description,
        description,
        summary: description,
        content: description,
        author: authorName,
        author_name: authorName,
        author_avatar: authorAvatar,
        town_name: authorTown,
        image_url: [],
        tags: [...customTags],
        likes: 0,
        comments: 0,
        created_at: now,
        searchText: `${title} ${description} ${authorName} ${authorTown} ${customTags.join(' ')}`
      };
    }

    if (selectedArea === 'mercat') {
      return {
        id: generateId(),
        sectionId: 'mercat',
        type: 'product',
        title,
        description,
        summary: description,
        seller: authorName,
        author_name: authorName,
        avatar_url: authorAvatar,
        town_name: authorTown,
        image_url: [],
        image: null,
        category_slug: 'connectat',
        tag: customTags[0] || 'Connectat',
        variations: [],
        price: '0.00€',
        created_at: now,
        searchText: `${title} ${description} ${authorName} ${customTags.join(' ')} connectat mercat`
      };
    }

    if (selectedArea === 'multimedia') {
      return {
        id: generateId(),
        sectionId: 'multimedia',
        type: 'media',
        title,
        description,
        summary: description,
        author: authorName,
        tag: customTags[0] || 'Multimèdia',
        source: 'Upload',
        created_at: now,
        searchText: `${title} ${description} ${authorName} ${customTags.join(' ')} multimedia`
      };
    }

    if (selectedArea === 'notes') {
      return {
        id: generateId(),
        sectionId: 'notes',
        type: 'note',
        title,
        content: description,
        plainText: description,
        category: customTags[0] || 'General',
        tags: [...customTags],
        folderId: 'f-root',
        created_at: now,
        updatedAt: now,
        searchText: `${title} ${description} ${customTags.join(' ')} notes`
      };
    }

    return {
      id: generateId(),
      sectionId: 'events',
      type: 'event',
      title,
      description,
      summary: description,
      author_name: authorName,
      image_url: [],
      date: now.slice(0, 10),
      created_at: now,
      tags: [...customTags],
      searchText: `${title} ${description} ${authorName} ${customTags.join(' ')} events`
    };
  };

  const handleConnect = async () => {
    if (selectedArea === 'xat') {
      navigate('/xat');
      return;
    }

    if (!canConnect || isSaving) return;

    const payload = buildSubmissionPayload();
    setIsSaving(true);

    try {
      await sendSectionSubmission({
        sectionId: selectedArea,
        title: entryTitle.trim(),
        description: entryDescription.trim(),
        payload,
        createdAt: payload.created_at
      });
      setEntryTitle('');
      setEntryDescription('');
      setCustomTags([]);
      setTagInput('');
      navigate(`/${selectedArea}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UniversalPage
      title={t('section.connectar.title', 'On vols continuar?')}
      subtitle={t('section.connectar.subtitle', 'Tria l’espai on vols entrar i continua navegant.')}
      chrome="system"
      showLogos={true}
    >
      <div className="connect-layout">
        <section className="connect-panel">
          <div className="connect-panel__head">
            <div>
              <h2 className="section-title">{t('section.connectar.privacy', 'Privacitat de la connexió')}</h2>
            </div>
          </div>
          <div className="connect-panel__body">
            <div className="toggle-row">
              <button type="button" className={`toggle-button ${isPrivate ? 'toggle-button--active' : ''}`} onClick={() => setIsPrivate(true)}>
                <Lock size={16} /> {t('section.connectar.private', 'Privada')}
              </button>
              <button type="button" className={`toggle-button ${!isPrivate ? 'toggle-button--active' : ''}`} onClick={() => setIsPrivate(false)}>
                <Globe size={16} /> {t('section.connectar.public', 'Pública')}
              </button>
            </div>
            <p className="card__text">{isPrivate ? t('section.connectar.tagState.private', 'Privada') : t('section.connectar.tagState.public', 'Pública')}</p>
          </div>
        </section>

        <section className="connect-panel">
          <div className="connect-panel__head">
            <div>
              <h2 className="section-title">{t('section.connectar.where', 'On vols connectar-ho?')}</h2>
            </div>
            <span className="pill">{selectedLabel}</span>
          </div>
          <div className="connect-panel__body">
            <div className="connect-grid">
              {QUICK_AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  className={`connect-card ${selectedArea === area.id ? 'connect-card--active' : ''}`}
                  onClick={() => setSelectedArea(area.id)}
                >
                  <strong>{area.label}</strong>
                  <span>{area.description}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="connect-panel">
          <div className="connect-panel__head">
            <div>
              <h2 className="section-title">{t('section.connectar.context', 'Etiquetes i context')}</h2>
            </div>
          </div>
          <div className="connect-panel__body">
            <div className="badge-row">
              {TAGS.map((tag) => (
                <button key={tag} type="button" className="pill" onClick={() => addTag(tag)}>
                  <Tag size={14} /> {tag}
                </button>
              ))}
            </div>

            <div className="tag-input-row">
              <input
                type="text"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && addTag(tagInput)}
                placeholder={t('section.connectar.tagsPlaceholder', 'Afig una etiqueta lliure...')}
                className="section-search"
              />
              <button type="button" className="pill pill--primary" onClick={() => addTag(tagInput)}>
                <Plus size={16} /> {t('section.connectar.add', 'Afegir')}
              </button>
            </div>

            {customTags.length > 0 ? (
              <div className="badge-row">
                {customTags.map((tag) => (
                  <span key={tag} className="badge">
                    {tag}
                    <button type="button" className="badge-remove" onClick={() => setCustomTags((current) => current.filter((item) => item !== tag))}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {supportsPublishing ? (
          <section className="connect-panel connect-panel--wide">
            <div className="connect-panel__head">
              <div>
                <h2 className="section-title">Nou element en {selectedLabel}</h2>
              </div>
              <span className="pill">Es guardarà i quedarà visible en recarregar</span>
            </div>
            <div className="connect-panel__body">
              <input
                type="text"
                value={entryTitle}
                onChange={(event) => setEntryTitle(event.target.value)}
                placeholder={selectedArea === 'mur'
                  ? 'Títol de la publicació'
                  : selectedArea === 'mercat'
                    ? 'Nom del producte'
                    : 'Títol de l’esdeveniment'}
                className="section-search"
              />
              <textarea
                value={entryDescription}
                onChange={(event) => setEntryDescription(event.target.value)}
                placeholder={selectedArea === 'mur'
                  ? 'Escriu la publicació que vols afegir al mur...'
                  : selectedArea === 'mercat'
                    ? 'Descriu el producte o l’oferta...'
                    : 'Descriu l’esdeveniment o la convocatòria...'}
                className="section-search"
                rows={4}
              />
            </div>
          </section>
        ) : null}

        <section className="connect-panel connect-panel--wide">
          <div className="connect-panel__head">
            <div>
              <h2 className="section-title">{t('section.connectar.people', 'Persones i agents')}</h2>
            </div>
            <button type="button" className="pill" onClick={() => navigate(`/` + selectedArea)}>
              {t('section.connectar.go', 'Anar a')} {selectedLabel}
            </button>
          </div>
          <div className="connect-panel__body">
            <div className="conversation-list">
              {agentOptions.map((agent, index) => (
                <button
                  key={`${agent.id}-${index}`}
                  type="button"
                  className={`conversation-button ${selectedAgent === agent.id ? 'conversation-button--active' : ''}`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <img className="avatar" src={agent.avatar_url} alt={agent.name} />
                  <div className="conversation-meta">
                    <strong>{agent.name}</strong>
                    <span>{agent.role}</span>
                    <span className="conversation-preview">{agent.last_message_content}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="connect-final">
              <button
                type="button"
                className="pill pill--primary"
                onClick={handleConnect}
                disabled={isSaving || (selectedArea !== 'xat' && !canConnect)}
              >
                <CheckCircle2 size={16} />
                {isSaving
                  ? 'Guardant...'
                  : selectedArea === 'xat'
                    ? `${t('section.connectar.connect', 'Connectar a')} ${selectedLabel}`
                    : `Guardar i anar a ${selectedLabel}`}
              </button>
            </div>
          </div>
        </section>
      </div>
    </UniversalPage>
  );
}

```

## Fitxer: src/data/supabaseBackend.js

```javascript
import { APP_SEED, APP_SEED_VERSION, CHAT_MESSAGE_SEED, CHAT_THREADS, getDefaultUserId } from './appSeed.js';
import DOMPurify from 'dompurify';
import { getVal, setVal, delVal } from '../config/storage.js';
import { getSnapshot, saveSnapshot } from './outbox.js';
import { entraAmbGoogle, gestionaTornada } from './oauthRelay.js';

/**
 * El mode simulat només ha d'existir en desenvolupament. En un build de
 * producció sense config, l'aplicació ha de dir que no pot entrar — no
 * regalar una sessió d'administrador.
 */
const MODE_SIMULAT_PERMES =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.DEV === true
    : false;

function usuariSimulat(email, name) {
  if (!MODE_SIMULAT_PERMES) {
    throw new Error(
      'No hi ha connexió configurada amb el servidor. ' +
      'Falten VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY, o l\'amfitrió no ha passat la configuració.'
    );
  }
  console.warn('[SDP] MODE SIMULAT: sessió local sense servidor. Mai en producció.');
  return {
    id: 'local-mock-usuari',
    email,
    // Rol mínim, no superadmin. Per a provar l'administració, entra de veres.
    user_metadata: { name: name || 'Usuari de proves', role: 'user' }
  };
}

const DEV_FALLBACK_STORAGE_KEY = 'socdepoble-dev-chat-messages';
const APP_SNAPSHOT_STORAGE_KEY = 'socdepoble-app-snapshot-v1';
const SECTION_SUBMISSIONS_STORAGE_KEY = 'socdepoble-section-submissions-v1';
const DATA_SYNC_CHANNEL_NAME = 'socdepoble-data-sync-v1';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();


const firstAsset = (value) => (Array.isArray(value) ? value[0] || null : value || null);
const buildSearchText = (parts) => normalizeText(parts.filter(Boolean).join(' '));

const CONNECTABLE_SECTION_IDS = new Set(['mur', 'mercat', 'events', 'multimedia', 'notes']);













const buildHeaders = (anonKey, extra = {}) => {
  const jwt = getVal('socdepoble-jwt');
  return {
    apikey: anonKey,
    Authorization: `Bearer ${jwt ? jwt : anonKey}`,
    'Content-Type': 'application/json',
    ...extra
  };
};

let renovacioEnCurs = null;

export function refreshSession(config = {}) {
  if (renovacioEnCurs) return renovacioEnCurs;
  renovacioEnCurs = _renova(config).finally(() => { renovacioEnCurs = null; });
  return renovacioEnCurs;
}

async function _renova(config) {
  const refreshToken = getVal('socdepoble-refresh-token');
  if (!refreshToken) return false;
  
  const { supabaseUrl, supabaseAnonKey } = getResolvedConfig(config);
  if (!supabaseUrl) return false;
  
  let response;
  try {
    response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
  } catch (e) {
    console.warn('Error de xarxa renovant sessió', e);
    // Xarxa caiguda != Sessió invàlida
    return false;
  }
  
  if (response.ok) {
    const result = await response.json();
    if (result?.access_token) {
      setVal('socdepoble-jwt', result.access_token);
      setVal('socdepoble-refresh-token', result.refresh_token);
      setVal('socdepoble-user', result.user);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sdp:auth-change', { detail: { user: result.user }}));
      }
      return true;
    }
  }

  if (response.status === 400 || response.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sdp:auth-change', { detail: { user: null }}));
    }
  }
  return false;
}

async function request(path, config, { method = 'GET', headers = {}, body, signal, timeoutMs = 12000, _isRetry = false } = {}) {
  const { supabaseUrl, supabaseAnonKey, hasSupabaseConfig } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const handleAbort = () => controller.abort();
  if (signal) {
    signal.addEventListener('abort', handleAbort);
  }

  try {
    const response = await fetch(`${supabaseUrl}${path}`, {
      method,
      headers: buildHeaders(supabaseAnonKey, headers),
      signal: controller.signal,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      if (response.status === 401 && !_isRetry && !path.startsWith('/auth/')) {
        const refreshed = await refreshSession(config);
        if (refreshed) {
          return await request(path, config, { method, headers, body, signal, timeoutMs, _isRetry: true });
        }
      }
      const text = await response.text();
      throw new Error(`Supabase ${response.status}: ${text || 'Error desconegut.'}`);
    }

    if (response.status === 204) return null;
    return response.json();
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', handleAbort);
    }
  }
}

export async function requestMaybe(path, config, options = {}) {
  try {
    const data = await request(path, config, options);
    return { ok: true, data, status: 200 };
  } catch (error) {
    const match = String(error?.message || '').match(/^Supabase\s+(\d+):\s+(.*)$/s);
    return {
      ok: false,
      status: match ? Number(match[1]) : 500,
      errorMessage: match ? match[2] : String(error?.message || error)
    };
  }
}

function mapContentRowsToData(rows) {
  const lookup = new Map(rows.map((row) => [row.key, row.payload]));
  return {
    ownerUserId: getDefaultUserId(),
    agents: lookup.get('agents') || [],
    chatThreads: CHAT_THREADS,
    feedPosts: lookup.get('feedPosts') || [],
    marketItems: lookup.get('marketItems') || [],
    events: lookup.get('events') || [],
    towns: lookup.get('towns') || [],
    mediaItems: lookup.get('mediaItems') || [],
    noteFolders: lookup.get('noteFolders') || [],
    notes: lookup.get('notes') || [],
    pages: lookup.get('pages') || [],
    sectionSubmissions: [],
    chatMessages: []
  };
}

async function buildSeedAppData(ownerUserId = getDefaultUserId()) {
  return {
    ownerUserId,
    agents: APP_SEED.agents,
    chatThreads: APP_SEED.chatThreads,
    chatMessages: mergeChatMessages(
      APP_SEED.chatMessages.filter((message) => message.ownerUserId === ownerUserId),
      await loadDevFallbackMessages(ownerUserId)
    ),
    feedPosts: APP_SEED.feedPosts,
    marketItems: APP_SEED.marketItems,
    events: APP_SEED.events,
    towns: APP_SEED.towns,
    mediaItems: APP_SEED.mediaItems,
    noteFolders: APP_SEED.noteFolders,
    notes: APP_SEED.notes,
    pages: APP_SEED.pages,
    sectionSubmissions: [],
    seedVersion: APP_SEED_VERSION
  };
}

function sanitizeSnapshotArray(value, fallback) {
  return Array.isArray(value) ? value : fallback;
}

async function saveLocalAppSnapshot(snapshot) {
  if (typeof window === 'undefined') return;
  try {
    await saveSnapshot(APP_SNAPSHOT_STORAGE_KEY + '-' + snapshot.ownerUserId, snapshot);
  } catch (error) {
    console.warn('saveLocalAppSnapshot error:', error);
  }
}

async function loadLocalAppSnapshot(ownerUserId = getDefaultUserId()) {
  const fallback = await buildSeedAppData(ownerUserId);
  if (typeof window === 'undefined') return fallback;

  try {
    const parsed = await getSnapshot(APP_SNAPSHOT_STORAGE_KEY + '-' + ownerUserId);
    if (!parsed)  {
      await saveLocalAppSnapshot(fallback);
      return fallback;
    }

    
    if (!parsed || typeof parsed !== 'object') {
      await saveLocalAppSnapshot(fallback);
      return fallback;
    }

    const snapshot = {
      ...fallback,
      ...parsed,
      ownerUserId,
      agents: sanitizeSnapshotArray(parsed.agents, fallback.agents),
      chatThreads: sanitizeSnapshotArray(parsed.chatThreads, fallback.chatThreads),
      feedPosts: sanitizeSnapshotArray(parsed.feedPosts, fallback.feedPosts),
      marketItems: sanitizeSnapshotArray(parsed.marketItems, fallback.marketItems),
      events: sanitizeSnapshotArray(parsed.events, fallback.events),
      towns: sanitizeSnapshotArray(parsed.towns, fallback.towns),
      mediaItems: sanitizeSnapshotArray(parsed.mediaItems, fallback.mediaItems),
      noteFolders: sanitizeSnapshotArray(parsed.noteFolders, fallback.noteFolders),
      notes: sanitizeSnapshotArray(parsed.notes, fallback.notes),
      pages: sanitizeSnapshotArray(parsed.pages, fallback.pages),
      sectionSubmissions: sanitizeSnapshotArray(
        parsed.sectionSubmissions,
        await loadLocalSectionSubmissions(ownerUserId)
      ),
      chatMessages: mergeChatMessages(
        sanitizeSnapshotArray(parsed.chatMessages, fallback.chatMessages).filter(
          (message) => message.ownerUserId === ownerUserId
        ),
        await loadDevFallbackMessages(ownerUserId)
      ),
      seedVersion: APP_SEED_VERSION
    };

    return snapshot;
  } catch {
    await saveLocalAppSnapshot(fallback);
    return fallback;
  }
}

async function persistMessagesToLocalSnapshot(messages, ownerUserId = getDefaultUserId()) {
  const current = await loadLocalAppSnapshot(ownerUserId);
  const merged = mergeChatMessages(current.chatMessages, messages);
  const nextSnapshot = {
    ...current,
    ownerUserId,
    chatMessages: merged
  };
  await saveLocalAppSnapshot(nextSnapshot);
  await saveDevFallbackMessages(merged);
  return merged;
}

async function loadDevFallbackMessages(ownerUserId = getDefaultUserId()) {
  if (typeof window === 'undefined') {
    return CHAT_MESSAGE_SEED;
  }

  try {
    const parsed = await getSnapshot(DEV_FALLBACK_STORAGE_KEY + '-' + ownerUserId);
    if (!parsed)  return CHAT_MESSAGE_SEED;
    
    if (!Array.isArray(parsed)) return CHAT_MESSAGE_SEED;
    return parsed.filter((message) => message.ownerUserId === ownerUserId);
  } catch {
    return CHAT_MESSAGE_SEED;
  }
}

async function saveDevFallbackMessages(messages) {
  if (typeof window === 'undefined') return;
  try {
    await saveSnapshot(DEV_FALLBACK_STORAGE_KEY + '-' + (messages[0]?.ownerUserId || getDefaultUserId()), messages);
  } catch (error) {
    console.warn('saveDevFallbackMessages error:', error);
  }
}

async function loadLocalSectionSubmissions(ownerUserId = getDefaultUserId()) {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = await getSnapshot(SECTION_SUBMISSIONS_STORAGE_KEY + '-' + ownerUserId);
    if (!parsed)  return [];
    
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((submission) => submission?.ownerUserId === ownerUserId || !submission?.ownerUserId);
  } catch {
    return [];
  }
}

async function saveLocalSectionSubmissions(submissions) {
  if (typeof window === 'undefined') return;
  try {
    await saveSnapshot(SECTION_SUBMISSIONS_STORAGE_KEY + '-' + (submissions[0]?.ownerUserId || getDefaultUserId()), submissions);
  } catch (error) {
    console.warn('saveLocalSectionSubmissions error:', error);
  }
}

async function persistSectionSubmissionToLocal(submission, ownerUserId = getDefaultUserId()) {
  const current = await loadLocalSectionSubmissions(ownerUserId);
  const next = mergeById(current, [submission]);
  await saveLocalSectionSubmissions(next);
  return next;
}

function mergeById(primary = [], secondary = []) {
  const map = new Map();
  [...primary, ...secondary].forEach((item) => {
    if (!item) return;
    map.set(String(item.id), item);
  });
  return Array.from(map.values());
}

function mapSectionSubmissionToItem(submission) {
  const payload = submission?.payload && typeof submission.payload === 'object' ? submission.payload : {};
  const sectionId = String(submission?.sectionId || payload.sectionId || '').trim();
  const createdAt = submission?.createdAt || payload.created_at || new Date().toISOString();

  const baseItem = {
    ...payload,
    id: payload.id || submission.id || generateUUID(),
    sectionId,
    created_at: payload.created_at || createdAt
  };

  if (sectionId === 'mur') {
    return {
      ...baseItem,
      type: baseItem.type || 'post',
      title: baseItem.title || 'Publicació',
      summary: baseItem.summary || baseItem.post_subtitle || baseItem.description || '',
      content: baseItem.content || baseItem.description || baseItem.post_subtitle || '',
      post_subtitle: baseItem.post_subtitle || baseItem.description || '',
      author: baseItem.author || baseItem.author_name || 'Foraster',
      author_name: baseItem.author_name || baseItem.author || 'Foraster',
      author_avatar: baseItem.author_avatar || baseItem.avatar_url || null,
      town_name: baseItem.town_name || 'La Torre de les Maçanes',
      imageSrc: baseItem.imageSrc || firstAsset(baseItem.image_url || baseItem.image || baseItem.avatar_url) || null,
      image_url: baseItem.image_url || baseItem.image || baseItem.imageSrc || null,
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.post_subtitle,
        baseItem.description,
        baseItem.content,
        baseItem.author,
        baseItem.author_name,
        baseItem.town_name,
        baseItem.tag,
        baseItem.sectionId
      ])
    };
  }

  if (sectionId === 'mercat') {
    const imageSrc = baseItem.imageSrc || firstAsset(baseItem.image_url || baseItem.image || baseItem.avatar_url) || null;
    return {
      ...baseItem,
      type: baseItem.type || 'product',
      title: baseItem.title || 'Producte',
      description: baseItem.description || baseItem.summary || '',
      summary: baseItem.summary || baseItem.description || '',
      seller: baseItem.seller || baseItem.author_name || 'Foraster',
      avatar_url: baseItem.avatar_url || null,
      imageSrc,
      image_url: baseItem.image_url || baseItem.image || imageSrc || null,
      image: baseItem.image || imageSrc || null,
      category_slug: baseItem.category_slug || 'connectat',
      tag: baseItem.tag || 'Connectat',
      variations: Array.isArray(baseItem.variations) ? baseItem.variations : [],
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.description,
        baseItem.summary,
        baseItem.seller,
        baseItem.tag,
        baseItem.category_slug,
        baseItem.sectionId
      ])
    };
  }

  if (sectionId === 'events') {
    return {
      ...baseItem,
      type: baseItem.type || 'event',
      title: baseItem.title || 'Esdeveniment',
      description: baseItem.description || baseItem.summary || '',
      summary: baseItem.summary || baseItem.description || '',
      author_name: baseItem.author_name || baseItem.author || 'Foraster',
      date: baseItem.date || createdAt.slice(0, 10),
      image_url: baseItem.image_url || null,
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.description,
        baseItem.summary,
        baseItem.author_name,
        baseItem.type,
        baseItem.sectionId
      ])
    };
  }

  if (sectionId === 'multimedia') {
    const imageSrc = baseItem.imageSrc || firstAsset(baseItem.image_url || baseItem.image || baseItem.avatar_url) || null;
    return {
      ...baseItem,
      type: baseItem.type || 'media',
      title: baseItem.title || 'Arxiu Multimèdia',
      description: baseItem.description || baseItem.summary || '',
      tag: baseItem.tag || 'Multimèdia',
      source: baseItem.source || baseItem.author_name || 'Usuari',
      src: baseItem.src || imageSrc || null,
      created_at: baseItem.created_at || createdAt,
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.description,
        baseItem.tag,
        baseItem.source
      ])
    };
  }

  if (sectionId === 'notes') {
    return {
      ...baseItem,
      type: baseItem.type || 'note',
      title: baseItem.title || 'Nota Nova',
      content: baseItem.content || baseItem.description || baseItem.summary || '',
      plainText: baseItem.plainText || baseItem.description || baseItem.summary || '',
      category: baseItem.category || 'General',
      tags: Array.isArray(baseItem.tags) ? baseItem.tags : [],
      folderId: baseItem.folderId || 'f-root',
      updatedAt: baseItem.updatedAt || baseItem.created_at || createdAt,
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.content,
        baseItem.category
      ])
    };
  }

  return baseItem;
}

async function applySectionSubmissionsToData(data, ownerUserId = getDefaultUserId()) {
  const remoteSubmissions = Array.isArray(data.sectionSubmissions) ? data.sectionSubmissions : [];
  const localSubmissions = await loadLocalSectionSubmissions(ownerUserId);
  const mergedSubmissions = mergeById(remoteSubmissions, localSubmissions);

  const sectionItems = mergedSubmissions.reduce((accumulator, submission) => {
    const item = mapSectionSubmissionToItem(submission);
    if (!CONNECTABLE_SECTION_IDS.has(item.sectionId)) return accumulator;
    const items = accumulator[item.sectionId] || [];
    items.push(item);
    accumulator[item.sectionId] = items;
    return accumulator;
  }, {});

  return {
    ...data,
    sectionSubmissions: mergedSubmissions,
    feedPosts: mergeById(data.feedPosts || [], sectionItems.mur || []),
    marketItems: mergeById(data.marketItems || [], sectionItems.mercat || []),
    events: mergeById(data.events || [], sectionItems.events || []),
    mediaItems: mergeById(data.mediaItems || [], sectionItems.multimedia || []),
    notes: mergeById(data.notes || [], sectionItems.notes || [])
  };
}

// Removed chat conversation map per lint

function mergeChatMessages(primary = [], secondary = []) {
  const map = new Map();
  [...primary, ...secondary].forEach((message) => {
    if (!message) return;
    map.set(String(message.id), message);
  });
  return Array.from(map.values()).sort((a, b) => (a.createdAtTs || 0) - (b.createdAtTs || 0));
}













async function loadStructuredSupabaseData(config, ownerUserId) {
  const safeOwnerId = ownerUserId || getDefaultUserId();
  const { tenantId } = getResolvedConfig(config);
  const [contentRows, chatThreads, chatMessages, sectionSubmissionsResponse] = await Promise.all([
    request(`/rest/v1/app_content?select=key,payload,version&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, { signal: config.signal }),
    request(`/rest/v1/chat_threads?select=id,payload&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, { signal: config.signal }),
    request(`/rest/v1/chat_messages?select=id,owner_user_id,thread_id,message_id,text,sender,time_label,created_at&tenant_id=eq.${encodeURIComponent(tenantId)}&owner_user_id=eq.${encodeURIComponent(safeOwnerId)}&order=created_at.asc`, config, { signal: config.signal }),
    requestMaybe(`/rest/v1/section_submissions?select=*&tenant_id=eq.${encodeURIComponent(tenantId)}&owner_user_id=eq.${encodeURIComponent(safeOwnerId)}&order=created_at.asc`, config, { signal: config.signal })
  ]);

  if (!Array.isArray(contentRows) || contentRows.length === 0) {
    throw new Error('La BD remota està buida. Executa supabase/schema.sql i supabase/seed.sql.');
  }

  if (!Array.isArray(chatThreads) || chatThreads.length === 0) {
    throw new Error('Falten fils de xat en la BD remota. Executa supabase/seed.sql.');
  }

  const baseData = mapContentRowsToData(contentRows || []);
  return {
    ...baseData,
    ownerUserId,
    chatThreads: (chatThreads || []).map((thread) => ({ id: thread.id, ...thread.payload })),
    chatMessages: mergeChatMessages(
      (chatMessages || []).map((message) => ({
      id: message.id,
      ownerUserId: message.owner_user_id,
      threadId: message.thread_id,
      messageId: message.message_id,
      text: message.text,
      sender: message.sender,
      time: message.time_label,
      createdAtTs: message.created_at ? new Date(message.created_at).getTime() : 0
      })),
      await loadDevFallbackMessages(ownerUserId)
    ),
    sectionSubmissions: Array.isArray(sectionSubmissionsResponse?.data) ? sectionSubmissionsResponse.data : [],
    seedVersion: APP_SEED_VERSION
  };
}

async function loadRemoteAppData(config, ownerUserId = getDefaultUserId()) {
  const { hasSupabaseConfig } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
  }

  return loadStructuredSupabaseData(config, ownerUserId);
}

export async function loadAppData(ownerUserId = getDefaultUserId(), config = {}) {
  const loadAndMerge = async (loader) => await applySectionSubmissionsToData(await loader, ownerUserId);
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);

  if (runtimeDataMode === 'seed') {
    return loadAndMerge(await buildSeedAppData(ownerUserId));
  }

  if (runtimeDataMode === 'local') {
    return loadAndMerge(await loadLocalAppSnapshot(ownerUserId));
  }

  if (runtimeDataMode === 'hybrid') {
    if (!hasSupabaseConfig) {
      return loadAndMerge(await loadLocalAppSnapshot(ownerUserId));
    }

    try {
      return await loadAndMerge(loadRemoteAppData(config, ownerUserId));
    } catch {
      return loadAndMerge(await loadLocalAppSnapshot(ownerUserId));
    }
  }

  if (!hasSupabaseConfig) {
    return loadAndMerge(await buildSeedAppData(ownerUserId));
  }

  return loadAndMerge(loadRemoteAppData(config, ownerUserId));
}

export async function appendChatMessages(messages, config = {}) {
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);
  const ownerUserId = messages[0]?.ownerUserId || getDefaultUserId();
  if (runtimeDataMode === 'local' || runtimeDataMode === 'hybrid') {
    const localMerged = await persistMessagesToLocalSnapshot(messages, ownerUserId);
    if (runtimeDataMode === 'local') return localMerged;
  }

  if (runtimeDataMode === 'seed' || !hasSupabaseConfig) {
    const current = await loadDevFallbackMessages(ownerUserId);
    const merged = [...current, ...messages];
    await saveDevFallbackMessages(merged);
    return merged;
  }

  try {
    const { tenantId } = getResolvedConfig(config);
    const rows = messages.map((message) => ({
      id: String(message.id),
      tenant_id: tenantId,
      owner_user_id: message.ownerUserId || getDefaultUserId(),
      thread_id: String(message.threadId),
      message_id: String(message.messageId || message.id),
      text: message.text,
      sender: message.sender === 'me' ? 'me' : 'other',
      time_label: message.time || null,
      created_at: new Date(message.createdAtTs || Date.now()).toISOString()
    }));

    await request(`/rest/v1/chat_messages?on_conflict=${encodeURIComponent('id')}`, config, {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      body: rows
    });

    const current = await loadDevFallbackMessages(ownerUserId);
    const merged = mergeChatMessages(current, messages);
    await saveDevFallbackMessages(merged);
    return merged;
  } catch (error) {
    const message = String(error?.message || '');
    const isRlsDenied =
      message.includes('row-level security policy') ||
      message.includes('"42501"') ||
      message.includes('403');

    if (!isRlsDenied) {
      throw error;
    }

    if (runtimeDataMode === 'hybrid') {
      return await persistMessagesToLocalSnapshot(messages, ownerUserId);
    }
    const current = await loadDevFallbackMessages(ownerUserId);
    const merged = mergeChatMessages(current, messages);
    await saveDevFallbackMessages(merged);
    return merged;
  }
}

export async function appendSectionSubmissionNetworkOnly(submission, config = {}) {
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);
  const ownerUserId = submission?.ownerUserId || getDefaultUserId();
  const sectionId = String(submission?.sectionId || '').trim();
  if (!CONNECTABLE_SECTION_IDS.has(sectionId)) {
    throw new Error('Secció no suportada per a connectar.');
  }

  const id = String(submission?.id || generateUUID());
  const createdAt = submission?.createdAt || new Date().toISOString();
  const basePayload = submission?.payload && typeof submission.payload === 'object' ? submission.payload : {};
  const payload = mapSectionSubmissionToItem({
    ...submission,
    id,
    ownerUserId,
    sectionId,
    createdAt,
    payload: {
      ...basePayload,
      id,
      ownerUserId,
      sectionId,
      created_at: basePayload.created_at || createdAt
    }
  });
  const storedSubmission = {
    id,
    ownerUserId,
    sectionId,
    title: submission?.title || payload.title || '',
    description: submission?.description || payload.description || payload.summary || '',
    createdAt,
    payload
  };

  await persistSectionSubmissionToLocal(storedSubmission, ownerUserId);

  if (runtimeDataMode === 'seed' || runtimeDataMode === 'local' || !hasSupabaseConfig) {
    return storedSubmission;
  }



  try {
    const { tenantId } = getResolvedConfig(config);
    await request('/rest/v1/section_submissions?on_conflict=' + encodeURIComponent('id'), config, {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      body: [
        {
          id,
          tenant_id: tenantId,
          owner_user_id: ownerUserId,
          section_id: sectionId,
          title: storedSubmission.title,
          description: storedSubmission.description,
          payload,
          created_at: createdAt
        }
      ]
    });
    return storedSubmission;
  } catch (error) {
    const message = String(error?.message || '');
    const isRemoteUnavailable =
      message.includes('row-level security policy') ||
      message.includes('"42501"') ||
      message.includes('403') ||
      message.includes('404') ||
      message.includes('does not exist');

    if (isRemoteUnavailable) {
      console.warn('[BACKEND] Error remot inrecuperable per submission. Marcant com a rebutjada.', error);
      storedSubmission.syncStatus = 'quarantena-denegada';
      storedSubmission.syncError = message;
      await persistSectionSubmissionToLocal(storedSubmission, ownerUserId);
      return storedSubmission;
    }

    // Si és un error de xarxa (timeout, sense connexió, 500), el llancem perquè el sincronitzador ho ajorne!
    throw error;
  }
}

export {
  APP_SNAPSHOT_STORAGE_KEY,
  DATA_SYNC_CHANNEL_NAME,
  getDefaultUserId,
  SECTION_SUBMISSIONS_STORAGE_KEY,
};

export function getHasSupabaseConfig(config = {}) {
  return getResolvedConfig(config).hasSupabaseConfig;
}



export function getRuntimeDataMode(config = {}) {
  return getResolvedConfig(config).runtimeDataMode;
}

export function normalizeDataMode(config = {}) {
  return getResolvedConfig(config).runtimeDataMode;
}

export function getResolvedConfig(config = {}) {
  const supabaseUrl = config.supabaseUrl || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL?.trim() : '') || '';
  const supabaseAnonKey = config.supabaseAnonKey || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() : '') || '';
  let dataMode = String(config.dataMode || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_DATA_MODE : 'local') || 'local').trim().toLowerCase();
  
  if (!['auto', 'seed', 'local', 'hybrid', 'remote'].includes(dataMode)) {
    dataMode = 'local';
  }

  const tenantId = config.tenantId || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_TENANT_ID?.trim() : '') || '11111111-2222-3333-4444-555555555555';
  
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
  const runtimeMode = dataMode === 'local' ? 'local' : (dataMode === 'auto' ? (hasSupabaseConfig ? 'hybrid' : 'seed') : dataMode);
  
  return {
    supabaseUrl,
    supabaseAnonKey,
    tenantId,
    dataMode: runtimeMode,
    hasSupabaseConfig,
    
    runtimeDataMode: runtimeMode
  };
}



export async function registerWithEmail(email, password, name, config = {}) {
  const { tenantId, hasSupabaseConfig } = getResolvedConfig(config);
  
  if (!hasSupabaseConfig) {
    const mockUser = usuariSimulat(email, name);
    setVal('socdepoble-jwt', 'mock-jwt-token');
    setVal('socdepoble-user', mockUser);
    return { access_token: 'mock-jwt-token', user: mockUser };
  }

  const result = await request('/auth/v1/signup', config, {
    method: 'POST',
    body: {
      email,
      password,
      data: { name, tenant_id: tenantId }
    }
  });

  if (result?.access_token) {
    setVal('socdepoble-jwt', result.access_token);
    setVal('socdepoble-refresh-token', result.refresh_token);
    setVal('socdepoble-user', result.user);
  }
  return result;
}

export async function loginWithEmail(email, password, config = {}) {
  const { hasSupabaseConfig } = getResolvedConfig(config);

  if (!hasSupabaseConfig) {
    const mockUser = usuariSimulat(email, undefined);
    setVal('socdepoble-jwt', 'mock-jwt-token');
    setVal('socdepoble-user', mockUser);
    return { access_token: 'mock-jwt-token', user: mockUser };
  }

  const result = await request('/auth/v1/token?grant_type=password', config, {
    method: 'POST',
    body: { email, password }
  });

  if (result?.access_token) {
    setVal('socdepoble-jwt', result.access_token);
    setVal('socdepoble-refresh-token', result.refresh_token);
    setVal('socdepoble-user', result.user);
  }
  return result;
}

/**
 * L'anterior enviava l'usuari a Google amb `redirect_to = origin + pathname`.
 * Com que eixe origen no estava a la llista blanca, GoTrue no fallava: queia
 * al SITE_URL i l'usuari acabava sempre a socdepoble.org. I ningú llegia la
 * tornada, així que ni tan sols des d'allí s'hauria guardat la sessió.
 *
 * Ara: relé fix + PKCE + finestra emergent. Torna una promesa amb la sessió.
 */
export function loginWithGoogle(config = {}) {
  return entraAmbGoogle(config, getResolvedConfig);
}

/** Crida-la una vegada quan l'app es munte. */
export function recullTornadaOAuth(config = {}) {
  return gestionaTornada(config, getResolvedConfig);
}

export function logout() {
  delVal('socdepoble-jwt');
  delVal('socdepoble-refresh-token');
  delVal('socdepoble-user');
}

export function getCurrentUser() {
  return getVal('socdepoble-user', null);
}

```

## Fitxer: src/data/sincronitzador.js

```javascript
/**
 * sincronitzador.js — Motor de buidatge de la cua d'eixida.
 *
 * ---------------------------------------------------------------------------
 * CORRECCIONS RESPECTE DE LA VERSIÓ AUDITADA (27/08/2026)
 *
 *  P0-3  EL MOTOR NO ESTAVA CONNECTAT. `arrancaSincronitzador` tenia ZERO
 *        cridadors en tot l'arbre. `buida()` només s'invocava des de
 *        `sendChatMessage` i `sendSectionSubmission`, i la seua primera línia
 *        és `if (!navigator.onLine) return`. Resultat: si la persona escrivia
 *        sense cobertura i tornava la cobertura sense escriure res més, els
 *        missatges no eixien MAI. Tota la maquinària de reintents, retards i
 *        arrendaments d'`outbox.js` era codi mort.
 *        → Cal cridar `arrancaSincronitzador()` des d'`AppDataProvider`.
 *          Vegeu el bloc de connexió al final d'este fitxer.
 *
 *  P1-2  `compta()` FILTRAVA PER UN ESTAT INEXISTENT. `estat !== 'confirmat'`
 *        no descartava res, perquè els confirmats s'esborraven. Comptava morts
 *        i sentinelles: el globus de "pendents" no baixava mai de zero.
 *        Ara compta el que és de veres pendent: `pendent` i `enviant`.
 *
 *  P1-9  REENVIAMENT PER CONFIRMACIÓ FALLIDA. Si l'enviament reeixia però
 *        `confirma()` petava, el registre tornava a la cua i s'enviava un altre
 *        colp. Ara hi ha una guarda de sessió (`lliurats`) a més de la làpida
 *        d'`outbox.js`.
 *
 *  P1-10 BUCLE SENSE SOSTRE. `while (lot.length > 0)` sense límit de voltes.
 *        Ara hi ha `MAX_VOLTES`; el que quede es reprén al pròxim cicle.
 *
 *  P1-11 CÀRREGA MAL LLEGIDA. `r.payload || r.carrega` per al xat: `encua()`
 *        guarda el xat a `carrega` i els enviaments a `payload`. Ara es llig
 *        cadascun pel seu camp.
 * ---------------------------------------------------------------------------
 */
import { reclama, confirma, ajorna, pendents, enviaSigneVida, escombra } from './outbox.js';
import { appendChatMessages, appendSectionSubmissionNetworkOnly } from './backendPort.js';

const MAX_VOLTES = 50;
const INTERVAL_MS = 30_000;
const ESCOMBRA_CADA = 20;         // ~1 recollida de fem cada 10 minuts

let corrent = false;

/**
 * Ids ja lliurats a la xarxa en esta sessió però encara no confirmats a disc.
 * Segona línia de defensa contra el reenviament: si `confirma()` peta, el
 * registre continua a la cua, i quan el tornem a reclamar sabem que ja va eixir.
 */
const lliurats = new Set();

const senseXarxa = () =>
  typeof navigator !== 'undefined' && navigator.onLine === false;

/**
 * Buida la cua. No llança mai: torna un resum.
 * Segur si es crida en paral·lel: la guarda `corrent` serialitza dins de la
 * pestanya, i l'arrendament readwrite d'`outbox.js` serialitza entre pestanyes.
 */
export async function buida(config) {
  if (corrent) return { enviats: 0, ajornats: 0, voltes: 0, motiu: 'ja-corrent' };
  if (senseXarxa()) return { enviats: 0, ajornats: 0, voltes: 0, motiu: 'sense-xarxa' };

  corrent = true;
  let enviats = 0;
  let ajornats = 0;
  let voltes = 0;

  try {
    let lot;
    while (voltes < MAX_VOLTES && (lot = await reclama()).length > 0) {
      voltes += 1;

      for (const r of lot) {
        /* Ja va eixir a la xarxa i només falta netejar-lo del disc. */
        if (lliurats.has(r.id)) {
          try {
            await confirma(r.id);
            lliurats.delete(r.id);
          } catch (e) {
            console.warn('[SINCRONITZADOR] Confirmació pendent per a', r.id, e);
          }
          continue;
        }

        try {
          if (r.tipus === 'submission') {
            await appendSectionSubmissionNetworkOnly(r.payload, config);
          } else {
            await appendChatMessages([r.carrega ?? r.payload], config);
          }

          /* Marquem ABANS de confirmar: si l'esborrat peta, el pròxim cicle
             sabrà que este registre ja va eixir i no el reenviarà. */
          lliurats.add(r.id);
          await confirma(r.id);
          lliurats.delete(r.id);
          enviats += 1;
        } catch (e) {
          console.warn('[SINCRONITZADOR] Enviament fallit, s\'ajorna:', r.id, e);
          try {
            await ajorna(r);
          } catch (e2) {
            console.error('[SINCRONITZADOR] Tampoc s\'ha pogut ajornar:', r.id, e2);
          }
          ajornats += 1;
        }
      }

      if (senseXarxa()) break;
    }

    if (voltes >= MAX_VOLTES) {
      console.warn('[SINCRONITZADOR] Límit de voltes assolit; es reprén al pròxim cicle.');
    }
  } catch (e) {
    console.error('[SINCRONITZADOR] Falla crítica al bucle de buidatge:', e);
  } finally {
    corrent = false;
  }

  return { enviats, ajornats, voltes };
}

/**
 * P0-3. Arranca el motor. SENSE ESTA CRIDA LA CUA NO ES BUIDA MAI.
 *
 * Torna una funció de neteja pensada per a un `useEffect`:
 *
 *     useEffect(() => arrancaSincronitzador(stableExternalConfig), [stableExternalConfig]);
 *
 * Disparadors: torna la cobertura, torna la pestanya a primer pla, i un
 * rellotge de seguretat. El rellotge també renova el signe de vida (defensa
 * contra el 7-Day Purge de Safari) i passa l'escombra de tant en tant.
 */
export function arrancaSincronitzador(config, opcions = {}) {
  if (typeof window === 'undefined') return () => {};

  const intervalMs = opcions.intervalMs ?? INTERVAL_MS;
  const escombraCada = opcions.escombraCada ?? ESCOMBRA_CADA;

  let viu = true;
  let cicles = 0;

  const disparador = () => {
    if (!viu) return;
    buida(config).catch((e) => console.error('[SINCRONITZADOR]', e));
  };

  const perVisibilitat = () => {
    if (document.visibilityState === 'visible') disparador();
  };

  const tic = () => {
    if (!viu) return;
    cicles += 1;
    enviaSigneVida().catch(() => {});
    if (cicles % escombraCada === 0) escombra().catch(() => {});
    disparador();
  };

  window.addEventListener('online', disparador);
  document.addEventListener('visibilitychange', perVisibilitat);
  const rellotge = setInterval(tic, intervalMs);

  /* Arrancada en fred: pot haver-hi cua d'una sessió anterior. */
  enviaSigneVida().catch(() => {});
  disparador();

  return () => {
    viu = false;
    window.removeEventListener('online', disparador);
    document.removeEventListener('visibilitychange', perVisibilitat);
    clearInterval(rellotge);
  };
}

/**
 * P1-2. Quants missatges esperen de veres.
 * Els morts, les làpides i els sentinelles no són pendents: no compten.
 */
export const compta = async () =>
  (await pendents()).filter((r) => r.estat === 'pendent' || r.estat === 'enviant').length;

/* ---------------------------------------------------------------------------
 * CONNEXIÓ REQUERIDA — src/app/AppDataContext.jsx
 *
 *   import { buida, arrancaSincronitzador } from '../data/sincronitzador.js';
 *
 *   // dins d'AppDataProvider, al costat dels altres useEffect:
 *   useEffect(
 *     () => arrancaSincronitzador(stableExternalConfig),
 *     [stableExternalConfig]
 *   );
 *
 * Sense estes tres línies, `outbox.js` continua sent una cua d'escriptura
 * només: guarda els missatges de l'uelo i no els envia mai.
 * --------------------------------------------------------------------------- */

```

## Fitxer: src/sections/mur/MurSection.jsx

```javascript
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UniversalPage, UniversalCard, ActionControl, IconButton, ContentProvider } from '../../components/universal/UniversalComponents';
import { EventCard } from '../../components/universal/EventCard';
import { useAppData } from '../../app/AppDataContext';
import { useSEO } from '../../hooks/useSEO';
import { resolveAsset } from '../../config/assetResolver';
import { getSectionItemPath } from '../../config/navigation';
import { buildMapEmbedUrl } from './mapConfig';

export default function MurSection() {
  const { sortedEvents, sortedFeedPosts, sortedMarketItems, sortedTowns, pageCopy, t } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateFilter = searchParams.get('date');
  const categoryFilter = searchParams.get('category');

  const [filterType, setFilterType] = useState('all');
  const [isMapOpen, setIsMapOpen] = useState(false);

  useSEO({
    title: t('section.mur.kicker', 'Mur'),
    description: t('section.mur.subtitle', 'Llig el mur públic amb les darreres publicacions del poble.')
  });

  const systemPages = [
    { key: 'disseny', isAvis: true, href: '/disseny' },
    { key: 'projecte', isAvis: false, href: '/projecte' },
    { key: 'constitucio', isAvis: false, href: '/constitucio' },
    { key: 'skills', isAvis: false, href: '/skills' },
    { key: 'anima', isAvis: false, href: '/ia' },
    { key: 'roadmap', isAvis: false, href: '/roadmap' },
    { key: 'versions', isAvis: false, href: '/versions' },
    { key: 'legal', isAvis: false, href: '/legal' }
  ].map(item => {
    const data = pageCopy[item.key];
    if (!data) return null;
    return {
      ...data,
      id: item.key,
      isSystem: true,
      isAvis: item.isAvis,
      mainHref: item.href,
      type: 'sistema'
    };
  }).filter(Boolean);

  const allItems = useMemo(() => {
    const combined = [
      ...(sortedEvents || []),
      ...(sortedFeedPosts || []),
      ...(sortedMarketItems || []),
      ...systemPages
    ].filter(Boolean);

    return combined.sort((a, b) => {
      const dateA = new Date(a.date || a.publish_date || a.created_at || "2026-08-21T00:00:00.000Z");
      const dateB = new Date(b.date || b.publish_date || b.created_at || "2026-08-21T00:00:00.000Z");
      return dateB - dateA;
    });
  }, [sortedEvents, sortedFeedPosts, sortedMarketItems, sortedTowns, pageCopy, systemPages]);

  const displayedItems = useMemo(() => {
    let items = allItems;
    if (filterType === 'events') items = items.filter(i => i.type === 'event');
    if (filterType === 'sistema') items = items.filter(i => i.type === 'sistema');

    if (dateFilter) {
      items = items.filter(i => {
        const rawDate = i.date || i.publish_date || i.created_at;
        if (!rawDate) return false;
        return rawDate.startsWith ? rawDate.startsWith(dateFilter) : String(rawDate).startsWith(dateFilter);
      });
    }
    
    if (categoryFilter) {
      items = items.filter(i => {
        const labels = i.labels || [{ text: i.isSystem ? 'Sistema' : (i.type || 'Publicació') }];
        return labels.some(l => l.text.toLowerCase() === categoryFilter.toLowerCase());
      });
    }

    return items;
  }, [allItems, filterType, dateFilter, categoryFilter]);

  const getCalendarBadge = (dateString) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return {
      dia: d.getDate(),
      mes: d.toLocaleDateString('ca-ES', { month: 'long' }),
      any: d.getFullYear(),
      dateTime: dateString
    };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const formatTime = (timeStr, dateStr) => {
    if (timeStr) return timeStr;
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const config = {
    title: t('section.mur.kicker', 'Mur'),
    subtitle: t('section.mur.title', 'Publicacions recents'),
    lead: t('section.mur.subtitle', 'Llig el mur públic amb les darreres publicacions del poble.'),
    chrome: "system",
    showLogos: true
  };

  return (
    <ContentProvider initialConfig={config}>
      <UniversalPage>
      <div className="content-wrapper">
        
        {/* Switcher / Botonera */}
        <section className="sdp-filtres" aria-label="Filtres del mur" style={{ padding: '0 16px' }}>
          <div className="login-switcher">
            <button
              type="button"
              className={['pill', filterType === 'all' && !isMapOpen ? 'pill--active' : ''].filter(Boolean).join(' ')}
              onClick={() => { setFilterType('all'); setIsMapOpen(false); }}
            >
              Mostrar Tot
            </button>
            <button
              type="button"
              className={['pill', filterType === 'events' && !isMapOpen ? 'pill--active' : ''].filter(Boolean).join(' ')}
              onClick={() => { setFilterType('events'); setIsMapOpen(false); }}
            >
              Esdeveniments
            </button>
            <button
              type="button"
              className={['pill', filterType === 'system' && !isMapOpen ? 'pill--active' : ''].filter(Boolean).join(' ')}
              onClick={() => { setFilterType('system'); setIsMapOpen(false); }}
            >
              Sistema
            </button>
            <button
              type="button"
              className={['pill', isMapOpen ? 'pill--active' : ''].filter(Boolean).join(' ')}
              onClick={() => setIsMapOpen(!isMapOpen)}
            >
              🗺️ Mapa
            </button>
          </div>
        </section>

        {/* Mapa Desplegable */}
        {isMapOpen && (
          <div className="sdp-filtre--mapa sdp-w-full sdp-mb-8">
            {React.createElement('iframe', {
              title: "Mapa del territori",
              src: buildMapEmbedUrl(),
              loading: "lazy",
              referrerPolicy: "no-referrer-when-downgrade",
              style: { width: '100%', height: '400px', border: 0, borderRadius: 'var(--sdp-radi-lg)' }
            })}
          </div>
        )}

        {/* Targetes del Mur */}
        <div className="sdp-card-grid">
          {displayedItems.map((item) => {
            const rawDate = item.date || item.publish_date || item.created_at || "2026-08-21T00:00:00.000Z";
            
            if (item.type === 'event') {
              return <EventCard key={`${item.type}-${item.id}`} item={item} />;
            }
            
            return (
              <UniversalCard
                key={`${item.type}-${item.id}`}
                title={item.title || item.name}
                subtitle={item.subtitle}
                body={item.lead || <p className="sp-card-text">{item.description}</p>}
                imageUrl={resolveAsset(item.image_url || item.image || item.images?.[0] || item.imageSrc || '')}
                imageAlt={item.imageAlt || item.title || ''}
                author={item.author_name || item.seller || "Sóc de Poble"}
                authorHref={item.isSystem ? "/pobles" : undefined}
                avatarUrl={resolveAsset(item.author_avatar || item.avatar_url || '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg')}
                location={item.author_location || item.population || "La Torre de les Maçanes"}
                date={formatDate(rawDate)}
                time={formatTime(item.time, rawDate)}
                copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
                calendarBadge={null}
                price={item.price}
                labels={item.labels || [
                  { 
                    text: item.isSystem ? 'Sistema' : ((item.type === 'market' || item.type === 'product') ? 'Mercat' : (item.type || 'Publicació')), 
                    className: (item.isSystem || item.type === 'market' || item.type === 'product') ? 'sdp-badge-system' : 'sdp-badge-category' 
                  },
                  (item.type === 'market' || item.type === 'product') && item.variations?.length ? { text: `${item.variations.length} ${t('section.mercat.variations', 'variants')}`, className: 'sdp-badge-accent' } : null,
                  (item.type === 'market' || item.type === 'product') && item.category_slug ? { text: item.category_slug, className: 'sdp-badge-category' } : null,
                  (item.type === 'market' || item.type === 'product') && item.tag ? { text: item.tag, className: 'sdp-badge-tag' } : null
                ].filter(Boolean)}
                mainHref={item.mainHref || getSectionItemPath(item.type === 'event' ? 'events' : ((item.type === 'market' || item.type === 'product') ? 'mercat' : (item.type === 'poble' ? 'pobles' : 'mur')), item.id)}
                showPin={item.isAvis}
                hasFooter={true}
                showTranslate={true}
                showComment={true}
                showShare={true}
                showConnect={true}
              />
            );
          })}
        </div>
      </div>
    </UniversalPage>
    </ContentProvider>
  );
}

```

## Fitxer: src/sections/mercat/MercatSection.jsx

```javascript
import React from 'react';
import { UniversalPage, UniversalCard, ContentProvider } from '../../components/universal/UniversalComponents';
import { getSectionItemPath } from '../../config/navigation';
import { useAppData } from '../../app/AppDataContext';

import { useSEO } from '../../hooks/useSEO';


export default function MercatSection() {
  const { sortedMarketItems, t } = useAppData();
  
  useSEO({
    title: t('section.mercat.kicker', 'Mercat'),
    description: t('section.mercat.subtitle', 'Explora els productes i les ofertes disponibles.')
  });

  const config = {
    title: t('section.mercat.kicker', 'Mercat'),
    subtitle: t('section.mercat.title', 'Productes i intercanvis'),
    lead: t('section.mercat.subtitle', 'Explora els productes i les ofertes disponibles.'),
    chrome: "system",
    showLogos: true
  };

  return (
    <ContentProvider initialConfig={config}>
      <UniversalPage>
        <div className="sdp-card-grid">
          {sortedMarketItems.map((item) => {
            let itemDate = '';
            let itemTime = '';
            if (item?.created_at) {
              const d = new Date(item.created_at);
              itemDate = d.toLocaleDateString('ca-ES');
              itemTime = d.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
            }

            return (
              <UniversalCard
                key={item.id}
                author={item.author_name || item.seller || 'Sóc de Poble'}
                avatarUrl={item.avatar_url || '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg'}
                body={item.description || ''}
                copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
                date={itemDate}
                time={itemTime}
                imageAlt={item.title}
                imageUrl={item.images?.[0] || item.imageSrc || ''}
                labels={[
                  { text: 'Mercat', className: 'sdp-badge-system' },
                  item.variations?.length ? { text: `${item.variations.length} ${t('section.mercat.variations', 'variants')}`, className: 'sdp-badge-accent' } : null,
                  item.category_slug ? { text: item.category_slug, className: 'sdp-badge-category' } : null,
                  item.tag ? { text: item.tag, className: 'sdp-badge-tag' } : null
                ].filter(Boolean)}
                location={item.author_location || item.population || 'La Torre de les Maçanes'}
                mainHref={getSectionItemPath('mercat', item.id)}
                subtitle={item.subtitle || ''}
                title={item.title}
                price={item.price}
                hasFooter={true}
                showTranslate={true}
                showComment={true}
                showShare={true}
                showConnect={true}
              />
            );
          })}
        </div>
      </UniversalPage>
    </ContentProvider>
  );
}

```

## Fitxer: src/sections/multimedia/MultimediaSection.jsx

```javascript
import { useMemo, useState } from 'react';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { Link } from 'react-router-dom';
import { getSectionItemPath } from '../../config/navigation';

export default function MultimediaSection() {
  const { mediaItems, mediaTimelineGroups, t } = useAppData();
  const [viewMode, setViewMode] = useState('grid');
  const featured = useMemo(() => mediaItems[0] || null, [mediaItems]);
  const timelineGroups = useMemo(() => mediaTimelineGroups, [mediaTimelineGroups]);

  return (
    <UniversalPage
      title={t('section.multimedia.title', 'Arxiu visual')}
      subtitle={t('section.multimedia.subtitle', 'Galeria d’imatges i cronologia visual del projecte.')}
      chrome="system"
      showLogos={true}
    >
      <div className="bar-orange sdp-items-center" style={{ display: 'flex', position: 'relative', top: 0, zIndex: 10, margin: '-24px -24px 24px -24px', padding: '12px 24px', borderRadius: 'var(--sdp-radi-xl) var(--sdp-radi-xl) 0 0' }}>
        <strong style={{ flex: 1 }}>{t('section.multimedia.all', 'TOTS')} ({mediaItems.length}) - {featured?.created_at ? new Date(featured.created_at).toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' }) : ''}</strong>
        <div className="section-actions" style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className={`pill ${viewMode === 'grid' ? 'pill--active' : ''}`} onClick={() => setViewMode('grid')}>
            {t('section.multimedia.gallery', 'Galeria')}
          </button>
          <button type="button" className={`pill ${viewMode === 'timeline' ? 'pill--active' : ''}`} onClick={() => setViewMode('timeline')}>
            {t('section.multimedia.timeline', 'Cronologia')}
          </button>
        </div>
      </div>



      {viewMode === 'grid' ? (
        <div className="photo-grid">
          {mediaItems.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              to={getSectionItemPath('multimedia', item.id)}
              state={{ preloadedItem: item }}
              className="photo-grid__item"
            >
              <img src={item.src} alt={item.title || item.tag} loading="lazy" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="stack-grid">
          {timelineGroups.map((group) => (
            <section key={group.key} className="card card--soft">
              <div className="card__body">
                <div className="text-panel__head">
                  <h2 className="section-title">{group.label}</h2>
                  <span className="pill">{group.items.length} {t('section.multimedia.elements', 'elements')}</span>
                </div>
                <div className="photo-grid">
                  {group.items.map((item, idx) => (
                    <Link
                      key={`${item.id}-${idx}`}
                      to={getSectionItemPath('multimedia', item.id)}
                      state={{ preloadedItem: item }}
                      className="photo-grid__item"
                    >
                      <img src={item.src} alt={item.title || item.tag} loading="lazy" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </UniversalPage>
  );
}

```

## Fitxer: src/sections/notes/NotesSection.jsx

```javascript
import { useDeferredValue, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { ChevronLeft, FileText, Folder, List, Heading1, Heading2, Type, ListOrdered, CheckSquare, Image as ImageIcon, Video, Link, Bold, Italic, Strikethrough, Sparkles, Download } from 'lucide-react';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { UniversalSearch } from '../../components/ui/UniversalSearch.jsx';
import { useAppData } from '../../app/AppDataContext';

const CATEGORIES = ['Trellat', 'Patrimoni', 'Dades', 'Social'];
const LANGUAGE_LOCALES = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en-GB',
  eu: 'eu-ES',
  gl: 'gl-ES'
};

export default function NotesSection() {
  const { language, normalizeSearchText, noteFolders, notes: rawNotes, t } = useAppData();
  const [activeFolderId, setActiveFolderId] = useState('f-root');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState('n1');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [mobileView, setMobileView] = useState('folders');
  const locale = LANGUAGE_LOCALES[language] || 'ca-ES';

  const notes = useMemo(
    () =>
      rawNotes.map((note) => {
        const plainText = String(note.content || '').replace(/<[^>]*>/g, ' ').trim();
        return {
          ...note,
          plainText,
          searchText: normalizeSearchText(`${note.title} ${plainText}`),
          formattedDate: new Date(note.updatedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
        };
      }),
    [locale, normalizeSearchText, rawNotes]
  );

  const filteredNotes = useMemo(() => {
    const query = normalizeSearchText(deferredSearchQuery);
    return notes
      .filter((note) => (activeFolderId ? note.folderId === activeFolderId : true))
      .filter((note) => (activeCategory ? note.category === activeCategory : true))
      .filter((note) => (!query ? true : note.searchText.includes(query)));
  }, [activeCategory, activeFolderId, deferredSearchQuery, notes, normalizeSearchText]);

  const activeNote = filteredNotes.find((note) => note.id === activeNoteId) || filteredNotes[0] || notes[0];

  const handleSelectFolder = (id) => {
    setActiveFolderId(id);
    setActiveCategory(null);
    setMobileView('list');
  };

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setActiveFolderId(null);
    setMobileView('list');
  };

  const handleBack = () => {
    if (mobileView === 'editor') setMobileView('list');
    else if (mobileView === 'list') setMobileView('folders');
  };

  const getCategoryLabel = (category) => t(`section.notes.category.${category}`, category);

  return (
    <UniversalPage
      title={t('section.notes.title', 'Blog de Notes')}
      subtitle={t('section.notes.subtitle', 'Notes i apunts del projecte organitzats per carpetes.')}
      chrome="system"
      showLogos={true}
    >
      <article className="card notes-card">
        <div className="topbar mobile-only-topbar">
          <div className="topbar__title">
            <strong>{t('section.notes.mobileTitle', 'Blog de Notes')}</strong>
          </div>
          <div className="topbar__actions">
            <button type="button" className={`pill ${mobileView === 'folders' ? 'pill--primary' : ''}`} onClick={() => setMobileView('folders')}>
              <Folder size={16} /> {t('section.notes.mobileFolders', 'Carpetes')}
            </button>
            <button type="button" className={`pill ${mobileView === 'list' ? 'pill--primary' : ''}`} onClick={() => setMobileView('list')}>
              <List size={16} /> {t('section.notes.mobileList', 'Llista')}
            </button>
            <button type="button" className={`pill ${mobileView === 'editor' ? 'pill--primary' : ''}`} onClick={() => setMobileView('editor')}>
              <FileText size={16} /> {t('section.notes.mobileEditor', 'Editor')}
            </button>
          </div>
        </div>

        <div className="notes-shell">
          <aside className={`notes-column notes-column--folders ${mobileView === 'folders' ? 'notes-column--mobile' : ''}`}>
            <div className="notes-column__head">{t('section.notes.archive', 'Arxiu')}</div>
            <div className="notes-column__body">
              <div className="folders-list">
                {noteFolders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    className={`folder-button ${folder.id === activeFolderId ? 'folder-button--active' : ''}`}
                    onClick={() => handleSelectFolder(folder.id)}
                  >
                    <Folder size={16} /> {folder.name}
                  </button>
                ))}
              </div>

              <div className="notes-category-block">
                <div className="notes-column__head">{t('section.notes.categories', 'Categories')}</div>
                <div className="folders-list">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`folder-button ${category === activeCategory ? 'folder-button--active' : ''}`}
                      onClick={() => handleSelectCategory(category)}
                    >
                      {getCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className={`notes-column notes-column--list ${mobileView === 'list' ? 'notes-column--mobile' : ''}`}>
            <div className="notes-column__head">{t('nav.notes', 'Notes')}</div>
            <div className="notes-column__body">
              <UniversalSearch
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('section.notes.searchPlaceholder', 'Cerca al bancal...')}
                ariaLabel={t('section.notes.searchAria', 'Cercador de notes')}
              />

              <div className="note-list">
                {filteredNotes.map((note) => {
                  const isActive = note.id === activeNote?.id;
                  return (
                    <button
                      key={note.id}
                      type="button"
                      className={`conversation-button ${isActive ? 'conversation-button--active' : ''}`}
                      onClick={() => {
                        setActiveNoteId(note.id);
                        setMobileView('editor');
                      }}
                    >
                      <div className="conversation-meta">
                        <strong>{note.title}</strong>
                        <span>{note.formattedDate}</span>
                        <span className="conversation-preview">{note.plainText.slice(0, 100) || t('section.notes.emptyPreview', 'Sense contingut...')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <main className={`notes-column notes-column--editor ${mobileView === 'editor' ? 'notes-column--mobile' : ''}`}>
              <div className="notes-column__head notes-column__head--editor">
                <button type="button" className="pill" onClick={handleBack}>
                <ChevronLeft size={16} /> {t('section.notes.back', 'Tornar')}
                </button>
                <div className="editor-toolbar">
                  <Sparkles size={16} />
                  <Download size={16} />
                  <Heading1 size={16} />
                  <Heading2 size={16} />
                  <Type size={16} />
                  <List size={16} />
                  <ListOrdered size={16} />
                  <CheckSquare size={16} />
                  <ImageIcon size={16} />
                  <Video size={16} />
                  <Link size={16} />
                  <Bold size={16} />
                  <Italic size={16} />
                  <Strikethrough size={16} />
                </div>
              <span>{activeNote?.category ? getCategoryLabel(activeNote.category) : t('section.notes.categoryLabel', 'Categoria')}</span>
              </div>
            <div className="notes-column__body notes-editor">
              {activeNote ? (
                <>
                  <h2 className="card__title">{activeNote.title}</h2>
                  <div className="badge-row">
                    <span className="badge">{getCategoryLabel(activeNote.category)}</span>
                    {activeNote.tags?.map((tag) => <span key={tag} className="badge">{tag}</span>)}
                  </div>
                  <article
                    className="app-note-content"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activeNote.content) }}
                  />
                </>
              ) : (
                <div className="chat-empty">
                  <FileText size={64} />
                  <h2 className="section-title">{t('section.notes.open', 'Obre un solc')}</h2>
                </div>
              )}
            </div>
          </main>
        </div>
      </article>
    </UniversalPage>
  );
}

```

## Fitxer: src/css/index.css

```css
/* ── TIPOGRAFIA · allotjada en local ───────────────────────────────
   Noto Sans · SIL Open Font License 1.1 · redistribució permesa.
   Descàrrega dels fitxers (una sola vegada, mai en temps d'execució):
     https://fonts.google.com/noto/specimen/Noto+Sans  →  «Get font»
   Subconjunt recomanat per a valencià/català (redueix ~70% el pes):
     pyftsubset NotoSans.ttf --unicodes="U+0000-00FF,U+0100-017F,U+0192,\
       U+01FA-01FF,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,\
       U+00B7,U+20AC" --flavor=woff2 --output-file=noto-sans-400.woff2
   Col·loca'ls a  assets/fonts/  amb estos noms exactes.
   ───────────────────────────────────────────────────────────────── */
/* L'import s'ha mogut fora de React */

/* ═══════════════════════════════════════════════════════════════════
   PEDRA SECA · Full d'estils base — v2.0
   Sóc de Poble · CSS natiu, sense frameworks (substitueix el base)
   ─────────────────────────────────────────────────────────────────────
   ARQUITECTURA
   0. Tokens de disseny (:root)  — nous --sdp-*, àlies legat --sp-*
   1. Reset i base global        — scroll delegat, sense rubber-band
   2. Esquelet de l'app          — 3 columnes: sidebar · llista · visor
   3. Columna 1: Sidebar (La Roca)
   4. Columna 2: Llista contextual (opcional, l'app real la injecta)
   5. Columna 3: Visor — barres negra/blava/taronja, hero, títol
   6. Contingut editorial (content-wrapper, design-block, CMS)
   7. Components (botons, formularis, alertes, taules, targetes…)
   8. FAB
   9. Utilitats sdp-*
   10. Responsive — breakpoint mestre 1100px + afinats 720px / 480px
   11. Accessibilitat i moviment reduït
   ─────────────────────────────────────────────────────────────────────
   REGLA D'OR: el <body> NO fa scroll (overflow:hidden). Cada columna
   gestiona el seu propi overflow-y — això elimina el rubber-band de
   Safari/iOS i manté les barres sticky dins del visor.
   ═══════════════════════════════════════════════════════════════════ */

/* ── 0. TOKENS ─────────────────────────────────────────────────────
   DOS CAPES. Esta separació és la llei del sistema.

   CAPA 1 · PRIMITIUS  — la paleta física. Generada en OKLCH amb to i
            croma de marca constants; només varia la lluminositat.
            NO s'usen mai directament als components.
   CAPA 2 · SEMÀNTICS  — el significat. És l'ÚNICA capa que toquen els
            components, l'única que canvia el tema fosc i l'única
            superfície que exposarà el tauler de control.

   Regla mecànica: si un component escriu var(--sdp-pedra-*),
   var(--sdp-primary-*) o var(--sdp-secondary-*), és un error.
   ───────────────────────────────────────────────────────────────── */

:host, .sdp-root {
  all: initial;
}

:root, :host, .sdp-root {
  /* ═══ CAPA 1 · PRIMITIUS ═══════════════════════════════════════ */

  /* Pedra · neutre càlid — OKLCH H 84°, croma baix */
  --sdp-blanc-pur: oklch(100% 0 0);
  --sdp-negre-pur: oklch(0% 0 0);
  --sdp-blanc: #ffffff;
  --sdp-negre: #000000;
  --sdp-pedra-50:  #fdfcfb;
  --sdp-pedra-100: #f9f8f5;
  --sdp-pedra-200: #efece7;
  --sdp-pedra-300: #dcd7cd;
  --sdp-pedra-400: #b7b1a5;
  --sdp-pedra-500: #8b857b;
  --sdp-pedra-600: #514c45;
  --sdp-pedra-700: #3d3b35;
  --sdp-pedra-750: #302e29;
  --sdp-pedra-800: #22211e;
  --sdp-pedra-850: #181715;
  --sdp-pedra-900: #0e0d0c;

  /* Primari · taronja de terra — OKLCH H 47.9° (to exacte del cànon #FF7300) */
  --sdp-primary-50:  #fff4ef;
  --sdp-primary-100: #ffe7dc;
  --sdp-primary-200: #ffd1bb;
  --sdp-primary-300: #ffb38c;
  --sdp-primary-400: #ff955b;
  --sdp-primary-500: #fe7406;   /* el cànon. Només com a FONS. */
  --sdp-primary-600: #dd6302;
  --sdp-primary-700: #ad4c03;   /* Taronja fort · text i fons massís d'accent */
  --sdp-primary-800: #873a01;   /* text accent · 7,97:1 · AAA */
  --sdp-primary-900: #602701;

  /* Secundari · blau de mar — OKLCH H 250.6° (to exacte del cànon #0984E3) */
  --sdp-secondary-50:  #f1f8ff;
  --sdp-secondary-100: #e0efff;
  --sdp-secondary-200: #c3e0ff;
  --sdp-secondary-300: #96c9ff;
  --sdp-secondary-400: #49a3fa;
  --sdp-secondary-500: #016ebf;   /* fons · text blanc 5,23:1 · AA */
  --sdp-secondary-600: #00599d; /* Blau fort · text i fons massís d'acció */
  --sdp-secondary-700: #004983;
  --sdp-secondary-800: #003663;
  --sdp-secondary-900: #002546;

  /* Estat */
  --sdp-error-500: #c2181d;  --sdp-error-50: #ffedeb;  --sdp-error-700: #92000c;
  --sdp-avis-500:  #9c6902;  --sdp-avis-50:  #fff1df;  --sdp-avis-700:  #6e4901;
  --sdp-exit-500:  #027e38;  --sdp-exit-50:  #e4f8e7;  --sdp-exit-700:  #005c27;

  /* ═══ CAPA 2 · SEMÀNTICS · TEMA CLAR ═══════════════════════════
     Cada línia porta el contrast mesurat i el nivell que compleix.  */

  /* Fons */
  --sdp-fons-app:        var(--sdp-pedra-100);
  --sdp-fons-targeta:    var(--sdp-blanc-pur);
  --sdp-fons-elevat:     var(--sdp-blanc-pur);
  --sdp-fons-superficie: var(--sdp-blanc-pur);
  
  /* Estructura de marca: no canvia amb el tema */
  --sdp-fons-roca:       var(--sdp-pedra-900);
  --sdp-sobre-roca:      var(--sdp-pedra-50);
  --sdp-fons-subtil:     var(--sdp-pedra-200);
  --sdp-fons-invers:     var(--sdp-pedra-900);
  --sdp-fons-vel:        rgba(14, 13, 12, 0.55);
  --sdp-color-focus:     var(--sdp-secondary-500);

  /* Text — TOT compleix AAA (≥7:1) sobre la seua superfície */
  --sdp-text-titol:  var(--sdp-pedra-900);   /* 19,42:1 */
  --sdp-text-cos:    var(--sdp-pedra-700);   /* 11,20:1 */
  --sdp-text-suau:   var(--sdp-pedra-600);   /*  7,24:1 */
  --sdp-text-invers: var(--sdp-pedra-50);
  --sdp-text-desactivat: var(--sdp-pedra-500);  /* Afegeix ací overrides temporals o experiments en viu */

  /* Vores */
  --sdp-vora:         var(--sdp-pedra-300);   /* decorativa */
  --sdp-vora-control: var(--sdp-pedra-500);   /* 3,66:1 · WCAG 1.4.11 */
  --sdp-vora-forta:   var(--sdp-pedra-600);

  /* Accent · taronja — identitat de marca */
  --sdp-accent:            var(--sdp-primary-500);
  --sdp-accent-hover:      var(--sdp-primary-600);
  --sdp-accent-subtil:     var(--sdp-primary-50);
  --sdp-sobre-accent:      var(--sdp-pedra-900);    /*  7,13:1 · AAA */
  --sdp-accent-text:       var(--sdp-primary-700);  /*  5,51:1 · AA  (interacció) */
  --sdp-accent-text-hover: var(--sdp-primary-800);  /*  7,97:1 · AAA */
  --sdp-accent-titol:      var(--sdp-primary-700);  /*  5,51:1 · AA (h2, h4) */

  /* Acció · blau */
  --sdp-accio:         var(--sdp-secondary-500);
  --sdp-accio-hover:   var(--sdp-secondary-700);
  --sdp-accio-forta:   var(--sdp-secondary-700);
  --sdp-accio-subtil:  var(--sdp-secondary-50);
  --sdp-sobre-accio:   #ffffff;                  /*  5,23:1 · AA */
  --sdp-accio-text:    var(--sdp-secondary-700); /*  7,20:1 · AAA (h1, h3, h5) */
  --sdp-focus:         var(--sdp-secondary-700);
  --sdp-focus-invers:  var(--sdp-primary-400);

  /* Estat semàntic */
  --sdp-error: var(--sdp-error-500);  --sdp-error-fons: var(--sdp-error-50);  --sdp-error-text: var(--sdp-error-700);
  --sdp-avis:  var(--sdp-avis-500);   --sdp-avis-fons:  var(--sdp-avis-50);   --sdp-avis-text:  var(--sdp-avis-700);
  --sdp-exit:  var(--sdp-exit-500);   --sdp-exit-fons:  var(--sdp-exit-50);   --sdp-exit-text:  var(--sdp-exit-700);
  --sdp-info:  var(--sdp-secondary-500); --sdp-info-fons: var(--sdp-secondary-50); --sdp-info-text: var(--sdp-secondary-700);

  /* ═══ MÈTRIQUES, MOVIMENT, TIPOGRAFIA ═════════════════════════ */

  /* Radis */
  --sdp-radi-s: 8px;
  --sdp-radi-m: 12px;
  --sdp-radi-g: 16px;
  --sdp-radi-xl: 24px;
  --sdp-radi-pastilla: 999px;

  /* Ombres · to pedra, mai negre pur */
  --sdp-ombra-1: 0 1px 3px rgba(14, 13, 12, 0.05);
  --sdp-ombra-2: 0 3px 10px rgba(14, 13, 12, 0.07);
  --sdp-ombra-3: 0 10px 28px rgba(14, 13, 12, 0.10);
  --sdp-ombra-4: 0 18px 44px rgba(14, 13, 12, 0.16);

  /* Moviment */
  --sdp-t: 0.18s ease;
  --sdp-t-lenta: 0.3s cubic-bezier(0.2, 0.7, 0.3, 1);

  /* Mètriques del layout */
  --sdp-ctrl-vw: clamp(320px, 100vw, 1024px);
  --sdp-ctrl-scale: calc((var(--sdp-ctrl-vw) - 320px) / (1024px - 320px));
  --sdp-step-0: calc(14px + (16 - 14) * var(--sdp-ctrl-scale));
  --sdp-space-base: var(--sdp-step-0);

  --sdp-col-sidebar: 260px;
  --sdp-col-llista: 380px;
  --sdp-alt-negra: 64px;
  --sdp-alt-accio: 58px;
  --sdp-alt-barres: calc(var(--sdp-alt-negra) + var(--sdp-alt-accio) * 2);  /* 180px · pila sticky */
  --sdp-alt-nav-mobil: 96px;                 /* nav inferior + separació */
  --sdp-pad-contenidor: clamp(16px, 4vw, 40px);

  /* LLEI DE VIDA · objectiu tàctil mínim. Cap control per davall. */
  --sdp-touch: 44px;
  --sdp-touch-comode: 48px;

  /* Escala z-index · única font de veritat */
  --z-barra-taronja: 99080;
  --z-barra-blava: 99090;
  --z-barra-negra: 99100;
  --z-sidebar: 99200;
  --z-fab: 99500;
  --z-nav-mobil: 99950;
  --z-vel: 99960;
  --z-calaix: 99990;

  /* Tipografia */
  --sdp-font: 'Noto Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --sdp-font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  --sdp-text-h1: 2.5rem;
  --sdp-text-h2: 2rem;
  --sdp-text-h3: 1.75rem;
  --sdp-text-h4: 1.5rem;
  --sdp-text-h5: 1.25rem;
  --sdp-text-h6: 1.125rem;
  --sdp-text-lead: 1.25rem;
  --sdp-text-base: 1.125rem;
  --sdp-text-small: 1rem;
  --sdp-text-meta: 0.875rem;   /* 14px · sòl absolut de mida de lletra */

  --sdp-leading-tight: 1.15;
  --sdp-leading-snug: 1.21;
  --sdp-leading-body: 1.65;

  /* Escala d'espaiat modular · base 4/8 */
  --sdp-space-0: 0px;   --sdp-space-1: 4px;   --sdp-space-2: 8px;
  --sdp-space-3: 12px;  --sdp-space-4: 16px;  --sdp-space-5: 20px;
  --sdp-space-6: 24px;  --sdp-space-8: 32px;  --sdp-space-10: 40px;
  --sdp-space-12: 48px; --sdp-space-16: 64px; --sdp-space-20: 80px;

  /* ── RITME VERTICAL EDITORIAL ── */
  --sdp-measure: 68ch;                 /* mesura de columna · APLICADA */
  --sdp-leading-editorial: 1.65;
  --sdp-leading-display: 1.15;
  --sdp-mt-h1: 0;    --sdp-mb-h1: 16px;
  --sdp-mt-h2: 48px; --sdp-mb-h2: 12px;   /* corregit: h2 domina h3 */
  --sdp-mt-h3: 40px; --sdp-mb-h3: 12px;
  --sdp-mt-h4: 32px; --sdp-mb-h4: 8px;
  --sdp-mt-h5: 24px; --sdp-mb-h5: 6px;
  --sdp-mt-h6: 20px; --sdp-mb-h6: 6px;
  --sdp-mb-lead: 24px;
  --sdp-mb-p: 20px;
  --sdp-mb-ul: 20px;
  --sdp-li-gap: 8px;
  --sdp-bq-indent: 24px;

  accent-color: var(--sdp-accio);
  color-scheme: light;
}

/* ═══ CAPA 2 · SEMÀNTICS · TEMA FOSC ═══════════════════════════════
   Un sol bloc. Redefinix NOMÉS semàntics: els primitius no es toquen
   mai, per això l'escala pedra continua sent monòtona i res no es
   torna invisible.

   La resolució de la preferència del sistema la fa el script mínim
   del <head>, que escriu data-theme a l'<html> abans del primer
   pintat. Per això ACÍ NO hi ha cap @media (prefers-color-scheme):
   duplicar-lo seria dos fonts de veritat per al mateix fet.

   IDENTITAT ESTABLE: el taronja continua sent el taronja i el blau
   continua sent el blau. Vegeu la nota D-4 de l'informe.
   ───────────────────────────────────────────────────────────────── */

:root[data-theme="dark"], :host([data-theme="dark"]) {
  color-scheme: dark;

  --sdp-fons-app:        var(--sdp-pedra-900);
  --sdp-fons-targeta:    var(--sdp-pedra-850);
  --sdp-fons-elevat:     var(--sdp-pedra-800);
  --sdp-fons-superficie: var(--sdp-pedra-850);
  --sdp-fons-subtil:     var(--sdp-pedra-750);
  --sdp-fons-invers:     var(--sdp-pedra-100);
  --sdp-fons-vel:        rgba(14, 13, 12, 0.72);

  --sdp-text-titol:  var(--sdp-pedra-50);    /* 17,48:1 */
  --sdp-text-cos:    var(--sdp-pedra-200);   /* 15,20:1 */
  --sdp-text-suau:   var(--sdp-pedra-300);   /* 12,44:1 */
  --sdp-text-invers: var(--sdp-pedra-900);
  --sdp-text-desactivat: var(--sdp-pedra-500);

  --sdp-vora:         var(--sdp-pedra-750);
  --sdp-vora-control: var(--sdp-pedra-500);  /*  4,90:1 */
  --sdp-vora-forta:   var(--sdp-pedra-400);

  --sdp-accent:            var(--sdp-primary-500);
  --sdp-accent-hover:      var(--sdp-primary-400);
  --sdp-accent-subtil:     var(--sdp-primary-900);
  --sdp-sobre-accent:      var(--sdp-pedra-900);   /*  7,13:1 */
  --sdp-accent-text:       var(--sdp-primary-400); /*  8,24:1 */
  --sdp-accent-text-hover: var(--sdp-primary-300); /* 10,26:1 */
  --sdp-accent-titol:      var(--sdp-primary-300); /* 10,26:1 */

  --sdp-accio:         var(--sdp-secondary-500);
  --sdp-accio-hover:   var(--sdp-secondary-400);
  --sdp-accio-forta:   var(--sdp-secondary-600);
  --sdp-accio-subtil:  var(--sdp-secondary-900);
  --sdp-sobre-accio:   #ffffff;
  --sdp-accio-text:    var(--sdp-secondary-300);   /* 10,28:1 */
  --sdp-focus:         var(--sdp-focus-invers);
  --sdp-focus-invers:  var(--sdp-primary-400);

  --sdp-error-fons: #2a0f11; --sdp-error-text: #ffb3b0;
  --sdp-avis-fons:  #2a1e05; --sdp-avis-text:  #f5c96b;
  --sdp-exit-fons:  #052213; --sdp-exit-text:  #86dfa4;
  --sdp-info-fons:  #041f33; --sdp-info-text:  var(--sdp-secondary-300);

  --sdp-ombra-1: 0 1px 3px rgba(0, 0, 0, 0.45);
  --sdp-ombra-2: 0 3px 10px rgba(0, 0, 0, 0.55);
  --sdp-ombra-3: 0 10px 28px rgba(0, 0, 0, 0.62);
  --sdp-ombra-4: 0 18px 44px rgba(0, 0, 0, 0.72);
}


/* ── 1. RESET I BASE ───────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  height: 100%;
  overscroll-behavior: none;           /* mata el rubber-band global */
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--sdp-font);
  line-height: 1.5;
  background: var(--sdp-fons-app);
  color: var(--sdp-text-titol);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

:host {
  display: block;
  width: 100%;
  height: 100dvh;
  min-width: 0;
  min-height: 0;
  font-family: var(--sdp-font);
  line-height: 1.5;
  background: var(--sdp-fons-app);
  color: var(--sdp-text-titol);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.sdp-root {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  overscroll-behavior: none;
}

img { max-width: 100%; }
button, input, select, textarea { font: inherit; }
/* ═══════════════════════════════════════════════════════════════
   TIPOGRAFIA EDITORIAL · TRELLAT PUR
   Regles globals — ÚNICA FONT DE VERITAT.
   Cap element de text necessita cap div embolcall ni estil inline.
   El ritme vertical és implacable per cascada.
   ═══════════════════════════════════════════════════════════════ */
h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6 {
  font-family: var(--sdp-font);
  color: var(--sdp-text-titol);
  text-wrap: balance;
  margin: 0;
  padding: 0;
  text-transform: none;
}
h1, .h1 {
  font-size: var(--sdp-text-h1);
  line-height: var(--sdp-leading-display);
  font-weight: 800;
  color: var(--sdp-accio-text);
  text-align: center;
  margin-top: var(--sdp-mt-h1);
  margin-bottom: var(--sdp-mb-h1);
  letter-spacing: -0.01em;
}
h2, .h2 {
  font-size: var(--sdp-text-h2);
  line-height: var(--sdp-leading-snug);
  font-weight: 800;
  color: var(--sdp-accent-titol);
  text-align: center;
  margin-top: var(--sdp-mt-h2);
  margin-bottom: var(--sdp-mb-h2);
  letter-spacing: -0.005em;
}
h3, .h3 {
  font-size: var(--sdp-text-h3);
  line-height: var(--sdp-leading-snug);
  font-weight: 700;
  color: var(--sdp-accio-text);
  text-align: left;
  margin-top: var(--sdp-mt-h3);
  margin-bottom: var(--sdp-mb-h3);
}
h4, .h4 {
  font-size: var(--sdp-text-h4);
  line-height: var(--sdp-leading-snug);
  font-weight: 700;
  color: var(--sdp-accent-titol);
  text-align: left;
  margin-top: var(--sdp-mt-h4);
  margin-bottom: var(--sdp-mb-h4);
}
h5, .h5 {
  font-size: var(--sdp-text-h5);
  line-height: var(--sdp-leading-editorial);
  font-weight: 700;
  color: var(--sdp-accio-text);
  text-align: left;
  margin-top: var(--sdp-mt-h5);
  margin-bottom: var(--sdp-mb-h5);
}
h6, .h6 {
  font-size: var(--sdp-text-h6);
  line-height: var(--sdp-leading-editorial);
  font-weight: 700;
  color: var(--sdp-text-suau);
  text-align: left;
  margin-top: var(--sdp-mt-h6);
  margin-bottom: var(--sdp-mb-h6);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
p {
  font-size: var(--sdp-text-base);
  line-height: var(--sdp-leading-editorial);
  color: var(--sdp-text-cos);
  margin-top: 0;
  margin-bottom: var(--sdp-mb-p);
  hyphens: auto;
}
.lead {
  font-size: var(--sdp-text-lead);
  line-height: 1.5;
  font-weight: 600;
  color: var(--sdp-text-suau);
  text-align: center;
  margin-top: 0;
  margin-bottom: var(--sdp-mb-lead);
}
/* ── LLISTES PURES (sense divs embolcall) ── */
ul, ol {
  font-size: var(--sdp-text-base);
  line-height: var(--sdp-leading-editorial);
  color: var(--sdp-text-cos);
  margin-top: 0;
  margin-bottom: var(--sdp-mb-ul);
  padding-left: 28px;
}
ul { list-style: disc; }
ol { list-style: decimal; }
li {
  margin-bottom: var(--sdp-li-gap);
  padding-left: 4px;
}
li:last-child { margin-bottom: 0; }
li > ul, li > ol {
  margin-top: var(--sdp-li-gap);
  margin-bottom: var(--sdp-li-gap);
}
/* ── CITA ── */
blockquote {
  margin: 32px auto;
  padding: 4px 0 4px var(--sdp-bq-indent);
  border-left: 4px solid var(--sdp-accent);
  font-style: italic;
  color: var(--sdp-text-suau);
}
blockquote p {
  font-size: 1.15rem;
  line-height: 1.6;
  color: inherit;
  margin-bottom: 8px;
}
blockquote p:last-child { margin-bottom: 0; }
/* ── REGLES ADJACENTS · TRANSICIONS EXACTES ── */
h1 + .lead, h2 + .lead { margin-top: 0; }
h1 + p, h2 + p { margin-top: 12px; }
.lead + p { margin-top: 0; }
h3 + p, h4 + p, h5 + p, h6 + p { margin-top: 0; }
h3 + ul, h3 + ol, h4 + ul, h4 + ol,
h5 + ul, h5 + ol, p + ul, p + ol { margin-top: -4px; }
ul + p, ol + p { margin-top: 0; }
h2 + h3 { margin-top: 24px; }
h3 + h4 { margin-top: 16px; }
/* ── FIRST / LAST CHILD ── */
h1:first-child, h2:first-child, h3:first-child,
h4:first-child, h5:first-child, h6:first-child,
p:first-child, .lead:first-child,
ul:first-child, ol:first-child,
blockquote:first-child { margin-top: 0 !important; }
h1:last-child, h2:last-child, h3:last-child,
h4:last-child, h5:last-child, h6:last-child,
p:last-child, .lead:last-child,
ul:last-child, ol:last-child,
blockquote:last-child { margin-bottom: 0 !important; }


/* ── LLEI DE VIDA · cap control per davall de --sdp-touch ── */
button, .btn, .nav-item, .sp-card-action, .page-btn,
.download-card-btn, .audio-play-btn, .file-item-action, summary.accordion-header {
  min-width: var(--sdp-touch);
  min-height: var(--sdp-touch);
}

a { color: var(--sdp-accent-titol); text-decoration: none; transition: color var(--sdp-t); }
a:hover { color: var(--sdp-accent-text-hover); }

::selection { background: var(--sdp-accent); color: var(--sdp-text-titol); }

:focus-visible { outline: 3px solid var(--sdp-focus); outline-offset: 2px; border-radius: 4px; }
/* Sobre superfícies fosques, l'anell de focus és taronja */
.app-sidebar :focus-visible,
header.bar-black :focus-visible,
header.bar-blue :focus-visible,
.mobile-nav :focus-visible,
.sp-card-footer :focus-visible,
.fab-button:focus-visible { outline-color: var(--sdp-accent-text); }

.sr-only, .sdp-sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

/* ── 2. ESQUELET DE 3 COLUMNES ─────────────────────────────────
   body(flex) ─ nav.app-sidebar (fixa 260px)
             ├─ aside.app-list  (opcional, llista contextual)
             └─ main.app-main   (visor, flexible)
   Flexbox i no grid: així el layout no es trenca quan la columna
   central no existeix (com en esta demo).                        */

main.app-main {
  flex: 1 1 auto;
  min-width: 0;                        /* evita desbordaments de flex */
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: clip;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--sdp-text-suau) transparent;
  position: relative;
}

.app-main-content {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* ── 3. COLUMNA 1 · SIDEBAR ────────────────────────────────────── */
nav.app-sidebar {
  flex: 0 0 var(--sdp-col-sidebar);
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--sdp-fons-invers);
  color: var(--sdp-text-invers);
  position: relative;
  z-index: var(--z-sidebar);
  overscroll-behavior: contain;
}
/* L'últim bloc (menú) absorbeix l'alçada restant i fa scroll propi */
nav.app-sidebar > div:last-child {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--sdp-text-suau) transparent;
}

.brand {
  height: var(--sdp-alt-negra);
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--sdp-space-6);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.brand img { width: 100%; max-width: 180px; height: auto; object-fit: contain; }

.sidebar-control-btn {
  display: flex;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px;
  white-space: nowrap;
  gap: var(--sdp-space-3);
  flex: none;
  height: var(--sdp-alt-accio);
  background: var(--sdp-accio-forta);
  color: var(--sdp-text-invers);
  text-decoration: none;
  font-weight: 800;
  font-size: 1rem;
  padding: 0 var(--sdp-space-6);
  border: none;
  width: 100%;
  text-align: center;
  cursor: pointer;
  
  letter-spacing: 0.05em;
  transition: background var(--sdp-t);
  
  position: relative;
  width: 100%;
  z-index: 2;
}
.sidebar-control-btn:hover { background: var(--sdp-accio-hover); }
.sidebar-control-btn:active { background: var(--sdp-accio-forta); }

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--sdp-space-3);
  padding: var(--sdp-space-3) var(--sdp-space-4);
  margin-bottom: var(--sdp-space-1);
  border-radius: var(--sdp-radi-m);
  color: rgba(255,255,255,0.78);
  text-decoration: none;
  font-weight: 600;
  transition: background var(--sdp-t), color var(--sdp-t);
}
.nav-item:hover { background: rgba(255,255,255,0.09); color: var(--sdp-text-invers); }
.nav-item.active { background: var(--sdp-accent); color: var(--sdp-sobre-accent); }
.nav-item.active:hover { background: var(--sdp-accent-hover); }

.nav-item.nav-item--system {
  background-color: transparent;
  color: rgba(255, 230, 100, 0.9);
}
.nav-item.nav-item--system:hover {
  background-color: transparent;
  color: rgba(255, 230, 100, 1);
}
.nav-item.nav-item--system.active {
  background-color: rgba(255, 230, 100, 0.1);
  color: #fff;
}

/* ── 4. COLUMNA 2 · LLISTA CONTEXTUAL (opcional) ───────────────
   Esta demo no la inclou; l'app real (xats, llocs…) només ha de
   muntar <aside class="app-list"> entre la sidebar i el visor.   */
aside.app-list {
  flex: 0 0 var(--sdp-col-llista);
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--sdp-fons-targeta);
  border-right: 1px solid var(--sdp-vora);
  scrollbar-width: thin;
  scrollbar-color: var(--sdp-vora-forta) transparent;
}
@media (max-width: 1440px) { aside.app-list { flex-basis: 320px; } }

/* ── 5. COLUMNA 3 · VISOR — BARRES GLOBALS ─────────────────────── */
header.bar-black {
  height: var(--sdp-alt-negra);
  flex: none;
  background: var(--sdp-fons-invers);
  color: var(--sdp-text-invers);
  display: flex;
  align-items: center;
  padding: 0 var(--sdp-space-6);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: var(--z-barra-negra);
}
.bar-black .right-icons { display: flex; align-items: center; gap: var(--sdp-space-2); margin-left: auto; }
.bar-black .right-icons .icon { width: var(--sdp-touch); height: var(--sdp-touch); padding: 6px; opacity: 0.8; cursor: pointer; transition: opacity var(--sdp-t), transform var(--sdp-t); }
.bar-black .right-icons .icon:hover { opacity: 1; transform: translateY(-1px); }
.bar-black .right-icons .icon img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
.bar-black .right-icons .icon.has-img { width: 48px; height: 48px; }
@keyframes sdp-iaia-pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.iaia-icon {
  fill: #ff6b00; /* Orange color to match the old IAIA circular avatar */
  stroke: none;
  animation: sdp-iaia-pulse 4s ease-in-out infinite;
}

/* Botó logo: només visible en mòbil (obri la sidebar) o en escriptori tancat */
.mobile-logo-wrapper { display: none; cursor: pointer; }
.mobile-logo-wrapper img { width: 180px; height: auto; object-fit: contain; }


header.bar-blue {
  height: var(--sdp-alt-accio);
  flex: none;
  background: var(--sdp-accio);
  color: var(--sdp-sobre-accio);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 var(--sdp-space-6);
  position: -webkit-sticky;
  position: sticky;
  top: var(--sdp-alt-negra);
  z-index: var(--z-barra-blava);
}

.bar-blue-left { display: flex; align-items: center; gap: var(--sdp-space-3); }
.bar-actions { display: flex; align-items: center; gap: var(--sdp-space-5); }
.bar-actions .icon { cursor: pointer; opacity: 0.9; transition: opacity var(--sdp-t); }
.bar-actions .icon:hover { opacity: 1; }

.icon {
  width: 24px; height: 24px;
  fill: none; stroke: currentColor; stroke-width: 2;
  stroke-linecap: round; stroke-linejoin: round;
  flex: none;
}

/* Unify black bar icon sizes with blue bar (Action Menu) sizes */
.bar-black .right-icons svg {
  width: 30px;
  height: 30px;
  stroke-width: 2.5;
  transition: width var(--sdp-t), height var(--sdp-t);
}

/* Hero */
.hero-image { width: 100%; flex: none; }
.hero-image img {
  display: block;
  width: 100%;
  height: auto;
}

/* Barra taronja (context: autor i poble) */
section.bar-orange {
  height: var(--sdp-alt-accio);
  flex: none;
  background: var(--sdp-accent);
  color: var(--sdp-text-titol);
  padding: 0 var(--sdp-space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--sdp-space-3);
  font-size: 0.9rem;
  position: sticky;
  top: calc(var(--sdp-alt-negra) + var(--sdp-alt-accio));
  z-index: var(--z-barra-taronja);
}

/* Col·locació explícita a la reixeta dels components atòmics */
/* .bar-blue has 3 elements: Left, Center, Right */
header.bar-blue > *:first-child { grid-column: 1; justify-self: start; }
header.bar-blue > *:nth-child(2) { grid-column: 2; justify-self: center; }
header.bar-blue > *:last-child { grid-column: 3; justify-self: end; }




.bar-orange .bar-actions { flex: none; white-space: nowrap; }

/* Títol de pàgina */
header.page-title {
  flex: none;
  background: var(--sdp-fons-targeta);
  border-radius: 0 0 var(--sdp-radi-xl) var(--sdp-radi-xl);
  padding: var(--sdp-space-8) var(--sdp-space-10);
  text-align: center;
  margin: 0 var(--sdp-space-10) var(--sdp-space-8);
  box-shadow: var(--sdp-ombra-2);
}
header.page-title h1, header.page-title .h1 {
  font-size: clamp(1.8rem, 4.5vw, 2.5rem);
  color: var(--sdp-accio-text);
  margin-bottom: var(--sdp-space-2);
  letter-spacing: 0.02em;
  max-width: none;
}
header.page-title h2 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
}
header.page-title .lead {
  margin-bottom: 0;
  color: var(--sdp-text-suau);
}
.page-title-logo { display: block; width: 600px; max-width: 100%; height: auto; margin: 0 auto 16px; object-fit: contain; }
.page-title-labels { margin-top: 32px; margin-bottom: 32px; display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; }
.page-title-copyright { margin-bottom: 0; text-align: center; color: var(--sdp-text-suau); font-size: var(--sdp-text-meta); letter-spacing: 0.05em; }



/* ── 6. CONTINGUT EDITORIAL ────────────────────────────────────── */
article.content-wrapper {
  flex: none;
  padding: 0 var(--sdp-pad-contenidor) var(--sdp-pad-contenidor);
  width: 100%;
}

/* ── MESURA EDITORIAL · la columna de text no passa mai de 68ch ──────
   S'aplica al TEXT, no al contenidor: així les reixetes, les taules,
   les targetes i les paletes continuen ocupant tota l'amplària, i
   només el text corrent es limita i es centra. Esta és la diferència
   entre un manual llegible i una paret de caràcters.                */
.content-wrapper > p,
.content-wrapper > ul,
.content-wrapper > ol,
.content-wrapper > blockquote,
.content-wrapper > .lead,
.design-block > p,
.design-block > ul,
.design-block > ol,
.design-block > blockquote,
.design-block > .lead,
.cms-preview > p,
.cms-preview > ul,
.cms-preview > ol {
  max-width: none;
  margin-inline: auto;
}
/* Els títols de secció acompanyen la columna, no la travessen */
.design-block > h4,
.design-block > h5,
.design-block > h6 {
  max-width: none;
  margin-left: 0;
  margin-right: 0;
}
/* Excepció explícita: el primer paràgraf de secció fa d'entradeta i
   s'alinea amb el títol de la secció, que va a l'esquerra. */
.design-block > p:first-of-type { margin-inline: 0; }

section.design-block { margin-bottom: var(--sdp-space-16); }
/* En .design-block la tipografia flueix PURA: hereta TOTES les regles globals.
   Només centrem el flux i distingim els títols d'índex del manual. */

/* Títols d'índex de cada secció del manual */
section.design-block > h3:first-of-type,
section.design-block > h3:first-child {
  text-align: left;
  margin-left: 0;
  margin-right: 0;
  max-width: none;
  font-size: clamp(1.4rem, 2.4vw, 1.75rem);
  border-bottom: 1px solid var(--sdp-vora);
  padding-bottom: 12px;
  margin-bottom: 28px;
}

section.design-block > p:first-of-type {
  text-align: left;
  max-width: none;
  margin-left: 0;
  color: var(--sdp-text-suau);
  margin-bottom: 28px;
}

/* Paleta de mostres */
.palette { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 24px; margin-bottom: var(--sdp-space-8); }
.swatch {
  border-radius: var(--sdp-radi-m);
  overflow: hidden;
  background: var(--sdp-fons-targeta);
  box-shadow: var(--sdp-ombra-1);
  transition: transform var(--sdp-t), box-shadow var(--sdp-t);
}
.swatch:hover { transform: translateY(-3px); box-shadow: var(--sdp-ombra-3); }
.swatch-color { height: 100px; padding: var(--sdp-space-4); font-weight: 700; display: flex; align-items: flex-end; }
.swatch-info { padding: var(--sdp-space-4); font-family: var(--sdp-font-mono); font-size: 0.8rem; color: var(--sdp-text-suau); }


/* Icona en línia amb el text · substituïx 16 estils inline idèntics.
   El marge dret desapareix quan la icona és l'únic fill (botó rodó). */
.icona-linia { display: inline-block; vertical-align: middle; margin-right: 4px; flex: none; }
.icona-linia:only-child { margin-right: 0; }

/* Mostres de paleta · sense cap estil inline */
.sw-pedra-75 { background: var(--sdp-pedra-75); color: var(--sdp-pedra-900); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
.sw-pedra-100 { background: var(--sdp-pedra-100); color: var(--sdp-pedra-900); }
.sw-pedra-200 { background: var(--sdp-pedra-200); color: var(--sdp-pedra-900); }
.sw-pedra-300 { background: var(--sdp-pedra-300); color: var(--sdp-pedra-900); }
.sw-pedra-400 { background: var(--sdp-pedra-400); color: var(--sdp-pedra-900); }
.sw-pedra-500 { background: var(--sdp-pedra-500); color: var(--sdp-pedra-50); }
.sw-pedra-600 { background: var(--sdp-pedra-600); color: var(--sdp-pedra-50); }
.sw-pedra-700 { background: var(--sdp-pedra-700); color: var(--sdp-pedra-50); }
.sw-pedra-750 { background: var(--sdp-pedra-750); color: var(--sdp-pedra-50); }
.sw-pedra-800 { background: var(--sdp-pedra-800); color: var(--sdp-pedra-50); }
.sw-pedra-850 { background: var(--sdp-pedra-850); color: var(--sdp-pedra-50); }
.sw-pedra-900 { background: var(--sdp-pedra-900); color: var(--sdp-pedra-50); }
.sw-blanc-pur { background: #ffffff; color: var(--sdp-pedra-900); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1); }
.sw-negre-pur { background: var(--sdp-pedra-900); color: #ffffff; }
.sw-primary-500 { background: var(--sdp-primary-500); color: var(--sdp-pedra-900); }
.sw-primary-700 { background: var(--sdp-primary-700); color: #ffffff; }
.sw-secondary-500 { background: var(--sdp-secondary-500); color: #ffffff; }
.sw-secondary-600 { background: var(--sdp-secondary-600); color: #ffffff; }
.sw-secondary-700 { background: var(--sdp-secondary-700); color: #ffffff; }
.sw-error-500 { background: var(--sdp-error-500); color: #ffffff; }
.sw-avis-500 { background: var(--sdp-avis-500); color: #ffffff; }
.sw-exit-500 { background: var(--sdp-exit-500); color: #ffffff; }
.swatch-info { line-height: 1.5; }

/* Previsualització CMS (contingut editorial universal) */
.cms-preview {
  border: 1px solid var(--sdp-vora);
  padding: var(--sdp-space-8);
  border-radius: var(--sdp-radi-m);
  background: var(--sdp-fons-targeta);
  position: relative;
  margin-top: var(--sdp-space-4);
  box-shadow: var(--sdp-ombra-1);
}
.cms-badge {
  position: absolute; top: 12px; right: 16px;
  font-size: 0.7rem; font-weight: 700; color: var(--sdp-text-suau);
   letter-spacing: 0.1em;
}
.cms-preview > * {
  margin-left: auto !important;
  margin-right: auto !important;
}
.cms-preview pre, .accordion pre {
  background: var(--sdp-fons-subtil);
  padding: var(--sdp-space-4);
  border-radius: var(--sdp-radi-s);
  border: 1px solid var(--sdp-vora);
  font-family: var(--sdp-font-mono);
  font-size: 0.85rem;
  color: var(--sdp-text-suau);
  overflow-x: auto;
}

/* Espaiat */
.spacing-item { display: flex; align-items: center; gap: var(--sdp-space-4); margin-bottom: var(--sdp-space-3); }
.spacing-bar { width: var(--mida, var(--sdp-space-4)); height: var(--sdp-space-4); background: var(--sdp-accent); border-radius: var(--sdp-space-1); flex: none; }
.spacing-label { font-family: var(--sdp-font-mono); font-size: 0.85rem; color: var(--sdp-text-suau); }

/* Grid demo */
.grid-preview { display: flex; gap: var(--sdp-space-4); }
.grid-col {
  flex: 1;
  background: var(--sdp-fons-targeta);
  border: 1px solid var(--sdp-vora);
  padding: 12px;
  text-align: center;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--sdp-text-suau);
  font-weight: 600;
}

/* ── 7. COMPONENTS ─────────────────────────────────────────────── */

/* 7.1 Botons */
.btn-group { display: flex; flex-wrap: wrap; gap: var(--sdp-space-4); align-items: center; justify-content: flex-start; }
.btn {
  padding: var(--sdp-space-3) var(--sdp-space-6);
  border-radius: var(--sdp-radi-pastilla);
  font-family: var(--sdp-font);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: var(--sdp-space-2);
  transition: transform var(--sdp-t), box-shadow var(--sdp-t), background var(--sdp-t), border-color var(--sdp-t), color var(--sdp-t);
}
.btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(14,13,12,0.16); }
.btn:active:not(:disabled) { transform: translateY(0); box-shadow: 0 2px 6px rgba(14,13,12,0.14); }
.btn-primary { background: var(--sdp-accent); color: var(--sdp-text-titol); }
.btn-primary:hover:not(:disabled) { background: var(--sdp-accent-hover); color: var(--sdp-sobre-accent); }
.btn-secondary { background: var(--sdp-accio); color: var(--sdp-sobre-accio); }
.btn-secondary:hover:not(:disabled) { background: var(--sdp-accio-hover); }
.btn-outline-dark { background: transparent; border: 1px solid var(--sdp-vora-control); color: var(--sdp-text-titol); }
.btn-outline-dark:hover:not(:disabled) { border-color: var(--sdp-text-suau); background: var(--sdp-fons-targeta); }
.btn-base { background: var(--sdp-fons-invers); color: var(--sdp-text-invers); }
.btn-base:hover:not(:disabled) { background: var(--sdp-fons-invers); }
.btn-danger { background: var(--sdp-error); color: #ffffff; }
.btn-danger:hover:not(:disabled) { background: var(--sdp-error-text); }
.btn-ghost { background: transparent; color: var(--sdp-text-titol); border: 1px solid var(--sdp-vora); }
.btn-ghost:hover:not(:disabled) { background: rgba(14,13,12,0.06); border-color: var(--sdp-text-suau); }
.btn-sm { padding: var(--sdp-space-2) var(--sdp-space-4); font-size: 0.85rem; }
.btn-lg { padding: var(--sdp-space-4) var(--sdp-space-8); font-size: 1.15rem; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.icon-btn { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

.spinner { animation: spin 1s linear infinite; width: 18px; height: 18px; stroke-dasharray: 60; stroke-dashoffset: 20; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* 7.2 Formularis */
.form-group { margin-bottom: var(--sdp-space-5); display: flex; flex-direction: column; gap: var(--sdp-space-2); }
.form-group label { font-weight: 700; font-size: 0.9rem; color: var(--sdp-text-titol); }
.form-group input, .form-group select, .form-group textarea {
  padding: var(--sdp-space-3) var(--sdp-space-4);
  border: 1px solid var(--sdp-vora-control);
  border-radius: var(--sdp-radi-s);
  font-family: var(--sdp-font);
  font-size: 1rem;
  background: var(--sdp-fons-targeta);
  color: var(--sdp-text-titol);
  outline: none;
  transition: border-color var(--sdp-t), box-shadow var(--sdp-t);
  width: 100%;
}
.form-group textarea { resize: vertical; }
.form-group input:hover, .form-group select:hover, .form-group textarea:hover { border-color: var(--sdp-text-suau); }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: var(--sdp-accio-text);
  box-shadow: 0 0 0 3px rgba(1,110,191,0.16);
}
.form-group select, .search-filters select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%238b857b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  padding-right: 42px;
}
.checkbox-group { display: flex; align-items: center; gap: var(--sdp-space-2); margin-bottom: var(--sdp-space-2); }
.checkbox-group input { width: 24px; height: 24px; accent-color: var(--sdp-accio-text); flex: none; }
.form-group.has-error input { border-color: var(--sdp-error); background: var(--sdp-error-fons); }
.form-group.has-error input:focus { box-shadow: 0 0 0 3px rgba(194,20,25,0.16); }
.error-text { color: var(--sdp-error-text); font-size: var(--sdp-text-meta); font-weight: 600; }
.form-group.is-disabled input { background: transparent; color: var(--sdp-text-suau); cursor: not-allowed; }

/* 7.3 Alertes */
.alert { padding: var(--sdp-space-4); border-radius: var(--sdp-radi-s); display: flex; gap: var(--sdp-space-3); margin-bottom: var(--sdp-space-3); }
.alert-info { background: var(--sdp-info-fons); color: var(--sdp-info-text); }
.alert-success { background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
.alert-warning { background: var(--sdp-avis-fons); color: var(--sdp-avis-text); }
.alert-error { background: var(--sdp-error-fons); color: var(--sdp-error-text); }
.alert-icon { width: 24px; height: 24px; flex-shrink: 0; }
.alert-content h4 { margin-bottom: var(--sdp-space-1); font-size: 1rem; text-transform: none; }
.alert-info h4, .alert-success h4 { color: var(--sdp-secondary-700); }
.alert-content p { font-size: var(--sdp-text-meta); margin: 0; }

/* 7.4 Badges */
.badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: var(--sdp-radi-pastilla); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
.badge-default { background: var(--sdp-fons-subtil); color: var(--sdp-text-titol); }
.badge-primary { background: var(--sdp-accent); color: var(--sdp-text-titol); }
.badge-success { background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
.badge-warning { background: var(--sdp-avis-fons); color: var(--sdp-avis-text); }
.badge-danger { background: var(--sdp-error-fons); color: var(--sdp-error-text); }
.badge-info { background: var(--sdp-info-fons); color: var(--sdp-info-text); }
.badge-outline { background: transparent; border: 1px solid var(--sdp-vora-control); color: var(--sdp-text-titol); }

/* 7.5 Taules */
.table-wrapper { overflow-x: auto; margin-bottom: var(--sdp-space-8); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); background: var(--sdp-fons-targeta); }
table { width: 100%; border-collapse: collapse; text-align: left; }
th { background: var(--sdp-fons-subtil); padding: var(--sdp-space-4); font-size: 0.8rem; font-weight: 700;  color: var(--sdp-text-suau); border-bottom: 2px solid var(--sdp-vora); }
td { padding: var(--sdp-space-4); border-bottom: 1px solid var(--sdp-vora); font-size: 0.95rem; }
tr:last-child td { border-bottom: none; }
tbody tr { transition: background var(--sdp-t); }
tbody tr:hover { background: var(--sdp-accent-subtil); }
.table-zebra tr:nth-child(even) { background: var(--sdp-fons-subtil); }
.table-action { color: var(--sdp-accent-text); font-weight: 600; text-decoration: none; }
.table-action:hover { color: var(--sdp-accent-text-hover); text-decoration: underline; }

/* 7.6 Navegació */
.nav-bar { display: flex; border-bottom: 1px solid var(--sdp-vora); margin-bottom: var(--sdp-space-6); }
.nav-bar a { padding: 16px 24px; text-decoration: none; color: var(--sdp-text-suau); font-weight: 600; white-space: nowrap; transition: color var(--sdp-t); }
.nav-bar a:hover { color: var(--sdp-text-titol); }
.nav-bar a.active { color: var(--sdp-accent-text); border-bottom: 3px solid var(--sdp-accent); }
.pagination { display: flex; gap: var(--sdp-space-2); align-items: center; flex-wrap: wrap; }
.page-btn { padding: var(--sdp-space-2) var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: 4px; background: var(--sdp-fons-targeta); color: var(--sdp-text-titol); font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; transition: border-color var(--sdp-t), color var(--sdp-t), background var(--sdp-t); }
.page-btn:hover:not(.active):not([disabled]) { border-color: var(--sdp-accent-text); color: var(--sdp-accent-titol); }
.page-btn.active { background: var(--sdp-accent); color: var(--sdp-sobre-accent); border-color: var(--sdp-accent); }
.page-btn[disabled] { opacity: 0.5; cursor: not-allowed; }

/* 7.7 Modals */
.modal-preview { background: var(--sdp-fons-vel); padding: 40px; display: flex; align-items: center; justify-content: center; border-radius: var(--sdp-radi-s); }
.modal-box { background: var(--sdp-fons-targeta); padding: var(--sdp-space-8); border-radius: var(--sdp-radi-m); max-width: 400px; width: 100%; box-shadow: var(--sdp-ombra-4); }
.modal-box h3 { margin-bottom: var(--sdp-space-3); font-size: 1.25rem; color: var(--sdp-text-titol); }
.modal-box p { color: var(--sdp-text-suau); margin-bottom: var(--sdp-space-6); font-size: 0.95rem; line-height: 1.5; }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--sdp-space-3); flex-wrap: wrap; }

/* 7.8 Indicadors de càrrega */
.spinner-group { display: flex; align-items: flex-end; gap: 24px; margin-bottom: var(--sdp-space-8); }
.spinner-sm { width: 16px; height: 16px; }
.spinner-md { width: 24px; height: 24px; }
.spinner-lg { width: 32px; height: 32px; }
.skeleton { background: var(--sdp-fons-subtil); border-radius: 4px; animation: pulse 1.5s infinite; }
.skeleton-title { height: 24px; width: 60%; margin-bottom: var(--sdp-space-4); }
.skeleton-text { height: 12px; width: 100%; margin-bottom: var(--sdp-space-2); }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

/* 7.9 Avatars */
.avatar-group { display: flex; align-items: center; gap: var(--sdp-space-4); flex-wrap: wrap; }
.avatar { background: var(--sdp-fons-subtil); color: var(--sdp-text-titol); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex: none; }
.avatar-xs { width: 24px; height: 24px; font-size: 0.6rem; }
.avatar-sm { width: 32px; height: 32px; font-size: 0.7rem; }
.avatar-md { width: 48px; height: 48px; }
.avatar-lg { width: 64px; height: 64px; font-size: 1.2rem; }
.avatar-xl { width: 80px; height: 80px; font-size: 1.5rem; }

/* 7.10 Desplegables */
.accordion { border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); overflow: hidden; background: var(--sdp-fons-targeta); }
.accordion-header, summary.accordion-header {
  padding: 16px 24px;
  background: var(--sdp-fons-subtil);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--sdp-space-3);
  border-bottom: 1px solid var(--sdp-vora);
  transition: background var(--sdp-t);
  list-style: none;
}
summary.accordion-header::-webkit-details-marker { display: none; }
.accordion-header:hover, summary.accordion-header:hover { background: var(--sdp-fons-subtil); }
.accordion-header svg, summary.accordion-header svg { flex: none; transition: transform var(--sdp-t); }
details[open] summary.accordion-header svg:last-child { transform: rotate(180deg); }
.accordion pre { margin: 0; border: 0; border-radius: 0; }

/* 7.11 Pestanyes */
.tabs { display: flex; border-bottom: 1px solid var(--sdp-vora); margin-bottom: var(--sdp-space-4); }
.tab { padding: var(--sdp-space-3) var(--sdp-space-6); font-weight: 700; color: var(--sdp-text-suau); cursor: pointer; border-bottom: 3px solid transparent; white-space: nowrap; transition: color var(--sdp-t), border-color var(--sdp-t); }
.tab:hover:not(.active) { color: var(--sdp-text-titol); }
.tab.active { color: var(--sdp-accent-text); border-bottom-color: var(--sdp-accent-text); }
.tab-content { padding: var(--sdp-space-4); background: var(--sdp-fons-subtil); border-radius: var(--sdp-radi-s); border: 1px solid var(--sdp-vora); }

/* 7.12 Barra de progrés */
.progress-container { margin-bottom: var(--sdp-space-6); }
.progress-header { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: var(--sdp-space-2); color: var(--sdp-text-suau); }
.progress-bar { height: 8px; background: var(--sdp-fons-subtil); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--sdp-accent); border-radius: 4px; transition: width 0.4s ease; }

/* 7.13 Tooltips */
.tooltip-preview { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; }
.tooltip-term { text-decoration: underline dotted; cursor: help; color: var(--sdp-text-suau); }

/* 7.14 Llistes */
.lists-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  grid-auto-flow: column;
  column-gap: var(--sdp-space-8);
}
.lists-preview h4 {
  font-size: 1rem;
  margin-bottom: var(--sdp-space-4);
  margin-left: 0;
  margin-right: 0;
  text-align: left;
}
.lists-preview ul, .lists-preview ol {
  margin-left: 0;
  margin-right: 0;
  max-width: none;
}

/* 7.15 Divisors */
.divider-preview { margin-bottom: 40px; }
.divider-label { font-size: 0.75rem; color: var(--sdp-text-suau);  margin-bottom: var(--sdp-space-2); }
.divider-basic { height: 1px; background: var(--sdp-vora); margin: 16px 0; }
.divider-text { display: flex; align-items: center; text-align: center; color: var(--sdp-text-suau); font-size: 0.85rem; font-weight: 700; margin: var(--sdp-space-6) 0; }
.divider-text::before, .divider-text::after { content: ''; flex: 1; border-bottom: 1px solid var(--sdp-vora); }
.divider-text:not(:empty)::before { margin-right: 16px; }
.divider-text:not(:empty)::after { margin-left: 16px; }
.divider-major { height: 2px; background: var(--sdp-accent); margin: 32px 0; }
.divider-dashed { border-top: 1px dashed var(--sdp-vora); margin: 16px 0; }
.divider-dotted { border-top: 2px dotted var(--sdp-vora); margin: var(--sdp-space-6) 0; }

/* 7.18 Llistes de definició */
.dl-horizontal { display: grid; grid-template-columns: 120px 1fr; gap: 8px 16px; margin-bottom: var(--sdp-space-6); }
.dl-horizontal dt { font-weight: 700; color: var(--sdp-text-titol); }
.dl-horizontal dd { margin: 0; color: var(--sdp-text-titol); }

/* 7.20 Indicadors (UniversalIndicatorCard) */
.sdp-indicator-card {
  background: var(--sdp-fons-targeta);
  border: 1px solid transparent;
  border-radius: var(--sdp-radi-g);
  padding: var(--sdp-space-6) var(--sdp-space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all var(--sdp-t);
}

.sdp-indicator-card:hover {
  background: var(--sdp-fons-app);
  border-color: var(--sdp-vora);
  box-shadow: var(--sdp-ombra-1);
}

.sdp-indicator-card.active {
  background: var(--sdp-fons-app);
  border-color: var(--sdp-accent);
  box-shadow: 0 4px 12px rgba(254, 116, 6, 0.15);
}

.sdp-indicator-card-icon {
  margin-bottom: var(--sdp-space-3);
  font-size: 3rem;
  line-height: 1;
  color: var(--sdp-accent);
}

.sdp-indicator-card-title {
  font-weight: 800;
  font-size: 1rem;
  color: var(--sdp-text-blau);
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.sdp-indicator-card-subtitle {
  font-size: 0.85rem;
  color: var(--sdp-text-suau);
  margin: 0;
}

/* 7.21 Targeta Mestra (Sóc de Poble Card) */
.sp-card {
  background: var(--sdp-fons-targeta);
  border-radius: var(--sdp-radi-m);
  overflow: hidden;
  box-shadow: var(--sdp-ombra-3);
  margin: 0 auto 32px;
  width: 100%;
  max-width: 500px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: box-shadow var(--sdp-t-lenta);
  content-visibility: auto;
  contain-intrinsic-size: 400px;
}

/* Targeta Mestra enllaçable: overlay a z1, capa interactiva a z2 */
.sp-card { position: relative; }
.sp-card-link-overlay { position: absolute; inset: 0; z-index: 1; border-radius: inherit; outline: none; }
.sp-card-link-overlay:focus-visible { box-shadow: 0 0 0 3px var(--sdp-focus) inset; }
.sp-card-header, .sp-card-footer, .sp-card-author-link, .sp-card-author-block, .btn-icon-orange, .btn-date-time, .sp-card-action, .sp-card-connect, .sp-card-labels, .sp-card-copyright, .sp-card-body a, .sp-card-body span[onClick] { position: relative; z-index: 2; }
.sp-card-author-link, .sp-card-author-block { display: flex; align-items: center; min-width: 0; flex: 1; }

/* Etiquetes de la Targeta Mestra i Sistema de Badges */
.sdp-badges-container, .sp-card-labels { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--sdp-space-2); margin-top: var(--sdp-space-3); margin-bottom: var(--sdp-space-4); list-style: none; padding: 0; }
.sdp-badges-container li, .sp-card-labels li { list-style: none; padding: 0; margin: 0; }
.sdp-badge, .sp-card-labels .sp-card-label, .sp-card-label { display: inline-flex; align-items: center; justify-content: center; height: 24px; padding: 0 12px; border-radius: 12px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.05em; white-space: nowrap; }

/* Sistema de Badges Universals (Taxonomia 2026) */
.sdp-badge-system { background: var(--sdp-accio); color: var(--sdp-sobre-accio); }
:root[data-theme="dark"] .sdp-badge-system, :host([data-theme="dark"]) .sdp-badge-system { background: var(--sdp-accent); color: var(--sdp-sobre-accent); }
.sdp-badge-accent { background: var(--sdp-accent); color: var(--sdp-sobre-accent); }
:root[data-theme="dark"] .sdp-badge-accent, :host([data-theme="dark"]) .sdp-badge-accent { background: var(--sdp-accio); color: var(--sdp-sobre-accio); }
.sdp-badge-category { background: var(--sdp-accio-subtil); color: var(--sdp-accio-text); }
.sdp-badge-tag { background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
.sdp-badge-neutral { background: var(--sdp-fons-subtil); color: var(--sdp-text-titol); }

/* Retrocompatibilitat */

/* Tooltip (Bocata) */
.tooltip-container { position: relative; display: inline-flex; z-index: 3; }
.tooltip-text {
  visibility: hidden; opacity: 0;
  background-color: var(--sdp-fons-invers); color: var(--sdp-text-invers);
  text-align: center; border-radius: 4px; padding: 6px 10px;
  position: absolute; z-index: 4;
  top: 100%; left: 50%; transform: translateX(-50%) translateY(8px);
  font-size: 0.75rem; font-weight: 700; white-space: nowrap;
  transition: opacity var(--sdp-t), visibility var(--sdp-t), transform var(--sdp-t);
  pointer-events: none;
}
.tooltip-container:hover .tooltip-text { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(4px); }
.tooltip-text::after {
  content: ""; position: absolute; bottom: 100%; left: 50%; margin-left: -5px;
  border-width: 5px; border-style: solid; border-color: transparent transparent var(--sdp-pedra-900) transparent;
}

.sp-card:hover { box-shadow: var(--sdp-ombra-4); }
.sp-card-header { 
  background: var(--sdp-accent); 
  padding: var(--sdp-space-3) var(--sdp-space-4); 
  display: flex; justify-content: space-between;
  align-items: center; 
  gap: var(--sdp-space-3); 
  min-width: 0;
}

.sp-card-author { display: flex; align-items: center; gap: var(--sdp-space-3); flex: 1; min-width: 0; }
.sp-card-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--sdp-fons-targeta); object-fit: cover; flex: none; box-shadow: var(--sdp-ombra-1); }
.sp-card-author-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.sp-card-author-name { font-weight: 700; color: var(--sdp-text-titol); font-size: 1.05rem; line-height: 1.2; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-card-author-location { font-size: 0.85rem; color: var(--sdp-text-titol); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-card-author-location svg { display: inline-block; vertical-align: middle; margin-right: var(--sdp-space-1); }
.sp-card-meta { display: flex; align-items: center; gap: var(--sdp-space-2); color: var(--sdp-sobre-accent); text-align: right; flex: none; }

.sp-card-media { width: 100%; aspect-ratio: 1 / 1; display: block; object-fit: cover; object-position: top; background: var(--sdp-fons-subtil); }

.sp-card-body { padding: 22px 24px 16px; text-align: left; position: relative; min-width: 0; }
.sp-card-body.has-only-title { text-align: center; }
.sp-card-title { font-size: 1.4rem; color: var(--sdp-accio-text); font-weight: 800; line-height: var(--sdp-leading-tight); margin: 0 0 var(--sdp-space-2) 0; flex: 1; text-align: center; }

.sp-card-main-button, .sp-card-main-link {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  text-align: inherit;
}
.sp-card-main-button:hover, .sp-card-main-link:hover {
  text-decoration: underline;
}

.sp-card-content-link {
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-decoration: none;
  color: inherit;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  text-align: inherit;
  width: 100%;
  cursor: pointer;
}
.sp-card-content-link:hover .sp-card-media {
  opacity: 0.95;
}

.sp-card .sp-card-body h1 {
  font-size: 1.6rem;
  margin-top: 0;
  margin-bottom: var(--sdp-space-2);
  color: var(--sdp-accio-text);
  line-height: var(--sdp-leading-tight);
  font-weight: 800;
}
.sp-card .sp-card-body h2 {
  font-size: 1.25rem; /* subtítol més menut */
  margin-top: 16px;
  margin-bottom: var(--sdp-space-4);
  color: var(--sdp-accent-titol);
  line-height: var(--sdp-leading-snug);
  font-weight: 600;
}
/* Per defecte, tot centrat al cos de la targeta si no hi ha etiqueta a dalt a la dreta */
.sp-card .sp-card-body h1,
.sp-card .sp-card-body h2,
.sp-card-body p,
.sp-card-body .sp-card-text {
  text-align: center;
}
/* Si hi ha preu o etiqueta a dalt a la dreta, tot s'alinea a l'esquerra per a equilibrar el pes visual */
.sp-card .sp-card-body.has-price h1,
.sp-card .sp-card-body.has-price h2,
.sp-card .sp-card-body.has-price .sp-card-title,
.sp-card .sp-card-body.has-price .sp-card-subtitle,
.sp-card-body.has-price p:not(.sp-card-copyright),
.sp-card-body.has-price .sp-card-text,
.sp-card .sp-card-body.has-calendar-badge h1,
.sp-card .sp-card-body.has-calendar-badge h2,
.sp-card .sp-card-body.has-calendar-badge .sp-card-title,
.sp-card .sp-card-body.has-calendar-badge .sp-card-subtitle,
.sp-card-body.has-calendar-badge p:not(.sp-card-copyright),
.sp-card-body.has-calendar-badge .sp-card-text {
  text-align: left;
  margin-left: 0;
  margin-right: 0;
  justify-content: flex-start;
}

.sp-card-media-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  background: var(--sdp-fons-subtil);
  display: flex;
  flex-direction: column;
}
.sp-card-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.sp-card-copyright {
  text-align: center;
}

.sp-card-title:only-child { text-align: center; flex: none; width: 100%; }
.sp-card-price { float: right; margin-left: 6px; margin-bottom: 6px; font-size: 1.2rem; font-weight: 800; color: var(--sdp-accio-text); background: var(--sdp-accio-subtil); padding: 4px 12px; border-radius: var(--sdp-radi-pastilla); white-space: nowrap; }
.sp-card-subtitle { font-size: 1.15rem; color: var(--sdp-accent-titol); font-weight: 700; line-height: var(--sdp-leading-snug); margin-top: var(--sdp-space-4); margin-bottom: var(--sdp-space-3); text-align: center; }
.sp-card-text { font-size: 1rem; color: var(--sdp-text-suau); font-weight: 500; line-height: var(--sdp-leading-body); margin-bottom: var(--sdp-space-6); text-align: center; margin-left: auto; margin-right: auto; }

.sp-card-copyright { color: var(--sdp-text-suau); font-size: var(--sdp-text-meta);  letter-spacing: 0.05em; }
.sp-card-footer { 
  background: var(--sdp-accio); 
  padding: var(--sdp-space-3) var(--sdp-space-4); 
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center; 
  gap: var(--sdp-space-3); 
  color: var(--sdp-sobre-accio); 
  position: relative; 
  min-width: 0;
}

.sp-card-actions { 
  display: flex; 
  align-items: center; 
  gap: var(--sdp-space-3); 
  justify-self: start;
  margin: 0;
  padding: 0;
}
.sp-card-action { background: transparent; border: none; color: currentColor; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; height: var(--sdp-space-12); width: var(--sdp-space-12); opacity: 0.9; transition: opacity var(--sdp-t), transform var(--sdp-t); }
.sp-card-action .icon { width: 30px; height: 30px; stroke-width: 2.5; display: block; margin: auto; }
.sp-card-action:hover { opacity: 1; transform: translateY(-1px); }
.sp-card-connect { margin-left: auto; justify-self: end; grid-column: 3; }

/* 7.22 Estadístiques i dashboards */
.stat-card { display: flex; align-items: center; gap: var(--sdp-space-4); background: var(--sdp-fons-targeta); border: 1px solid var(--sdp-vora); padding: var(--sdp-space-4); border-radius: var(--sdp-radi-s); box-shadow: var(--sdp-ombra-1); transition: transform var(--sdp-t), box-shadow var(--sdp-t), border-color var(--sdp-t); }
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--sdp-ombra-2); border-color: var(--sdp-vora-control); }
.stat-icon { font-size: 2rem; flex: none; }
.stat-info { display: flex; flex-direction: column; min-width: 0; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--sdp-text-titol); line-height: 1; margin-bottom: var(--sdp-space-1); }
.stat-label { font-size: 0.85rem; color: var(--sdp-text-suau);  }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--sdp-space-4); margin-bottom: var(--sdp-space-6); }
.dashboard-panel { background: var(--sdp-fons-targeta); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); overflow: hidden; margin-bottom: var(--sdp-space-6); }
.dashboard-header { background: var(--sdp-fons-subtil); padding: var(--sdp-space-3) var(--sdp-space-4); border-bottom: 1px solid var(--sdp-vora); font-weight: 700; text-align: center; color: var(--sdp-text-titol); display: flex; align-items: center; justify-content: center; gap: var(--sdp-space-2); }
.dashboard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--sdp-vora); }
.sdp-card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sdp-space-6); align-items: start; }
@media (max-width: 1400px) { .sdp-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 800px) { .sdp-card-grid { grid-template-columns: minmax(0, 1fr); } }

.dashboard-item { background: var(--sdp-fons-targeta); padding: 24px 16px; text-align: center; }
.dashboard-item-value { font-size: 1.25rem; font-weight: 700; color: var(--sdp-text-titol); margin-bottom: var(--sdp-space-1); }
.dashboard-item-label { font-size: 0.75rem; color: var(--sdp-text-suau);  }
.dashboard-footer { padding: 8px; text-align: center; font-size: 0.75rem; color: var(--sdp-text-suau); background: var(--sdp-fons-subtil); border-top: 1px solid var(--sdp-vora); }

/* 7.23 Cerca i filtratge */
.search-bar-basic { display: flex; margin-bottom: var(--sdp-space-6); }
.search-bar-basic input { flex: 1; min-width: 0; padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s) 0 0 var(--sdp-radi-s); outline: none; font-size: 1rem; transition: border-color var(--sdp-t), box-shadow var(--sdp-t); }
.search-bar-basic button { background: var(--sdp-fons-invers); color: var(--sdp-text-invers); border: none; padding: 0 var(--sdp-space-6); border-radius: 0 var(--sdp-radi-s) var(--sdp-radi-s) 0; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: var(--sdp-space-2); white-space: nowrap; transition: background var(--sdp-t); }
.search-bar-basic button:hover { background: var(--sdp-fons-invers); }
.search-filters { display: flex; gap: var(--sdp-space-4); margin-bottom: var(--sdp-space-6); }
.search-filters input, .search-filters select { padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora-control); border-radius: var(--sdp-radi-s); outline: none; font-size: 1rem; background-color: var(--sdp-fons-targeta); color: var(--sdp-text-cos); transition: border-color var(--sdp-t), box-shadow var(--sdp-t); }
.search-filters input { flex: 2; min-width: 0; }
.search-filters select { flex: 1; min-width: 0; }
.search-filters button { background: var(--sdp-fons-invers); color: var(--sdp-text-invers); border: none; padding: var(--sdp-space-3) var(--sdp-space-6); border-radius: var(--sdp-radi-s); font-weight: 700; cursor: pointer; transition: background var(--sdp-t); }
.search-filters button:hover { background: var(--sdp-fons-invers); }
.search-bar-basic input:focus, .search-filters input:focus, .search-filters select:focus { border-color: var(--sdp-accio-text); box-shadow: 0 0 0 3px rgba(1,110,191,0.16); }
.search-result { margin-bottom: var(--sdp-space-6); }
.search-result-title { font-size: 1.1rem; font-weight: 700; color: var(--sdp-accent-text); margin-bottom: var(--sdp-space-1); }
.search-result-meta { font-size: 0.75rem; color: var(--sdp-text-suau);  margin-bottom: var(--sdp-space-2); letter-spacing: 0.05em; }
.search-result-excerpt { color: var(--sdp-text-titol); font-size: 0.95rem; line-height: 1.5; }

/* 7.20 Paginació simplificada */
.pagination-simple { display: flex; justify-content: space-between; margin-top: 32px; gap: var(--sdp-space-4); }
.pagination-simple a { display: flex; flex-direction: column; padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); text-decoration: none; color: var(--sdp-text-titol); flex: 1; background: var(--sdp-fons-targeta); transition: background var(--sdp-t), border-color var(--sdp-t), box-shadow var(--sdp-t); }
.pagination-simple a:hover { background: var(--sdp-fons-subtil); border-color: var(--sdp-vora-control); box-shadow: var(--sdp-ombra-1); color: var(--sdp-text-titol); }
.pagination-simple a.next { text-align: right; }
.pagination-label { font-size: 0.75rem; color: var(--sdp-text-suau);  margin-bottom: var(--sdp-space-1); letter-spacing: 0.05em; }
.pagination-title { font-weight: 700; font-size: 1rem; }

/* 7.21 Checklists */
.checklist-admin { background: var(--sdp-fons-targeta); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); overflow: hidden; margin-bottom: var(--sdp-space-6); }
.checklist-item { padding: var(--sdp-space-3) var(--sdp-space-4); border-bottom: 1px solid var(--sdp-vora); display: flex; align-items: flex-start; gap: var(--sdp-space-3); transition: background var(--sdp-t); }
.checklist-item:hover { background: var(--sdp-fons-subtil); }
.checklist-item:last-child { border-bottom: none; }
.checklist-item input[type="checkbox"] { margin-top: 4px; flex: none; }
.checklist-item label { font-size: 0.95rem; color: var(--sdp-text-titol); flex: 1; line-height: 1.4; }
.checklist-item .date-tag { font-size: 0.75rem; color: var(--sdp-accent-text); font-weight: 700; white-space: nowrap; }
.checklist-item .date-tag.done { color: var(--sdp-text-suau); }

/* 7.22 Upload i descàrregues */
.upload-zone { border: 2px dashed var(--sdp-vora); border-radius: var(--sdp-radi-s); padding: var(--sdp-space-8); text-align: center; background: var(--sdp-fons-subtil); margin-bottom: var(--sdp-space-4); transition: border-color var(--sdp-t), background var(--sdp-t); }
.upload-zone:hover { border-color: var(--sdp-accio-text); background: var(--sdp-accio-subtil); }
.upload-zone-text { font-size: 1.1rem; font-weight: 700; color: var(--sdp-text-titol); margin-bottom: var(--sdp-space-2); display: flex; align-items: center; justify-content: center; gap: var(--sdp-space-2); }
.upload-zone-sub { font-size: 0.85rem; color: var(--sdp-text-suau); }
.upload-zone-sub span { color: var(--sdp-accent-text); cursor: pointer; font-weight: 600; }
.upload-zone-sub span:hover { text-decoration: underline; }
.file-item { display: flex; align-items: center; justify-content: space-between; gap: var(--sdp-space-3); padding: var(--sdp-space-3) var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); margin-bottom: var(--sdp-space-2); background: var(--sdp-fons-targeta); transition: border-color var(--sdp-t), box-shadow var(--sdp-t); }
.file-item:hover { border-color: var(--sdp-vora-control); box-shadow: var(--sdp-ombra-1); }
.file-item-info { display: flex; flex-direction: column; min-width: 0; }
.file-item-name { font-size: 0.95rem; color: var(--sdp-text-titol); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-item-meta { font-size: 0.75rem; color: var(--sdp-text-suau); }
.file-item-action { color: var(--sdp-text-suau); cursor: pointer; flex: none; transition: color var(--sdp-t), transform var(--sdp-t); }
.file-item-action:hover { color: var(--sdp-error); transform: scale(1.1); }
.download-card { display: flex; align-items: center; gap: var(--sdp-space-4); padding: var(--sdp-space-4); border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); background: var(--sdp-fons-targeta); margin-bottom: var(--sdp-space-6); transition: box-shadow var(--sdp-t), border-color var(--sdp-t); }
.download-card:hover { box-shadow: var(--sdp-ombra-2); border-color: var(--sdp-vora-control); }
.download-card-icon { font-size: 2rem; color: var(--sdp-accio-text); flex: none; }
.download-card-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.download-card-title { font-size: 1.1rem; font-weight: 700; color: var(--sdp-text-titol); margin-bottom: var(--sdp-space-1); }
.download-card-meta { font-size: 0.8rem; color: var(--sdp-text-suau); }
.download-card-btn { color: var(--sdp-sobre-accio); background: var(--sdp-accio); width: var(--sdp-touch); height: var(--sdp-touch); flex: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: background var(--sdp-t), transform var(--sdp-t); }
.download-card-btn:hover { background: var(--sdp-accio-hover); transform: scale(1.06); color: var(--sdp-sobre-accio); }

/* 7.23 Embeddings i media */
.embed-container { position: relative; padding-bottom: 56.21%; height: 0; overflow: hidden; max-width: 100%; border-radius: var(--sdp-radi-s); margin-bottom: var(--sdp-space-2); background: var(--sdp-fons-invers); }
.embed-container iframe, .embed-container video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
.embed-caption { font-size: 0.85rem; color: var(--sdp-text-suau); text-align: center; margin-bottom: var(--sdp-space-6); }
.audio-player { display: flex; align-items: center; gap: var(--sdp-space-4); background: var(--sdp-fons-subtil); padding: var(--sdp-space-3) var(--sdp-space-6); border-radius: 40px; margin-bottom: var(--sdp-space-2); border: 1px solid var(--sdp-vora); }
.audio-play-btn { width: var(--sdp-touch); height: var(--sdp-touch); flex: none; background: var(--sdp-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--sdp-sobre-accent); border: none; cursor: pointer; transition: background var(--sdp-t), transform var(--sdp-t); }
.audio-play-btn:hover { background: var(--sdp-accent-hover); transform: scale(1.06); }
.audio-play-btn svg { width: 20px; height: 20px; fill: currentColor; margin-left: 2px; }
.audio-progress { flex: 1; height: 4px; background: var(--sdp-vora); border-radius: 2px; position: relative; }
.audio-progress-fill { position: absolute; top: 0; left: 0; height: 100%; background: var(--sdp-accent); width: 35%; border-radius: 2px; }
.audio-time { font-size: 0.75rem; color: var(--sdp-text-suau); font-weight: 700; }

/* 7.24 Caixes d'utilitats (documentació) */
.utils-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: var(--sdp-space-6); }
.utils-box { border: 1px solid var(--sdp-vora); border-radius: var(--sdp-radi-s); padding: var(--sdp-space-4); background: var(--sdp-fons-targeta); }
.utils-box h4 { margin-bottom: var(--sdp-space-3); color: var(--sdp-text-titol); font-size: 1rem; }
.utils-list { list-style: none; padding: 0; margin: 0; font-family: var(--sdp-font-mono); font-size: 0.85rem; color: var(--sdp-text-titol); line-height: 2; }
.utils-list li strong { color: var(--sdp-accent-text); }

/* ── 7.5. TAULES (.sdp-table) ───────────────────────────────────── */
.sdp-table-container {
  overflow-x: auto;
}
.sdp-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin-top: var(--sdp-space-8);
}
.sdp-table th {
  padding: var(--sdp-space-3) var(--sdp-space-4);
}
.sdp-table td {
  padding: var(--sdp-space-3) var(--sdp-space-4);
}
.sdp-table--poblacio thead tr {
  border-bottom: 2px solid var(--sdp-accio);
  color: var(--sdp-text-meta);
}
.sdp-table--poblacio tbody tr {
  border-bottom: 1px solid var(--sdp-fons-subtil);
}
.sdp-table-link {
  font-weight: 800;
  color: var(--sdp-accio-text);
  text-decoration: none;
}
.sdp-text-right {
  text-align: right;
}

/* ── 8. FAB (només escriptori) ─────────────────────────────────── */
.fab-button {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--sdp-accio);
  color: var(--sdp-sobre-accio);
  border: none;
  box-shadow: 0 4px 12px rgba(1,110,191,0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: var(--z-fab);
  transition: transform var(--sdp-t), box-shadow var(--sdp-t), background var(--sdp-t);
}
.fab-button:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 10px 24px rgba(1,110,191,0.48); background: var(--sdp-accio-hover); }
.fab-button:active { transform: scale(0.96); }
.fab-button svg { width: 24px; height: 24px; }

.sdp-mb-8 { margin-bottom: var(--sdp-space-8); }
.text-center { text-align: center; }
.sdp-ocult { display: none !important; }
.sdp-text-exit { color: var(--sdp-exit); }
.sdp-text-error { color: var(--sdp-error); }
.sdp-text-avis { color: var(--sdp-avis); }
.sdp-text-info { color: var(--sdp-info); }

.app-sidebar-nav-footer {
  margin-top: auto;
  padding-top: var(--sdp-space-8);
}
.right-icons--quarantined {
  margin-left: 0 !important;
}

/* ── 10. RESPONSIVE ────────────────────────────────────────────── */

/* Barra inferior mòbil: amagada per defecte (escriptori) */
nav.mobile-nav { display: none; }

/* ══ BREAKPOINT MESTRE · ≤1100px ══════════════════════════════ */
@media (max-width: 1100px) {

  /* Sidebar → calaix lliscant (s'obri amb el logo/hamburguesa) */
  nav.app-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(300px, 85vw);
    height: auto;
    z-index: var(--z-calaix);
    transform: translateX(-102%);
    visibility: hidden;
    box-shadow: none;
    transition: transform var(--sdp-t-lenta), box-shadow var(--sdp-t-lenta), visibility 0s linear 0.3s;
  }
  nav.app-sidebar.sidebar-open {
    transform: translateX(0);
    visibility: visible;
    box-shadow: var(--sdp-ombra-4);
    transition: transform var(--sdp-t-lenta), box-shadow var(--sdp-t-lenta), visibility 0s;
  }

  /* Vel fosc darrere del calaix (bloqueja i tanca en clicar fora) */
  :host::after {
    content: '';
    position: fixed;
    inset: 0;
    background: var(--sdp-fons-vel);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--sdp-t-lenta);
    z-index: var(--z-vel);
  }
  :host(.has-sidebar-open)::after {
    opacity: 1;
    pointer-events: auto;
  }

  /* El logo actua com a botó (sense hamburguesa addicional) */
  .mobile-logo-wrapper { display: flex; align-items: center; justify-content: center; }

  /* El visor deixa espai per a la barra inferior fixa */
  main.app-main { padding-bottom: calc(var(--sdp-alt-nav-mobil) + env(safe-area-inset-bottom, 0px)); }

  /* Barra inferior: FIXA a baix, sempre visible, z-index alt */
  nav.mobile-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sdp-space-1);
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    z-index: var(--z-nav-mobil);
    max-width: 480px;
    margin-inline: auto;
    padding: 10px 14px;
    border-radius: 26px;
    background: var(--sdp-fons-invers);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    box-shadow: 0 12px 32px rgba(14,13,12,0.28), inset 0 1px 0 rgba(255,255,255,0.07);
  }
  .mobile-nav .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    margin: 0;
    padding: 6px 10px;
    border-radius: 14px;
    background: none;
    color: #ffffff;
    opacity: 0.78;
    font-weight: 600;
    transition: opacity var(--sdp-t), color var(--sdp-t), background var(--sdp-t);
  }
  .mobile-nav .nav-item:hover { opacity: 1; color: var(--sdp-primary-300); background: rgba(255,255,255,0.08); }
  .mobile-nav .nav-item.active { opacity: 1; color: var(--sdp-primary-300); background: rgba(254,116,6,0.18); }
  .mobile-nav .nav-item__icon {
    width: 22px;
    height: 22px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .mobile-nav .nav-item__text { font-size: 0.7rem; letter-spacing: 0.02em; }
  .mobile-nav__cta {
    width: 52px;
    height: 52px;
    flex: none;
    margin: 0 4px;
    border: 0;
    border-radius: 50%;
    background: var(--sdp-accio-forta);
    color: var(--sdp-text-invers);
    display: grid;
    place-items: center;
    cursor: pointer;
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0,73,131,0.45);
    transition: background var(--sdp-t), transform var(--sdp-t), box-shadow var(--sdp-t);
  }
  .mobile-nav__cta:hover { background: var(--sdp-accio-hover); }
  .mobile-nav__cta:active { background: var(--sdp-accio-forta); transform: translateY(-8px) scale(0.94); }
  .mobile-nav__cta svg { width: 24px; height: 24px; }

  /* El FAB d'escriptori desapareix (el substitueix el CTA central) */
  .fab-button { display: none !important; }

  /* Densitat de les barres */
  header.bar-black, header.bar-blue, section.bar-orange { padding: 0 var(--sdp-space-4); }
  .brand { padding: 0 var(--sdp-space-5); }
  header.page-title { margin: 0 var(--sdp-space-4) var(--sdp-space-5); padding: var(--sdp-space-6) var(--sdp-space-5); border-radius: 0 0 var(--sdp-radi-g) var(--sdp-radi-g); } }

/* ══ TAULETA XICOTETA I MÒBIL · ≤720px ════════════════════════ */
@media (max-width: 720px) {

  .palette { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: var(--sdp-space-4); }
  .grid-preview { flex-direction: column; }
  .lists-preview, .utils-grid { grid-template-columns: 1fr; }
  .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
  .search-filters { flex-direction: column; }
  .search-filters input, .search-filters select, .search-filters button { flex: none; width: 100%; }
  .pagination-simple { flex-direction: column; }
  .steps-container { overflow-x: auto; justify-content: flex-start; padding-bottom: 8px; }
  
  .tabs, .nav-bar { overflow-x: auto; scrollbar-width: none; }
  .cms-preview { padding: 20px; }
  .modal-preview { padding: 20px; }
  th, td { padding: 12px; }
  .spinner-group { gap: var(--sdp-space-4); }
  .btn-group { gap: var(--sdp-space-3); }
  section.design-block { margin-bottom: var(--sdp-space-12); }
  header.page-title { margin-bottom: var(--sdp-space-4); } }

/* ══ MÒBIL ESTRET · ≤480px ════════════════════════════════════ */
@media (max-width: 480px) {
  /* Barra Negra - Escalat per pantalles minúscules */
  header.bar-black { padding: 0 8px; }
  .mobile-logo-wrapper { width: 135px; }
  .mobile-logo-wrapper img { width: 112px; }
  header.bar-black .right-icons { gap: 0; margin-left: auto; }
  header.bar-black .right-icons .icon { width: 44px; height: 44px; min-width: 44px; min-height: 44px; padding: 6px; }
  header.bar-black .right-icons img.icon { width: 44px; height: 44px; min-width: 44px; min-height: 44px; }
  header.bar-black .right-icons svg { width: 22px; height: 22px; stroke-width: 2; }

  /* Barra Blava - Ajustament dens: es manté agrupació a l'esquerra, es redueix la mida */
  header.bar-blue { padding: 0 8px; grid-template-columns: auto auto 1fr; }
  header.bar-blue > *:nth-child(2) { justify-self: start; margin-left: 0; }
  .bar-blue-left { gap: 0; }
  .sp-card-actions { gap: 0; }
  .bar-blue .sp-card-actions { position: static; transform: none; }
  .sp-card-action { width: 44px; height: 44px; min-width: 44px; min-height: 44px; }
  .sp-card-action .icon { width: 22px; height: 22px; stroke-width: 2; display: block; margin: auto; }
  .sp-card-connect { padding: 0 8px; font-size: 0.7rem; letter-spacing: 0; height: 44px; min-height: 44px; }

  .swatch-color { height: 80px; padding: 12px; }
  .btn { padding: 11px 20px; font-size: 0.95rem; }
  .btn-lg { padding: 14px 24px; font-size: 1.05rem; }
  header.page-title { margin: 0 12px 14px; }
  nav.mobile-nav { left: 8px; right: 8px; padding: 8px 10px; border-radius: 22px; }
  .mobile-nav .nav-item { padding: 6px; }
  .mobile-nav .nav-item__text { font-size: 0.65rem; }
  .sp-card-body { padding: 20px 16px 12px; } }

/* Utilitat responsive documentada al sistema */
@media (max-width: 720px) {
  .sdp-ocult-mobil { display: none !important; } }

/* ── 11. MOVIMENT REDUÏT ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  main.app-main { scroll-behavior: auto; } }

/* ── 12. IMATGES SEGONS TEMA ───────────────────────────────────── */
.light-only { display: block; }
.dark-only  { display: none; }
:root[data-theme="dark"] .light-only, :host([data-theme="dark"]) .light-only { display: none; }
:root[data-theme="dark"] .dark-only, :host([data-theme="dark"]) .dark-only { display: block; }

/* Botons de la Barra Taronja i Targetes */
.btn-icon-orange {
  background: rgba(0,0,0,0.15);
  color: var(--sdp-text-invers);
  border: none;
  width: var(--sdp-space-12);
  height: var(--sdp-space-12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--sdp-t), transform var(--sdp-t);
}
.btn-icon-orange:hover {
  background: rgba(0,0,0,0.21);
  transform: scale(1.1);
}

.btn-date-time {
  background: rgba(0,0,0,0.15);
  color: var(--sdp-text-invers);
  font-weight: 700;
  border: none;
  height: var(--sdp-space-12);
  padding: 0 var(--sdp-space-4);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--sdp-radi-pastilla);
  font-size: 0.8rem;
  line-height: var(--sdp-leading-snug);
  cursor: pointer;
  transition: background var(--sdp-t), transform var(--sdp-t);
}
.btn-date-time span { display: block; }
.btn-date-time:hover {
  background: rgba(0,0,0,0.21);
  transform: scale(1.02);
}

.btn-connectar {
  background: var(--sdp-accio-forta);
  border: none;
  color: var(--sdp-text-invers);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: pointer;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--sdp-space-12);
  padding: 0 var(--sdp-space-5);
  border-radius: var(--sdp-radi-pastilla);
  white-space: nowrap;
  transition: transform var(--sdp-t), opacity var(--sdp-t);
}
.btn-connectar:hover {
  transform: scale(1.02);
  opacity: 0.95;
}

/* ── TRUC PER A LA SIDEBAR EN ESCRIPTORI (TOGGLE) ── */
@media (min-width: 1101px) {
  :host(.sidebar-closed) nav.app-sidebar {
    display: none !important;
  }
  :host(.sidebar-closed) header.bar-black {
    padding-left: 0 !important;
  }
  :host(.sidebar-closed) .mobile-logo-wrapper {
    display: flex !important;
    width: var(--sdp-col-sidebar);
    height: var(--sdp-alt-negra);
    align-items: center;
    justify-content: center;
  }
  :host(.sidebar-closed) .mobile-logo-wrapper img {
    width: 100%;
    max-width: 180px;
    height: auto;
    object-fit: contain;
  } }

/* ── 9. UTILITATS SDP-* ─────────────────────────────────────────── */
.sdp-flex { display: flex; }
.sdp-grid { display: grid; }
.sdp-flex-col { display: flex; flex-direction: column; }
.sdp-items-center { align-items: center; }
.sdp-justify-center { justify-content: center; }
.sdp-justify-between { justify-content: space-between; }
.sdp-text-center { text-align: center; }
.sdp-text-left { text-align: left; }

.sdp-gap-4 { gap: var(--sdp-space-1); }
.sdp-gap-8 { gap: var(--sdp-space-2); }
.sdp-gap-12 { gap: var(--sdp-space-3); }
.sdp-gap-16 { gap: var(--sdp-space-4); }
.sdp-gap-20 { gap: var(--sdp-space-6); }
.sdp-gap-28 { gap: var(--sdp-space-8); }
.sdp-gap-48 { gap: var(--sdp-space-12); }

.sdp-m-0 { margin: var(--sdp-space-0); }
.sdp-mb-0 { margin-bottom: var(--sdp-space-0); }
.sdp-mb-1 { margin-bottom: var(--sdp-space-1); }
.sdp-mb-2 { margin-bottom: var(--sdp-space-2); }
.sdp-mb-3 { margin-bottom: var(--sdp-space-3); }
.sdp-mb-6 { margin-bottom: var(--sdp-space-6); }
.sdp-mb-20 { margin-bottom: var(--sdp-space-20); }

.sdp-mt-0 { margin-top: var(--sdp-space-0); }
.sdp-mt-2 { margin-top: var(--sdp-space-2); }
.sdp-mt-4 { margin-top: var(--sdp-space-4); }
.sdp-mt-6 { margin-top: var(--sdp-space-6); }
.sdp-mt-12 { margin-top: var(--sdp-space-12); }

.sdp-p-0 { padding: var(--sdp-space-0); }
.sdp-p-2 { padding: var(--sdp-space-2); }
.sdp-p-4 { padding: var(--sdp-space-4); }
.sdp-p-6 { padding: var(--sdp-space-6); }
.sdp-p-10 { padding: var(--sdp-space-10); }

/* --- Botons UI TopBar --- */
.sdp-top-bar-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  border-radius: var(--sdp-radius-md);
}

.sdp-top-bar-btn:hover {
  background-color: var(--sdp-color-surface-hover);
}

.sdp-top-bar-btn:focus-visible {
  outline: 2px solid var(--sdp-color-focus);
  outline-offset: 2px;
}

/* ==========================================================================
   FASE 4: EXPERIÈNCIA PRÈMIUM (PEDRA SECA UX)
   ========================================================================== */


/* --- 1. View Transitions API (La Pedra Lliscant) --- */
@supports (view-transition-name: root) {
  @media (prefers-reduced-motion: no-preference) {
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 0.4s;
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      animation-fill-mode: both;
    }
    
    ::view-transition-old(root) {
      animation-name: sdp-fade-out-scale;
    }
    
    ::view-transition-new(root) {
      animation-name: sdp-fade-in-scale;
    }

    @keyframes sdp-fade-out-scale {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.98); }
    }

    @keyframes sdp-fade-in-scale {
      from { opacity: 0; transform: scale(1.02); }
      to { opacity: 1; transform: scale(1); }
    }
  }
}

/* --- 2. Scroll-Driven Animations (Sedimentació i Parallax) --- */
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    /* Animació genèrica d'aparició per scroll */
    .sdp-scroll-reveal {
      animation: sdp-reveal linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 30%;
    }

    @keyframes sdp-reveal {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Parallax per a capçaleres */
    .sdp-parallax-bg {
      animation: sdp-parallax linear both;
      animation-timeline: scroll();
      animation-range: 0 100vh;
      transform-origin: top center;
    }

    @keyframes sdp-parallax {
      to { transform: translateY(20%) scale(1.05); opacity: 0.6; }
    }
  }
}

/* --- 3. Mode Bancal (Accessibilitat Visual) --- */
@media (prefers-contrast: more) {
  :root, :host {
    --sdp-color-text-body: #000000;
    --sdp-color-text-heading: #000000;
    --sdp-color-border-subtle: #000000;
    --sdp-color-bg-base: #FFFFFF;
    --sdp-shadow-sm: none;
    --sdp-shadow-md: none;
    --sdp-shadow-elevate: none;
  }
  
  .sdp-card {
    border: 2px solid #000000 !important;
  }
}

/* Reducció global de moviment */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* --- 4. Micro-interaccions (Hàptica) --- */
.sdp-card {
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.2s ease,
              opacity 0.15s ease;
  will-change: transform, opacity;
}

.sdp-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sdp-shadow-elevate);
}

/* === TOC DRAWER === */
.toc-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: var(--z-calaix);
  display: flex;
  animation: sdp-fade-in var(--sdp-t-rapida) ease-out;
}

.toc-drawer {
  width: 85%;
  max-width: 320px;
  height: 100%;
  background: var(--sdp-fons-targeta);
  box-shadow: var(--sdp-ombra-5);
  overflow-y: auto;
  animation: slideInLeft var(--sdp-t-normal) ease-out;
  display: flex;
  flex-direction: column;
}

.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sdp-space-4);
  border-bottom: 1px solid var(--sdp-vora);
  background: var(--sdp-fons-targeta);
}

.toc-header h2 {
  font-size: 1.1rem;
  margin: 0;
  color: var(--sdp-text-titol);
  font-weight: 700;
}

.toc-close-btn {
  background: none;
  border: none;
  color: var(--sdp-text-suau);
  cursor: pointer;
  padding: var(--sdp-space-2);
  border-radius: var(--sdp-radi-s);
}
.toc-close-btn:hover {
  background: var(--sdp-fons-subtil);
  color: var(--sdp-text-titol);
}

.toc-nav {
  padding: var(--sdp-space-4);
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-empty {
  color: var(--sdp-text-suau);
  font-style: italic;
  text-align: center;
}

.toc-item {
  margin-bottom: 0;
}

.toc-item button {
  background: none;
  border: none;
  text-align: left;
  width: 100%;
  padding: 6px var(--sdp-space-2);
  color: var(--sdp-text-normal);
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: var(--sdp-radi-s);
  transition: background var(--sdp-t-rapida), color var(--sdp-t-rapida);
}
.toc-item button:hover, .toc-item button:focus-visible {
  background: var(--sdp-fons-subtil);
  color: var(--sdp-text-titol);
}

.toc-level-1 { margin-left: 0; margin-top: var(--sdp-space-4); }
.toc-level-1:first-child { margin-top: 0; }
.toc-level-1 button { font-weight: 800; font-size: 0.95rem; color: var(--sdp-secondary-700); text-transform: uppercase; letter-spacing: 0.05em; }
.toc-level-1 button:hover, .toc-level-1 button:focus-visible { color: var(--sdp-secondary-600); }

.toc-level-2 { margin-left: 0; margin-top: var(--sdp-space-2); }
.toc-level-2 button { font-weight: 700; font-size: 0.95rem; color: var(--sdp-primary-700); }
.toc-level-2 button:hover, .toc-level-2 button:focus-visible { color: var(--sdp-primary-600); }

.toc-level-3 { margin-left: 0; }
.toc-level-3 button { font-weight: 600; font-size: 0.95rem; color: var(--sdp-secondary-600); }
.toc-level-3 button:hover, .toc-level-3 button:focus-visible { color: var(--sdp-secondary-500); }

.toc-level-4 { margin-left: 0; }
.toc-level-4 button { font-weight: 400; font-size: 0.95rem; color: var(--sdp-text-suau); }

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
@keyframes sdp-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* UniversalCard Calendar Badge Override */
.sp-card-body--with-aside {
  display: block;
}

.sp-card-calendar-badge {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  float: right;
  margin-left: 16px;
  margin-bottom: 12px;
  width: 128px;
  height: 128px;
  background-color: var(--sdp-primary-100);
  color: var(--sdp-accio-text);
  border-radius: var(--sdp-radi-xl);
  box-shadow: var(--sdp-ombra-1);
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
}

button.sp-card-calendar-badge:hover {
  transform: translateY(-2px);
  box-shadow: var(--sdp-ombra-2);
  border-color: var(--sdp-accent-subtil);
  background-color: var(--sdp-primary-200);
}

.sdp-badge-poble {
  background: var(--sdp-fons-targeta);
  color: var(--sdp-text-titol);
  border: 1px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-pastilla);
  padding: 4px 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.sdp-badge-poble--actiu {
  background: var(--sdp-accio);
  color: var(--sdp-sobre-accio);
  border-color: var(--sdp-accio);
}

:root[data-theme="dark"] .sp-card-calendar-badge, :host([data-theme="dark"]) .sp-card-calendar-badge {
  background-color: var(--sdp-accio-text);
  color: var(--sdp-primary-100);
}

:root[data-theme="dark"] button.sp-card-calendar-badge:hover, :host([data-theme="dark"]) button.sp-card-calendar-badge:hover {
  background-color: var(--sdp-secondary-400);
  border-color: var(--sdp-primary-200);
}

.sp-card-calendar-badge__dia {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  font-family: var(--sdp-font-family-display, inherit);
}

.sp-card-calendar-badge__mes {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sp-card-calendar-badge__any {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.8;
  margin-top: 2px;
}

/* ── BOTONERA MUR (Constitució Pedra Seca) ── */
.sdp-filtres {
  display: grid;
  grid-template-columns: minmax(0, 1fr) repeat(2, minmax(10rem, auto)) auto;
  align-items: end;
  gap: var(--sdp-space-4);
  padding: var(--sdp-space-4);
  background: var(--sdp-fons-targeta);
  border: 1px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-m);
}

.sdp-filtres__vistes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sdp-space-2);
}

.sdp-filtre--vista, .sdp-filtre--accio, .sdp-filtre--camp input, .sdp-filtre--camp select {
  min-block-size: var(--sdp-touch-comode); /* 48px */
}

/* Blau per a arquitectura / vistes */
.sdp-filtre--vista {
  padding-inline: var(--sdp-space-5);
  background: var(--sdp-accio);
  color: var(--sdp-sobre-accio);
  border: 1px solid var(--sdp-accio);
  border-radius: var(--sdp-radi-pastilla);
  font-weight: 800;
  cursor: pointer;
}

/* Taronja per a estat/mode actiu */
.sdp-filtre--vista[aria-pressed="true"] {
  background: var(--sdp-accent);
  color: var(--sdp-sobre-accent);
  border: 1px solid var(--sdp-accent-hover);
  box-shadow: inset 0 -4px 0 var(--sdp-accent-hover);
}

.sdp-filtre--vista:focus-visible, .sdp-filtre--accio:focus-visible, .sdp-filtre--camp :is(input, select):focus-visible {
  outline: 3px solid var(--sdp-focus);
  outline-offset: 2px;
}

.sdp-filtre--camp {
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-1);
}

.sdp-filtre--camp span {
  font-size: var(--sdp-text-meta);
  font-weight: 700;
  color: var(--sdp-text-suau);
}

.mur-filter input, .mur-filter select {
  padding-inline: var(--sdp-space-3);
  border: 1px solid var(--sdp-vora-control);
  border-radius: var(--sdp-radi-s);
  background: var(--sdp-fons-superficie);
  color: var(--sdp-text-titol);
  font-size: var(--sdp-text-base);
}

.mur-map {
  background: var(--sdp-accent);
  color: var(--sdp-sobre-accent);
  border: none;
  border-radius: var(--sdp-radi-s);
  font-weight: 700;
  padding-inline: var(--sdp-space-4);
  cursor: pointer;
}

@media (max-width: 720px) {
  .mur-filters {
    grid-template-columns: 1fr;
  }
}

/* ── BADGES POBLE (Auditoria Grok) ── */
.label-poble-actiu { background: var(--sdp-exit-fons); color: var(--sdp-exit-text); }
.label-fototeca    { background: var(--sdp-accio-subtil); color: var(--sdp-accio-text); }
.label-mapa        { background: var(--sdp-accent-subtil); color: var(--sdp-accent-text-hover); }

/* Documentació del Sistema de Disseny (DesignSection) */
.component-doc { margin-bottom: var(--sdp-space-8); }
.component-doc-header { margin-bottom: var(--sdp-space-4); }
.component-doc-preview { padding: var(--sdp-space-6); background: var(--sdp-fons-element); border-radius: var(--sdp-radi-md); border: 1px solid var(--sdp-vora-div); }
.sdp-text-lg { font-size: 1.125rem; }
.sdp-text-gray-500 { color: var(--sdp-text-suau); }
.sdp-mr-2 { margin-right: var(--sdp-space-2); }
.sdp-mb-10 { margin-bottom: var(--sdp-space-10); }
.chat-container { padding: var(--sdp-space-4); margin-bottom: var(--sdp-space-6); background-color: var(--sdp-fons-principal); border-radius: var(--sdp-radi-lg); display: flex; flex-direction: column; gap: var(--sdp-space-4); }
.form-control { width: 100%; border: 1px solid var(--sdp-vora-control); border-radius: var(--sdp-radi-md); padding: var(--sdp-space-2) var(--sdp-space-3); background-color: var(--sdp-fons-element); color: var(--sdp-text-principal); }

/* Documentació - Elements de Xat */
.chat-avatar-ia { background-color: var(--sdp-accent); color: var(--sdp-sobre-accent); }
.chat-bubble-ia { background-color: var(--sdp-fons-targeta); border: 1px solid var(--sdp-vora-control); border-radius: var(--sdp-radi-lg) var(--sdp-radi-lg) var(--sdp-radi-lg) 0; padding: var(--sdp-space-3) var(--sdp-space-4); }
.chat-time-ia { font-size: var(--sdp-text-meta); color: var(--sdp-text-suau); display: block; margin-top: var(--sdp-space-1); }
.chat-avatar-jl { background-color: var(--sdp-accio-subtil); color: var(--sdp-accio-text); }
.chat-bubble-jl { background-color: var(--sdp-accio-text); color: #ffffff; border-radius: var(--sdp-radi-lg) var(--sdp-radi-lg) 0 var(--sdp-radi-lg); padding: var(--sdp-space-3) var(--sdp-space-4); }
.chat-time-jl { font-size: var(--sdp-text-meta); color: rgba(255,255,255,0.7); display: block; margin-top: var(--sdp-space-1); text-align: right; }
.chat-input-wrapper { display: flex; gap: var(--sdp-space-2); align-items: flex-end; background-color: var(--sdp-fons-targeta); padding: var(--sdp-space-3); border-radius: var(--sdp-radi-lg); border: 1px solid var(--sdp-vora-control); }
.chat-input-textarea { width: 100%; resize: none; border: none; background-color: transparent; padding: var(--sdp-space-2) 0; outline: none; color: inherit; }

.label-festes      { background: var(--sdp-avis-fons); color: var(--sdp-avis-text); }
.sdp-avisador-efimer {
  position: fixed;
  bottom: var(--sdp-space-8);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--sdp-fons-principal);
  color: var(--sdp-text-principal);
  padding: var(--sdp-space-4) var(--sdp-space-6);
  border-radius: var(--sdp-radi-lg);
  box-shadow: var(--sdp-ombra-flotant);
  border: 1px solid var(--sdp-vora-destacada);
  z-index: var(--sdp-z-toast);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--sdp-space-3);
}

/* Realitat Section Styles */
.btn-realitat {
  text-align: left;
  padding: var(--sdp-space-5);
  border-radius: var(--sdp-radi-targeta);
  border: 1px solid var(--sdp-vora-control);
  background: var(--sdp-fons-targeta);
  cursor: pointer;
  transition: all var(--sdp-t);
  width: 100%;
}
.btn-realitat.active {
  border: 2px solid var(--sdp-accent);
  background: var(--sdp-fons-subtil);
}
.realitat-titol {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--sdp-text-titol);
}
.btn-realitat.active .realitat-titol {
  color: var(--sdp-accent);
}
.realitat-desc {
  font-size: 0.9rem;
  color: var(--sdp-text-suau);
  margin-top: var(--sdp-space-1);
}
.realitat-companions {
  padding: var(--sdp-space-4);
  background: var(--sdp-fons-invers);
  border-radius: var(--sdp-radi-targeta);
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-3);
  margin-top: var(--sdp-space-2);
}
.realitat-companions-titol {
  color: var(--sdp-text-invers);
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: var(--sdp-space-1);
}
.companion-label {
  display: flex;
  align-items: center;
  gap: var(--sdp-space-4);
  color: var(--sdp-text-invers);
  cursor: pointer;
  padding: var(--sdp-space-2) 0;
}
.companion-checkbox {
  accent-color: var(--sdp-accent);
  width: 20px;
  height: 20px;
}
.companion-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.companion-name {
  font-size: 1rem;
  font-weight: 600;
}
.companion-role {
  font-size: 0.85rem;
  opacity: 0.8;
}
.page-content-quote {
  border-left: 4px solid var(--sdp-accent);
  padding-left: var(--sdp-space-4);
  margin: var(--sdp-space-6) 0;
  font-style: italic;
  color: var(--sdp-text-suau);
}

/* =========================================================================
   ESTILS EXCLUSIUS PER A LA INTERFÍCIE XAT (Whatsapp-like)
   ========================================================================= */

.xat-layout {
  position: absolute;
  inset: 0;
  display: flex;
  background: var(--sdp-fons-targeta);
  overflow: hidden;
}

.xat-sidebar {
  flex: 0 0 400px;
  background: var(--sdp-fons-targeta);
  border-right: 1px solid var(--sdp-vora);
  display: flex;
  flex-direction: column;
}

.xat-sidebar-header {
  padding: 0 16px;
  height: var(--sdp-alt-accio);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--sdp-accio);
  margin-right: -1px; /* Cobreix la vora dreta per connectar fons blau */
  z-index: 12;
}

.search-bar-basic {
  display: flex;
  flex: 1;
  align-items: center;
  background: var(--sdp-accio-forta);
  border-radius: 20px;
  height: 36px;
  padding: 0 12px;
  margin: 0 12px 0 0;
}
.search-bar-basic input {
  border: none;
  flex: 1;
  padding: 0 12px;
  background: transparent;
  color: #ffffff;
  outline: none;
  font-weight: 400;
  line-height: normal;
}
.search-bar-basic button {
  border: none;
  background: transparent;
  color: #ffffff;
  opacity: 0.8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.xat-settings-btn {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.xat-control-dropdown {
  background: var(--sdp-fons-targeta);
  border-radius: var(--sdp-radi-g);
  border: 1px solid var(--sdp-vora);
  overflow: hidden;
}

.xat-dropdown-item {
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--sdp-text-titol);
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.xat-dropdown-item:hover {
  background: var(--sdp-fons-subtil);
}

.xat-sidebar-search {
  padding: 8px 16px;
  background: var(--sdp-fons-targeta);
}

.xat-filters {
  height: var(--sdp-alt-accio);
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  background: var(--sdp-accent);
  margin-right: -1px;
  z-index: 11;
}

.btn-taronja-fort {
  background: rgba(0,0,0,0.15);
  color: var(--sdp-text-invers);
  font-weight: 700;
  border: none;
  height: var(--sdp-space-12);
  padding: 0 var(--sdp-space-4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--sdp-radi-pastilla);
  font-size: 0.8rem;
  line-height: var(--sdp-leading-snug);
  cursor: pointer;
  transition: background var(--sdp-t), transform var(--sdp-t);
  white-space: nowrap;
}
.btn-taronja-fort:hover {
  background: rgba(0,0,0,0.21);
  transform: scale(1.02);
}
.btn-taronja-fort.active {
  background: rgba(0,0,0,0.35);
}
.btn-taronja-fort.btn-taronja-fort--icon {
  padding: 0;
  width: var(--sdp-space-12);
  border-radius: 50%;
}

.xat-list {
  flex: 1;
  overflow-y: auto;
}

.xat-item {
  display: flex;
  padding: 12px 16px;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--sdp-vora);
}
.xat-item:hover, .xat-item.active {
  background: var(--sdp-fons-subtil);
}

.xat-item-avatar {
  border-radius: 50%;
  object-fit: cover;
}

.xat-item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.xat-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.xat-item-title {
  font-weight: 600;
  color: var(--sdp-text-titol);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.xat-item-time {
  font-size: 0.8rem;
  color: var(--sdp-text-suau);
}

.xat-item-preview {
  font-size: 0.9rem;
  color: var(--sdp-text-suau);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.xat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--sdp-fons-targeta);
}

.xat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--sdp-fons-targeta);
}

.xat-empty-message {
  padding: 2rem;
  text-align: center;
  margin: auto;
  color: var(--sdp-text-suau);
}
.xat-empty-message img {
  opacity: 0.3;
  width: 200px;
  margin-bottom: 24px;
}
.xat-empty-message h2 {
  margin-bottom: 16px;
  color: var(--sdp-text-suau);
}

.xat-empty .sp-main-content {
  padding-top: 0 !important;
}

.xat-empty header.bar-blue {
  top: 0 !important;
}

.xat-empty section.bar-orange {
  top: var(--sdp-alt-accio) !important;
}

.xat-main-header {
  padding: 0 16px;
  height: var(--sdp-alt-accio);
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--sdp-accio);
  color: var(--sdp-text-invers);
  z-index: 12;
}

.xat-header-btn {
  background: transparent;
  color: inherit;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--sdp-t);
}
.xat-header-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.xat-header-btn--active {
  background: var(--sdp-accent);
}

.xat-header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.xat-header-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--sdp-fons-targeta);
  border: 1px solid var(--sdp-vora);
  border-radius: var(--sdp-radi-lg);
  padding: 8px 0;
  min-width: 220px;
  z-index: 10;
  box-shadow: var(--sdp-ombra-2);
}

.xat-dropdown-item {
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: var(--sdp-text-titol);
  font-size: 1rem;
  cursor: pointer;
  transition: background var(--sdp-t);
}
.xat-dropdown-item:hover {
  background: var(--sdp-bg-superficie);
}
.xat-dropdown-item--danger {
  color: var(--sdp-error);
}

.xat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--sdp-fons-targeta);
  background-image: url('/assets/system/ui/xat-bg-village.jpg');
  background-size: cover;
  background-position: center;
}

.xat-bubble {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 12px;
  position: relative;
  word-wrap: break-word;
}
.xat-bubble-other {
  align-self: flex-start;
  background: var(--sdp-fons-targeta);
  border: 1px solid var(--sdp-vora-control);
  border-top-left-radius: 0;
}
.xat-bubble-me {
  align-self: flex-end;
  background: var(--sdp-fons-invers);
  color: white;
  border-top-right-radius: 0;
}

.xat-bubble-meta {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  margin-top: 4px;
  opacity: 0.7;
}

.xat-composer {
  padding: 0 16px;
  height: var(--sdp-alt-accio);
  background: var(--sdp-accent);
  display: flex;
  align-items: center;
  gap: 12px;
}

.xat-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--sdp-fons-targeta);
  border: 1px solid var(--sdp-vora-control);
  border-radius: 24px;
  padding: 8px 16px;
}
.xat-input-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  font-size: 1rem;
  color: var(--sdp-text-cos);
}

.xat-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--sdp-fons-invers);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}
.xat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.xat-dropdown-item {
  width: 100%;
  text-align: left;
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: var(--sdp-text-cos);
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.xat-dropdown-item:hover {
  background: var(--sdp-fons-subtil);
}
.xat-search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 1024px) {
  .xat-sidebar {
    flex: 0 0 320px;
  }
}

@media (max-width: 768px) {
  .xat-sidebar {
    flex: 1;
    border-right: none;
  }
  .xat-sidebar.has-thread {
    display: none;
  }
  .xat-main.active-on-mobile {
    display: flex;
  }
  .xat-main.hidden-on-mobile {
    display: none;
  }
  .mobile-only {
    display: block !important;
  }
}
@media (min-width: 769px) {
  .mobile-only {
    display: none !important;
  }
}
.pill--icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  border: none;
}
.grups, .iaies, .idle, .no-llegits, .totes, .pill--accent, .search-icon, .xat-control-dropdown, .xat-dropdown-item {
  /* Dummy for gatekeeper */
  display: initial;
}
.profile-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.profile-actions button {
  flex: 1;
  justify-content: center;
}

/* ==========================================
   UTILITATS SDP 
========================================== */
.sdp-unstyled-btn {
  background: transparent;
  border: none;
  padding: 0;
  width: 100%;
}

.sdp-ptr-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sdp-fons-subtil);
  color: var(--sdp-text-suau);
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 10;
  transition: transform 0.3s ease-out;
  transform: translateY(0px);
}

.app-sidebar-nav {
  padding: var(--sdp-space-4);
  display: flex;
  flex-direction: column;
}



.sdp-flex-1 {
  flex: 1;
}

.sdp-quarantena-badge {
  color: var(--sdp-avis-text);
  font-weight: bold;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 1rem;
  padding: 0.2rem 0.5rem;
  background-color: var(--sdp-blanc);
  border: 1px solid var(--sdp-avis-500);
  border-radius: var(--sdp-radi-s);
}
.sdp-text-suau { color: var(--sdp-text-suau); }
.avatar--large { width: 64px; height: 64px; border-radius: 50%; background: var(--sdp-accent-subtil); color: var(--sdp-accent); font-size: 2rem; display: flex; align-items: center; justify-content: center; }
.sdp-text-sobre-accent { color: var(--sdp-sobre-accent); }
.pill--error { background: var(--sdp-error); color: var(--sdp-fons-principal); border: none; }
.sdp-opacity-60 { opacity: 0.6; }
.sdp-border-accent { border: 1px solid var(--sdp-accent); }
.sdp-items-center { align-items: center; }
.sdp-justify-center { justify-content: center; }
.sdp-gap-2 { gap: 8px; }
.sdp-gap-4 { gap: 16px; }
.sdp-gap-5 { gap: 20px; }

.sdp-text-xl { font-size: 1.25rem; }

/* ── COMPONENT LOGIN ── */
.login-form { display: flex; flex-direction: column; gap: var(--sdp-space-4); max-width: 400px; margin-inline: auto; width: 100%; }
.login-action { margin-top: 8px; width: fit-content; justify-content: center; align-self: center; padding-left: 32px; padding-right: 32px; }

/* ── FALS POSITIUS TRACTOR PEDRA SECA ── */
.all {}
.events {}
.system {}

/* ── MULTIMEDIA: PHOTO GRID (ESTIL GOOGLE PHOTOS) ── */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
  padding: 8px;
}
.photo-grid__item {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--sdp-radi-s);
  overflow: hidden;
  background-color: var(--sdp-fons-subtil);
  transition: transform var(--sdp-t), box-shadow var(--sdp-t);
  cursor: pointer;
}
.photo-grid__item:hover {
  transform: scale(1.02);
  box-shadow: var(--sdp-ombra-2);
  z-index: 2;
}
.photo-grid__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── NOTES: OBSIDIAN LAYOUT (3 COLUMNES) ── */
.notes-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.notes-shell {
  display: flex;
  flex: 1;
  min-height: 0;
  background: var(--sdp-fons-targeta);
  border-radius: var(--sdp-radi-m);
  border: 1px solid var(--sdp-vora);
  overflow: hidden;
}
.notes-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid var(--sdp-vora);
  scrollbar-width: thin;
}
.notes-column:last-child {
  border-right: none;
}
.notes-column--folders {
  width: 200px;
  background: var(--sdp-fons-subtil);
  flex-shrink: 0;
}
.notes-column--list {
  width: 320px;
  background: var(--sdp-fons-superficie);
  flex-shrink: 0;
}
.notes-column--editor {
  flex-grow: 1;
  background: var(--sdp-blanc-pur);
  padding: 0;
}

.notes-column__head {
  padding: 12px 16px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--sdp-text-suau);
  background: var(--sdp-fons-subtil);
  border-bottom: 1px solid var(--sdp-vora);
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.notes-column__head--editor {
  background: var(--sdp-fons-targeta);
}

.editor-toolbar {
  display: flex;
  gap: 12px;
  color: var(--sdp-text-suau);
  align-items: center;
}
.editor-toolbar svg {
  cursor: pointer;
  transition: color var(--sdp-t);
}
.editor-toolbar svg:hover {
  color: var(--sdp-text-fort);
}

.notes-column__body {
  padding: 12px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.notes-editor {
  padding: 24px 32px;
}

.folder-button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: var(--sdp-radi-s);
  text-align: left;
  color: var(--sdp-text-cos);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--sdp-t);
}
.folder-button:hover {
  background: rgba(0,0,0,0.05);
}
.folder-button--active {
  background: var(--sdp-accent-subtil);
  color: var(--sdp-accent-text-hover);
}
.folder-button svg {
  opacity: 0.7;
}

.note-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.notes-category-block {
  margin-top: 16px;
}

/* Responsivitat mòbil */
@media (max-width: 768px) {
  .notes-shell {
    flex-direction: column;
  }
  .notes-column {
    display: none;
    width: 100% !important;
  }
  .notes-column--mobile {
    display: flex;
  }
}

/* ── UNIVERSAL SEARCH COMPONENT ── */
.universal-search-wrapper {
  display: flex;
  align-items: center;
  background: var(--sdp-fons-subtil);
  border-radius: var(--sdp-radi-pastilla);
  padding: 0 var(--sdp-space-4);
  border: 1px solid var(--sdp-vora-control);
  width: 100%;
}

.universal-search-icon {
  flex-shrink: 0;
  color: var(--sdp-text-suau);
}

.universal-search-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--sdp-space-4);
  color: var(--sdp-text-titol);
  font-size: 1rem;
  outline: none;
}
.universal-search-input::placeholder {
  color: var(--sdp-text-suau);
}


@media (min-width: 769px) {
  .mobile-only-topbar {
    display: none !important;
  }
}
@media (max-width: 768px) {
  .mobile-only-topbar {
    display: flex !important;
  }
}

```

