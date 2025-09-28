export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateAccountNumber = () => {
  const prefix = 'PAH';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const generateBillNumber = () => {
  const prefix = 'BILL';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}${timestamp}${random}`;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const calculateSubtotal = (quantity, unitPrice) => {
  return quantity * unitPrice;
};

export const calculateTax = (subtotal, taxRate = 0.1) => {
  return subtotal * taxRate;
};

export const calculateTotal = (subtotal, tax = 0) => {
  return subtotal + tax;
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getStatusColor = (status) => {
  const statusColors = {
    ACTIVE: 'text-green-600 bg-green-100',
    INACTIVE: 'text-red-600 bg-red-100',
    PENDING: 'text-yellow-600 bg-yellow-100',
    PAID: 'text-green-600 bg-green-100',
    CANCELLED: 'text-red-600 bg-red-100',
  };
  return statusColors[status] || 'text-gray-600 bg-gray-100';
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const printReceipt = (billData) => {
  const printWindow = window.open('', '_blank');
  const printContent = generateReceiptHTML(billData);
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

const generateReceiptHTML = (billData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - ${billData.billNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .receipt-header { text-align: center; margin-bottom: 20px; }
        .receipt-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .receipt-table th, .receipt-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .receipt-table th { background-color: #f2f2f2; }
        .total-row { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="receipt-header">
        <h2>Pahana Edu Bookshop</h2>
        <p>Receipt #${billData.billNumber}</p>
        <p>Date: ${formatDate(billData.billDate)}</p>
        <p>Customer: ${billData.customerName}</p>
      </div>
      <table class="receipt-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${billData.items.map(item => `
            <tr>
              <td>${item.itemName}</td>
              <td>${item.quantity}</td>
              <td>${formatCurrency(item.unitPrice)}</td>
              <td>${formatCurrency(item.subtotal)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="total-row">Tax:</td>
            <td class="total-row">${formatCurrency(billData.taxAmount)}</td>
          </tr>
          <tr>
            <td colspan="3" class="total-row">Total:</td>
            <td class="total-row">${formatCurrency(billData.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
      <div style="text-align: center; margin-top: 30px;">
        <p>Thank you for your business!</p>
      </div>
    </body>
    </html>
  `;
};