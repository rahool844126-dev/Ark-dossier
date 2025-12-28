
const DB_NAME = 'ArkDossierDB';
const DB_VERSION = 2; // Incremented version to add the new store
export const STORES = {
    IMAGES: 'creature_images',
    TAMES: 'tamed_creatures',
};

let dbPromise: Promise<IDBDatabase> | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject('Database error');
      dbPromise = null; // Reset on error
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;

      if (oldVersion < 1) {
        // This is a fresh install or upgrading from a version with no DB
        if (!db.objectStoreNames.contains(STORES.IMAGES)) {
            db.createObjectStore(STORES.IMAGES, { keyPath: 'id' });
        }
      }
      if (oldVersion < 2) {
        // Upgrading from version 1, add the new store
        if (!db.objectStoreNames.contains(STORES.TAMES)) {
            db.createObjectStore(STORES.TAMES, { keyPath: 'id' });
        }
      }
    };
  });
  return dbPromise;
};

export const clearStore = (storeName: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    } catch (error) {
      console.error(`Failed to clear store ${storeName}`, error);
      reject(error);
    }
  });
};
