import React, { useState, useEffect } from 'react';
import { Save, X, User, MapPin, Phone, Calendar, Activity } from 'lucide-react';
import { generateAccountNumber } from '../../utils/helpers';
import { CUSTOMER_STATUS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const CustomerForm = ({ customer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    customerName: '',
    address: '',
    telephoneNumber: '',
    registrationDate: new Date().toISOString().split('T')[0],
    status: CUSTOMER_STATUS.ACTIVE,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        accountNumber: customer.accountNumber || '',
        customerName: customer.customerName || '',
        address: customer.address || '',
        telephoneNumber: customer.telephoneNumber || '',
        registrationDate: customer.registrationDate || new Date().toISOString().split('T')[0],
        status: customer.status || CUSTOMER_STATUS.ACTIVE,
      });
    } else {
      // Generate account number for new customers
      setFormData(prev => ({
        ...prev,
        accountNumber: generateAccountNumber(),
      }));
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const result = await onSubmit(formData);
      if (!result.success && result.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewAccountNumber = () => {
    setFormData(prev => ({
      ...prev,
      accountNumber: generateAccountNumber(),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Account Number */}
      <div className="form-group">
        <label htmlFor="accountNumber" className="form-label">
          <User size={16} className="inline mr-2" />
          Account Number
        </label>
        <div className="flex space-x-2">
          <input
            id="accountNumber"
            name="accountNumber"
            type="text"
            value={formData.accountNumber}
            onChange={handleChange}
            className={`form-input flex-1 ${errors.accountNumber ? 'border-red-400' : ''}`}
            placeholder="Auto-generated account number"
            readOnly={!!customer}
          />
          {!customer && (
            <button
              type="button"
              onClick={generateNewAccountNumber}
              className="btn-secondary px-3 py-2 text-sm"
            >
              Generate
            </button>
          )}
        </div>
        {errors.accountNumber && (
          <p className="text-red-300 text-sm mt-1">{errors.accountNumber}</p>
        )}
      </div>

      {/* Customer Name */}
      <div className="form-group">
        <label htmlFor="customerName" className="form-label">
          <User size={16} className="inline mr-2" />
          Customer Name *
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          value={formData.customerName}
          onChange={handleChange}
          className={`form-input ${errors.customerName ? 'border-red-400' : ''}`}
          placeholder="Enter customer name"
          disabled={loading}
        />
        {errors.customerName && (
          <p className="text-red-300 text-sm mt-1">{errors.customerName}</p>
        )}
      </div>

      {/* Address */}
      <div className="form-group">
        <label htmlFor="address" className="form-label">
          <MapPin size={16} className="inline mr-2" />
          Address *
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className={`form-input resize-none ${errors.address ? 'border-red-400' : ''}`}
          placeholder="Enter customer address"
          disabled={loading}
        />
        {errors.address && (
          <p className="text-red-300 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* Telephone Number */}
      <div className="form-group">
        <label htmlFor="telephoneNumber" className="form-label">
          <Phone size={16} className="inline mr-2" />
          Telephone Number *
        </label>
        <input
          id="telephoneNumber"
          name="telephoneNumber"
          type="tel"
          value={formData.telephoneNumber}
          onChange={handleChange}
          className={`form-input ${errors.telephoneNumber ? 'border-red-400' : ''}`}
          placeholder="Enter telephone number (10 digits)"
          disabled={loading}
        />
        {errors.telephoneNumber && (
          <p className="text-red-300 text-sm mt-1">{errors.telephoneNumber}</p>
        )}
      </div>

      {/* Registration Date */}
      <div className="form-group">
        <label htmlFor="registrationDate" className="form-label">
          <Calendar size={16} className="inline mr-2" />
          Registration Date *
        </label>
        <input
          id="registrationDate"
          name="registrationDate"
          type="date"
          value={formData.registrationDate}
          onChange={handleChange}
          className={`form-input ${errors.registrationDate ? 'border-red-400' : ''}`}
          disabled={loading}
        />
        {errors.registrationDate && (
          <p className="text-red-300 text-sm mt-1">{errors.registrationDate}</p>
        )}
      </div>

      {/* Status */}
      <div className="form-group">
        <label htmlFor="status" className="form-label">
          <Activity size={16} className="inline mr-2" />
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={`form-select ${errors.status ? 'border-red-400' : ''}`}
          disabled={loading}
        >
          <option value={CUSTOMER_STATUS.ACTIVE}>Active</option>
          <option value={CUSTOMER_STATUS.INACTIVE}>Inactive</option>
        </select>
        {errors.status && (
          <p className="text-red-300 text-sm mt-1">{errors.status}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white border-opacity-20">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex items-center space-x-2"
          disabled={loading}
        >
          <X size={16} />
          <span>Cancel</span>
        </button>
        
        <button
          type="submit"
          className="btn-primary flex items-center space-x-2"
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Save size={16} />
              <span>{customer ? 'Update' : 'Create'} Customer</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;