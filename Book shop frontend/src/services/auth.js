import apiService from './api';
import storageService from './storage';
import { USER_ROLES } from '../utils/constants';

class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
    this.isInitialized = false;
  }

  // Initialize auth service
  async initialize() {
    try {
      const token = storageService.getToken();
      const user = storageService.getUser();
      
      if (token && user) {
        this.token = token;
        this.user = user;
        
        // Validate token with a simple API call
        try {
          // You might want to add a validate endpoint or use an existing one
          await apiService.healthCheck();
        } catch (error) {
          // Token is invalid, clear auth data
          this.logout();
        }
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.isInitialized = true;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.login(credentials);
      const { token } = response;
      
      // Decode user info from token (you might want to get this from API response)
      const user = this.decodeUserFromToken(token) || {
        username: credentials.username,
        role: USER_ROLES.ADMIN, // Default role, should come from API
      };
      
      this.token = token;
      this.user = user;
      
      // Store in localStorage
      storageService.setToken(token);
      storageService.setUser(user);
      
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  logout() {
    this.token = null;
    this.user = null;
    
    // Clear storage
    storageService.clearAuthData();
    
    // Don't redirect here, let React handle it
    // window.location.href = '/login';
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.token && this.user);
  }

  // Check if user has specific role
  hasRole(role) {
    return this.user?.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole(USER_ROLES.ADMIN);
  }

  // Check if user is cashier
  isCashier() {
    return this.hasRole(USER_ROLES.CASHIER);
  }

  // Check if user has permission for action
  canPerform(action) {
    if (!this.isAuthenticated()) return false;
    
    const permissions = {
      [USER_ROLES.ADMIN]: [
        'view_dashboard',
        'view_customers',    // ← ADD THIS
        'manage_customers',
        'view_items',        // ← ADD THIS
        'manage_items',
        'manage_bills',
        'view_reports',
        'delete_records',
      ],
      [USER_ROLES.CASHIER]: [
        'view_dashboard',
        'view_customers',
        'view_items',
        'manage_bills',
      ],
    };
    
    const userPermissions = permissions[this.user.role] || [];
    const result = userPermissions.includes(action);
    
    // Add debug logging
    console.log('Permission check:', {
      action,
      userRole: this.user.role,
      userPermissions,
      result
    });
    
    return result;
  }

  // Decode user info from JWT token
  decodeUserFromToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      return {
        username: payload.sub || payload.username,
        role: payload.role || USER_ROLES.ADMIN,
        exp: payload.exp,
        iat: payload.iat,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired() {
    if (!this.token) return true;
    
    try {
      const user = this.decodeUserFromToken(this.token);
      if (!user || !user.exp) return false; // If no exp, assume it doesn't expire
      
      const currentTime = Date.now() / 1000;
      return user.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Refresh token (if your API supports it)
  async refreshToken() {
    try {
      if (this.isTokenExpired()) {
        this.logout();
        return null;
      }
      
      // If you have a refresh endpoint, implement it here
      // const response = await apiService.refreshToken();
      // const { token } = response;
      // this.token = token;
      // storageService.setToken(token);
      // return token;
      
      return this.token;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  // Add auth state change listener
  onAuthStateChange(callback) {
    // This is a simple implementation
    // In a real app, you might want to use an event emitter
    const checkAuthState = () => {
      const isAuthenticated = this.isAuthenticated();
      callback({ user: this.user, isAuthenticated });
    };
    
    // Check immediately
    checkAuthState();
    
    // Return unsubscribe function
    return () => {
      // Cleanup if needed
    };
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;