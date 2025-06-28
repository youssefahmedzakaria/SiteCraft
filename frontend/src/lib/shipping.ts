export interface ShippingInfo {
  id?: number;
  governmentName: string;
  shippingPrice: number;
  estimatedDeliveryTime: string;
  storeId?: number;
}

// API functions for shipping info
export async function getStoreShippingInfo() {
  console.log('🚚 Getting store shipping info...');
  
  const res = await fetch('http://localhost:8080/api/store/getAllShippingInfo', {
    method: 'GET',
    credentials: 'include',
  });
  
  console.log('📡 Get shipping info response status:', res.status);
  console.log('📡 Get shipping info response ok:', res.ok);
  
  if (!res.ok) {
    let msg = 'Failed to get shipping info';
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
      console.log('❌ Get shipping info error response:', data);
    } catch {
      try {
        msg = await res.text() || msg;
        console.log('❌ Get shipping info error text:', msg);
      } catch {
        console.log('❌ Get shipping info failed with unknown error');
      }
    }
    throw new Error(msg);
  }
  
  const data = await res.json();
  console.log('✅ Shipping info retrieved successfully!', data);
  return data['Shipping Info'] || [];
}

export async function addShippingInfo(shippingData: Omit<ShippingInfo, 'id'>) {
  console.log('🚚 Adding shipping info...', shippingData);
  
  const res = await fetch('http://localhost:8080/api/store/addShippingInfo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(shippingData),
  });
  
  console.log('📡 Add shipping info response status:', res.status);
  console.log('📡 Add shipping info response ok:', res.ok);
  
  if (!res.ok) {
    let msg = 'Failed to add shipping info';
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
      console.log('❌ Add shipping info error response:', data);
    } catch {
      try {
        msg = await res.text() || msg;
        console.log('❌ Add shipping info error text:', msg);
      } catch {
        console.log('❌ Add shipping info failed with unknown error');
      }
    }
    throw new Error(msg);
  }
  
  const data = await res.json();
  console.log('✅ Shipping info added successfully!', data);
  return data.shippingInfo;
}

export async function updateShippingInfo(id: number, shippingData: Partial<ShippingInfo>) {
  console.log('🚚 Updating shipping info...', { id, shippingData });
  
  const res = await fetch(`http://localhost:8080/api/store/updateShippingInfo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(shippingData),
  });
  
  console.log('📡 Update shipping info response status:', res.status);
  console.log('📡 Update shipping info response ok:', res.ok);
  
  if (!res.ok) {
    let msg = 'Failed to update shipping info';
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
      console.log('❌ Update shipping info error response:', data);
    } catch {
      try {
        msg = await res.text() || msg;
        console.log('❌ Update shipping info error text:', msg);
      } catch {
        console.log('❌ Update shipping info failed with unknown error');
      }
    }
    throw new Error(msg);
  }
  
  const data = await res.json();
  console.log('✅ Shipping info updated successfully!', data);
  return data;
}

export async function deleteShippingInfo(id: number) {
  console.log('🚚 Deleting shipping info...', id);
  
  const res = await fetch(`http://localhost:8080/api/store/deleteShippingInfo/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  console.log('📡 Delete shipping info response status:', res.status);
  console.log('📡 Delete shipping info response ok:', res.ok);
  
  if (!res.ok) {
    let msg = 'Failed to delete shipping info';
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
      console.log('❌ Delete shipping info error response:', data);
    } catch {
      try {
        msg = await res.text() || msg;
        console.log('❌ Delete shipping info error text:', msg);
      } catch {
        console.log('❌ Delete shipping info failed with unknown error');
      }
    }
    throw new Error(msg);
  }
  
  const data = await res.json();
  console.log('✅ Shipping info deleted successfully!', data);
  return data;
}

// Legacy interface for backward compatibility
export interface Shipping {
    id: string
    governorate: string
    price: string
    estimatedDeliveryDays: string
}

export const shippings: Shipping[] = [
    {
        id: '1',
        governorate: 'Cairo',
        price: "50",
        estimatedDeliveryDays: '1-2 Days',
    },
    {
        id: '2',
        governorate: 'Alexandria',
        price: "100",
        estimatedDeliveryDays: '3-4 Days',
    },
    {
        id: '3',
        governorate: 'Aswan',
        price: "150",
        estimatedDeliveryDays: '5-6 Days',
    },
]