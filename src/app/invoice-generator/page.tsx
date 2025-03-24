'use client';

import { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { InvoiceData } from './types';

export default function InvoiceGeneratorPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'USD',
    tax: 0,
    discount: 0,
    sender: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      email: '',
      phone: '',
    },
    recipient: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      email: '',
      phone: '',
    },
    items: [
      {
        id: '1',
        description: '',
        quantity: 1,
        price: 0,
      },
    ],
    note: '',
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-3">Free Invoice Generator</h1>
            <p className="text-gray-600">
              Create professional invoices in seconds. No signup required.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6 border-r border-gray-200">
                <InvoiceForm 
                  invoiceData={invoiceData} 
                  setInvoiceData={setInvoiceData} 
                />
              </div>
              <div className="p-6 bg-gray-50">
                <InvoicePreview invoiceData={invoiceData} />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              All data stays on your device. We don't store any of your information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 