import { openDB } from 'idb';

const DB_NAME = 'nodesphere-db';
const STORE = 'maps';

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'mapId' });
      }
    }
  });
}

export async function saveMap(map: any) {
  const db = await initDB();
  await db.put(STORE, map);
}

export async function loadMap(mapId: string) {
  const db = await initDB();
  return db.get(STORE, mapId);
}
