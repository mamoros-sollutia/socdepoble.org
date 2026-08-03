import { createHash, createHmac, randomBytes, randomInt } from 'node:crypto';
import { mkdir, open, readFile, readdir, rename, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DAY_MS = 86_400_000;
const MINUTE_MS = 60_000;
const LOG_SALT = randomBytes(32);

export class QueueFullError extends Error {
  constructor(message = 'La cua d’entrada està plena') {
    super(message);
    this.name = 'QueueFullError';
    this.code = 'QUEUE_FULL';
  }
}

export class OutboundBlockedError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'OutboundBlockedError';
    this.code = code;
  }
}

export function hashId(value) {
  return createHash('sha256').update(String(value)).digest('hex');
}

export function redactJid(jid) {
  if (!jid) return 'jid:none';
  const suffix = String(jid).split('@')[1] || 'unknown';
  const opaque = createHmac('sha256', LOG_SALT).update(String(jid)).digest('hex').slice(0, 12);
  return `jid:${opaque}@${suffix}`;
}

export function sleep(ms, signal) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(done, ms);
    function done() {
      signal?.removeEventListener('abort', aborted);
      resolve();
    }

    function aborted() {
      clearTimeout(timer);
      reject(signal.reason || new Error('Operació cancel·lada'));
    }

    if (signal?.aborted) aborted();
    else signal?.addEventListener('abort', aborted, { once: true });
  });
}

export async function withTimeout(work, timeoutMs, label = 'Operació', onTimeout) {
  const controller = new AbortController();
  let timer;
  let timeoutError;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => {
      timeoutError = Object.assign(new Error(`${label}: temps excedit`), { code: 'TIMEOUT' });
      controller.abort(timeoutError);
      // El callback permet que el propietari tanque l'admissió immediatament
      // encara que el downstream ignore AbortSignal i continue encallat.
      try {
        onTimeout?.(timeoutError);
      } catch {
        // El timeout original continua sent l'error autoritatiu.
      }
      resolve({ timedOut: true });
    }, timeoutMs);
  });
  const operation = Promise.resolve()
    .then(() => work(controller.signal))
    .then(
      (value) => ({ ok: true, value }),
      (error) => ({ ok: false, error }),
    );
  try {
    const outcome = await Promise.race([operation, timeout]);
    if (outcome.timedOut) {
      // Fail-closed: no alliberem la plaça ni el Buffer fins que el downstream
      // acabe. Un handler que ignore AbortSignal no crea operacions òrfenes.
      await operation;
      throw timeoutError;
    }
    if (!outcome.ok) throw outcome.error;
    return outcome.value;
  } finally {
    clearTimeout(timer);
  }
}

class Semaphore {
  #active = 0;
  #waiting = [];

  constructor(limit) {
    if (!Number.isInteger(limit) || limit < 1) throw new TypeError('limit ha de ser >= 1');
    this.limit = limit;
  }

  async run(work) {
    await this.#acquire();
    try {
      return await work();
    } finally {
      this.#release();
    }
  }

  #acquire() {
    if (this.#active < this.limit) {
      this.#active += 1;
      return Promise.resolve();
    }
    return new Promise((resolve) => this.#waiting.push(resolve));
  }

  #release() {
    const next = this.#waiting.shift();
    if (next) next();
    else this.#active -= 1;
  }
}

/** FIFO per conversa amb un límit global de treball simultani. */
export class BoundedKeyedQueue {
  #tails = new Map();
  #perKey = new Map();
  #pending = 0;
  #closed = false;
  #idleWaiters = new Set();

  constructor({ concurrency = 2, maxPending = 100, maxPerKey = 10 } = {}) {
    if (!Number.isInteger(maxPending) || maxPending < 1) throw new TypeError('maxPending ha de ser >= 1');
    if (!Number.isInteger(maxPerKey) || maxPerKey < 1) throw new TypeError('maxPerKey ha de ser >= 1');
    this.maxPending = maxPending;
    this.maxPerKey = maxPerKey;
    this.semaphore = new Semaphore(concurrency);
  }

  get pending() {
    return this.#pending;
  }

  enqueue(key, work) {
    if (this.#closed) return Promise.reject(new QueueFullError('La cua està tancada'));
    const keyCount = this.#perKey.get(key) || 0;
    if (this.#pending >= this.maxPending || keyCount >= this.maxPerKey) {
      return Promise.reject(new QueueFullError());
    }

    this.#pending += 1;
    this.#perKey.set(key, keyCount + 1);
    const previous = this.#tails.get(key) || Promise.resolve();
    const run = previous.catch(() => undefined).then(() => this.semaphore.run(work));
    let sentinel;
    sentinel = run
      .catch(() => undefined)
      .finally(() => {
        this.#pending -= 1;
        const left = (this.#perKey.get(key) || 1) - 1;
        if (left) this.#perKey.set(key, left);
        else this.#perKey.delete(key);
        if (this.#tails.get(key) === sentinel) this.#tails.delete(key);
        if (this.#pending === 0) {
          for (const resolve of this.#idleWaiters) resolve();
          this.#idleWaiters.clear();
        }
      });
    this.#tails.set(key, sentinel);
    return run;
  }

  close() {
    this.#closed = true;
  }

  async drain(timeoutMs = 30_000) {
    if (this.#pending === 0) return true;
    let timeout;
    let idleResolve;
    const idle = new Promise((resolve) => {
      idleResolve = resolve;
      this.#idleWaiters.add(resolve);
    });
    const timedOut = new Promise((resolve) => {
      timeout = setTimeout(() => resolve(false), timeoutMs);
    });
    const result = await Promise.race([idle.then(() => true), timedOut]);
    clearTimeout(timeout);
    this.#idleWaiters.delete(idleResolve);
    return result;
  }
}

/** Cache estructural compatible amb el CacheStore de Baileys. */
export class TtlCache {
  #items = new Map();

  constructor({ ttlMs = 60 * 60_000, maxEntries = 5_000 } = {}) {
    if (!Number.isFinite(ttlMs) || ttlMs <= 0) throw new TypeError('ttlMs ha de ser positiu');
    if (!Number.isInteger(maxEntries) || maxEntries < 1) throw new TypeError('maxEntries ha de ser >= 1');
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
  }

  get(key) {
    const item = this.#items.get(String(key));
    if (!item) return undefined;
    if (item.expiresAt <= Date.now()) {
      this.#items.delete(String(key));
      return undefined;
    }
    return item.value;
  }

  set(key, value, ttlSeconds) {
    if (this.#items.size >= this.maxEntries && !this.#items.has(String(key))) {
      this.#items.delete(this.#items.keys().next().value);
    }
    const requestedTtl = ttlSeconds == null ? this.ttlMs : Number(ttlSeconds) * 1_000;
    if (!Number.isFinite(requestedTtl) || requestedTtl <= 0) {
      throw new TypeError('TTL de cache invàlid');
    }
    const ttlMs = requestedTtl;
    this.#items.set(String(key), { value, expiresAt: Date.now() + ttlMs });
    return true;
  }

  del(key) {
    return this.#items.delete(String(key)) ? 1 : 0;
  }

  flushAll() {
    this.#items.clear();
  }
}

/** Serialitza saveCreds: dos creds.update mai escriuen al mateix temps. */
export class SerializedWriter {
  #tail = Promise.resolve();

  request(work) {
    const run = this.#tail.catch(() => undefined).then(work);
    this.#tail = run.catch(() => undefined);
    return run;
  }

  drain() {
    return this.#tail;
  }
}

/** Un únic procés pot usar una sessió Baileys; evita guerres de connectionReplaced. */
export class ProcessLock {
  #handle = null;
  #owned = false;

  constructor(path) {
    this.path = path;
  }

  async acquire() {
    await mkdir(dirname(this.path), { recursive: true, mode: 0o700 });
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        this.#handle = await open(this.path, 'wx', 0o600);
        await this.#handle.writeFile(`${JSON.stringify({ pid: process.pid, startedAt: Date.now() })}\n`);
        this.#owned = true;
        return;
      } catch (error) {
        if (this.#handle) {
          await this.#handle.close().catch(() => undefined);
          this.#handle = null;
          this.#owned = false;
          await unlink(this.path).catch(() => undefined);
        }
        if (error?.code !== 'EEXIST') throw error;
        const owner = await this.#readOwner();
        if (owner?.pid && this.#pidIsAlive(owner.pid)) {
          throw Object.assign(new Error(`La sessió ja té un procés propietari (pid ${owner.pid})`), {
            code: 'INSTANCE_LOCKED',
          });
        }
        if (attempt > 0) throw error;
        // Conservem el lock vell com a evidència; no l'esborrem silenciosament.
        await rename(this.path, `${this.path}.stale-${Date.now()}`).catch((renameError) => {
          if (renameError?.code !== 'ENOENT') throw renameError;
        });
      }
    }
  }

  async #readOwner() {
    try {
      return JSON.parse(await readFile(this.path, 'utf8'));
    } catch {
      return null;
    }
  }

  #pidIsAlive(pid) {
    try {
      process.kill(Number(pid), 0);
      return true;
    } catch (error) {
      return error?.code === 'EPERM';
    }
  }

  async release() {
    if (!this.#owned && !this.#handle) return;
    await this.#handle?.close().catch(() => undefined);
    this.#handle = null;
    this.#owned = false;
    await unlink(this.path).catch((error) => {
      if (error?.code !== 'ENOENT') throw error;
    });
  }

  /** Tanca el descriptor però conserva el fitxer fins que el procés muira. */
  async preserve() {
    if (!this.#owned || !this.#handle) return;
    await this.#handle.close();
    this.#handle = null;
  }
}

async function atomicJson(path, value) {
  await atomicText(path, `${JSON.stringify(value)}\n`);
}

async function syncDirectory(path) {
  let handle;
  try {
    handle = await open(dirname(path), 'r');
    await handle.sync();
  } catch (error) {
    if (!['EINVAL', 'ENOTSUP', 'EISDIR'].includes(error?.code)) throw error;
  } finally {
    await handle?.close().catch(() => undefined);
  }
}

async function atomicText(path, contents) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temporary = `${path}.${process.pid}.${Date.now()}.${randomInt(0, 1_000_000)}.tmp`;
  let handle;
  try {
    handle = await open(temporary, 'wx', 0o600);
    await handle.writeFile(contents);
    await handle.sync();
    await handle.close();
    handle = null;
    await rename(temporary, path);
    await syncDirectory(path);
  } catch (error) {
    await handle?.close().catch(() => undefined);
    await unlink(temporary).catch(() => undefined);
    throw error;
  }
}

async function durableAppend(path, contents) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const handle = await open(path, 'a', 0o600);
  try {
    await handle.writeFile(contents);
    await handle.sync();
  } finally {
    await handle.close();
  }
}

/**
 * Dedupe persistent, amb estat escrit abans de sendMessage.
 * Un 'attempted' no es reenvia automàticament: l'error de xarxa pot ser ambigu.
 */
export class ReplyLedger {
  #activeClaims = new Set();

  constructor(directory, { recoveryMs = 15 * MINUTE_MS, retentionMs = 8 * DAY_MS } = {}) {
    this.directory = directory;
    this.recoveryMs = recoveryMs;
    this.retentionMs = retentionMs;
  }

  async init() {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    await this.cleanup();
  }

  pathFor(eventId) {
    return join(this.directory, `${hashId(eventId)}.json`);
  }

  async claim(eventId) {
    const claimKey = hashId(eventId);
    if (this.#activeClaims.has(claimKey)) return false;
    this.#activeClaims.add(claimKey);
    const path = this.pathFor(eventId);
    const record = { state: 'processing', updatedAt: Date.now() };
    try {
      const handle = await open(path, 'wx', 0o600);
      try {
        await handle.writeFile(`${JSON.stringify(record)}\n`);
        await handle.sync();
      } finally {
        await handle.close();
      }
      await syncDirectory(path);
      return true;
    } catch (error) {
      if (error?.code !== 'EEXIST') {
        this.#activeClaims.delete(claimKey);
        throw error;
      }
    }

    try {
      const old = await this.read(eventId);
      if (old?.state === 'processing' && Date.now() - old.updatedAt >= this.recoveryMs) {
        await atomicJson(path, record);
        return true;
      }
      this.#activeClaims.delete(claimKey);
      return false;
    } catch (error) {
      this.#activeClaims.delete(claimKey);
      throw error;
    }
  }

  async markAttempted(eventId) {
    await atomicJson(this.pathFor(eventId), { state: 'reply_attempted', updatedAt: Date.now() });
    this.#activeClaims.delete(hashId(eventId));
  }

  async markDone(eventId) {
    await atomicJson(this.pathFor(eventId), { state: 'done', updatedAt: Date.now() });
    this.#activeClaims.delete(hashId(eventId));
  }

  async abandon(eventId) {
    const current = await this.read(eventId);
    if (current?.state === 'processing') await unlink(this.pathFor(eventId)).catch(() => undefined);
    this.#activeClaims.delete(hashId(eventId));
  }

  async read(eventId) {
    try {
      return JSON.parse(await readFile(this.pathFor(eventId), 'utf8'));
    } catch (error) {
      if (error?.code === 'ENOENT') return null;
      throw error;
    }
  }

  async cleanup() {
    const cutoff = Date.now() - this.retentionMs;
    for (const name of await readdir(this.directory)) {
      if (!name.endsWith('.json')) continue;
      const path = join(this.directory, name);
      try {
        const record = JSON.parse(await readFile(path, 'utf8'));
        if (Number(record.updatedAt) < cutoff) await unlink(path);
      } catch {
        // Un fitxer corrupte es conserva per a inspecció; no arrisquem un reenviament.
      }
    }
  }
}

/** Comptador d'intents persistent; només desa el hash del xat. */
export class AttemptLedger {
  #items = [];
  #tail = Promise.resolve();
  #dirty = 0;

  constructor(path) {
    this.path = path;
  }

  async init() {
    await mkdir(dirname(this.path), { recursive: true, mode: 0o700 });
    try {
      const source = await readFile(this.path, 'utf8');
      const cutoff = Date.now() - DAY_MS;
      this.#items = [];
      for (const [index, line] of source.split('\n').filter(Boolean).entries()) {
        try {
          const item = JSON.parse(line);
          if (Number(item.at) > cutoff) this.#items.push(item);
        } catch {
          // Una línia és un intent. Davant truncament/corrupció, comptem un
          // intent incert ara: mai el perdem silenciosament (fail-closed).
          this.#items.push({ at: Date.now(), chat: `uncertain-${index}`, group: false, uncertain: true });
        }
      }
      this.#items.sort((a, b) => a.at - b.at);
      await atomicText(this.path, this.#serialise());
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }

  recent(since) {
    this.#items = this.#items.filter((item) => item.at > Date.now() - DAY_MS);
    return this.#items.filter((item) => item.at > since);
  }

  async record(chatJid, isGroup, at = Date.now()) {
    const item = { at, chat: hashId(chatJid).slice(0, 20), group: Boolean(isGroup) };
    this.#items.push(item);
    this.#dirty += 1;
    const line = `${JSON.stringify(item)}\n`;
    const run = this.#tail
      .catch(() => undefined)
      .then(async () => {
        await durableAppend(this.path, line);
        if (this.#dirty >= 100) {
          this.recent(Date.now() - DAY_MS);
          await atomicText(this.path, this.#serialise());
          this.#dirty = 0;
        }
      });
    this.#tail = run.catch(() => undefined);
    await run;
  }

  drain() {
    return this.#tail;
  }

  #serialise() {
    return this.#items.map((item) => JSON.stringify(item)).join('\n') + (this.#items.length ? '\n' : '');
  }
}

/** IMessage persistent per ID, necessari perquè getMessage sobrevisca reinicis. */
export class PersistentMessageStore {
  #memory;
  #tail = Promise.resolve();

  constructor(directory, { ttlMs = DAY_MS, replacer, reviver } = {}) {
    this.directory = directory;
    this.ttlMs = ttlMs;
    this.replacer = replacer;
    this.reviver = reviver;
    this.#memory = new TtlCache({ ttlMs, maxEntries: 10_000 });
  }

  async init() {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    const cutoff = Date.now();
    for (const name of await readdir(this.directory)) {
      if (!name.endsWith('.json')) continue;
      const path = join(this.directory, name);
      try {
        const record = JSON.parse(await readFile(path, 'utf8'), this.reviver);
        if (Number(record.expiresAt) <= cutoff) await unlink(path);
      } catch {
        // Conservem corrupció com a evidència i retornarem undefined.
      }
    }
  }

  pathFor(id) {
    return join(this.directory, `${hashId(id)}.json`);
  }

  set(id, message) {
    if (!id || !message) return Promise.resolve();
    this.#memory.set(id, message);
    const record = { expiresAt: Date.now() + this.ttlMs, message };
    const contents = `${JSON.stringify(record, this.replacer)}\n`;
    const run = this.#tail.catch(() => undefined).then(() => atomicText(this.pathFor(id), contents));
    this.#tail = run.catch(() => undefined);
    return run;
  }

  async get(id) {
    if (!id) return undefined;
    const memory = this.#memory.get(id);
    if (memory) return memory;
    await this.#tail;
    try {
      const record = JSON.parse(await readFile(this.pathFor(id), 'utf8'), this.reviver);
      if (Number(record.expiresAt) <= Date.now()) {
        await unlink(this.pathFor(id)).catch(() => undefined);
        return undefined;
      }
      this.#memory.set(id, record.message);
      return record.message;
    } catch {
      return undefined;
    }
  }

  drain() {
    return this.#tail;
  }
}

/**
 * Governador reactiu. El jitter només suavitza ràfegues; no simula conducta humana.
 * Els valors són de pilot conservador, no límits oficials ni garantia anti-bloqueig.
 */
export class OutboundGate {
  #tail = Promise.resolve();
  #lastGlobal = 0;
  #closed = false;
  #pauses = new Map();
  #messageCap = null;
  #stateWaiters = new Set();

  constructor({
    attemptLedger,
    isConnected,
    perMinute = 8,
    perDay = 250,
    globalGapMs = 3_000,
    directGapMs = 4_000,
    groupGapMs = 12_000,
    jitterMs = 700,
  }) {
    this.attemptLedger = attemptLedger;
    this.isConnected = isConnected;
    this.limits = { perMinute, perDay, globalGapMs, directGapMs, groupGapMs, jitterMs };
    for (const [name, value] of Object.entries(this.limits)) {
      const mayBeZero = name.endsWith('GapMs') || name === 'jitterMs';
      if (!Number.isInteger(value) || value < (mayBeZero ? 0 : 1)) {
        throw new TypeError(`${name} té un valor invàlid`);
      }
    }
  }

  pauseOutbound(source, { until = Infinity, setAt = Date.now() } = {}) {
    this.#pauses.set(source, { until, setAt });
  }

  clearPause(source) {
    if (this.#pauses.delete(source)) this.#wakeStateWaiters();
  }

  applyReachoutTimelock(lock, { confirmedAt = Date.now() } = {}) {
    if (lock?.isActive) {
      const rawEnd = lock.timeEnforcementEnds ? new Date(lock.timeEnforcementEnds).getTime() : NaN;
      // Sense final explícit, fail-closed: només un estat posterior inactiu
      // pot alçar la pausa.
      const until = Number.isFinite(rawEnd) ? rawEnd + MINUTE_MS : Infinity;
      this.pauseOutbound('server-timelock', { until, setAt: confirmedAt });
      return;
    }
    const server = this.#pauses.get('server-timelock');
    if (!server || server.setAt <= confirmedAt) this.clearPause('server-timelock');
    const local = this.#pauses.get('local-463');
    if (local && local.setAt <= confirmedAt) this.clearPause('local-463');
  }

  #isPaused(now = Date.now()) {
    let changed = false;
    for (const [source, pause] of this.#pauses) {
      if (pause.until <= now) {
        this.#pauses.delete(source);
        changed = true;
      }
    }
    if (changed) this.#wakeStateWaiters();
    return this.#pauses.size > 0;
  }

  get outboundPaused() {
    return this.#isPaused();
  }

  applyMessageCap(cap) {
    this.#messageCap = cap || null;
  }

  get blocksNewChats() {
    const cap = this.#messageCap;
    if (!cap) return false;
    return (
      ['FIRST_WARNING', 'SECOND_WARNING', 'CAPPED'].includes(cap.capping_status) ||
      (Number.isFinite(cap.total_quota) &&
        Number.isFinite(cap.used_quota) &&
        cap.used_quota >= cap.total_quota)
    );
  }

  sendReply(
    chatJid,
    { isGroup = false, expiresAt = Infinity, rateKey = chatJid, reactive = false } = {},
    work,
  ) {
    if (this.#closed) return Promise.reject(new OutboundBlockedError('OUTBOUND_CLOSED', 'Eixides tancades'));
    const run = this.#tail
      .catch(() => undefined)
      .then(() => this.#admit(chatJid, rateKey, isGroup, reactive, expiresAt, work));
    this.#tail = run.catch(() => undefined);
    return run;
  }

  async #admit(chatJid, rateKey, isGroup, reactive, expiresAt, work) {
    if (this.#closed) {
      throw new OutboundBlockedError('OUTBOUND_CLOSED', 'Eixides tancades');
    }
    if (Date.now() > expiresAt) {
      throw new OutboundBlockedError('REPLY_EXPIRED', 'La resposta ha caducat');
    }
    await this.#waitUntilUnpaused(expiresAt);
    if (this.blocksNewChats && !reactive) {
      throw new OutboundBlockedError('NEW_CHAT_CAPPED', 'WhatsApp ha limitat les converses noves');
    }

    const day = this.attemptLedger.recent(Date.now() - DAY_MS);
    const minute = day.filter((item) => item.at > Date.now() - MINUTE_MS);
    if (day.length >= this.limits.perDay) {
      throw new OutboundBlockedError('DAILY_LIMIT', 'Límit intern diari assolit');
    }

    const now = Date.now();
    const chatHash = hashId(rateKey).slice(0, 20);
    const sameChat = [...day].reverse().find((item) => item.chat === chatHash)?.at || 0;
    const minuteWait = minute.length >= this.limits.perMinute ? minute[0].at + MINUTE_MS - now : 0;
    const chatGap = isGroup ? this.limits.groupGapMs : this.limits.directGapMs;
    const lastPersistedAttempt = day.reduce((latest, item) => Math.max(latest, item.at), 0);
    const waitMs = Math.max(
      0,
      Math.max(this.#lastGlobal, lastPersistedAttempt) + this.limits.globalGapMs - now,
      sameChat + chatGap - now,
      minuteWait,
    );
    if (waitMs) {
      const totalWait = waitMs + randomInt(0, this.limits.jitterMs + 1);
      if (Date.now() + totalWait > expiresAt) {
        throw new OutboundBlockedError('REPLY_EXPIRED', 'La resposta caducaria en la cua');
      }
      await sleep(totalWait);
    }

    if (Date.now() > expiresAt) {
      throw new OutboundBlockedError('REPLY_EXPIRED', 'La resposta ha caducat en la cua');
    }
    if (!this.isConnected()) {
      throw new OutboundBlockedError('NOT_CONNECTED', 'Socket desconnectat; no s’intenta enviar');
    }
    await this.#waitUntilUnpaused(expiresAt);
    if (this.blocksNewChats && !reactive) {
      throw new OutboundBlockedError('NEW_CHAT_CAPPED', 'WhatsApp ha limitat les converses noves');
    }
    if (this.#closed) {
      throw new OutboundBlockedError('OUTBOUND_CLOSED', 'Eixides tancades');
    }

    const attemptedAt = Date.now();
    await this.attemptLedger.record(rateKey, isGroup, attemptedAt);
    this.#lastGlobal = attemptedAt;
    return work();
  }

  close() {
    this.#closed = true;
    this.#wakeStateWaiters();
  }

  async drain() {
    await this.#tail;
    await this.attemptLedger.drain();
  }

  async #waitUntilUnpaused(expiresAt) {
    while (this.#isPaused()) {
      if (this.#closed) {
        throw new OutboundBlockedError('OUTBOUND_CLOSED', 'Eixides tancades');
      }
      const now = Date.now();
      if (now >= expiresAt) {
        throw new OutboundBlockedError('REPLY_EXPIRED', 'La resposta ha caducat durant la pausa');
      }
      const finiteEnds = [...this.#pauses.values()]
        .map((pause) => pause.until)
        .filter(Number.isFinite);
      const nextEnd = finiteEnds.length ? Math.min(...finiteEnds) : Infinity;
      const waitMs = Math.max(1, Math.min(expiresAt, nextEnd) - now);
      await new Promise((resolve) => {
        let timer;
        const wake = () => {
          clearTimeout(timer);
          this.#stateWaiters.delete(wake);
          resolve();
        };
        this.#stateWaiters.add(wake);
        timer = setTimeout(wake, waitMs);
      });
    }
  }

  #wakeStateWaiters() {
    for (const wake of this.#stateWaiters) wake();
  }
}

const FATAL_DISCONNECTS = new Set([401, 403, 411, 440, 463, 500]);

export function disconnectCode(error) {
  return (
    error?.output?.statusCode ??
    error?.data?.statusCode ??
    error?.cause?.output?.statusCode ??
    error?.statusCode ??
    error?.code
  );
}

export class ReconnectPolicy {
  #attempt = 0;
  #closes = [];

  constructor({ maxDelayMs = 5 * MINUTE_MS, circuitDelayMs = 30 * MINUTE_MS } = {}) {
    this.maxDelayMs = maxDelayMs;
    this.circuitDelayMs = circuitDelayMs;
  }

  opened() {
    this.#attempt = 0;
  }

  decision(code, now = Date.now()) {
    const numericCode = Number(code);
    if (FATAL_DISCONNECTS.has(numericCode)) {
      return { reconnect: false, fatal: true, code: numericCode };
    }

    this.#closes = this.#closes.filter((at) => at > now - 10 * MINUTE_MS);
    this.#closes.push(now);
    if (this.#closes.length >= 6) {
      return { reconnect: true, fatal: false, circuitOpen: true, delayMs: this.circuitDelayMs };
    }

    if (numericCode === 515) {
      return { reconnect: true, fatal: false, delayMs: randomInt(500, 1_501) };
    }
    const cap = Math.min(this.maxDelayMs, 2_000 * 2 ** Math.min(this.#attempt, 7));
    this.#attempt += 1;
    return { reconnect: true, fatal: false, delayMs: randomInt(250, cap + 1) };
  }
}
