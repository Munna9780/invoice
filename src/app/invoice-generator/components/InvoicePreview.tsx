'use client';

import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from '../types';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD':
      case 'CAD':
      case 'AUD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'JPY':
        return '¥';
      default:
        return '';
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

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoiceData.invoiceNumber || 'Draft'}.pdf`);
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="invoice-preview">
      <div className="text-right mb-6 print:hidden">
        <button
          onClick={downloadPDF}
          className="btn btn-primary mr-2"
          disabled={!invoiceData.recipient.name}
        >
          Download PDF
        </button>
        <button
          onClick={printInvoice}
          className="btn btn-secondary"
          disabled={!invoiceData.recipient.name}
        >
          Print
        </button>
      </div>

      <div 
        ref={invoiceRef} 
        className="bg-white p-8 rounded shadow-sm border border-gray-200"
        style={{ minHeight: '29.7cm', maxWidth: '21cm', margin: '0 auto' }}
      >
        {/* Invoice Header */}
        <div className="flex justify-between mb-8">
          <div>
            {invoiceData.sender.name && (
              <h2 className="text-xl font-bold text-gray-800">{invoiceData.sender.name}</h2>
            )}
            {invoiceData.sender.address && (
              <p className="text-gray-600">{invoiceData.sender.address}</p>
            )}
            {(invoiceData.sender.city || invoiceData.sender.state || invoiceData.sender.zip) && (
              <p className="text-gray-600">
                {invoiceData.sender.city && `${invoiceData.sender.city}, `}
                {invoiceData.sender.state && `${invoiceData.sender.state} `}
                {invoiceData.sender.zip}
              </p>
            )}
            {invoiceData.sender.country && (
              <p className="text-gray-600">{invoiceData.sender.country}</p>
            )}
            {invoiceData.sender.email && (
              <p className="text-gray-600 mt-2">{invoiceData.sender.email}</p>
            )}
            {invoiceData.sender.phone && (
              <p className="text-gray-600">{invoiceData.sender.phone}</p>
            )}
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800 uppercase mb-2">INVOICE</h1>
            {invoiceData.invoiceNumber && (
              <p className="text-gray-600">
                <span className="font-semibold">Invoice #:</span> {invoiceData.invoiceNumber}
              </p>
            )}
            {invoiceData.issueDate && (
              <p className="text-gray-600">
                <span className="font-semibold">Date Issued:</span> {invoiceData.issueDate}
              </p>
            )}
            {invoiceData.dueDate && (
              <p className="text-gray-600">
                <span className="font-semibold">Due Date:</span> {invoiceData.dueDate}
              </p>
            )}
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Bill To:</h3>
          {invoiceData.recipient.name && (
            <p className="font-medium">{invoiceData.recipient.name}</p>
          )}
          {invoiceData.recipient.address && (
            <p className="text-gray-600">{invoiceData.recipient.address}</p>
          )}
          {(invoiceData.recipient.city || invoiceData.recipient.state || invoiceData.recipient.zip) && (
            <p className="text-gray-600">
              {invoiceData.recipient.city && `${invoiceData.recipient.city}, `}
              {invoiceData.recipient.state && `${invoiceData.recipient.state} `}
              {invoiceData.recipient.zip}
            </p>
          )}
          {invoiceData.recipient.country && (
            <p className="text-gray-600">{invoiceData.recipient.country}</p>
          )}
          {invoiceData.recipient.email && (
            <p className="text-gray-600 mt-2">{invoiceData.recipient.email}</p>
          )}
          {invoiceData.recipient.phone && (
            <p className="text-gray-600">{invoiceData.recipient.phone}</p>
          )}
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-2 text-left text-gray-700 font-semibold">Description</th>
                <th className="py-2 text-right text-gray-700 font-semibold">Quantity</th>
                <th className="py-2 text-right text-gray-700 font-semibold">Price</th>
                <th className="py-2 text-right text-gray-700 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 text-left">
                    {item.description || 'Item description'}
                  </td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">
                    {getCurrencySymbol(invoiceData.currency)}
                    {item.price.toFixed(2)}
                  </td>
                  <td className="py-3 text-right">
                    {getCurrencySymbol(invoiceData.currency)}
                    {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Subtotal:</span>
              <span>
                {getCurrencySymbol(invoiceData.currency)}
                {calculateSubtotal().toFixed(2)}
              </span>
            </div>
            
            {invoiceData.tax > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Tax ({invoiceData.tax}%):</span>
                <span>
                  {getCurrencySymbol(invoiceData.currency)}
                  {calculateTax().toFixed(2)}
                </span>
              </div>
            )}
            
            {invoiceData.discount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Discount ({invoiceData.discount}%):</span>
                <span>
                  -{getCurrencySymbol(invoiceData.currency)}
                  {calculateDiscount().toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between py-2 font-bold">
              <span>Total:</span>
              <span>
                {getCurrencySymbol(invoiceData.currency)}
                {calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Note */}
        {invoiceData.note && (
          <div className="mt-12 border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Notes:</h3>
            <p className="text-gray-600">{invoiceData.note}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview; 