import { PDFPage } from 'pdf-lib';

declare module 'pdf-lib' {
  interface PDFPage {
    getTextContent(): string;
  }
} 