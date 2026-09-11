/** forma.mjs — Anonimització per tipus: vegeu captura-contracte.mjs. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function forma(v) {
  if (Array.isArray(v)) return v.slice(0, 2).map(forma);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, forma(x)]));
  if (typeof v === 'string') {
    if (UUID.test(v)) return '00000000-0000-0000-0000-000000000000';
    if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(v) && !Number.isNaN(Date.parse(v))) return '1970-01-01T00:00:00.000Z';
    if (/^[^@\s]+@[^@\s]+$/.test(v)) return 'anonim@exemple.invalid';
    if (/^https?:\/\//.test(v)) return 'https://exemple.invalid/';
    return 'text';
  }
  if (typeof v === 'number') return 0;
  return v; // boolean o null: no identifiquen ningú i en canvien la forma
}

