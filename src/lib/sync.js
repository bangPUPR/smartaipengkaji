/**
 * Offline Sync Utility (IndexedDB)
 * Handles local storage of inspection drafts when offline.
 */

const DB_NAME = 'SmartAISyncDB';
const DB_VERSION = 1;
const STORE_NAME = 'checklist_drafts';

/**
 * Initialize IndexedDB
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // keyPath is a combination of proyek_id and kode to ensure uniqueness
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Save checklist items to local draft
 * @param {Array} items - List of checklist items
 */
export async function saveOfflineDrafts(items) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  
  for (const item of items) {
    // Generate unique ID for IndexedDB
    const draft = { ...item, id: `${item.proyek_id}_${item.kode}` };
    store.put(draft);
  }
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get all pending drafts
 */
export async function getPendingDrafts() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear specific drafts after successful sync
 * @param {Array} ids - List of draft IDs (proyek_id_kode)
 */
export async function clearSyncedDrafts(ids) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  
  for (const id of ids) {
    store.delete(id);
  }
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Check if there are any pending drafts
 */
export async function hasPendingDrafts() {
  const drafts = await getPendingDrafts();
  return drafts.length > 0;
}
