import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, User, Calendar, Receipt } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { useItems } from '../../hooks/useItems';
import { generateBillNumber, calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateBillForm = ({ onSubmit, onCancel }) => {
  const { customers } = useCustomers();
  const { items } = useItems();
  
  const [formData, setFormData] = useState({
    customerId: '',
    billNumber: generateBillNumber(),
    billDate: new Date().toISOString().split('T')[0],
    items: [
      {
        itemId: '',
        quantity: 1,
        unitPrice: 0,
      }
    ],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCustomerChange = (e) => {
    setFormData(prev => ({
      ...prev,
      customerId: e.target.value
    }));
    
    if (errors.customerId) {
      setErrors(prev => ({ ...prev, customerId: '' }));
    }
  };

  const handleBillInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Auto-set unit price when item is selected
    if (field === 'itemId' && value) {
      const selectedItem = items.find(item => item.itemId.toString() === value);
      if (selectedItem) {
        newItems[index].unitPrice = selectedItem.price;
      }
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));

    // Clear item errors
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: '',
          quantity: 1,
          unitPrice: 0,
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      if (item.itemId && item.quantity && item.unitPrice) {
        return sum + calculateSubtotal(item.quantity, item.unitPrice);
      }
      return sum;
    }, 0);
    
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);
    
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const newErrors = {};
    
    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }
    
    if (!formData.billNumber) {
      newErrors.billNumber = 'Bill number is required';
    }
    
    if (!formData.billDate) {
      newErrors.billDate = 'Bill date is required';
    }

    // Validate items
    const validItems = formData.items.filter(item => 
      item.itemId && item.quantity > 0 && item.unitPrice > 0
    );
    
    if (validItems.length === 0) {
      newErrors.items = 'At least one valid item is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Prepare submission data
    const submitData = {
      customerId: parseInt(formData.customerId),
      billNumber: formData.billNumber,
      billDate: formData.billDate,
      items: validItems.map(item => ({
        itemId: parseInt(item.itemId),
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
      })),
    };

    try {
      const result = await onSubmit(submitData);
      if (!result.success && result.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewBillNumber = () => {
    setFormData(prev => ({
      ...prev,
      billNumber: generateBillNumber(),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bill Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer Selection */}
        <div className="form-group">
          <label htmlFor="customerId" className="form-label">
            <User size={16} className="inline mr-2" />
            Customer *
          </label>
          <select
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleCustomerChange}
            className={`form-select select-dropdown ${errors.customerId ? 'select-dropdown--error' : ''}`}
            disabled={loading}
          >
            <option value="">Select a customer</option>
            {customers.map(customer => (
              <option key={customer.customerId} value={customer.customerId}>
                {customer.customerName} - {customer.accountNumber}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="text-red-300 text-sm mt-1">{errors.customerId}</p>
          )}
        </div>

        {/* Bill Number */}
        <div className="form-group">
          <label htmlFor="billNumber" className="form-label">
            <Receipt size={16} className="inline mr-2" />
            Bill Number *
          </label>
          <div className="flex space-x-2">
            <input
              id="billNumber"
              name="billNumber"
              type="text"
              value={formData.billNumber}
              onChange={handleBillInfoChange}
              className={`form-input flex-1 ${errors.billNumber ? 'border-red-400' : ''}`}
              placeholder="Auto-generated bill number"
              disabled={loading}
            />
            <button
              type="button"
              onClick={generateNewBillNumber}
              className="btn-secondary px-3 py-2 text-sm"
            >
              Generate
            </button>
          </div>
          {errors.billNumber && (
            <p className="text-red-300 text-sm mt-1">{errors.billNumber}</p>
          )}
        </div>

        {/* Bill Date */}
        <div className="form-group">
          <label htmlFor="billDate" className="form-label">
            <Calendar size={16} className="inline mr-2" />
            Bill Date *
          </label>
          <input
            id="billDate"
            name="billDate"
            type="date"
            value={formData.billDate}
            onChange={handleBillInfoChange}
            className={`form-input ${errors.billDate ? 'border-red-400' : ''}`}
            disabled={loading}
          />
          {errors.billDate && (
            <p className="text-red-300 text-sm mt-1">{errors.billDate}</p>
          )}
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Bill Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="btn-secondary flex items-center space-x-2 text-sm"
          >
            <Plus size={16} />
            <span>Add Item</span>
          </button>
        </div>

        {errors.items && (
          <p className="text-red-300 text-sm">{errors.items}</p>
        )}

        {/* Items List */}
        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="p-4 bg-white bg-opacity-5 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* Item Selection */}
                <div className="md:col-span-2">
                  <label className="form-label text-sm">Item</label>
                  <select
                    value={item.itemId}
                    onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                    className="form-select select-dropdown text-sm"
                    disabled={loading}
                  >
                    <option value="">Select an item</option>
                    {items.map(availableItem => (
                      <option key={availableItem.itemId} value={availableItem.itemId}>
                        {availableItem.itemName} - {formatCurrency(availableItem.price)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="form-label text-sm">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="form-input text-sm"
                    disabled={loading}
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <label className="form-label text-sm">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="form-input text-sm"
                    disabled={loading}
                  />
                </div>

                {/* Subtotal & Actions */}
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <label className="form-label text-sm">Subtotal</label>
                    <div className="p-2 bg-white bg-opacity-10 rounded text-white text-sm font-medium">
                      {formatCurrency(calculateSubtotal(item.quantity, item.unitPrice))}
                    </div>
                  </div>
                  
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg text-red-300"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bill Summary */}
      <div className="p-4 bg-white bg-opacity-5 rounded-lg">
        <h4 className="text-white font-medium mb-3">Bill Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Tax (10%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-white text-lg font-bold border-t border-white border-opacity-20 pt-2">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
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
          disabled={loading || total === 0}
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Save size={16} />
              <span>Create Bill</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateBillForm;