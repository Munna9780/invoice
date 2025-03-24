'use client';

import { useState, useRef } from 'react';

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('jpeg');
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

    setIsConverting(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('targetFormat', targetFormat);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name.replace(/\.[^/.]+$/, '') + '.' + targetFormat;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Failed to convert image. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div className="space-y-4">
          <div className="text-4xl">📷</div>
          <div className="text-lg font-medium">
            {selectedFile ? selectedFile.name : 'Drop your image here or click to select'}
          </div>
          <div className="text-sm text-gray-500">
            Supports JPG, PNG, WebP, and AVIF formats
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Convert to:
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
            </select>
          </div>

          <button
            onClick={handleConvert}
            disabled={isConverting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConverting ? 'Converting...' : 'Convert Image'}
          </button>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium">Features:</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            High-quality image conversion
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Support for multiple formats
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Fast processing
          </li>
        </ul>
      </div>
    </div>
  );
} 