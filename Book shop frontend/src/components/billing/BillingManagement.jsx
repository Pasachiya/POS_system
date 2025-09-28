import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Receipt, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useBills } from '../../hooks/useBills';
import { useAuth } from '../../hooks/useAuth';
import { exportToCSV, formatCurrency } from '../../utils/helpers';
import { PAYMENT_STATUS } from '../../utils/constants';
import GlassCard from '../common/GlassCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import CreateBillForm from './CreateBillForm';
import BillView from './BillView';
import BillSearch from './BillSearch';

const BillingManagement = () => {
  const { 
    bills, 
    loading, 
    searchTerm, 
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    createBill,
    payBill,
    getBillsSummary 
  } = useBills();
  const { hasPermission } = useAuth();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingBill, setViewingBill] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleCreateBill = async (billData) => {
    const result = await createBill(billData);
    if (result.success) {
      setIsCreateModalOpen(false);
    }
    return result;
  };

  const handlePayBill = async (bill) => {
    if (window.confirm(`Mark bill ${bill.billNumber} as paid?`)) {
      await payBill(bill.billId);
    }
  };

  const handleExport = () => {
    const exportData = bills.map(bill => ({
      'Bill Number': bill.billNumber,
      'Customer': bill.customerName,
      'Date': bill.billDate,
      'Tax Amount': bill.taxAmount,
      'Total Amount': bill.totalAmount,
      'Payment Status': bill.paymentStatus,
      'Items Count': bill.items?.length || 0,
    }));
    
    exportToCSV(exportData, `bills-${new Date().toISOString().split('T')[0]}`);
  };

  const billsSummary = getBillsSummary();

  const StatusCard = ({ title, count, amount, icon: Icon, color, status }) => (
    <GlassCard hover className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{count}</p>
          <p className="text-gray-400 text-sm mt-1">{formatCurrency(amount)}</p>
        </div>
        <div className={`p-3 ${color} rounded-full`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </GlassCard>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Billing Management</h1>
          <p className="text-gray-300 mt-1">Create and manage customer bills</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Search size={16} />
            <span>Advanced Search</span>
          </button>
          
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
            disabled={bills.length === 0}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          
          {hasPermission('manage_bills') && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Create Bill</span>
            </button>
          )}
        </div>
      </div>

      {/* Bills Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          title="Pending Bills"
          count={billsSummary.pendingBills}
          amount={billsSummary.pendingAmount}
          icon={Clock}
          color="bg-yellow-500 bg-opacity-20"
          status={PAYMENT_STATUS.PENDING}
        />
        <StatusCard
          title="Paid Bills"
          count={billsSummary.paidBills}
          amount={billsSummary.paidAmount}
          icon={CheckCircle}
          color="bg-green-500 bg-opacity-20"
          status={PAYMENT_STATUS.PAID}
        />
        <StatusCard
          title="Cancelled Bills"
          count={billsSummary.cancelledBills}
          amount={0}
          icon={XCircle}
          color="bg-red-500 bg-opacity-20"
          status={PAYMENT_STATUS.CANCELLED}
        />
      </div>

      {/* Search and Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bills by number, customer name..."
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
              <option value={PAYMENT_STATUS.PENDING}>Pending</option>
              <option value={PAYMENT_STATUS.PAID}>Paid</option>
              <option value={PAYMENT_STATUS.CANCELLED}>Cancelled</option>
            </select>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-3 text-gray-300 text-sm">
          Showing {bills.length} bills
          {statusFilter && ` with status: ${statusFilter}`}
        </div>
      </GlassCard>

      {/* Bills Table */}
      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Loading bills..." />
          </div>
        ) : bills.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Receipt size={48} className="mx-auto mb-2 opacity-50" />
              <p>No bills found</p>
              <p className="text-sm">Create your first bill to get started</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white border-opacity-10">
                  <th className="text-left p-4 text-gray-300 font-medium">Bill Number</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Customer</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Date</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Total Amount</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr
                    key={bill.billId}
                    className={`
                      table-row border-b border-white border-opacity-5 
                      ${index % 2 === 0 ? 'bg-white bg-opacity-5' : ''}
                    `}
                  >
                    <td className="p-4">
                      <span className="text-white font-mono text-sm">
                        {bill.billNumber}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{bill.customerName}</p>
                        <p className="text-gray-400 text-sm">ID: {bill.customerId}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{new Date(bill.billDate).toLocaleDateString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">{formatCurrency(bill.totalAmount)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`status-badge ${
                        bill.paymentStatus === 'PAID' ? 'status-paid' :
                        bill.paymentStatus === 'PENDING' ? 'status-pending' :
                        'status-cancelled'
                      }`}>
                        {bill.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingBill(bill)}
                          className="p-2 glass-button hover:bg-blue-500 hover:bg-opacity-30"
                          title="View Bill"
                        >
                          <Eye size={16} className="text-blue-300" />
                        </button>
                        
                        {bill.paymentStatus === PAYMENT_STATUS.PENDING && hasPermission('manage_bills') && (
                          <button
                            onClick={() => handlePayBill(bill)}
                            className="p-2 glass-button hover:bg-green-500 hover:bg-opacity-30"
                            title="Mark as Paid"
                          >
                            <CheckCircle size={16} className="text-green-300" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Create Bill Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Bill"
        size="xl"
      >
        <CreateBillForm
          onSubmit={handleCreateBill}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Bill View Modal */}
      <Modal
        isOpen={!!viewingBill}
        onClose={() => setViewingBill(null)}
        title={`Bill ${viewingBill?.billNumber || ''}`}
        size="xl"
      >
        {viewingBill && (
          <BillView
            bill={viewingBill}
            onPayBill={hasPermission('manage_bills') ? handlePayBill : null}
          />
        )}
      </Modal>

      {/* Advanced Search Modal */}
      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        title="Advanced Bill Search"
        size="lg"
      >
        <BillSearch onClose={() => setIsSearchModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default BillingManagement;