export interface Policy {
    id: string;
    title: string;
    content: string;
    lastUpdated: string;
    status: 'Active' | 'Draft';
  }
  
  export interface AboutSection {
    id: string;
    title: string;
    content: string;
    type: 'Text' | 'Image' | 'Mission' | 'Team' | 'History';
    status: 'Visible' | 'Hidden';
  }

  // Store interface for API integration
  export interface Store {
    id?: number;
    storeName: string;
    storeType?: string;
    logo?: string;
    description?: string;
    phoneNumber?: string;
    emailAddress?: string;
    address?: string;
    addressLink?: string;
    openingHours?: string;
    subdomain?: string;
    socialMediaAccounts?: SocialMedia[];
  }

  export interface SocialMedia {
    id?: number;
    platform: string;
    url: string;
  }

  // Staff member interface for API integration
  export interface StaffMember {
    id?: number;
    name: string;
    email: string;
    gender: 'Male' | 'Female';
    phone: string;
    role?: string;
    storeId?: number;
  }

  // Store API functions
  export async function getStoreSettings() {
    console.log('🏪 Getting store settings...');
    
    const res = await fetch('http://localhost:8080/api/store/getStoreSettings', {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('📡 Get store settings response status:', res.status);
    console.log('📡 Get store settings response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to get store settings';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Get store settings error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Get store settings error text:', msg);
        } catch {
          console.log('❌ Get store settings failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Store settings retrieved successfully!', data);
    return data.store;
  }

  export async function updateStoreInfo(storeData: Partial<Store>, logo?: File) {
    console.log('🏪 Updating store info...', { storeData, logo });
    
    const formData = new FormData();
    formData.append('store', JSON.stringify(storeData));
    
    if (logo) {
      formData.append('logo', logo);
    }
    
    const res = await fetch('http://localhost:8080/api/store/updateStoreInfo', {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
    
    console.log('📡 Update store info response status:', res.status);
    console.log('📡 Update store info response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to update store info';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Update store info error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Update store info error text:', msg);
        } catch {
          console.log('❌ Update store info failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Store info updated successfully!', data);
    return data.store;
  }

  // Staff Management API functions
  export async function getStoreStaff() {
    console.log('👥 Getting store staff...');
    
    const res = await fetch('http://localhost:8080/api/store/getStoreStaff', {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('📡 Get store staff response status:', res.status);
    console.log('📡 Get store staff response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to get store staff';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Get store staff error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Get store staff error text:', msg);
        } catch {
          console.log('❌ Get store staff failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Store staff retrieved successfully!', data);
    return data.staffMembers;
  }

  export async function addStaff(staffData: Omit<StaffMember, 'id'>) {
    console.log('👥 Adding staff member...', staffData);
    
    const res = await fetch('http://localhost:8080/api/store/addStaff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(staffData),
    });
    
    console.log('📡 Add staff response status:', res.status);
    console.log('📡 Add staff response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to add staff member';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Add staff error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Add staff error text:', msg);
        } catch {
          console.log('❌ Add staff failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Staff member added successfully!', data);
    return data.staffMember;
  }

  export async function removeStaff(staffId: number) {
    console.log('👥 Removing staff member...', staffId);
    
    const res = await fetch(`http://localhost:8080/api/store/removeStaff/${staffId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    console.log('📡 Remove staff response status:', res.status);
    console.log('📡 Remove staff response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to remove staff member';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Remove staff error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Remove staff error text:', msg);
        } catch {
          console.log('❌ Remove staff failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    console.log('✅ Staff member removed successfully!');
    return true;
  }
  
  // Sample policies data
  export const policies: Policy[] = [
    {
      id: "POL-001",
      title: "Return Policy",
      content: "We offer a 30-day return policy for all unused and unopened items. Please contact our customer service team to initiate a return.",
      lastUpdated: "2025-03-15",
      status: "Active"
    },
    {
      id: "POL-002",
      title: "Shipping Policy",
      content: "Orders are typically processed within 1-2 business days. Standard shipping takes 3-5 business days. Express shipping options are available at checkout.",
      lastUpdated: "2025-03-10",
      status: "Active"
    },
    {
      id: "POL-003",
      title: "Privacy Policy",
      content: "We respect your privacy and are committed to protecting your personal information. Please review our full privacy policy for details on how we collect and use your data.",
      lastUpdated: "2025-02-28",
      status: "Active"
    },
    {
      id: "POL-004",
      title: "Terms of Service",
      content: "By using our website and services, you agree to comply with our terms of service. Please read the full terms for details on acceptable use and limitations.",
      lastUpdated: "2025-01-20",
      status: "Active"
    },
    {
      id: "POL-005",
      title: "Cookie Policy",
      content: "We use cookies to enhance your browsing experience. This policy explains how we use cookies and similar technologies.",
      lastUpdated: "2025-04-01",
      status: "Draft"
    }
  ];
  
  // Sample about sections data
  export const aboutSections: AboutSection[] = [
    {
      id: "ABOUT-001",
      title: "Our Story",
      content: "Founded in 2020, SiteCraft began with a simple mission: to help small businesses establish a powerful online presence without the complexity and high costs typically associated with web development.",
      type: "History",
      status: "Visible"
    },
    {
      id: "ABOUT-002",
      title: "Our Mission",
      content: "We're dedicated to democratizing web development by providing intuitive, powerful tools that enable businesses of all sizes to create professional websites that drive growth.",
      type: "Mission",
      status: "Visible"
    },
    {
      id: "ABOUT-003",
      title: "Meet Our Team",
      content: "Our diverse team of developers, designers, and customer success specialists work together to ensure you have the best experience building your online presence.",
      type: "Team",
      status: "Visible"
    },
    {
      id: "ABOUT-004",
      title: "Company Values",
      content: "Innovation, accessibility, and customer satisfaction form the core values that drive everything we do at SiteCraft.",
      type: "Text",
      status: "Hidden"
    },
    {
      id: "ABOUT-005",
      title: "Office Location",
      content: "Our headquarters are located in the heart of the tech district in San Francisco, with satellite offices in New York, London, and Singapore.",
      type: "Text",
      status: "Visible"
    }
  ];