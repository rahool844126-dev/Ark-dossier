
import { initDB, STORES, clearStore } from './db';

export const getCustomCreatureImage = (creatureId: string): Promise<string | null> => {
  return new Promise(async (resolve) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORES.IMAGES, 'readonly');
      const store = transaction.objectStore(STORES.IMAGES);
      const request = store.get(creatureId);

      request.onerror = () => {
        console.error("IndexedDB get error:", request.error);
        resolve(null);
      };
      request.onsuccess = () => {
        resolve(request.result ? request.result.image : null);
      };
    } catch (error) {
      console.error("Failed to get image from IndexedDB", error);
      resolve(null);
    }
  });
};

export const saveCustomCreatureImage = (creatureId: string, base64Image: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORES.IMAGES, 'readwrite');
      const store = transaction.objectStore(STORES.IMAGES);
      const request = store.put({ id: creatureId, image: base64Image });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    } catch (error) {
      console.error("Failed to save image to IndexedDB", error);
      reject(error);
    }
  });
};

export const removeCustomCreatureImage = (creatureId: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(STORES.IMAGES, 'readwrite');
      const store = transaction.objectStore(STORES.IMAGES);
      const request = store.delete(creatureId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    } catch (error) {
      console.error("Failed to remove image from IndexedDB", error);
      reject(error);
    }
  });
};

export const clearAllCustomImages = (): Promise<void> => {
    return clearStore(STORES.IMAGES);
};
