import { useState, useEffect } from 'react';
import { openDB, IDBPDatabase } from 'idb';

interface StorageData {
  morningEmojis: (string | null)[];
  middayEmojis: (string | null)[];
  eveningEmojis: (string | null)[];
  homeworkCompleted: boolean;
  lastModified?: number;
}

const DB_NAME = 'emoji-planner';
const STORE_NAME = 'planner-data';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function useOfflineStorage() {
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize database';
        setError(new Error(`Database initialization failed: ${errorMessage}`));
        console.error('Database initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initDB();

    return () => {
      db?.close();
    };
  }, []);

  const retry = async <T>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> => {
    try {
      return await operation();
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return retry(operation, retries - 1);
      }
      throw err;
    }
  };

  const saveData = async (data: StorageData): Promise<boolean> => {
    if (!db) {
      setError(new Error('Database not initialized'));
      return false;
    }

    setIsSaving(true);
    try {
      await retry(async () => {
        const timestamp = Date.now();
        await db.put(STORE_NAME, { ...data, lastModified: timestamp }, 'current');
      });
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(new Error(`Failed to save data: ${errorMessage}`));
      console.error('Save data error:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const loadData = async (): Promise<StorageData | null> => {
    if (!db) {
      setError(new Error('Database not initialized'));
      return null;
    }

    try {
      const data = await retry(async () => {
        return db.get(STORE_NAME, 'current');
      });
      setError(null);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(new Error(`Failed to load data: ${errorMessage}`));
      console.error('Load data error:', err);
      return null;
    }
  };

  return {
    saveData,
    loadData,
    isLoading,
    isSaving,
    error,
  };
}
