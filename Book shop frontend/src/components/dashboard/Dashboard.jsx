import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  Package, 
  Receipt, 
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { useItems } from '../../hooks/useItems';
import { useBills } from '../../hooks/useBills';
import { formatCurrency, formatDate } from '../../utils/helpers';
import GlassCard from '../common/GlassCard';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const { customers, loading: customersLoading } = useCustomers();
  const { items, getLowStockItems, loading: itemsLoading } = useItems();
  const { bills, getBillsSummary, loading: billsLoading } = useBills();
  
  // Use useMemo to calculate derived data and prevent unnecessary recalculations
  const dashboardData = useMemo(() => {
    const billsSummary = getBillsSummary();
    const lowStockItems = getLowStockItems(10);
    
    return {
      totalCustomers: customers.length,
      totalItems: items.length,
      lowStockItems: lowStockItems.length,
      billsSummary,
    };
  }, [customers.length, items.length, bills, getBillsSummary, getLowStockItems]);

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <GlassCard hover className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 ${color} rounded-full`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp size={16} className="text-green-400 mr-1" />
          <span className="text-green-400 text-sm">{trend}</span>
        </div>
      )}
    </GlassCard>
  );

  const RecentActivity = () => {
    const recentBills = useMemo(() => 
      bills
        .sort((a, b) => new Date(b.billDate) - new Date(a.billDate))
        .slice(0, 5),
      [bills]
    );

    return (
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Bills</h3>
        <div className="space-y-3">
          {recentBills.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No recent bills</p>
          ) : (
            recentBills.map((bill) => (
              <div key={bill.billId} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    bill.paymentStatus === 'PAID' ? 'bg-green-500 bg-opacity-20' :
                    bill.paymentStatus === 'PENDING' ? 'bg-yellow-500 bg-opacity-20' :
                    'bg-red-500 bg-opacity-20'
                  }`}>
                    {bill.paymentStatus === 'PAID' ? <CheckCircle size={16} className="text-green-400" /> :
                     bill.paymentStatus === 'PENDING' ? <Clock size={16} className="text-yellow-400" /> :
                     <AlertTriangle size={16} className="text-red-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{bill.billNumber}</p>
                    <p className="text-gray-400 text-sm">{bill.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatCurrency(bill.totalAmount)}</p>
                  <p className="text-gray-400 text-sm">{formatDate(bill.billDate)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    );
  };

  const LowStockAlert = () => {
    const lowStockItems = useMemo(() => getLowStockItems(10), [getLowStockItems]);

    if (lowStockItems.length === 0) {
      return null;
    }

    return (
      <GlassCard className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle size={20} className="text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Low Stock Alert</h3>
        </div>
        <div className="space-y-2">
          {lowStockItems.slice(0, 5).map((item) => (
            <div key={item.itemId} className="flex items-center justify-between p-2 bg-red-500 bg-opacity-10 rounded-lg">
              <div>
                <p className="text-white font-medium">{item.itemName}</p>
                <p className="text-gray-400 text-sm">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-red-400 font-medium">{item.stockQuantity} left</p>
              </div>
            </div>
          ))}
          {lowStockItems.length > 5 && (
            <p className="text-gray-400 text-sm text-center mt-2">
              +{lowStockItems.length - 5} more items
            </p>
          )}
        </div>
      </GlassCard>
    );
  };

  if (customersLoading || itemsLoading || billsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-300">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={dashboardData.totalCustomers}
          icon={Users}
          color="bg-blue-500 bg-opacity-20"
          subtitle="Active customers"
        />
        <StatCard
          title="Total Items"
          value={dashboardData.totalItems}
          icon={Package}
          color="bg-green-500 bg-opacity-20"
          subtitle="In inventory"
        />
        <StatCard
          title="Total Bills"
          value={dashboardData.billsSummary?.totalBills || 0}
          icon={Receipt}
          color="bg-purple-500 bg-opacity-20"
          subtitle="All time"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardData.billsSummary?.totalAmount || 0)}
          icon={DollarSign}
          color="bg-yellow-500 bg-opacity-20"
          subtitle="All time"
        />
      </div>

      {/* Bills Summary */}
      {dashboardData.billsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Pending Bills"
            value={dashboardData.billsSummary.pendingBills}
            icon={Clock}
            color="bg-yellow-500 bg-opacity-20"
            subtitle={formatCurrency(dashboardData.billsSummary.pendingAmount)}
          />
          <StatCard
            title="Paid Bills"
            value={dashboardData.billsSummary.paidBills}
            icon={CheckCircle}
            color="bg-green-500 bg-opacity-20"
            subtitle={formatCurrency(dashboardData.billsSummary.paidAmount)}
          />
          <StatCard
            title="Cancelled Bills"
            value={dashboardData.billsSummary.cancelledBills}
            icon={AlertTriangle}
            color="bg-red-500 bg-opacity-20"
            subtitle="Cancelled orders"
          />
        </div>
      )}

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <LowStockAlert />
      </div>
    </div>
  );
};

export default Dashboard;