import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import { validateItem } from '../utils/validators';
import { ITEM_CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch all items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getItems();
      setItems(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch items';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch item by ID
  const fetchItemById = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await apiService.getItemById(id);
      setSelectedItem(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch item';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new item
  const createItem = useCallback(async (itemData) => {
    try {
      setLoading(true);
      
      // Validate item data
      const validation = validateItem(itemData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        toast.error(firstError);
        return { success: false, errors: validation.errors };
      }

      const newItem = await apiService.createItem(itemData);
      setItems(prev => [...prev, newItem]);
      toast.success('Item created successfully!');
      return { success: true, data: newItem };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create item';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update item
  const updateItem = useCallback(async (id, itemData) => {
    try {
      setLoading(true);
      
      // Validate item data
      const validation = validateItem(itemData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        toast.error(firstError);
        return { success: false, errors: validation.errors };
      }

      const updatedItem = await apiService.updateItem(id, itemData);
      setItems(prev => 
        prev.map(item => 
          item.itemId === id ? updatedItem : item
        )
      );
      
      if (selectedItem?.itemId === id) {
        setSelectedItem(updatedItem);
      }
      
      toast.success('Item updated successfully!');
      return { success: true, data: updatedItem };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update item';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedItem]);

  // Delete item
  const deleteItem = useCallback(async (id) => {
    try {
      setLoading(true);
      await apiService.deleteItem(id);
      setItems(prev => prev.filter(item => item.itemId !== id));
      
      if (selectedItem?.itemId === id) {
        setSelectedItem(null);
      }
      
      toast.success('Item deleted successfully!');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete item';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedItem]);

  // Filter items based on search term and category
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get items by category
  const getItemsByCategory = useCallback((category) => {
    return items.filter(item => item.category === category);
  }, [items]);

  // Get low stock items
  const getLowStockItems = useCallback((threshold = 10) => {
    return items.filter(item => item.stockQuantity <= threshold);
  }, [items]);

  // Update item stock
  const updateItemStock = useCallback(async (id, newQuantity) => {
    try {
      const item = items.find(item => item.itemId === id);
      if (!item) {
        throw new Error('Item not found');
      }

      const updatedItem = await apiService.updateItem(id, {
        ...item,
        stockQuantity: newQuantity,
      });

      setItems(prev => 
        prev.map(item => 
          item.itemId === id ? updatedItem : item
        )
      );

      return { success: true, data: updatedItem };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update stock';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [items]);

  // Load items on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items: filteredItems,
    allItems: items,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedItem,
    setSelectedItem,
    categories: ITEM_CATEGORIES,
    fetchItems,
    fetchItemById,
    createItem,
    updateItem,
    deleteItem,
    getItemsByCategory,
    getLowStockItems,
    updateItemStock,
  };
};