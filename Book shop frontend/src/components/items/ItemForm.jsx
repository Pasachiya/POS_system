import React, { useState, useEffect } from 'react';
import { Save, X, Package, Tag, DollarSign, Hash } from 'lucide-react';
import { ITEM_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

const ItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    price: '',
    stockQuantity: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        itemName: item.itemName || '',
        category: item.category || '',
        price: item.price?.toString() || '',
        stockQuantity: item.stockQuantity?.toString() || '',
      });
    }
  }, [item]);

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

    // Convert string values to appropriate types
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Item Name */}
      <div className="form-group">
        <label htmlFor="itemName" className="form-label">
          <Package size={16} className="inline mr-2" />
          Item Name *
        </label>
        <input
          id="itemName"
          name="itemName"
          type="text"
          value={formData.itemName}
          onChange={handleChange}
          className={`form-input ${errors.itemName ? 'border-red-400' : ''}`}
          placeholder="Enter item name"
          disabled={loading}
        />
        {errors.itemName && (
          <p className="text-red-300 text-sm mt-1">{errors.itemName}</p>
        )}
      </div>

      {/* Category */}
      <div className="form-group">
        <label htmlFor="category" className="form-label">
          <Tag size={16} className="inline mr-2" />
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`form-select ${errors.category ? 'border-red-400' : ''}`}
          disabled={loading}
        >
          <option value="">Select a category</option>
          {ITEM_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-300 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Price and Stock in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price */}
        <div className="form-group">
          <label htmlFor="price" className="form-label">
            <DollarSign size={16} className="inline mr-2" />
            Price (LKR) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            className={`form-input ${errors.price ? 'border-red-400' : ''}`}
            placeholder="0.00"
            disabled={loading}
          />
          {errors.price && (
            <p className="text-red-300 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Stock Quantity */}
        <div className="form-group">
          <label htmlFor="stockQuantity" className="form-label">
            <Hash size={16} className="inline mr-2" />
            Stock Quantity *
          </label>
          <input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            value={formData.stockQuantity}
            onChange={handleChange}
            className={`form-input ${errors.stockQuantity ? 'border-red-400' : ''}`}
            placeholder="0"
            disabled={loading}
          />
          {errors.stockQuantity && (
            <p className="text-red-300 text-sm mt-1">{errors.stockQuantity}</p>
          )}
        </div>
      </div>

      {/* Calculated Values */}
      {formData.price && formData.stockQuantity && (
        <div className="p-4 bg-white bg-opacity-5 rounded-lg">
          <h4 className="text-white font-medium mb-2">Calculated Values</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Total Value:</span>
              <span className="text-white ml-2 font-medium">
                {formatCurrency(parseFloat(formData.price) * parseInt(formData.stockQuantity))}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Per Unit:</span>
              <span className="text-white ml-2 font-medium">
                {formatCurrency(parseFloat(formData.price))}
              </span>
            </div>
          </div>
        </div>
      )}

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
              <span>{item ? 'Update' : 'Create'} Item</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;