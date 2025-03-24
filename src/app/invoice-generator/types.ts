export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Address {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  tax: number;
  discount: number;
  sender: Address;
  recipient: Address;
  items: InvoiceItem[];
  note: string;
}