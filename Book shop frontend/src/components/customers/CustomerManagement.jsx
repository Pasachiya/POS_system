import React, { useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { useAuth } from '../../hooks/useAuth';
import { exportToCSV } from '../../utils/helpers';
import GlassCard from '../common/GlassCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import CustomerForm from './CustomerForm';
import CustomerTable from './CustomerTable';

const CustomerManagement = () => {
  const { 
    customers, 
    loading, 
    searchTerm, 
    setSearchTerm,
    createCustomer,
    updateCustomer,
    deleteCustomer 
  } = useCustomers();
  const { hasPermission } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const handleCreateCustomer = async (customerData) => {
    const result = await createCustomer(customerData);
    if (result.success) {
      setIsModalOpen(false);
    }
    return result;
  };

  const handleUpdateCustomer = async (customerData) => {
    const result = await updateCustomer(editingCustomer.customerId, customerData);
    if (result.success) {
      setIsModalOpen(false);
      setEditingCustomer(null);
    }
    return result;
  };

  const handleDeleteCustomer = async (customer) => {
    if (window.confirm(`Are you sure you want to delete customer "${customer.customerName}"?`)) {
      await deleteCustomer(customer.customerId);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleExport = () => {
    const exportData = customers.map(customer => ({
      'Account Number': customer.accountNumber,
      'Customer Name': customer.customerName,
      'Address': customer.address,
      'Phone': customer.telephoneNumber,
      'Registration Date': customer.registrationDate,
      'Status': customer.status,
    }));
    
    exportToCSV(exportData, `customers-${new Date().toISOString().split('T')[0]}`);
  };

  const filteredCustomers = customers.filter(customer => {
    return !statusFilter || customer.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Management</h1>
          <p className="text-gray-300 mt-1">Manage customer accounts and information</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
            disabled={customers.length === 0}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          
          {hasPermission('manage_customers') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Customer</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, account number, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select pl-10 min-w-40"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-3 text-gray-300 text-sm">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </GlassCard>

      {/* Customer Table */}
      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Loading customers..." />
          </div>
        ) : (
          <CustomerTable
            customers={filteredCustomers}
            onEdit={hasPermission('manage_customers') ? handleEditCustomer : null}
            onDelete={hasPermission('manage_customers') ? handleDeleteCustomer : null}
          />
        )}
      </GlassCard>

      {/* Customer Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        size="lg"
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default CustomerManagement;