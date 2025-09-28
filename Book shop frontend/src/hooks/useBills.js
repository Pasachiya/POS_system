import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import { validateBill } from '../utils/validators';
import { generateBillNumber, calculateSubtotal, calculateTax, calculateTotal } from '../utils/helpers';
import { PAYMENT_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';

export const useBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);

  // Fetch all bills
  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBills();
      setBills(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch bills';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch bill by ID
  const fetchBillById = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await apiService.getBillById(id);
      setSelectedBill(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch bill';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch bills by customer
  const fetchBillsByCustomer = useCallback(async (customerId) => {
    try {
      setLoading(true);
      const data = await apiService.getBillsByCustomer(customerId);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch customer bills';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new bill
  const createBill = useCallback(async (billData) => {
    try {
      setLoading(true);
      
      // Validate bill data
      const validation = validateBill(billData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        toast.error(firstError);
        return { success: false, errors: validation.errors };
      }

      // Generate bill number if not provided
      const dataWithBillNumber = {
        ...billData,
        billNumber: billData.billNumber || generateBillNumber(),
        billDate: billData.billDate || new Date().toISOString().split('T')[0],
      };

      const newBill = await apiService.createBill(dataWithBillNumber);
      setBills(prev => [...prev, newBill]);
      toast.success('Bill created successfully!');
      return { success: true, data: newBill };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create bill';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Pay bill
  const payBill = useCallback(async (id) => {
    try {
      setLoading(true);
      const paidBill = await apiService.payBill(id);
      
      setBills(prev => 
        prev.map(bill => 
          bill.billId === id ? paidBill : bill
        )
      );
      
      if (selectedBill?.billId === id) {
        setSelectedBill(paidBill);
      }
      
      toast.success('Bill marked as paid successfully!');
      return { success: true, data: paidBill };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to mark bill as paid';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedBill]);

  // Calculate bill totals
  const calculateBillTotals = useCallback((items) => {
    const subtotal = items.reduce((sum, item) => {
      return sum + calculateSubtotal(item.quantity, item.unitPrice);
    }, 0);
    
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);
    
    return { subtotal, tax, total };
  }, []);

  // Filter bills based on search term and status
  const filteredBills = bills.filter(bill => {
    const matchesSearch = !searchTerm || 
      bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customerId?.toString().includes(searchTerm);
    
    const matchesStatus = !statusFilter || 
      bill.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get bills by status
  const getBillsByStatus = useCallback((status) => {
    return bills.filter(bill => bill.paymentStatus === status);
  }, [bills]);

  // Get pending bills
  const getPendingBills = useCallback(() => {
    return getBillsByStatus(PAYMENT_STATUS.PENDING);
  }, [getBillsByStatus]);

  // Get paid bills
  const getPaidBills = useCallback(() => {
    return getBillsByStatus(PAYMENT_STATUS.PAID);
  }, [getBillsByStatus]);

  // Get cancelled bills
  const getCancelledBills = useCallback(() => {
    return getBillsByStatus(PAYMENT_STATUS.CANCELLED);
  }, [getBillsByStatus]);

  // Get bills summary
  const getBillsSummary = useCallback(() => {
    const totalBills = bills.length;
    const pendingBills = getPendingBills().length;
    const paidBills = getPaidBills().length;
    const cancelledBills = getCancelledBills().length;
    
    const totalAmount = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
    const paidAmount = getPaidBills().reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
    const pendingAmount = getPendingBills().reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
    
    return {
      totalBills,
      pendingBills,
      paidBills,
      cancelledBills,
      totalAmount,
      paidAmount,
      pendingAmount,
    };
  }, [bills, getPendingBills, getPaidBills, getCancelledBills]);

  // Get bills by date range
  const getBillsByDateRange = useCallback((startDate, endDate) => {
    return bills.filter(bill => {
      const billDate = new Date(bill.billDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return billDate >= start && billDate <= end;
    });
  }, [bills]);

  // Load bills on mount
  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return {
    bills: filteredBills,
    allBills: bills,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedBill,
    setSelectedBill,
    fetchBills,
    fetchBillById,
    fetchBillsByCustomer,
    createBill,
    payBill,
    calculateBillTotals,
    getBillsByStatus,
    getPendingBills,
    getPaidBills,
    getCancelledBills,
    getBillsSummary,
    getBillsByDateRange,
  };
};