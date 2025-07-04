import { useState, useEffect, useCallback } from 'react';
import { 
  Policy, 
  AboutSection, 
  getStorePolicies, 
  getStoreAboutUsList,
  addPolicy,
  updatePolicy,
  deletePolicy,
  addAboutUs,
  updateAboutUs,
  deleteAboutUs
} from '@/lib/store-info';

export function useStoreInfo() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [policiesLoading, setPoliciesLoading] = useState(false);
  const [aboutLoading, setAboutLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Load all store info on mount
  useEffect(() => {
    loadStoreInfo();
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔄 Policies state updated:', policies);
  }, [policies]);

  useEffect(() => {
    console.log('🔄 About sections state updated:', aboutSections);
  }, [aboutSections]);

  const loadStoreInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading store info (policies and about us)...');
      
      // Load policies and about us in parallel
      const [policiesData, aboutUsData] = await Promise.all([
        getStorePolicies(),
        getStoreAboutUsList()
      ]);
      
      console.log('✅ Store info loaded successfully:', { 
        policiesCount: policiesData.length, 
        aboutUsCount: aboutUsData.length 
      });
      
      setPolicies(policiesData);
      setAboutSections(aboutUsData);
    } catch (err) {
      console.error('❌ Failed to load store info:', err);
      setError(err instanceof Error ? err.message : 'Failed to load store info');
    } finally {
      setLoading(false);
    }
  };

  // Policy management functions
  const addNewPolicy = async (policyData: Omit<Policy, 'id'>) => {
    try {
      setPoliciesLoading(true);
      setError(null);
      console.log('🔄 Adding new policy...', policyData);
      
      const newPolicy = await addPolicy(policyData);
      console.log('✅ Policy added successfully:', newPolicy);
      
      setPolicies(prev => [...prev, newPolicy]);
      setForceUpdate(prev => prev + 1);
      return newPolicy;
    } catch (err) {
      console.error('❌ Failed to add policy:', err);
      setError(err instanceof Error ? err.message : 'Failed to add policy');
      throw err;
    } finally {
      setPoliciesLoading(false);
    }
  };

  const updateExistingPolicy = async (policyId: number, policyData: Partial<Policy>) => {
    try {
      setPoliciesLoading(true);
      setError(null);
      console.log('🔄 Updating policy...', { policyId, policyData });
      
      await updatePolicy(policyId, policyData);
      console.log('✅ Policy updated successfully');
      
      setPolicies(prev => prev.map(policy => 
        policy.id === policyId ? { ...policy, ...policyData } : policy
      ));
      setForceUpdate(prev => prev + 1);
    } catch (err) {
      console.error('❌ Failed to update policy:', err);
      setError(err instanceof Error ? err.message : 'Failed to update policy');
      throw err;
    } finally {
      setPoliciesLoading(false);
    }
  };

  const removePolicy = async (policyId: number) => {
    try {
      setPoliciesLoading(true);
      setError(null);
      console.log('🔄 Deleting policy...', policyId);
      console.log('📊 Current policies before deletion:', policies);
      
      await deletePolicy(policyId);
      console.log('✅ Policy deleted successfully');
      
      // Update state with explicit new array
      setPolicies(currentPolicies => {
        const newPolicies = currentPolicies.filter(policy => policy.id !== policyId);
        console.log('📊 Policies after deletion:', newPolicies);
        return newPolicies;
      });
      
      // Force a re-render
      setForceUpdate(prev => prev + 1);
      
    } catch (err) {
      console.error('❌ Failed to delete policy:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete policy');
      throw err;
    } finally {
      setPoliciesLoading(false);
    }
  };

  // About Us management functions
  const addNewAboutUs = async (aboutUsData: Omit<AboutSection, 'id'>) => {
    try {
      setAboutLoading(true);
      setError(null);
      console.log('🔄 Adding new about us section...', aboutUsData);
      
      const newAboutUs = await addAboutUs(aboutUsData);
      console.log('✅ About us section added successfully:', newAboutUs);
      
      setAboutSections(prev => [...prev, newAboutUs]);
      setForceUpdate(prev => prev + 1);
      return newAboutUs;
    } catch (err) {
      console.error('❌ Failed to add about us section:', err);
      setError(err instanceof Error ? err.message : 'Failed to add about us section');
      throw err;
    } finally {
      setAboutLoading(false);
    }
  };

  const updateExistingAboutUs = async (id: number, aboutUsData: Partial<AboutSection>) => {
    try {
      setAboutLoading(true);
      setError(null);
      console.log('🔄 Updating about us section...', { id, aboutUsData });
      
      await updateAboutUs(id, aboutUsData);
      console.log('✅ About us section updated successfully');
      
      setAboutSections(prev => prev.map(section => 
        section.id === id ? { ...section, ...aboutUsData } : section
      ));
      setForceUpdate(prev => prev + 1);
    } catch (err) {
      console.error('❌ Failed to update about us section:', err);
      setError(err instanceof Error ? err.message : 'Failed to update about us section');
      throw err;
    } finally {
      setAboutLoading(false);
    }
  };

  const removeAboutUs = async (id: number) => {
    try {
      setAboutLoading(true);
      setError(null);
      console.log('🔄 Deleting about us section...', id);
      console.log('📊 Current about sections before deletion:', aboutSections);
      
      await deleteAboutUs(id);
      console.log('✅ About us section deleted successfully');
      
      // Update state with explicit new array
      setAboutSections(currentSections => {
        const newAboutSections = currentSections.filter(section => section.id !== id);
        console.log('📊 About sections after deletion:', newAboutSections);
        return newAboutSections;
      });
      
      // Force a re-render
      setForceUpdate(prev => prev + 1);
      
    } catch (err) {
      console.error('❌ Failed to delete about us section:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete about us section');
      throw err;
    } finally {
      setAboutLoading(false);
    }
  };

  const refreshStoreInfo = useCallback(() => {
    loadStoreInfo();
  }, []);

  return {
    // Data
    policies,
    aboutSections,
    
    // Loading states
    loading,
    policiesLoading,
    aboutLoading,
    
    // Error state
    error,
    
    // Policy functions
    addNewPolicy,
    updateExistingPolicy,
    removePolicy,
    
    // About Us functions
    addNewAboutUs,
    updateExistingAboutUs,
    removeAboutUs,
    
    // Utility functions
    refreshStoreInfo,
    
    // Force update for debugging
    forceUpdate,
  };
} 