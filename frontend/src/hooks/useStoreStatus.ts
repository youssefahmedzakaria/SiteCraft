import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useStoreStatus() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const isInactive = user?.storeStatus === 'inactive' || (user?.storeId && user?.role === 'owner' && user?.storeStatus === null);
  
  useEffect(() => {
    if (isAuthenticated && isInactive) {
      console.log('🔒 Store is inactive, redirecting to pricing');
      router.push('/pricing');
    }
  }, [isAuthenticated, isInactive, router]);

  return {
    isInactive,
    hasStore: user?.storeId && user?.role === 'owner',
    storeStatus: user?.storeStatus
  };
} 