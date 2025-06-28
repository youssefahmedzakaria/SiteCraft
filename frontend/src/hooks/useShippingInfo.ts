import { useState, useEffect, useCallback } from 'react';
import { 
  ShippingInfo, 
  getStoreShippingInfo, 
  addShippingInfo,
  updateShippingInfo,
  deleteShippingInfo
} from '@/lib/shipping';

export function useShippingInfo() {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Load shipping info on mount
  useEffect(() => {
    loadShippingInfo();
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔄 Shipping info state updated:', shippingInfo);
  }, [shippingInfo]);

  const loadShippingInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading shipping info...');
      
      const shippingData = await getStoreShippingInfo();
      
      console.log('✅ Shipping info loaded successfully:', { 
        shippingCount: shippingData.length
      });
      
      setShippingInfo(shippingData);
    } catch (err) {
      console.error('❌ Failed to load shipping info:', err);
      setError(err instanceof Error ? err.message : 'Failed to load shipping info');
    } finally {
      setLoading(false);
    }
  };

  // Shipping info management functions
  const addNewShippingInfo = async (shippingData: Omit<ShippingInfo, 'id'>) => {
    try {
      setShippingLoading(true);
      setError(null);
      console.log('🔄 Adding new shipping info...', shippingData);
      
      const newShippingInfo = await addShippingInfo(shippingData);
      console.log('✅ Shipping info added successfully:', newShippingInfo);
      
      setShippingInfo(prev => [...prev, newShippingInfo]);
      setForceUpdate(prev => prev + 1);
      return newShippingInfo;
    } catch (err) {
      console.error('❌ Failed to add shipping info:', err);
      setError(err instanceof Error ? err.message : 'Failed to add shipping info');
      throw err;
    } finally {
      setShippingLoading(false);
    }
  };

  const updateExistingShippingInfo = async (id: number, shippingData: Partial<ShippingInfo>) => {
    try {
      setShippingLoading(true);
      setError(null);
      console.log('🔄 Updating shipping info...', { id, shippingData });
      
      await updateShippingInfo(id, shippingData);
      console.log('✅ Shipping info updated successfully');
      
      setShippingInfo(prev => prev.map(info => 
        info.id === id ? { ...info, ...shippingData } : info
      ));
      setForceUpdate(prev => prev + 1);
    } catch (err) {
      console.error('❌ Failed to update shipping info:', err);
      setError(err instanceof Error ? err.message : 'Failed to update shipping info');
      throw err;
    } finally {
      setShippingLoading(false);
    }
  };

  const removeShippingInfo = async (id: number) => {
    try {
      setShippingLoading(true);
      setError(null);
      console.log('🔄 Deleting shipping info...', id);
      console.log('📊 Current shipping info before deletion:', shippingInfo);
      
      await deleteShippingInfo(id);
      console.log('✅ Shipping info deleted successfully');
      
      // Update state with explicit new array
      setShippingInfo(currentInfo => {
        const newShippingInfo = currentInfo.filter(info => info.id !== id);
        console.log('📊 Shipping info after deletion:', newShippingInfo);
        return newShippingInfo;
      });
      
      // Force a re-render
      setForceUpdate(prev => prev + 1);
      
    } catch (err) {
      console.error('❌ Failed to delete shipping info:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete shipping info');
      throw err;
    } finally {
      setShippingLoading(false);
    }
  };

  const refreshShippingInfo = useCallback(() => {
    loadShippingInfo();
  }, []);

  return {
    // Data
    shippingInfo,
    
    // Loading states
    loading,
    shippingLoading,
    
    // Error state
    error,
    
    // Shipping info functions
    addNewShippingInfo,
    updateExistingShippingInfo,
    removeShippingInfo,
    
    // Utility functions
    refreshShippingInfo,
    
    // Force update for debugging
    forceUpdate,
  };
} 