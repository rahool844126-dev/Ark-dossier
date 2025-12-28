
import { TamedCreature } from '../types';
import { initDB, STORES, clearStore } from './db';

// A simple UUID generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getTames = async (): Promise<TamedCreature[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORES.TAMES, 'readonly');
    const store = transaction.objectStore(STORES.TAMES);
    const request = store.getAll();
    return new Promise((resolve, reject) => {
        request.onerror = () => {
          console.error("Failed to get tames from IndexedDB", request.error);
          reject(request.error)
        };
        request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error("Failed to open DB for getTames", error);
    return [];
  }
};

export const addTame = async (newTame: Omit<TamedCreature, 'id'>): Promise<TamedCreature> => {
  const tameWithId = { ...newTame, id: generateUUID() };
  const db = await initDB();
  const transaction = db.transaction(STORES.TAMES, 'readwrite');
  const store = transaction.objectStore(STORES.TAMES);
  const request = store.add(tameWithId);
  return new Promise((resolve, reject) => {
      request.onerror = () => {
        console.error("Failed to add tame to IndexedDB", request.error);
        reject(request.error)
      };
      request.onsuccess = () => resolve(tameWithId);
  });
};

export const updateTame = async (updatedTame: TamedCreature): Promise<TamedCreature> => {
  const db = await initDB();
  const transaction = db.transaction(STORES.TAMES, 'readwrite');
  const store = transaction.objectStore(STORES.TAMES);
  const request = store.put(updatedTame);
  return new Promise((resolve, reject) => {
      request.onerror = () => {
        console.error("Failed to update tame in IndexedDB", request.error);
        reject(request.error)
      };
      request.onsuccess = () => resolve(updatedTame);
  });
};

export const removeTame = async (tameId: string): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORES.TAMES, 'readwrite');
  const store = transaction.objectStore(STORES.TAMES);
  const request = store.delete(tameId);
   return new Promise<void>((resolve, reject) => {
      request.onerror = () => {
        console.error("Failed to remove tame from IndexedDB", request.error);
        reject(request.error)
      };
      request.onsuccess = () => resolve();
  });
};

export const clearAllTames = (): Promise<void> => {
    return clearStore(STORES.TAMES);
};
