import { useState, useEffect } from 'react';
import { openDB, IDBPDatabase } from 'idb';

interface StorageData {
  morningEmojis: (string | null)[];
  middayEmojis: (string | null)[];
  eveningEmojis: (string | null)[];
  homeworkCompleted: boolean;
}

const DB_NAME = 'emoji-planner';
const STORE_NAME = 'planner-data';

export function useOfflineStorage() {
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDB(DB_NAME, 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME);
            }
          },
        });
        setDb(database);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      } finally {
        setIsLoading(false);
      }
    };

    initDB();

    return () => {
      db?.close();
    };
  }, []);

  const saveData = async (data: StorageData) => {
    if (!db) return;
    try {
      const timestamp = Date.now();
      await db.put(STORE_NAME, { ...data, lastModified: timestamp }, 'current');
      
      // Store in pending sync queue if offline
      if (!navigator.onLine) {
        const pendingSync = await db.get(STORE_NAME, 'pendingSync') || [];
        pendingSync.push({ data, timestamp });
        await db.put(STORE_NAME, pendingSync, 'pendingSync');
      }
    } catch (err) {
      console.error('Failed to save data:', err);
    }
  };

  const loadData = async (): Promise<StorageData | null> => {
    if (!db) return null;
    try {
      const data = await db.get(STORE_NAME, 'current');
      
      // If we're back online, process any pending syncs
      if (navigator.onLine) {
        const pendingSync = await db.get(STORE_NAME, 'pendingSync') || [];
        if (pendingSync.length > 0) {
          console.log('Processing pending syncs:', pendingSync.length);
          // Here we would typically sync with a server
          // For now, we'll just clear the pending queue
          await db.delete(STORE_NAME, 'pendingSync');
        }
      }
      
      return data;
    } catch (err) {
      console.error('Failed to load data:', err);
      return null;
    }
  };

  return {
    saveData,
    loadData,
    isLoading,
    error,
  };
}
