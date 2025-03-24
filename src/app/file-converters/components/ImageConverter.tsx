'use client';

import { useState, useRef } from 'react';
import { convertImage, downloadFile } from '../utils/converters';

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'jpg' | 'png' | 'webp' | 'gif'>('jpg');
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
      
      // Convert the image
      const convertedBlob = await convertImage(selectedFile, targetFormat);
      
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
        <h2 className="text-xl font-semibold mb-2">Convert Images to Any Format</h2>
        <p className="text-gray-600">
          Transform your images between different formats while maintaining quality.
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
          accept="image/*"
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-2">
          {selectedFile ? selectedFile.name : 'Drag and drop your image here or click to browse'}
        </p>
        <p className="text-sm text-gray-500">
          Supported formats: JPG, PNG, WEBP, GIF
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
            onChange={(e) => setTargetFormat(e.target.value as 'jpg' | 'png' | 'webp' | 'gif')}
            className="input mb-4"
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
            <option value="gif">GIF</option>
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
          <h3 className="font-medium mb-2">Preserve Quality</h3>
          <p className="text-sm text-gray-600">
            Convert without losing image quality
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Multiple Formats</h3>
          <p className="text-sm text-gray-600">
            Support for all popular image formats
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Fast Processing</h3>
          <p className="text-sm text-gray-600">
            Convert your images in seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter; 