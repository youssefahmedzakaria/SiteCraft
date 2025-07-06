// Cache utility for SiteCraft registration flow
export interface SiteCraftCacheData {
  // User data from registration
  user?: {
    email: string;
    password: string;
    name: string;
    phone: string;
    gender: string;
  };
  
  // Store data from branding (without File objects)
  store?: {
    storeName?: string;
    storeType?: string;
    description?: string;
    phoneNumber?: string;
    emailAddress?: string;
    address?: string;
    addressLink?: string;
    openingHours?: string;
    colors?: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  // Add templates property for storing updated templates
  templates?: any[];
}

// Global variable to store File objects (since they can't be serialized)
let cachedLogoFile: File | null = null;

class SiteCraftCache {
  private readonly CACHE_KEY = 'sitecraft_registration_cache';
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  // Save data to cache
  setData(data: Partial<SiteCraftCacheData>): void {
    try {
      const existingData = this.getData();
      const updatedData = { ...existingData, ...data };
      
      const cacheData = {
        data: updatedData,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Cache updated:', updatedData);
    } catch (error) {
      console.error('❌ Failed to save to cache:', error);
    }
  }

  // Get data from cache
  getData(): SiteCraftCacheData {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return {} as SiteCraftCacheData;

      const cacheData = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > this.CACHE_EXPIRY) {
        this.clearCache();
        return {} as SiteCraftCacheData;
      }

      return cacheData.data || {} as SiteCraftCacheData;
    } catch (error) {
      console.error('❌ Failed to read from cache:', error);
      return {} as SiteCraftCacheData;
    }
  }

  // Clear cache
  clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      cachedLogoFile = null; // Clear the File object too
      console.log('🗑️ Cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  }

  // Check if cache has complete data
  isComplete(): boolean {
    const data = this.getData();
    return !!(data.user && data.store);
  }

  // Get specific section data
  getUserData() {
    return this.getData().user;
  }

  getStoreData() {
    return this.getData().store || undefined;
  }

  // Save user data
  saveUserData(userData: SiteCraftCacheData['user']) {
    this.setData({ user: userData });
  }

  // Save store data (without File objects)
  saveStoreData(storeData: Omit<SiteCraftCacheData['store'], 'logo'> & { logo?: File }) {
    // Store the File object separately
    if (storeData.logo) {
      cachedLogoFile = storeData.logo;
      console.log('💾 Logo file cached in memory:', storeData.logo.name);
    }
    
    // Remove File object before saving to cache
    const { logo, ...storeDataWithoutLogo } = storeData;
    this.setData({ store: storeDataWithoutLogo });
  }

  // Get the cached logo file
  getCachedLogoFile(): File | null {
    return cachedLogoFile;
  }

  // Set the cached logo file
  setCachedLogoFile(file: File | null): void {
    cachedLogoFile = file;
  }
}

// Export singleton instance
export const siteCraftCache = new SiteCraftCache(); 