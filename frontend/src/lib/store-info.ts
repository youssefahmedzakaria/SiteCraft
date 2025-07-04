export interface Policy {
    id?: number;
    title: string;
    description: string;
    status: string;
    storeId?: number;
  }
  
  export interface AboutSection {
    id?: number;
    title: string;
    type: string;
    status: string;
    content: string;
    storeId?: number;
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
  
  // Policy Management API functions
  export async function getStorePolicies() {
    console.log('📋 Getting store policies...');
    
    const res = await fetch('http://localhost:8080/api/store/getStorePolicies', {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('📡 Get store policies response status:', res.status);
    console.log('📡 Get store policies response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to get store policies';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Get store policies error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Get store policies error text:', msg);
        } catch {
          console.log('❌ Get store policies failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Store policies retrieved successfully!', data);
    return data.StorePolicies || [];
  }

  export async function getStorePolicyById(policyId: number) {
    console.log('📋 Getting store policy by ID...', policyId);
    
    const res = await fetch(`http://localhost:8080/api/store/getStorePolicyById/${policyId}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('📡 Get store policy by ID response status:', res.status);
    console.log('📡 Get store policy by ID response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to get store policy';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Get store policy by ID error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Get store policy by ID error text:', msg);
        } catch {
          console.log('❌ Get store policy by ID failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Store policy retrieved successfully!', data);
    return data.Policy;
  }

  export async function addPolicy(policyData: Omit<Policy, 'id'>) {
    console.log('📋 Adding new policy...', policyData);
    
    const res = await fetch('http://localhost:8080/api/store/addPolicy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(policyData),
    });
    
    console.log('📡 Add policy response status:', res.status);
    console.log('📡 Add policy response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to add policy';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Add policy error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Add policy error text:', msg);
        } catch {
          console.log('❌ Add policy failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Policy added successfully!', data);
    return data.policy;
  }

  export async function updatePolicy(policyId: number, policyData: Partial<Policy>) {
    console.log('📋 Updating policy...', { policyId, policyData });
    
    const res = await fetch(`http://localhost:8080/api/store/updatePolicy/${policyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(policyData),
    });
    
    console.log('📡 Update policy response status:', res.status);
    console.log('📡 Update policy response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to update policy';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Update policy error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Update policy error text:', msg);
        } catch {
          console.log('❌ Update policy failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Policy updated successfully!', data);
    return data;
  }

  export async function deletePolicy(policyId: number) {
    console.log('📋 Deleting policy...', policyId);
    
    const res = await fetch(`http://localhost:8080/api/store/deletePolicy/${policyId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    console.log('📡 Delete policy response status:', res.status);
    console.log('📡 Delete policy response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to delete policy';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Delete policy error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Delete policy error text:', msg);
        } catch {
          console.log('❌ Delete policy failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    console.log('✅ Policy deleted successfully!');
    return true;
  }

  // About Us Management API functions
  export async function getStoreAboutUsList() {
    console.log('📄 Getting store about us list...');
    
    const res = await fetch('http://localhost:8080/api/store/getStoreAboutUsList', {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('📡 Get store about us list response status:', res.status);
    console.log('📡 Get store about us list response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to get store about us list';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Get store about us list error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Get store about us list error text:', msg);
        } catch {
          console.log('❌ Get store about us list failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Store about us list retrieved successfully!', data);
    return data.aboutUsList || [];
  }

  export async function getStoreAboutUsById(id: number) {
    console.log('📄 Getting store about us by ID...', id);
    
    const res = await fetch(`http://localhost:8080/api/store/getStoreAboutUsById/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('📡 Get store about us by ID response status:', res.status);
    console.log('📡 Get store about us by ID response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to get store about us';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Get store about us by ID error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Get store about us by ID error text:', msg);
        } catch {
          console.log('❌ Get store about us by ID failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ Store about us retrieved successfully!', data);
    return data.aboutUs;
  }

  export async function addAboutUs(aboutUsData: Omit<AboutSection, 'id'>) {
    console.log('📄 Adding new about us section...', aboutUsData);
    
    const res = await fetch('http://localhost:8080/api/store/addAboutUs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(aboutUsData),
    });
    
    console.log('📡 Add about us response status:', res.status);
    console.log('📡 Add about us response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to add about us section';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Add about us error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Add about us error text:', msg);
        } catch {
          console.log('❌ Add about us failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ About us section added successfully!', data);
    return data.aboutUs;
  }

  export async function updateAboutUs(id: number, aboutUsData: Partial<AboutSection>) {
    console.log('📄 Updating about us section...', { id, aboutUsData });
    
    const res = await fetch(`http://localhost:8080/api/store/updateAboutUs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(aboutUsData),
    });
    
    console.log('📡 Update about us response status:', res.status);
    console.log('📡 Update about us response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to update about us section';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Update about us error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Update about us error text:', msg);
        } catch {
          console.log('❌ Update about us failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('✅ About us section updated successfully!', data);
    return data;
  }

  export async function deleteAboutUs(id: number) {
    console.log('📄 Deleting about us section...', id);
    
    const res = await fetch(`http://localhost:8080/api/store/deleteAboutUs/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    console.log('📡 Delete about us response status:', res.status);
    console.log('📡 Delete about us response ok:', res.ok);
    
    if (!res.ok) {
      let msg = 'Failed to delete about us section';
      try { 
        const data = await res.json();
        msg = data.message || data || msg; 
        console.log('❌ Delete about us error response:', data);
      } catch {
        try {
          msg = await res.text() || msg;
          console.log('❌ Delete about us error text:', msg);
        } catch {
          console.log('❌ Delete about us failed with unknown error');
        }
      }
      throw new Error(msg);
    }
    
    console.log('✅ About us section deleted successfully!');
    return true;
  }

  // Sample policies data
  export const policies: Policy[] = [
    {
      id: 1,
      title: "Return Policy",
      description: "We offer a 30-day return policy for all unused and unopened items. Please contact our customer service team to initiate a return.",
      status: "Active"
    },
    {
      id: 2,
      title: "Shipping Policy",
      description: "Orders are typically processed within 1-2 business days. Standard shipping takes 3-5 business days. Express shipping options are available at checkout.",
      status: "Active"
    },
    {
      id: 3,
      title: "Privacy Policy",
      description: "We respect your privacy and are committed to protecting your personal information. Please review our full privacy policy for details on how we collect and use your data.",
      status: "Active"
    },
    {
      id: 4,
      title: "Terms of Service",
      description: "By using our website and services, you agree to comply with our terms of service. Please read the full terms for details on acceptable use and limitations.",
      status: "Active"
    },
    {
      id: 5,
      title: "Cookie Policy",
      description: "We use cookies to enhance your browsing experience. This policy explains how we use cookies and similar technologies.",
      status: "Draft"
    }
  ];
  
  // Sample about sections data
  export const aboutSections: AboutSection[] = [
    {
      id: 1,
      title: "Our Story",
      content: "Founded in 2020, SiteCraft began with a simple mission: to help small businesses establish a powerful online presence without the complexity and high costs typically associated with web development.",
      type: "History",
      status: "Visible"
    },
    {
      id: 2,
      title: "Our Mission",
      content: "We're dedicated to democratizing web development by providing intuitive, powerful tools that enable businesses of all sizes to create professional websites that drive growth.",
      type: "Mission",
      status: "Visible"
    },
    {
      id: 3,
      title: "Meet Our Team",
      content: "Our diverse team of developers, designers, and customer success specialists work together to ensure you have the best experience building your online presence.",
      type: "Team",
      status: "Visible"
    },
    {
      id: 4,
      title: "Company Values",
      content: "Innovation, accessibility, and customer satisfaction form the core values that drive everything we do at SiteCraft.",
      type: "Text",
      status: "Hidden"
    },
    {
      id: 5,
      title: "Office Location",
      content: "Our headquarters are located in the heart of the tech district in San Francisco, with satellite offices in New York, London, and Singapore.",
      type: "Text",
      status: "Visible"
    }
  ];