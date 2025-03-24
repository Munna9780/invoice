'use client';

import { useState, useRef } from 'react';
import { convertSpreadsheet, downloadFile } from '../utils/converters';

const SpreadsheetConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'xlsx' | 'csv' | 'xls' | 'ods'>('xlsx');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    try {
      setIsConverting(true);
      
      // Convert the spreadsheet file
      const convertedBlob = await convertSpreadsheet(selectedFile, targetFormat);
      
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
        <h2 className="text-xl font-semibold mb-2">Convert Spreadsheet Files</h2>
        <p className="text-gray-600">
          Convert your spreadsheets between different formats while preserving formatting.
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
          accept=".xlsx,.xls,.csv,.ods"
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
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-2">
          {selectedFile ? selectedFile.name : 'Drag and drop your spreadsheet here or click to browse'}
        </p>
        <p className="text-sm text-gray-500">
          Supported formats: XLSX, XLS, CSV, ODS
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
            onChange={(e) => setTargetFormat(e.target.value as 'xlsx' | 'csv' | 'xls' | 'ods')}
            className="input mb-4"
          >
            <option value="xlsx">Excel (XLSX)</option>
            <option value="csv">CSV</option>
            <option value="xls">Excel 97-2003 (XLS)</option>
            <option value="ods">OpenDocument (ODS)</option>
          </select>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options:
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-sm text-gray-600">Preserve formatting</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-sm text-gray-600">Include headers</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-sm text-gray-600">Keep formulas (when possible)</span>
              </label>
            </div>
          </div>

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
          <h3 className="font-medium mb-2">Format Preservation</h3>
          <p className="text-sm text-gray-600">
            Keep your spreadsheet formatting intact
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Multiple Formats</h3>
          <p className="text-sm text-gray-600">
            Support for all major spreadsheet formats
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Advanced Options</h3>
          <p className="text-sm text-gray-600">
            Customize your conversion settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetConverter; 