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
  
  // Store data from branding
  store?: {
    storeName: string;
    storeType: string;
    description?: string;
    phoneNumber?: string;
    emailAddress?: string;
    address?: string;
    addressLink?: string;
    openingHours?: string;
    logo?: File;
    colors?: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}

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
      if (!cached) return {};

      const cacheData = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > this.CACHE_EXPIRY) {
        this.clearCache();
        return {};
      }

      return cacheData.data || {};
    } catch (error) {
      console.error('❌ Failed to read from cache:', error);
      return {};
    }
  }

  // Clear cache
  clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
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
    return this.getData().store;
  }

  // Save user data
  saveUserData(userData: SiteCraftCacheData['user']) {
    this.setData({ user: userData });
  }

  // Save store data
  saveStoreData(storeData: SiteCraftCacheData['store']) {
    this.setData({ store: storeData });
  }
}

// Export singleton instance
export const siteCraftCache = new SiteCraftCache(); 