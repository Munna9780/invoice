'use client';

import { useState } from 'react';
import { InvoiceData, InvoiceItem } from '../types';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoiceData, setInvoiceData }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'sender' | 'recipient'>('details');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    section?: 'sender' | 'recipient'
  ) => {
    const { name, value } = e.target;

    if (section) {
      setInvoiceData({
        ...invoiceData,
        [section]: {
          ...invoiceData[section],
          [name]: value
        }
      });
    } else {
      setInvoiceData({
        ...invoiceData,
        [name]: value
      });
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const addItem = () => {
    const newId = (invoiceData.items.length + 1).toString();
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          id: newId,
          description: '',
          quantity: 1,
          price: 0
        }
      ]
    });
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({
        ...invoiceData,
        items: invoiceData.items.filter(item => item.id !== id)
      });
    }
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoiceData.tax / 100);
  };

  const calculateDiscount = () => {
    return calculateSubtotal() * (invoiceData.discount / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  return (
    <div className="invoice-form">
      <div className="tabs flex mb-6 border-b overflow-x-auto">
        <button
          className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'items' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'sender' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('sender')}
        >
          From
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'recipient' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('recipient')}
        >
          To
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
            <input
              type="text"
              name="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={handleChange}
              className="input"
              placeholder="INV-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              name="currency"
              value={invoiceData.currency}
              onChange={handleChange}
              className="input"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={invoiceData.issueDate}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={invoiceData.dueDate}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%)</label>
            <input
              type="number"
              name="tax"
              value={invoiceData.tax}
              onChange={handleChange}
              className="input"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={invoiceData.discount}
              onChange={handleChange}
              className="input"
              min="0"
              max="100"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Note/Memo</label>
            <textarea
              name="note"
              value={invoiceData.note}
              onChange={handleChange}
              className="input"
              rows={3}
              placeholder="Thank you for your business!"
            />
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div>
          <div className="mb-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="py-2 px-2 text-left text-sm font-medium text-gray-700 w-24">Qty</th>
                  <th className="py-2 px-2 text-left text-sm font-medium text-gray-700 w-32">Price</th>
                  <th className="py-2 px-2 text-left text-sm font-medium text-gray-700 w-32">Total</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full border-gray-300 rounded p-1 text-sm"
                        placeholder="Description"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full border-gray-300 rounded p-1 text-sm"
                        min="1"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full border-gray-300 rounded p-1 text-sm"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="py-2 px-2 text-sm">
                      {(item.quantity * item.price).toFixed(2)}
                    </td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={invoiceData.items.length === 1}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button
            type="button"
            onClick={addItem}
            className="text-primary-600 border border-primary-600 px-3 py-1 rounded text-sm hover:bg-primary-50"
          >
            + Add Item
          </button>
          
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span>{calculateSubtotal().toFixed(2)}</span>
            </div>
            {invoiceData.tax > 0 && (
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Tax ({invoiceData.tax}%):</span>
                <span>{calculateTax().toFixed(2)}</span>
              </div>
            )}
            {invoiceData.discount > 0 && (
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Discount ({invoiceData.discount}%):</span>
                <span>-{calculateDiscount().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 font-bold border-t mt-2">
              <span>Total:</span>
              <span>{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sender' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Business/Name</label>
            <input
              type="text"
              name="name"
              value={invoiceData.sender.name}
              onChange={(e) => handleChange(e, 'sender')}
              className="input"
              placeholder="Your Company Name"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={invoiceData.sender.address}
              onChange={(e) => handleChange(e, 'sender')}
              className="input"
              placeholder="Street Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={invoiceData.sender.city}
              onChange={(e) => handleChange(e, 'sender')}
              className="input"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
            <input
              type="text"
              name="state"
              value={invoiceData.sender.state}
              onChange={(e) => handleChange(e, 'sender')}
              className="input"
              placeholder="State/Province"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
            <input
              type="text"
              name="zip"
              value={invoiceData.sender.zip}
              onChange={(e) => handleChange(e, 'sender')}
              className="input"
              placeholder="ZIP/Postal Code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={invoiceData.sender.country}
              onChange={(e) => handleChange(e, 'sender')}
              className="input"
              placeholder="Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={invoiceData.sender.email}
              onChange={(e) => handleChange(e, 'sender')}
              className="input"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={invoiceData.sender.phone}
              onChange={(e) => handleChange(e, 'sender')}
              className="input"
              placeholder="Phone Number"
            />
          </div>
        </div>
      )}

      {activeTab === 'recipient' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
            <input
              type="text"
              name="name"
              value={invoiceData.recipient.name}
              onChange={(e) => handleChange(e, 'recipient')}
              className="input"
              placeholder="Client/Company Name"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={invoiceData.recipient.address}
              onChange={(e) => handleChange(e, 'recipient')}
              className="input"
              placeholder="Street Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={invoiceData.recipient.city}
              onChange={(e) => handleChange(e, 'recipient')}
              className="input"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
            <input
              type="text"
              name="state"
              value={invoiceData.recipient.state}
              onChange={(e) => handleChange(e, 'recipient')}
              className="input"
              placeholder="State/Province"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
            <input
              type="text"
              name="zip"
              value={invoiceData.recipient.zip}
              onChange={(e) => handleChange(e, 'recipient')}
              className="input"
              placeholder="ZIP/Postal Code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={invoiceData.recipient.country}
              onChange={(e) => handleChange(e, 'recipient')}
              className="input"
              placeholder="Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={invoiceData.recipient.email}
              onChange={(e) => handleChange(e, 'recipient')}
              className="input"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={invoiceData.recipient.phone}
              onChange={(e) => handleChange(e, 'recipient')}
              className="input"
              placeholder="Phone Number"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm; 