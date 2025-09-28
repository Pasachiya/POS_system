export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: (id) => `/customers/${id}`,
  },
  ITEMS: {
    BASE: '/items',
    BY_ID: (id) => `/items/${id}`,
  },
  BILLS: {
    BASE: '/bills',
    BY_ID: (id) => `/bills/${id}`,
    BY_CUSTOMER: (customerId) => `/bills?customerId=${customerId}`,
    PAY: (id) => `/bills/${id}/pay`,
  },
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  CASHIER: 'CASHIER',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
};

export const CUSTOMER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const ITEM_CATEGORIES = [
  'Books',
  'Stationery',
  'Electronics',
  'Accessories',
  'Other',
];

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
};

export const VALIDATION_RULES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NUMBER: 'Please enter a valid number',
  MIN_LENGTH: (length) => `Minimum ${length} characters required`,
  MAX_LENGTH: (length) => `Maximum ${length} characters allowed`,
};

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

export const DEBOUNCE_DELAY = 300;