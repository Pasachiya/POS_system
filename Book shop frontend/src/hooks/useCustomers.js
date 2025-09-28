import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import { validateCustomer } from '../utils/validators';
import { generateAccountNumber } from '../utils/helpers';
import toast from 'react-hot-toast';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch all customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCustomers();
      setCustomers(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch customers';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch customer by ID
  const fetchCustomerById = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await apiService.getCustomerById(id);
      setSelectedCustomer(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch customer';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new customer
  const createCustomer = useCallback(async (customerData) => {
    try {
      setLoading(true);
      
      // Validate customer data
      const validation = validateCustomer(customerData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        toast.error(firstError);
        return { success: false, errors: validation.errors };
      }

      // Generate account number if not provided
      const dataWithAccountNumber = {
        ...customerData,
        accountNumber: customerData.accountNumber || generateAccountNumber(),
        registrationDate: customerData.registrationDate || new Date().toISOString().split('T')[0],
      };

      const newCustomer = await apiService.createCustomer(dataWithAccountNumber);
      setCustomers(prev => [...prev, newCustomer]);
      toast.success('Customer created successfully!');
      return { success: true, data: newCustomer };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create customer';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update customer
  const updateCustomer = useCallback(async (id, customerData) => {
    try {
      setLoading(true);
      
      // Validate customer data
      const validation = validateCustomer(customerData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        toast.error(firstError);
        return { success: false, errors: validation.errors };
      }

      const updatedCustomer = await apiService.updateCustomer(id, customerData);
      setCustomers(prev => 
        prev.map(customer => 
          customer.customerId === id ? updatedCustomer : customer
        )
      );
      
      if (selectedCustomer?.customerId === id) {
        setSelectedCustomer(updatedCustomer);
      }
      
      toast.success('Customer updated successfully!');
      return { success: true, data: updatedCustomer };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update customer';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer]);

  // Delete customer
  const deleteCustomer = useCallback(async (id) => {
    try {
      setLoading(true);
      await apiService.deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer.customerId !== id));
      
      if (selectedCustomer?.customerId === id) {
        setSelectedCustomer(null);
      }
      
      toast.success('Customer deleted successfully!');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete customer';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer]);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.customerName?.toLowerCase().includes(searchLower) ||
      customer.accountNumber?.toLowerCase().includes(searchLower) ||
      customer.telephoneNumber?.includes(searchTerm) ||
      customer.address?.toLowerCase().includes(searchLower)
    );
  });

  // Load customers on mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCustomer,
    setSelectedCustomer,
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};