import React, { useState } from 'react';
import { Plus, Search, Filter, Download, AlertTriangle } from 'lucide-react';
import { useItems } from '../../hooks/useItems';
import { useAuth } from '../../hooks/useAuth';
import { exportToCSV, formatCurrency } from '../../utils/helpers';
import GlassCard from '../common/GlassCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import ItemForm from './ItemForm';
import ItemTable from './ItemTable';

const ItemManagement = () => {
  const { 
    items, 
    loading, 
    searchTerm, 
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    createItem,
    updateItem,
    deleteItem,
    getLowStockItems 
  } = useItems();
  const { hasPermission } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleCreateItem = async (itemData) => {
    const result = await createItem(itemData);
    if (result.success) {
      setIsModalOpen(false);
    }
    return result;
  };

  const handleUpdateItem = async (itemData) => {
    const result = await updateItem(editingItem.itemId, itemData);
    if (result.success) {
      setIsModalOpen(false);
      setEditingItem(null);
    }
    return result;
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete item "${item.itemName}"?`)) {
      await deleteItem(item.itemId);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleExport = () => {
    const exportData = items.map(item => ({
      'Item ID': item.itemId,
      'Item Name': item.itemName,
      'Category': item.category,
      'Price': item.price,
      'Stock Quantity': item.stockQuantity,
      'Total Value': item.price * item.stockQuantity,
    }));
    
    exportToCSV(exportData, `items-${new Date().toISOString().split('T')[0]}`);
  };

  const lowStockItems = getLowStockItems(10);
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.stockQuantity), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Item Management</h1>
          <p className="text-gray-300 mt-1">Manage inventory and item catalog</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
            disabled={items.length === 0}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          
          {hasPermission('manage_items') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{items.length}</p>
            <p className="text-gray-300 text-sm">Total Items</p>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
            <p className="text-gray-300 text-sm">Total Inventory Value</p>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              {lowStockItems.length > 0 && (
                <AlertTriangle size={20} className="text-yellow-400" />
              )}
              <p className="text-2xl font-bold text-white">{lowStockItems.length}</p>
            </div>
            <p className="text-gray-300 text-sm">Low Stock Items</p>
          </div>
        </GlassCard>
      </div>

      {/* Search and Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select pl-10 min-w-40"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-3 text-gray-300 text-sm">
          Showing {items.length} items
          {selectedCategory && ` in ${selectedCategory}`}
        </div>
      </GlassCard>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <GlassCard className="p-4 border-l-4 border-yellow-400">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle size={20} className="text-yellow-400" />
            <h3 className="text-white font-medium">Low Stock Alert</h3>
          </div>
          <p className="text-gray-300 text-sm">
            {lowStockItems.length} item(s) are running low on stock. Consider restocking soon.
          </p>
        </GlassCard>
      )}

      {/* Item Table */}
      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Loading items..." />
          </div>
        ) : (
          <ItemTable
            items={items}
            onEdit={hasPermission('manage_items') ? handleEditItem : null}
            onDelete={hasPermission('manage_items') ? handleDeleteItem : null}
          />
        )}
      </GlassCard>

      {/* Item Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        size="lg"
      >
        <ItemForm
          item={editingItem}
          onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default ItemManagement;