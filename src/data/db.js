import Dexie from 'dexie';

export const db = new Dexie('SocDePobleDB');

db.version(1).stores({
  keyval: 'key' // A simple key-value store for app snapshots and fallback data
});

export async function getVal(key) {
  try {
    const record = await db.keyval.get(key);
    return record ? record.value : null;
  } catch (error) {
    console.error('Dexie getVal error:', error);
    return null;
  }
}

export async function setVal(key, value) {
  try {
    await db.keyval.put({ key, value });
  } catch (error) {
    console.error('Dexie setVal error:', error);
  }
}
