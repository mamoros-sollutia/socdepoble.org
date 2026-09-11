import Dexie from 'dexie';

const isDemoMode = new URLSearchParams(window.location.search).get('mode') === 'demo';
const dbName = isDemoMode ? "GestoriaDePoble_Demo" : "GestoriaDePoble";

export const db = new Dexie(dbName);

// Versió 4 amb esquema de Conciliació i Burocràcia
db.version(4).stores({
  // 'events' és append-only per complir amb VeriFactu. Els updates es fan afegint nous events que anul·len els vells.
  // Indexos: id, domini (owner_scope), data, estat fiscal, regla fiscal
  events: 'id, owner_scope, timestamp, tax_status, tax_rule_id',
  
  // Taula versionada de regles fiscals (mai hardcodejat a la UI)
  tax_rules: 'id, year, type, rate', 
  
  // Taula de Factures Ingerides (Ingressos i Despeses)
  factures: 'id, date_timestamp, type, contact_nif, estat_conciliacio',
  
  // Taula de Llibre Major de Contactes (Clients i Proveïdors)
  contactes: 'nif, nom, tipus',
  
  // Taula d'Arxiu Burocràtic (Suma, Herències)
  documents: 'id, filename, category, status',

  // Metadades generals (últim hash sincronitzat, etc)
  metadata: 'key'
});

console.log(`[Pedra Seca DB] Dexie.js inicialitzada: ${dbName} v4 (Conciliació & Burocràcia Ready)`);
