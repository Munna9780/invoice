'use client';

import { useState, useRef } from 'react';
import { convertPDFToDocx, convertDocxToPDF, downloadFile } from '../utils/converters';

const PDFConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'docx' | 'pdf'>('docx');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-select target format based on input file
      setTargetFormat(file.name.toLowerCase().endsWith('.pdf') ? 'docx' : 'pdf');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setTargetFormat(file.name.toLowerCase().endsWith('.pdf') ? 'docx' : 'pdf');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    try {
      setIsConverting(true);
      
      let convertedBlob: Blob;
      const isPDF = selectedFile.name.toLowerCase().endsWith('.pdf');
      
      if (isPDF) {
        convertedBlob = await convertPDFToDocx(selectedFile);
      } else {
        convertedBlob = await convertDocxToPDF(selectedFile);
      }
      
      // Generate filename
      const originalName = selectedFile.name.split('.')[0];
      const newFilename = `${originalName}.${targetFormat}`;
      
      // Download the converted file
      downloadFile(convertedBlob, newFilename);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert file. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Convert PDF to Word or Word to PDF</h2>
        <p className="text-gray-600">
          Upload your file and we'll convert it to your desired format instantly.
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-2">
          {selectedFile ? selectedFile.name : 'Drag and drop your file here or click to browse'}
        </p>
        <p className="text-sm text-gray-500">
          Supported formats: PDF, DOC, DOCX
        </p>
      </div>

      {/* Conversion Options */}
      {selectedFile && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Convert to:
          </label>
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value as 'docx' | 'pdf')}
            className="input mb-4"
          >
            <option value="pdf">PDF</option>
            <option value="docx">Word (DOCX)</option>
          </select>

          <button
            onClick={handleConvert}
            disabled={isConverting}
            className="btn btn-primary w-full"
          >
            {isConverting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Converting...
              </span>
            ) : (
              'Convert Now'
            )}
          </button>
        </div>
      )}

      {/* Features List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">High Quality</h3>
          <p className="text-sm text-gray-600">
            Maintain formatting and quality during conversion
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Fast Processing</h3>
          <p className="text-sm text-gray-600">
            Convert your files in seconds
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Secure</h3>
          <p className="text-sm text-gray-600">
            Files are processed locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFConverter; 