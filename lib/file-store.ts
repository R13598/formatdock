// lib/file-store.ts
const DB_NAME = 'FormatDock_FileStore';
const STORE_NAME = 'pending_files';
const FILE_KEY = 'current_dropped_file';

// Opens the browser's built-in client-side database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject('Browser IndexedDB not supported');
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores the dropped File locally in browser memory before navigating
 */
export async function setPendingFile(file: File): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(file, FILE_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save file in local browser storage:', err);
  }
}

/**
 * Retrieves and clears the stored File when the target tool mounts
 */
export async function getAndClearPendingFile(): Promise<File | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(FILE_KEY);

      req.onsuccess = () => {
        const file = req.result as File | undefined;
        if (file) {
          // Delete file immediately after reading so reloads start fresh
          store.delete(FILE_KEY);
          resolve(file);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to retrieve file from local browser storage:', err);
    return null;
  }
}