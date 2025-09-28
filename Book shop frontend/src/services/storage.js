import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  // Token management
  setToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  }

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  removeToken() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  // User data management
  setUser(userData) {
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  getUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from storage:', error);
      return null;
    }
  }

  removeUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Clear all auth data
  clearAuthData() {
    this.removeToken();
    this.removeUser();
  }

  // Generic storage methods
  setItem(key, value) {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error storing item with key ${key}:`, error);
    }
  }

  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      // Try to parse as JSON, if it fails return as string
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error(`Error retrieving item with key ${key}:`, error);
      return null;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item with key ${key}:`, error);
    }
  }

  // Check if storage is available
  isStorageAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo() {
    if (!this.isStorageAvailable()) {
      return { available: false };
    }

    let totalSize = 0;
    const items = {};

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage[key];
        const size = new Blob([value]).size;
        items[key] = { size, value: value.substring(0, 50) + '...' };
        totalSize += size;
      }
    }

    return {
      available: true,
      totalSize,
      items,
      freeSpace: 5 * 1024 * 1024 - totalSize, // Assuming 5MB limit
    };
  }
}

// Create a singleton instance
const storageService = new StorageService();

export default storageService;