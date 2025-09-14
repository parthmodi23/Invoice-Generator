import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Download, FileText, Calendar, Hash, Calculator, Save, BookOpen, Eye, ArrowLeft, Search } from 'lucide-react';

const AutoWorkshopInvoiceGenerator = () => {
  // Current invoice state
  const [currentInvoice, setCurrentInvoice] = useState({
    workshopName: 'AUTO SERVICE CENTER',
    address: 'Jakatnaka, Surat, Gujarat',
    phone: '+91 98765 43210',
    email: 'info@autoservice.com',
    date: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    vehicleNo: '',
    model: '',
    km: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: [
      { id: 1, description: 'Oil Change Service', parts: 800, labour: 200, remark: '' }
    ]
  });

  // Saved invoices (in memory)
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [currentView, setCurrentView] = useState('create'); // 'create', 'list', 'view'
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({ description: '', parts: '', labour: '', remark: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Generate next invoice number
  useEffect(() => {
    if (!currentInvoice.invoiceNo) {
      const nextNo = (savedInvoices.length + 1).toString().padStart(4, '0');
      setCurrentInvoice(prev => ({ ...prev, invoiceNo: `INV-${nextNo}` }));
    }
  }, [savedInvoices.length, currentInvoice.invoiceNo]);

  // Calculate totals
  const calculateTotals = (items) => {
    const totalParts = items.reduce((sum, item) => sum + item.parts, 0);
    const totalLabour = items.reduce((sum, item) => sum + item.labour, 0);
    const grandTotal = totalParts + totalLabour;
    return { totalParts, totalLabour, grandTotal };
  };

  // Update invoice data
  const updateInvoiceData = (field, value) => {
    setCurrentInvoice(prev => ({ ...prev, [field]: value }));
  };

  // Update item
  const updateItem = (id, field, value) => {
    setCurrentInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === 'parts' || field === 'labour' 
              ? (parseFloat(value) || 0)
              : value
          };
        }
        return item;
      })
    }));
  };

  // Add new item
  const addItem = () => {
    if (newItem.description.trim()) {
      const item = {
        id: Date.now(),
        description: newItem.description.trim(),
        parts: parseFloat(newItem.parts) || 0,
        labour: parseFloat(newItem.labour) || 0,
        remark: newItem.remark.trim()
      };
      setCurrentInvoice(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
      setNewItem({ description: '', parts: '', labour: '', remark: '' });
      setShowAddForm(false);
    }
  };

  // Remove item
  const removeItem = (id) => {
    setCurrentInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  // Save invoice
  const saveInvoice = () => {
    if (!currentInvoice.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    
    const invoiceToSave = {
      ...currentInvoice,
      id: Date.now(),
      savedAt: new Date().toLocaleString(),
      ...calculateTotals(currentInvoice.items)
    };
    
    setSavedInvoices(prev => [invoiceToSave, ...prev]);
    alert('Invoice saved successfully!');
  };

  // Create new invoice
  const createNewInvoice = () => {
    const nextNo = (savedInvoices.length + 2).toString().padStart(4, '0');
    setCurrentInvoice({
      workshopName: currentInvoice.workshopName,
      address: currentInvoice.address,
      phone: currentInvoice.phone,
      email: currentInvoice.email,
      date: new Date().toISOString().split('T')[0],
      invoiceNo: `INV-${nextNo}`,
      vehicleNo: '',
      model: '',
      km: '',
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      items: [{ id: Date.now(), description: '', parts: 0, labour: 0, remark: '' }]
    });
    setCurrentView('create');
  };

  // Print invoice
  const printInvoice = (invoice) => {
    const printContent = generatePrintHTML(invoice);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Generate print HTML
  const generatePrintHTML = (invoice) => {
    const { totalParts, totalLabour, grandTotal } = calculateTotals(invoice.items);
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoiceNo}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #2563eb; font-size: 24px; }
        .header p { margin: 5px 0; color: #666; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .customer-info { margin-bottom: 20px; padding: 10px; background: #f8f9fa; border-left: 4px solid #2563eb; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #2563eb; color: white; }
        .total-row { background-color: #e6f3ff; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${invoice.workshopName}</h1>
        <p>${invoice.address}</p>
        <p>Phone: ${invoice.phone} | Email: ${invoice.email}</p>
      </div>
      
      <div class="invoice-info">
        <div>
          <h3>Invoice Details</h3>
          <p><strong>Invoice No:</strong> ${invoice.invoiceNo}</p>
          <p><strong>Date:</strong> ${invoice.date}</p>
        </div>
        <div>
          <h3>Vehicle Details</h3>
          <p><strong>Vehicle No:</strong> ${invoice.vehicleNo}</p>
          <p><strong>Model:</strong> ${invoice.model}</p>
          <p><strong>KM:</strong> ${invoice.km}</p>
        </div>
      </div>

      <div class="customer-info">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${invoice.customerName}</p>
        <p><strong>Phone:</strong> ${invoice.customerPhone}</p>
        <p><strong>Address:</strong> ${invoice.customerAddress}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Description</th>
            <th>Parts (₹)</th>
            <th>Labour (₹)</th>
            <th>Total (₹)</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.description}</td>
              <td>₹${item.parts.toFixed(2)}</td>
              <td>₹${item.labour.toFixed(2)}</td>
              <td>₹${(item.parts + item.labour).toFixed(2)}</td>
              <td>${item.remark || '-'}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="2"><strong>TOTAL</strong></td>
            <td><strong>₹${totalParts.toFixed(2)}</strong></td>
            <td><strong>₹${totalLabour.toFixed(2)}</strong></td>
            <td><strong>₹${grandTotal.toFixed(2)}</strong></td>
            <td><strong>-</strong></td>
          </tr>
        </tbody>
      </table>
      
      <div class="footer">
        <p>Thank you for choosing our service!</p>
        <p>For any queries, please contact us at ${invoice.phone}</p>
      </div>
    </body>
    </html>
    `;
  };

  // Filter invoices
  const filteredInvoices = savedInvoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { totalParts, totalLabour, grandTotal } = calculateTotals(currentInvoice.items);

  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                Invoice Book
              </h1>
              <button
                onClick={() => setCurrentView('create')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Create
              </button>
            </div>
            
            {/* Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, invoice no, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Invoices List */}
          <div className="grid gap-4">
            {filteredInvoices.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No invoices found</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{invoice.invoiceNo}</h3>
                        <span className="text-xl font-bold text-green-600">₹{invoice.grandTotal.toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Customer:</span>
                          <p>{invoice.customerName}</p>
                        </div>
                        <div>
                          <span className="font-medium">Vehicle:</span>
                          <p>{invoice.model} - {invoice.vehicleNo}</p>
                        </div>
                        <div>
                          <span className="font-medium">Date:</span>
                          <p>{invoice.date}</p>
                        </div>
                        <div>
                          <span className="font-medium">Items:</span>
                          <p>{invoice.items.length} items</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setViewingInvoice(invoice);
                          setCurrentView('view');
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => printInvoice(invoice)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Print Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'view' && viewingInvoice) {
    const viewTotals = calculateTotals(viewingInvoice.items);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
              <div className="flex justify-between items-start mb-4">
                <button
                  onClick={() => setCurrentView('list')}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => printInvoice(viewingInvoice)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Print
                </button>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold">{viewingInvoice.workshopName}</h1>
                <p className="text-blue-100">{viewingInvoice.address}</p>
                <p className="text-blue-100 text-sm">{viewingInvoice.phone} | {viewingInvoice.email}</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Invoice Details</h3>
                  <p className="text-sm"><span className="font-medium">No:</span> {viewingInvoice.invoiceNo}</p>
                  <p className="text-sm"><span className="font-medium">Date:</span> {viewingInvoice.date}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Vehicle Details</h3>
                  <p className="text-sm"><span className="font-medium">Vehicle:</span> {viewingInvoice.vehicleNo}</p>
                  <p className="text-sm"><span className="font-medium">Model:</span> {viewingInvoice.model}</p>
                  <p className="text-sm"><span className="font-medium">KM:</span> {viewingInvoice.km}</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Customer Details</h3>
                <p className="text-sm"><span className="font-medium">Name:</span> {viewingInvoice.customerName}</p>
                <p className="text-sm"><span className="font-medium">Phone:</span> {viewingInvoice.customerPhone}</p>
                <p className="text-sm"><span className="font-medium">Address:</span> {viewingInvoice.customerAddress}</p>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left text-sm">No.</th>
                      <th className="border border-gray-300 p-2 text-left text-sm">Description</th>
                      <th className="border border-gray-300 p-2 text-left text-sm">Parts</th>
                      <th className="border border-gray-300 p-2 text-left text-sm">Labour</th>
                      <th className="border border-gray-300 p-2 text-left text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingInvoice.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 p-2 text-sm">{index + 1}</td>
                        <td className="border border-gray-300 p-2 text-sm">{item.description}</td>
                        <td className="border border-gray-300 p-2 text-sm">₹{item.parts.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-sm">₹{item.labour.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-sm">₹{(item.parts + item.labour).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="text-right space-y-1">
                  <p className="text-sm">Parts: <span className="font-medium">₹{viewTotals.totalParts.toFixed(2)}</span></p>
                  <p className="text-sm">Labour: <span className="font-medium">₹{viewTotals.totalLabour.toFixed(2)}</span></p>
                  <p className="text-lg font-bold text-green-700">Total: ₹{viewTotals.grandTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Navigation */}
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Invoice Generator</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('list')}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              View All ({savedInvoices.length})
            </button>
          </div>
        </div>

        {/* Main Invoice Container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 relative">
            <div className="text-center">
              <input
                type="text"
                value={currentInvoice.workshopName}
                onChange={(e) => updateInvoiceData('workshopName', e.target.value)}
                className="bg-transparent text-white text-xl font-bold border-none outline-none text-center placeholder-blue-200 w-full"
                placeholder="Workshop Name"
              />
              <input
                type="text"
                value={currentInvoice.address}
                onChange={(e) => updateInvoiceData('address', e.target.value)}
                className="bg-transparent text-blue-100 text-sm border-none outline-none text-center placeholder-blue-300 w-full mt-1"
                placeholder="Address"
              />
              <div className="flex justify-center gap-4 mt-2 text-xs text-blue-100">
                <input
                  type="text"
                  value={currentInvoice.phone}
                  onChange={(e) => updateInvoiceData('phone', e.target.value)}
                  className="bg-transparent border-none outline-none text-center placeholder-blue-300 w-24"
                  placeholder="Phone"
                />
                <input
                  type="text"
                  value={currentInvoice.email}
                  onChange={(e) => updateInvoiceData('email', e.target.value)}
                  className="bg-transparent border-none outline-none text-center placeholder-blue-300 w-32"
                  placeholder="Email"
                />
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={currentInvoice.date}
                  onChange={(e) => updateInvoiceData('date', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={currentInvoice.invoiceNo}
                  onChange={(e) => updateInvoiceData('invoiceNo', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Invoice No."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Vehicle No."
                value={currentInvoice.vehicleNo}
                onChange={(e) => updateInvoiceData('vehicleNo', e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Model"
                value={currentInvoice.model}
                onChange={(e) => updateInvoiceData('model', e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="KM"
                value={currentInvoice.km}
                onChange={(e) => updateInvoiceData('km', e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Customer Details</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Customer Name *"
                value={currentInvoice.customerName}
                onChange={(e) => updateInvoiceData('customerName', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={currentInvoice.customerPhone}
                  onChange={(e) => updateInvoiceData('customerPhone', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Customer Address"
                  value={currentInvoice.customerAddress}
                  onChange={(e) => updateInvoiceData('customerAddress', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 h-16 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Service Items</h3>
            
            {/* Items List */}
            <div className="space-y-3 mb-4">
              {currentInvoice.items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Service description"
                    className="w-full px-3 py-2 border rounded text-sm mb-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={item.parts}
                      onChange={(e) => updateItem(item.id, 'parts', e.target.value)}
                      placeholder="Parts ₹"
                      className="px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={item.labour}
                      onChange={(e) => updateItem(item.id, 'labour', e.target.value)}
                      placeholder="Labour ₹"
                      className="px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.remark}
                    onChange={(e) => updateItem(item.id, 'remark', e.target.value)}
                    placeholder="Remark (optional)"
                    className="w-full px-3 py-2 border rounded text-sm mt-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="text-right text-sm font-medium text-gray-700 mt-2">
                    Total: ₹{(item.parts + item.labour).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item Form */}
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service Item
              </button>
            ) : (
              <div className="border rounded-lg p-4 bg-blue-50 space-y-3">
                <input
                  type="text"
                  placeholder="Service description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Parts cost"
                    value={newItem.parts}
                    onChange={(e) => setNewItem(prev => ({ ...prev, parts: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    placeholder="Labour cost"
                    value={newItem.labour}
                    onChange={(e) => setNewItem(prev => ({ ...prev, labour: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Remark (optional)"
                  value={newItem.remark}
                  onChange={(e) => setNewItem(prev => ({ ...prev, remark: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addItem}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewItem({ description: '', parts: '', labour: '', remark: '' });
                    }}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-t">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Parts:</span>
                <span className="font-medium">₹{totalParts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Labour:</span>
                <span className="font-medium">₹{totalLabour.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-green-700 border-t pt-2">
                <span>GRAND TOTAL:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-white">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={saveInvoice}
                className="flex items-center justify-center px-3 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={() => printInvoice(currentInvoice)}
                className="flex items-center justify-center px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-1" />
                Print
              </button>
              <button
                onClick={createNewInvoice}
                className="flex items-center justify-center px-3 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-3 text-center text-xs text-gray-500 border-t">
            <p>Invoice Generator - Professional Auto Workshop Solution</p>
          </div>
        </div>
        
        {/* Live Total Summary */}
        <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-gray-700">Current Invoice</span>
            </div>
            <div className="text-xl font-bold text-green-600">₹{grandTotal.toFixed(2)}</div>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>Parts: ₹{totalParts.toFixed(2)}</span>
            <span>Labour: ₹{totalLabour.toFixed(2)}</span>
            <span>Items: {currentInvoice.items.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoWorkshopInvoiceGenerator