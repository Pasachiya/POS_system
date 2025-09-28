import React from 'react';
import { CheckCircle, Printer, User, Calendar, Receipt, Package, Clock, XCircle } from 'lucide-react';
import { formatCurrency, formatDate, printReceipt } from '../../utils/helpers';
import { PAYMENT_STATUS } from '../../utils/constants';

const BillView = ({ bill, onPayBill }) => {
  const handlePrint = () => {
    printReceipt(bill);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return <CheckCircle size={16} className="text-green-400" />;
      case PAYMENT_STATUS.PENDING:
        return <Clock size={16} className="text-yellow-400" />;
      case PAYMENT_STATUS.CANCELLED:
        return <XCircle size={16} className="text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return 'text-green-400 bg-green-500 bg-opacity-20';
      case PAYMENT_STATUS.PENDING:
        return 'text-yellow-400 bg-yellow-500 bg-opacity-20';
      case PAYMENT_STATUS.CANCELLED:
        return 'text-red-400 bg-red-500 bg-opacity-20';
      default:
        return 'text-gray-400 bg-gray-500 bg-opacity-20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Bill Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Receipt size={20} />
            <span>Bill {bill.billNumber}</span>
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            {getStatusIcon(bill.paymentStatus)}
            <span className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusColor(bill.paymentStatus)}`}>
              {bill.paymentStatus}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="btn-secondary flex items-center space-x-2"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
          
          {bill.paymentStatus === PAYMENT_STATUS.PENDING && onPayBill && (
            <button
              onClick={() => onPayBill(bill)}
              className="btn-success flex items-center space-x-2"
            >
              <CheckCircle size={16} />
              <span>Mark as Paid</span>
            </button>
          )}
        </div>
      </div>

      {/* Bill Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="p-4 bg-white bg-opacity-5 rounded-lg">
          <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
            <User size={16} />
            <span>Customer Information</span>
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-gray-400 text-sm">Customer Name</label>
              <p className="text-white">{bill.customerName}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Customer ID</label>
              <p className="text-white">#{bill.customerId}</p>
            </div>
          </div>
        </div>

        {/* Bill Information */}
        <div className="p-4 bg-white bg-opacity-5 rounded-lg">
          <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
            <Calendar size={16} />
            <span>Bill Information</span>
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-gray-400 text-sm">Bill Date</label>
              <p className="text-white">{formatDate(bill.billDate)}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Bill ID</label>
              <p className="text-white">#{bill.billId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Items */}
      <div className="p-4 bg-white bg-opacity-5 rounded-lg">
        <h3 className="text-white font-medium mb-4 flex items-center space-x-2">
          <Package size={16} />
          <span>Bill Items</span>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white border-opacity-10">
                <th className="text-left p-3 text-gray-300 text-sm">Item</th>
                <th className="text-left p-3 text-gray-300 text-sm">Quantity</th>
                <th className="text-left p-3 text-gray-300 text-sm">Unit Price</th>
                <th className="text-left p-3 text-gray-300 text-sm">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {bill.items?.map((item, index) => (
                <tr key={item.billItemId || index} className="border-b border-white border-opacity-5">
                  <td className="p-3">
                    <div>
                      <p className="text-white font-medium">{item.itemName}</p>
                      <p className="text-gray-400 text-sm">ID: #{item.itemId}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-white">{item.quantity}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-white">{formatCurrency(item.unitPrice)}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-white font-medium">{formatCurrency(item.subtotal)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Totals */}
      <div className="p-4 bg-white bg-opacity-5 rounded-lg">
        <h3 className="text-white font-medium mb-4">Bill Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal:</span>
            <span>{formatCurrency(bill.totalAmount - bill.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Tax Amount:</span>
            <span>{formatCurrency(bill.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-white text-xl font-bold border-t border-white border-opacity-20 pt-3">
            <span>Total Amount:</span>
            <span>{formatCurrency(bill.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillView;