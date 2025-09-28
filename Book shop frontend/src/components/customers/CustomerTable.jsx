import React, { useState } from 'react';
import { Edit, Trash2, Eye, Phone, MapPin, Users } from 'lucide-react';
import { formatDate, getStatusColor } from '../../utils/helpers';
import Modal from '../common/Modal';

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  const [viewingCustomer, setViewingCustomer] = useState(null);

  const CustomerDetailsModal = ({ customer, onClose }) => (
    <Modal isOpen={!!customer} onClose={onClose} title="Customer Details" size="lg">
      {customer && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Account Number</label>
                <p className="text-white font-medium">{customer.accountNumber}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Customer Name</label>
                <p className="text-white font-medium">{customer.customerName}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Registration Date</label>
                <p className="text-white">{formatDate(customer.registrationDate)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm flex items-center">
                  <Phone size={14} className="mr-1" />
                  Telephone
                </label>
                <p className="text-white">{customer.telephoneNumber}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm flex items-center">
                  <MapPin size={14} className="mr-1" />
                  Address
                </label>
                <p className="text-white">{customer.address}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );

  if (customers.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Users size={48} className="mx-auto mb-2 opacity-50" />
          <p>No customers found</p>
          <p className="text-sm">Add your first customer to get started</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white border-opacity-10">
              <th className="text-left p-4 text-gray-300 font-medium">Account No.</th>
              <th className="text-left p-4 text-gray-300 font-medium">Customer Name</th>
              <th className="text-left p-4 text-gray-300 font-medium">Phone</th>
              <th className="text-left p-4 text-gray-300 font-medium">Registration Date</th>
              <th className="text-left p-4 text-gray-300 font-medium">Status</th>
              <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={customer.customerId}
                className={`
                  table-row border-b border-white border-opacity-5 
                  ${index % 2 === 0 ? 'bg-white bg-opacity-5' : ''}
                `}
              >
                <td className="p-4">
                  <span className="text-white font-mono text-sm">
                    {customer.accountNumber}
                  </span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-white font-medium">{customer.customerName}</p>
                    <p className="text-gray-400 text-sm truncate max-w-32" title={customer.address}>
                      {customer.address}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-gray-300">{customer.telephoneNumber}</span>
                </td>
                <td className="p-4">
                  <span className="text-gray-300">{formatDate(customer.registrationDate)}</span>
                </td>
                <td className="p-4">
                  <span className={`status-badge ${customer.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewingCustomer(customer)}
                      className="p-2 glass-button hover:bg-blue-500 hover:bg-opacity-30"
                      title="View Details"
                    >
                      <Eye size={16} className="text-blue-300" />
                    </button>
                    
                    {onEdit && (
                      <button
                        onClick={() => onEdit(customer)}
                        className="p-2 glass-button hover:bg-green-500 hover:bg-opacity-30"
                        title="Edit Customer"
                      >
                        <Edit size={16} className="text-green-300" />
                      </button>
                    )}
                    
                    {onDelete && (
                      <button
                        onClick={() => onDelete(customer)}
                        className="p-2 glass-button hover:bg-red-500 hover:bg-opacity-30"
                        title="Delete Customer"
                      >
                        <Trash2 size={16} className="text-red-300" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={viewingCustomer}
        onClose={() => setViewingCustomer(null)}
      />
    </>
  );
};

export default CustomerTable;