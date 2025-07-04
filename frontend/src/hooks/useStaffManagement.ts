import { useState, useEffect } from 'react';
import { StaffMember, getStoreStaff, addStaff, removeStaff } from '@/lib/store-info';

export function useStaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);

  // Load staff on mount
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading staff...');
      
      const staffData = await getStoreStaff();
      console.log('✅ Staff loaded:', staffData);
      
      // Map the backend response to our frontend interface
      const mappedStaff = staffData.map((member: any) => ({
        id: member.id,
        name: member.name || '',
        email: member.email || '',
        gender: member.gender || 'Male',
        phone: member.phone || '',
        role: member.role || 'Staff',
        storeId: member.storeId
      }));
      
      setStaff(mappedStaff);
    } catch (err) {
      console.error('❌ Failed to load staff:', err);
      setError(err instanceof Error ? err.message : 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const addStaffMember = async (staffData: Omit<StaffMember, 'id'>) => {
    try {
      setAdding(true);
      setError(null);
      console.log('🔄 Adding staff member...', staffData);
      
      const newStaffMember = await addStaff(staffData);
      console.log('✅ Staff member added:', newStaffMember);
      
      // Map the response to our interface
      const mappedStaffMember: StaffMember = {
        id: newStaffMember.id,
        name: newStaffMember.name || staffData.name,
        email: newStaffMember.email || staffData.email,
        gender: newStaffMember.gender || staffData.gender,
        phone: newStaffMember.phone || staffData.phone,
        role: newStaffMember.role || staffData.role || 'Staff',
        storeId: newStaffMember.storeId
      };
      
      setStaff(prev => [...prev, mappedStaffMember]);
      return mappedStaffMember;
    } catch (err) {
      console.error('❌ Failed to add staff member:', err);
      setError(err instanceof Error ? err.message : 'Failed to add staff member');
      throw err;
    } finally {
      setAdding(false);
    }
  };

  const removeStaffMember = async (staffId: number) => {
    try {
      setRemoving(true);
      setError(null);
      console.log('🔄 Removing staff member...', staffId);
      
      await removeStaff(staffId);
      console.log('✅ Staff member removed:', staffId);
      
      setStaff(prev => prev.filter(member => member.id !== staffId));
    } catch (err) {
      console.error('❌ Failed to remove staff member:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove staff member');
      throw err;
    } finally {
      setRemoving(false);
    }
  };

  const refreshStaff = () => {
    loadStaff();
  };

  return {
    staff,
    loading,
    error,
    adding,
    removing,
    addStaffMember,
    removeStaffMember,
    refreshStaff,
  };
} 