import { siteCraftCache } from './cache';

// Authentication API utilities for SiteCraft admin/store owner

export async function login(email: string, password: string) {
  console.log('🔐 Logging in...', { email, password });
  const res = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  console.log('🔐 Login response status:', res.status);
  console.log('🔐 Login response ok:', res.ok);
  if (!res.ok) {
    let msg = 'Login failed';
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
    } catch {
      // If response is not JSON, try to get text
      try {
        msg = await res.text() || msg;
      } catch {
        // Keep default message
      }
    }
    throw new Error(msg);
  }
  return true;
}

export async function logout() {
  console.log('🔐 Logging out...');
  const res = await fetch('http://localhost:8080/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    console.log('❌ Logout failed');
    throw new Error('Failed to logout');
  }
  console.log('✅ Logged out successfully!');
  return true;
}

export async function getSession() {
  console.log('🔐 Getting session from backend...');
  const res = await fetch('http://localhost:8080/auth/getSession', {
    credentials: 'include',
  });
  console.log('📡 getSession response status:', res.status);
  console.log('📡 getSession response ok:', res.ok);
  
  if (!res.ok) {
    console.log('❌ getSession failed');
    return null;
  }
  
  const sessionData = await res.json();
  console.log('✅ getSession successful, data:', sessionData);
  return sessionData;
}

export async function setSession(userId: number, storeId: number | null, role?: string | null) {
  console.log('🔐 Setting session...', { userId, storeId, role });
  
  const res = await fetch('http://localhost:8080/auth/setSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ userId, storeId, role }),
  });
  
  console.log('📡 Set session response status:', res.status);
  console.log('📡 Set session response ok:', res.ok);
  
  if (!res.ok) {
    console.log('❌ Failed to set session');
    throw new Error('Failed to set session');
  }
  
  console.log('✅ Session set successfully!');
  return true;
}

export async function register(user: { email: string, password: string, name?: string, phone?: string, gender?: string }) {
  console.log('🚀 Starting registration process...', { email: user.email, name: user.name });
  
  const requestBody = JSON.stringify(user);
  console.log('📤 Sending request body:', requestBody);
  
  const res = await fetch('http://localhost:8080/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: requestBody,
  });
  
  console.log('📡 Registration response status:', res.status);
  console.log('📡 Registration response ok:', res.ok);
  
  if (!res.ok) {
    let msg = 'Registration failed';
    const responseClone = res.clone();
    
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
      console.log('❌ Registration error response:', data);
    } catch (jsonError) {
      try {
        const textResponse = await responseClone.text();
        msg = textResponse || msg;
        console.log('❌ Registration error text:', textResponse);
      } catch (textError) {
        console.log('❌ Registration failed with unknown error');
        console.log('❌ JSON parse error:', jsonError);
        console.log('❌ Text parse error:', textError);
      }
    }
    throw new Error(msg);
  }
  
  const data = await res.json();
  console.log('✅ Registration successful! Response data:', data);
  console.log('👤 User ID from response:', data.userId);
  console.log('🏪 Store ID from response:', data.storeId);
  console.log('👑 Role from response:', data.role);
  
  // Return the complete response data including userId, storeId, and role
  return {
    userId: data.userId,
    storeId: data.storeId,
    role: data.role
  };
}

export async function sendForgotPasswordOTP(email: string) {
  console.log('📧 Sending forgot password OTP to:', email);
  
  const res = await fetch('http://localhost:8080/auth/forgotPassword/sendOTP', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });
  
  console.log('📡 Send OTP response status:', res.status);
  console.log('📡 Send OTP response ok:', res.ok);
  
  if (!res.ok) {
    let msg = 'Failed to send OTP';
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
      console.log('❌ Send OTP error response:', data);
    } catch {
      try {
        msg = await res.text() || msg;
        console.log('❌ Send OTP error text:', msg);
      } catch {
        console.log('❌ Send OTP failed with unknown error');
      }
    }
    throw new Error(msg);
  }
  
  console.log('✅ OTP sent successfully!');
  return true;
}

export async function verifyForgotPasswordOTP(email: string, otp: string) {
  console.log('🔐 Verifying OTP for:', email);
  
  const res = await fetch('http://localhost:8080/auth/forgotPassword/verifyOTP', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, otp }),
  });
  
  console.log('📡 Verify OTP response status:', res.status);
  console.log('📡 Verify OTP response ok:', res.ok);
  
  if (!res.ok) {
    let msg = 'Failed to verify OTP';
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
      console.log('❌ Verify OTP error response:', data);
    } catch {
      try {
        msg = await res.text() || msg;
        console.log('❌ Verify OTP error text:', msg);
      } catch {
        console.log('❌ Verify OTP failed with unknown error');
      }
    }
    throw new Error(msg);
  }
  
  console.log('✅ OTP verified successfully!');
  return true;
}

export async function resetForgotPassword(email: string, newPassword: string) {
  console.log('🔐 Resetting password for:', email);
  
  const res = await fetch('http://localhost:8080/auth/forgotPassword/resetPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, newPassword }),
  });
  
  console.log('📡 Reset password response status:', res.status);
  console.log('📡 Reset password response ok:', res.ok);
  
  if (!res.ok) {
    let msg = 'Failed to reset password';
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
      console.log('❌ Reset password error response:', data);
    } catch {
      try {
        msg = await res.text() || msg;
        console.log('❌ Reset password error text:', msg);
      } catch {
        console.log('❌ Reset password failed with unknown error');
      }
    }
    throw new Error(msg);
  }
  
  console.log('✅ Password reset successfully!');
  return true;
}

export async function createStore(storeData: {
  storeName: string;
  storeType: string;
  description?: string;
  phoneNumber?: string;
  emailAddress?: string;
  address?: string;
  addressLink?: string;
  openingHours?: string;
  logo?: File;
}, userId: number) {
  const formData = new FormData();
  
  // Add store data as JSON
  const storeJson = JSON.stringify({
    storeName: storeData.storeName,
    storeType: storeData.storeType,
    description: storeData.description || '',
    phoneNumber: storeData.phoneNumber || '',
    emailAddress: storeData.emailAddress || '',
    address: storeData.address || '',
    addressLink: storeData.addressLink || '',
    openingHours: storeData.openingHours || ''
  });
  
  formData.append('store', storeJson);
  
  // Add logo if provided
  if (storeData.logo) {
    formData.append('logo', storeData.logo);
  }
  
  // Use the existing endpoint with userId as path parameter
  const url = `http://localhost:8080/api/store/${userId}`;
  
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  
  if (!res.ok) {
    let msg = 'Failed to create store';
    try { 
      const data = await res.json();
      msg = data.message || data || msg; 
    } catch {
      try {
        msg = await res.text() || msg;
      } catch {
        // Keep default message
      }
    }
    throw new Error(msg);
  }
  
  return res.json();
}

export async function commitCachedRegistration(cachedData: {
  user: { email: string; password: string; name: string; phone: string; gender: string };
  store: { storeName: string; storeType: string; description?: string; phoneNumber?: string; emailAddress?: string; address?: string; addressLink?: string; openingHours?: string; colors?: { primary: string; secondary: string; accent: string } };
  template: { id: string; title: string };
}) {
  console.log('🚀 Committing cached registration data...', cachedData);
  
  const formData = new FormData();
  
  // Add all data as JSON
  const registrationData = {
    user: cachedData.user,
    store: {
      storeName: cachedData.store.storeName,
      storeType: cachedData.store.storeType,
      description: cachedData.store.description || '',
      phoneNumber: cachedData.store.phoneNumber || '',
      emailAddress: cachedData.store.emailAddress || '',
      address: cachedData.store.address || '',
      addressLink: cachedData.store.addressLink || '',
      openingHours: cachedData.store.openingHours || '',
      colors: cachedData.store.colors || { primary: '#000000', secondary: '#ffffff', accent: '#ff6b6b' }
    }
  };
  
  formData.append('registrationData', JSON.stringify(registrationData));
  
  // Get the cached logo file from the cache
  const cachedLogoFile = siteCraftCache.getCachedLogoFile();
  if (cachedLogoFile) {
    console.log('🖼️ Adding cached logo file to commit:', cachedLogoFile.name);
    formData.append('logo', cachedLogoFile);
  } else {
    console.log('ℹ️ No logo file found in cache');
  }
  
  try {
    const response = await fetch('http://localhost:8080/auth/commitRegistration', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Commit registration error response:', errorData);
      throw new Error(errorData.message || 'Failed to commit registration');
    }
    
    const result = await response.json();
    console.log('✅ Registration committed successfully:', result);
    
    // Clear the cache after successful commit
    siteCraftCache.clearCache();
    
    return result;
    
  } catch (error) {
    console.error('❌ Error committing registration:', error);
    throw error;
  }
}