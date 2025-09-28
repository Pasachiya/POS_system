import React, { useState } from 'react';
import { Edit, Trash2, Eye, Package, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import Modal from '../common/Modal';

const ItemTable = ({ items, onEdit, onDelete, onView }) => {
  const [viewingItem, setViewingItem] = useState(null);

  const ItemDetailsModal = ({ item, onClose }) => (
    <Modal isOpen={!!item} onClose={onClose} title="Item Details" size="lg">
      {item && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Item ID</label>
                <p className="text-white font-medium">#{item.itemId}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Item Name</label>
                <p className="text-white font-medium">{item.itemName}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Category</label>
                <p className="text-white">{item.category}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Unit Price</label>
                <p className="text-white font-medium">{formatCurrency(item.price)}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Stock Quantity</label>
                <div className="flex items-center space-x-2">
                  <p className="text-white">{item.stockQuantity}</p>
                  {item.stockQuantity <= 10 && (
                    <AlertTriangle size={16} className="text-yellow-400" />
                  )}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Total Value</label>
                <p className="text-white font-medium">{formatCurrency(item.price * item.stockQuantity)}</p>
              </div>
            </div>
          </div>
          
          {item.stockQuantity <= 10 && (
            <div className="mt-4 p-3 bg-yellow-500 bg-opacity-20 border border-yellow-400 border-opacity-30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle size={16} className="text-yellow-400" />
                <p className="text-yellow-200 text-sm font-medium">Low Stock Warning</p>
              </div>
              <p className="text-yellow-100 text-sm mt-1">
                This item is running low on stock. Consider restocking soon.
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Package size={48} className="mx-auto mb-2 opacity-50" />
          <p>No items found</p>
          <p className="text-sm">Add your first item to get started</p>
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
              <th className="text-left p-4 text-gray-300 font-medium">Item Name</th>
              <th className="text-left p-4 text-gray-300 font-medium">Category</th>
              <th className="text-left p-4 text-gray-300 font-medium">Price</th>
              <th className="text-left p-4 text-gray-300 font-medium">Stock</th>
              <th className="text-left p-4 text-gray-300 font-medium">Total Value</th>
              <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.itemId}
                className={`
                  table-row border-b border-white border-opacity-5 
                  ${index % 2 === 0 ? 'bg-white bg-opacity-5' : ''}
                `}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white bg-opacity-10 rounded-lg">
                      <Package size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.itemName}</p>
                      <p className="text-gray-400 text-sm">ID: #{item.itemId}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-200 rounded-md text-sm">
                    {item.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-white font-medium">{formatCurrency(item.price)}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${item.stockQuantity <= 10 ? 'text-yellow-400' : 'text-white'}`}>
                      {item.stockQuantity}
                    </span>
                    {item.stockQuantity <= 10 && (
                      <AlertTriangle size={16} className="text-yellow-400" title="Low Stock" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-white font-medium">
                    {formatCurrency(item.price * item.stockQuantity)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewingItem(item)}
                      className="p-2 glass-button hover:bg-blue-500 hover:bg-opacity-30"
                      title="View Details"
                    >
                      <Eye size={16} className="text-blue-300" />
                    </button>
                    
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 glass-button hover:bg-green-500 hover:bg-opacity-30"
                        title="Edit Item"
                      >
                        <Edit size={16} className="text-green-300" />
                      </button>
                    )}
                    
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 glass-button hover:bg-red-500 hover:bg-opacity-30"
                        title="Delete Item"
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

      {/* Item Details Modal */}
      <ItemDetailsModal
        item={viewingItem}
        onClose={() => setViewingItem(null)}
      />
    </>
  );
};

export default ItemTable;