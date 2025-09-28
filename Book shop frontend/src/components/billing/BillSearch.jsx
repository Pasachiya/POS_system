import React, { useState } from 'react';
import { Search, Calendar, User, DollarSign, Filter } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { useBills } from '../../hooks/useBills';
import { PAYMENT_STATUS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

const BillSearch = ({ onClose }) => {
  const { customers } = useCustomers();
  const { getBillsByDateRange, fetchBillsByCustomer } = useBills();
  
  const [searchCriteria, setSearchCriteria] = useState({
    billNumber: '',
    customerId: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    paymentStatus: '',
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    try {
      let results = [];

      // Search by customer
      if (searchCriteria.customerId) {
        results = await fetchBillsByCustomer(searchCriteria.customerId);
      } else if (searchCriteria.startDate && searchCriteria.endDate) {
        // Search by date range
        results = getBillsByDateRange(searchCriteria.startDate, searchCriteria.endDate);
      } else {
        // Get all bills and filter
        results = bills; // This should come from a hook or prop
      }

      // Apply additional filters
      results = results.filter(bill => {
        let matches = true;

        if (searchCriteria.billNumber) {
          matches = matches && bill.billNumber.toLowerCase().includes(searchCriteria.billNumber.toLowerCase());
        }

        if (searchCriteria.paymentStatus) {
          matches = matches && bill.paymentStatus === searchCriteria.paymentStatus;
        }

        if (searchCriteria.minAmount) {
          matches = matches && bill.totalAmount >= parseFloat(searchCriteria.minAmount);
        }

        if (searchCriteria.maxAmount) {
          matches = matches && bill.totalAmount <= parseFloat(searchCriteria.maxAmount);
        }

        return matches;
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchCriteria({
      billNumber: '',
      customerId: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      paymentStatus: '',
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Bill Number */}
        <div className="form-group">
          <label htmlFor="billNumber" className="form-label">
            <Search size={16} className="inline mr-2" />
            Bill Number
          </label>
          <input
            id="billNumber"
            name="billNumber"
            type="text"
            value={searchCriteria.billNumber}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter bill number"
            disabled={loading}
          />
        </div>

        {/* Customer */}
        <div className="form-group">
          <label htmlFor="customerId" className="form-label">
            <User size={16} className="inline mr-2" />
            Customer
          </label>
          <select
            id="customerId"
            name="customerId"
            value={searchCriteria.customerId}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="">All Customers</option>
            {customers.map(customer => (
              <option key={customer.customerId} value={customer.customerId}>
                {customer.customerName} - {customer.accountNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">
              <Calendar size={16} className="inline mr-2" />
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={searchCriteria.startDate}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate" className="form-label">
              <Calendar size={16} className="inline mr-2" />
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={searchCriteria.endDate}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>
        </div>

        {/* Amount Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="minAmount" className="form-label">
              <DollarSign size={16} className="inline mr-2" />
              Min Amount
            </label>
            <input
              id="minAmount"
              name="minAmount"
              type="number"
              step="0.01"
              min="0"
              value={searchCriteria.minAmount}
              onChange={handleChange}
              className="form-input"
              placeholder="0.00"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="maxAmount" className="form-label">
              <DollarSign size={16} className="inline mr-2" />
              Max Amount
            </label>
            <input
              id="maxAmount"
              name="maxAmount"
              type="number"
              step="0.01"
              min="0"
              value={searchCriteria.maxAmount}
              onChange={handleChange}
              className="form-input"
              placeholder="0.00"
              disabled={loading}
            />
          </div>
        </div>

        {/* Payment Status */}
        <div className="form-group">
          <label htmlFor="paymentStatus" className="form-label">
            <Filter size={16} className="inline mr-2" />
            Payment Status
          </label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            value={searchCriteria.paymentStatus}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="">All Status</option>
            <option value={PAYMENT_STATUS.PENDING}>Pending</option>
            <option value={PAYMENT_STATUS.PAID}>Paid</option>
            <option value={PAYMENT_STATUS.CANCELLED}>Cancelled</option>
          </select>
        </div>

        {/* Search Actions */}
        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Search size={16} />
                <span>Search Bills</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={clearSearch}
            className="btn-secondary"
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Search Results</h3>
            <span className="text-gray-300 text-sm">
              {searchResults.length} bill(s) found
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">No bills found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white bg-opacity-5 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white border-opacity-10">
                    <th className="text-left p-3 text-gray-300 text-sm">Bill Number</th>
                    <th className="text-left p-3 text-gray-300 text-sm">Customer</th>
                    <th className="text-left p-3 text-gray-300 text-sm">Date</th>
                    <th className="text-left p-3 text-gray-300 text-sm">Amount</th>
                    <th className="text-left p-3 text-gray-300 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((bill, index) => (
                    <tr
                      key={bill.billId}
                      className={`
                        border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 cursor-pointer
                        ${index % 2 === 0 ? 'bg-white bg-opacity-2' : ''}
                      `}
                      onClick={() => {
                        // You could set viewing bill here if needed
                        console.log('Selected bill:', bill);
                      }}
                    >
                      <td className="p-3">
                        <span className="text-white font-mono text-sm">{bill.billNumber}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-white">{bill.customerName}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-gray-300">{formatDate(bill.billDate)}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-white font-medium">{formatCurrency(bill.totalAmount)}</span>
                      </td>
                      <td className="p-3">
                        <span className={`status-badge ${
                          bill.paymentStatus === 'PAID' ? 'status-paid' :
                          bill.paymentStatus === 'PENDING' ? 'status-pending' :
                          'status-cancelled'
                        }`}>
                          {bill.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Search Summary */}
          {searchResults.length > 0 && (
            <div className="p-4 bg-white bg-opacity-5 rounded-lg">
              <h4 className="text-white font-medium mb-2">Search Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Bills:</span>
                  <span className="text-white ml-2 font-medium">{searchResults.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="text-white ml-2 font-medium">
                    {formatCurrency(searchResults.reduce((sum, bill) => sum + bill.totalAmount, 0))}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Avg Amount:</span>
                  <span className="text-white ml-2 font-medium">
                    {formatCurrency(searchResults.reduce((sum, bill) => sum + bill.totalAmount, 0) / searchResults.length)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BillSearch;