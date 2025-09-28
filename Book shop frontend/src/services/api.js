import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../utils/constants';
import storageService from './storage';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = storageService.getToken();
    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url,
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, request, message } = error;
    
    // Handle network errors
    if (!response) {
      if (request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Request setup error: ' + message);
      }
      return Promise.reject(error);
    }
    
    // Handle HTTP errors
    const { status, data, config } = response;
    const isLoginCall = config?.url?.includes(ENDPOINTS.AUTH.LOGIN);

    switch (status) {
      case 401:
        if (isLoginCall) {
          // Let the login form handle invalid credentials
          return Promise.reject(error);
        }
        toast.error('Session expired. Please login again.');
        storageService.clearAuthData();
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Access denied. Insufficient permissions.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 422:
        // Validation errors - don't show toast, let components handle
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        const errorMessage = data?.message || data?.error || 'An unexpected error occurred';
        toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// API service class
class ApiService {
  // Authentication APIs
  async login(credentials) {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }

  // Customer APIs
  async getCustomers() {
    const response = await api.get(ENDPOINTS.CUSTOMERS.BASE);
    return response.data;
  }

  async getCustomerById(id) {
    const response = await api.get(ENDPOINTS.CUSTOMERS.BY_ID(id));
    return response.data;
  }

  async createCustomer(customerData) {
    const response = await api.post(ENDPOINTS.CUSTOMERS.BASE, customerData);
    return response.data;
  }

  async updateCustomer(id, customerData) {
    const response = await api.put(ENDPOINTS.CUSTOMERS.BY_ID(id), customerData);
    return response.data;
  }

  async deleteCustomer(id) {
    const response = await api.delete(ENDPOINTS.CUSTOMERS.BY_ID(id));
    return response.data;
  }

  // Item APIs
  async getItems() {
    const response = await api.get(ENDPOINTS.ITEMS.BASE);
    return response.data;
  }

  async getItemById(id) {
    const response = await api.get(ENDPOINTS.ITEMS.BY_ID(id));
    return response.data;
  }

  async createItem(itemData) {
    const response = await api.post(ENDPOINTS.ITEMS.BASE, itemData);
    return response.data;
  }

  async updateItem(id, itemData) {
    const response = await api.put(ENDPOINTS.ITEMS.BY_ID(id), itemData);
    return response.data;
  }

  async deleteItem(id) {
    const response = await api.delete(ENDPOINTS.ITEMS.BY_ID(id));
    return response.data;
  }

  // Bill APIs
  async getBills() {
    const response = await api.get(ENDPOINTS.BILLS.BASE);
    return response.data;
  }

  async getBillById(id) {
    const response = await api.get(ENDPOINTS.BILLS.BY_ID(id));
    return response.data;
  }

  async getBillsByCustomer(customerId) {
    const response = await api.get(ENDPOINTS.BILLS.BY_CUSTOMER(customerId));
    return response.data;
  }

  async createBill(billData) {
    const response = await api.post(ENDPOINTS.BILLS.BASE, billData);
    return response.data;
  }

  async payBill(id) {
    const response = await api.post(ENDPOINTS.BILLS.PAY(id));
    return response.data;
  }

  // Generic API methods
  async get(endpoint, params = {}) {
    const response = await api.get(endpoint, { params });
    return response.data;
  }

  async post(endpoint, data) {
    const response = await api.post(endpoint, data);
    return response.data;
  }

  async put(endpoint, data) {
    const response = await api.put(endpoint, data);
    return response.data;
  }

  async delete(endpoint) {
    const response = await api.delete(endpoint);
    return response.data;
  }

  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('API health check failed');
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;