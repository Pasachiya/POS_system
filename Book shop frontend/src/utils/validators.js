import { VALIDATION_RULES } from './constants';

export const validateRequired = (value) => {
  if (!value || value.toString().trim() === '') {
    return VALIDATION_RULES.REQUIRED_FIELD;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return VALIDATION_RULES.REQUIRED_FIELD;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return VALIDATION_RULES.INVALID_EMAIL;
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return VALIDATION_RULES.REQUIRED_FIELD;
  const phoneRegex = /^[0-9]{10}$/;
  const cleanPhone = phone.replace(/\s+/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return VALIDATION_RULES.INVALID_PHONE;
  }
  return null;
};

export const validateNumber = (value) => {
  if (!value) return VALIDATION_RULES.REQUIRED_FIELD;
  if (isNaN(value) || value <= 0) {
    return VALIDATION_RULES.INVALID_NUMBER;
  }
  return null;
};

export const validateMinLength = (value, minLength) => {
  if (!value) return VALIDATION_RULES.REQUIRED_FIELD;
  if (value.length < minLength) {
    return VALIDATION_RULES.MIN_LENGTH(minLength);
  }
  return null;
};

export const validateMaxLength = (value, maxLength) => {
  if (value && value.length > maxLength) {
    return VALIDATION_RULES.MAX_LENGTH(maxLength);
  }
  return null;
};

export const validateCustomer = (customer) => {
  const errors = {};
  
  const nameError = validateRequired(customer.customerName);
  if (nameError) errors.customerName = nameError;
  
  const addressError = validateRequired(customer.address);
  if (addressError) errors.address = addressError;
  
  const phoneError = validatePhone(customer.telephoneNumber);
  if (phoneError) errors.telephoneNumber = phoneError;
  
  const statusError = validateRequired(customer.status);
  if (statusError) errors.status = statusError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateItem = (item) => {
  const errors = {};
  
  const nameError = validateRequired(item.itemName);
  if (nameError) errors.itemName = nameError;
  
  const categoryError = validateRequired(item.category);
  if (categoryError) errors.category = categoryError;
  
  const priceError = validateNumber(item.price);
  if (priceError) errors.price = priceError;
  
  const stockError = validateNumber(item.stockQuantity);
  if (stockError) errors.stockQuantity = stockError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateBill = (bill) => {
  const errors = {};
  
  const customerError = validateRequired(bill.customerId);
  if (customerError) errors.customerId = customerError;
  
  const billNumberError = validateRequired(bill.billNumber);
  if (billNumberError) errors.billNumber = billNumberError;
  
  const billDateError = validateRequired(bill.billDate);
  if (billDateError) errors.billDate = billDateError;
  
  if (!bill.items || bill.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    const itemErrors = bill.items.map((item, index) => {
      const itemError = {};
      
      const itemIdError = validateRequired(item.itemId);
      if (itemIdError) itemError.itemId = itemIdError;
      
      const quantityError = validateNumber(item.quantity);
      if (quantityError) itemError.quantity = quantityError;
      
      return Object.keys(itemError).length > 0 ? itemError : null;
    }).filter(error => error !== null);
    
    if (itemErrors.length > 0) {
      errors.itemErrors = itemErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLogin = (credentials) => {
  const errors = {};
  
  const usernameError = validateRequired(credentials.username);
  if (usernameError) errors.username = usernameError;
  
  const passwordError = validateRequired(credentials.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};