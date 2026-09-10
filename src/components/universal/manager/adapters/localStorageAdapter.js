/* ============================================================================
 * adapters/localStorageAdapter.js
 * ----------------------------------------------------------------------------
 * Adaptador LOCAL del port de dades del UniversalManagerShell.
 * Ports & Adapters (ADR Online-First): el shell i els hooks només coneixen
 * el CONTRACTE, mai el mitjà. Quan existisca backend, un createApiAdapter()
 * implementarà exactament aquesta mateixa interfície i cap gestor haurà de
 * canviar una línia.
 *
 * API de createLocalStorageAdapter(managerId):
 *   list()            → Promise<Registre[]>      còpies, ordre d'inserció
 *   get(id)           → Promise<Registre|null>
 *   create(payload)   → Promise<Registre>        segellat
 *   update(id, patch) → Promise<Registre>        resegellat
 *   remove(id)        → Promise<Registre|null>   el mort, per al "desfés"
 *   tree.load()       → Promise<{ [id]: Node }>  facetes persistides
 *   tree.put(node)    → Promise<Node>            upsert amb garanties d'arbre
 *   tree.remove(id)   → Promise<Node|null>       error si té fills
 *
 * Emmagatzematge versionat (l'embolcall), a la clau sdp.managers.<managerId>:
 *   { v: 1, records: [...], tree: { [id]: Node } }
 *   - Pujar de versió = afegir el pas a MIGRACIONS (mai editar dades a mà).
 *   - Versió futura o format malmès → error immediat. Falla aviat.
 *
 * Propietat dels segells (de l'adaptador, mai del payload):
 *   id     — únic; generat si el payload no el porta vàlid
 *   creat  — ms de creació; es conserva en restauracions (creat numèric)
 *   editat — ms de la darrera modificació; resegellat a cada update()
 *
 * Garanties:
 *   - Cap await intern: cada operació és atòmica al fil JS (el cicle
 *     llegir→modificar→escriure mai s'entrellaça, ni dins d'un Promise.all).
 *   - Sense cache: cada lectura ve del localStorage; el que escriga una
 *     altra pestanya es reflecteix a la lectura següent (reactivitat
 *     immediata: que el hook escolte l'event 'storage').
 *   - Entre pestanyes, l'última escriptura guanya (per operació).
 *   - Tot el que es retorna són còpies: mutar-ho no toca la persistència.
 * ========================================================================== */

const PREFIX_CLAU = 'sdp.managers.';
const VERSIO = 1;

/**
 * Passos de migració de l'embolcall: { vActual: (env) => envDeLaVSegüent }.
 * Buit mentre VERSIO == 1. Exemple quan existisca la v2:
 *   1: (env) => ({ ...env, v: 2, records: env.records.map((r) => ({ ...r, estat: r.estat ?? 'actiu' })) })
 */
const MIGRACIONS = {};

/** Ids de gestor segurs com a clau: lletres, dígits, guió i guió baix. */
const PATRO_ID_GESTOR = /^[a-zA-Z0-9_-]+$/;

/* ------------------------------- Utilitats -------------------------------- */

function esObjecte(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

/** Còpia profunda. Només s'aplica a dades ja serialitzades (post-escriptura). */
function clonar(valor) {
  if (typeof structuredClone === 'function') return structuredClone(valor);
  return JSON.parse(JSON.stringify(valor));
}

function uid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function emmagatzematgeDisponible() {
  try {
    if (typeof localStorage === 'undefined') return false;
    const clauProva = `${PREFIX_CLAU}__prova__`;
    localStorage.setItem(clauProva, '1');
    localStorage.removeItem(clauProva);
    return true;
  } catch {
    return false; // mode privat, sandbox, entorn sense emmagatzematge
  }
}

function tipusDe(valor) {
  if (valor === null) return 'null';
  if (Array.isArray(valor)) return 'array';
  return typeof valor;
}

/* --------------------------------- Fàbrica -------------------------------- */

export function createLocalStorageAdapter(managerId) {
  /* -- Validació d'arrencada: falla una vegada ací, no a cada crida. ----- */
  if (typeof managerId !== 'string' || !PATRO_ID_GESTOR.test(managerId)) {
    throw new Error(
      `createLocalStorageAdapter: managerId invàlid (${JSON.stringify(managerId)});` +
        ' esperava un identificador tipus "notes", "usuaris"...'
    );
  }
  if (!emmagatzematgeDisponible()) {
    throw new Error(
      `createLocalStorageAdapter("${managerId}"): localStorage no està disponible` +
        ' (mode privat, entorn sandbox o sense emmagatzematge).'
    );
  }

  const CLAU = `${PREFIX_CLAU}${managerId}`;

  const falla = (missatge) => {
    throw new Error(`${CLAU}: ${missatge}`);
  };

  const envolcallBuit = () => ({ v: VERSIO, records: [], tree: {} });

  /* ------------- Nucli de persistència: llegir → migrar → validar ------- */

  function llegir() {
    const cru = localStorage.getItem(CLAU);
    if (cru === null) return envolcallBuit(); // primer ús del gestor

    let env;
    try {
      env = JSON.parse(cru);
    } catch (e) {
      falla(`JSON malmès: no es pot llegir l'embolcall (${e.message})`);
    }
    env = migrar(env);
    validarEnvolcall(env);
    return env;
  }

  function migrar(env) {
    if (!esObjecte(env) || typeof env.v !== 'number') {
      falla(`format desconegut: manca el camp de versió "v"`);
    }
    while (env.v < VERSIO) {
      const pas = MIGRACIONS[env.v];
      if (!pas) falla(`no hi ha migració de la v${env.v} a la v${env.v + 1}`);
      env = pas(env);
    }
    if (env.v > VERSIO) {
      falla(`dades d'una versió futura (v${env.v} > v${VERSIO}); actualitza l'aplicació`);
    }
    return env;
  }

  function validarEnvolcall(env) {
    if (!Array.isArray(env.records)) falla(`embolcall malmès: "records" no és un array`);
    if (!esObjecte(env.tree)) falla(`embolcall malmès: "tree" no és un objecte`);

    // Registres: objectes amb id string únic.
    const vists = new Set();
    for (const rec of env.records) {
      if (!esObjecte(rec)) falla(`registre malmès a "records": no és un objecte`);
      if (typeof rec.id !== 'string' || rec.id === '') {
        falla(`registre malmès a "records": id absent o no vàlid`);
      }
      if (vists.has(rec.id)) falla(`id de registre duplicat: "${rec.id}"`);
      vists.add(rec.id);
    }

    // Nodes: la clau ha de coincidir amb l'id intern; pare existent o null.
    for (const [id, node] of Object.entries(env.tree)) {
      if (id === '') falla(`node amb clau buida a "tree"`);
      if (!esObjecte(node)) falla(`node malmès a "tree": "${id}"`);
      if (node.id !== id) falla(`node "${id}": l'id intern no coincideix amb la clau`);
      const pare = node.pare ?? null;
      if (pare !== null && typeof pare !== 'string') {
        falla(`node "${id}": "pare" ha de ser string o null`);
      }
      if (pare !== null && !(pare in env.tree)) {
        falla(`node "${id}": el pare "${pare}" no existeix`);
      }
    }

    // Bosc sa: cap cadena de pares pot superar el nombre total de nodes.
    // (Passar el límit = cicle: corrupció per edició externa.)
    const total = Object.keys(env.tree).length;
    for (const node of Object.values(env.tree)) {
      let passos = 0;
      let cursor = node;
      while (cursor) {
        if (++passos > total) falla(`cicle detectat a "tree" des del node "${node.id}"`);
        cursor = env.tree[cursor.pare] ?? null;
      }
    }
  }

  function escriure(env) {
    try {
      localStorage.setItem(CLAU, JSON.stringify(env));
    } catch (e) {
      falla(`no s'ha pogut escriure (quota esgotada o mode privat?): ${e.message}`);
    }
  }

  /* ----------------------- Validació de les entrades -------------------- */

  function exigirObjecte(valor, operacio) {
    if (!esObjecte(valor)) {
      falla(`${operacio}: esperava un objecte, ha arribat ${tipusDe(valor)}`);
    }
  }

  function exigirId(id, operacio) {
    if (typeof id !== 'string' || id === '') {
      falla(`${operacio}: esperava un id (string no buit), ha arribat ${tipusDe(id)}`);
    }
  }

  function exigirSerializable(obj, operacio) {
    // Nivell superior: el que JSON perd o rebenta es detecta ací, amb context.
    // (Els valors exòtics niats: o es perden en silenci —comportament JSON—
    // o escriure() els atrapa amb el seu propi missatge.)
    for (const [clau, valor] of Object.entries(obj)) {
      const tipus = typeof valor;
      if (tipus === 'function' || tipus === 'undefined' || tipus === 'symbol' || tipus === 'bigint') {
        falla(`${operacio}: el camp "${clau}" és de tipus ${tipus} i no sobreviurà a localStorage`);
      }
    }
  }

  /* ------------------------- Contracte de registres --------------------- */

  /** Tots els registres (còpies), en ordre d'inserció. Filtrar i ordenar és feina del hook. */
  async function list() {
    return clonar(llegir().records);
  }

  /** Un registre (còpia) o null. */
  async function get(id) {
    exigirId(id, 'get');
    const env = llegir();
    const rec = env.records.find((r) => r.id === id);
    return rec ? clonar(rec) : null;
  }

  /**
   * Crea un registre nou i el retorna segellat.
   * - "id" explícit al payload (string no buit): es respecta — serveix per a
   *   importacions i per al "desfés" de remove(); si ja existeix, error.
   * - "creat" numèric al payload: es conserva (restauració o sincronització
   *   futura); si manca, és creació nova i es segella ara.
   * - "editat" del payload: sempre l'ignora l'adaptador.
   */
  async function create(payload) {
    exigirObjecte(payload, 'create');
    exigirSerializable(payload, 'create');

    let id;
    if (payload.id !== undefined && payload.id !== null) {
      if (typeof payload.id !== 'string' || payload.id === '') {
        falla(`create: "id" explícit ha de ser un string no buit, ha arribat ${tipusDe(payload.id)}`);
      }
      id = payload.id;
    } else {
      id = uid();
    }

    const env = llegir();
    if (env.records.some((r) => r.id === id)) {
      falla(`create: ja existeix un registre amb l'id "${id}"; per a modificar-lo, update()`);
    }

    const ara = Date.now();
    const rec = {
      ...payload,
      id,
      creat: typeof payload.creat === 'number' ? payload.creat : ara,
      editat: ara,
    };
    env.records.push(rec);
    escriure(env);
    return clonar(rec);
  }

  /**
   * Aplica un patch sobre un registre existent i el retorna resegellat.
   * - NO fa upsert: registre inexistent → error (res silenciós).
   * - "id" immutable (patch amb id diferent → error); "creat" immutable (el
   *   valor del patch s'ignora); "editat" el segella sempre l'adaptador.
   * - Un patch buit {} és vàlid: només resegella "editat".
   */
  async function update(id, patch) {
    exigirId(id, 'update');
    exigirObjecte(patch, 'update');
    if (patch.id !== undefined && patch.id !== null && patch.id !== id) {
      falla(`update("${id}"): el patch porta un id diferent ("${String(patch.id)}")`);
    }
    exigirSerializable(patch, 'update');

    const env = llegir();
    const posicio = env.records.findIndex((r) => r.id === id);
    if (posicio === -1) falla(`update("${id}"): el registre no existeix`);

    const anterior = env.records[posicio];
    const actualitzat = {
      ...anterior,
      ...patch,
      id,                     // inalterable
      creat: anterior.creat,  // immutable
      editat: Date.now(),     // resegellat sempre per l'adaptador
    };
    env.records[posicio] = actualitzat;
    escriure(env);
    return clonar(actualitzat);
  }

  /**
   * Elimina el registre i RETORNA el mort (còpia): el Manager implementa el
   * "desfés" amb create(mort), que conserva l'id i el "creat" originals.
   * Idempotent: si no existeix, retorna null sense error.
   */
  async function remove(id) {
    exigirId(id, 'remove');
    const env = llegir();
    const posicio = env.records.findIndex((r) => r.id === id);
    if (posicio === -1) return null;
    const [mort] = env.records.splice(posicio, 1);
    escriure(env);
    return clonar(mort);
  }

  /* ------------- Contracte de facetes (nodes del sidebar) ----------------
   * Només el toquen gestors amb facetes { store: true }. Si cap definició
   * l'usa, "tree" queda buit a l'embolcall i no molesta.
   * Node: { id: string, pare: string|null, ...campsLliures (label, facet...) }
   * ---------------------------------------------------------------------- */

  /** Mapa pla id → node (còpia). L'índex jeràrquic el construeix el hook. */
  async function treeLoad() {
    return clonar(llegir().tree);
  }

  /**
   * Upsert d'un node; normalitza "pare" a null quan manca. Garanties:
   *   - el pare, si n'hi ha, ha d'existir;
   *   - mai un node pare de si mateix, ni cicles (es camina del pare amunt).
   */
  async function treePut(node) {
    exigirObjecte(node, 'tree.put');
    exigirId(node.id, 'tree.put');
    exigirSerializable(node, 'tree.put');

    const pare = node.pare ?? null;
    if (pare !== null && typeof pare !== 'string') {
      falla(`tree.put("${node.id}"): "pare" ha de ser string o null`);
    }

    const env = llegir();
    if (pare !== null) {
      if (pare === node.id) {
        falla(`tree.put("${node.id}"): un node no pot ser pare de si mateix`);
      }
      if (!(pare in env.tree)) {
        falla(`tree.put("${node.id}"): el pare "${pare}" no existeix`);
      }
      for (let cursor = env.tree[pare]; cursor; cursor = env.tree[cursor.pare] ?? null) {
        if (cursor.id === node.id) {
          falla(`tree.put("${node.id}"): assignar el pare "${pare}" crearia un cicle`);
        }
      }
    }

    const segellat = { ...node, pare };
    env.tree[node.id] = segellat;
    escriure(env);
    return clonar(segellat);
  }

  /**
   * Elimina un node i el retorna (còpia) per al "desfés" (tree.put(node)).
   * POLÍTICA DURA: si té fills → error ("mou-los o elimina'ls primer"):
   * la política de cascada és del Manager, no de l'adaptador. Els registres
   * que apunten el node (p. ex. nota.carpetaId) també són cosa seua: ell
   * coneix el "field" de la faceta.
   * Idempotent: node inexistent → null.
   */
  async function treeRemove(id) {
    exigirId(id, 'tree.remove');
    const env = llegir();
    const node = env.tree[id];
    if (!node) return null;

    const fills = Object.values(env.tree).filter((n) => n.pare === id);
    if (fills.length > 0) {
      falla(`tree.remove("${id}"): té ${fills.length} fills; mou-los o elimina'ls primer`);
    }

    delete env.tree[id];
    escriure(env);
    return clonar(node);
  }

  return {
    list,
    get,
    create,
    update,
    remove,
    tree: { load: treeLoad, put: treePut, remove: treeRemove },
  };
}
