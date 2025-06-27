import { useState, useEffect } from 'react';
import { Store, getStoreSettings, updateStoreInfo } from '@/lib/store-info';

export function useStoreSettings() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Load store settings on mount
  useEffect(() => {
    loadStoreSettings();
  }, []);

  const loadStoreSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading store settings...');
      
      const storeData = await getStoreSettings();
      console.log('✅ Store settings loaded:', storeData);
      
      setStore(storeData);
    } catch (err) {
      console.error('❌ Failed to load store settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  const updateStore = async (storeData: Partial<Store>, logo?: File) => {
    try {
      setUpdating(true);
      setError(null);
      console.log('🔄 Updating store info...', storeData);
      
      const updatedStore = await updateStoreInfo(storeData, logo);
      console.log('✅ Store info updated:', updatedStore);
      
      setStore(updatedStore);
      return updatedStore;
    } catch (err) {
      console.error('❌ Failed to update store info:', err);
      setError(err instanceof Error ? err.message : 'Failed to update store info');
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const refreshStore = () => {
    loadStoreSettings();
  };

  return {
    store,
    loading,
    error,
    updating,
    updateStore,
    refreshStore,
  };
} 