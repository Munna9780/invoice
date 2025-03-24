'use client';

import { useState } from 'react';
import ConverterSelector from './components/ConverterSelector';
import PDFConverter from './components/PDFConverter';
import ImageConverter from './components/ImageConverter';
import AudioConverter from './components/AudioConverter';
import VideoConverter from './components/VideoConverter';
import SpreadsheetConverter from './components/SpreadsheetConverter';

type ConverterType = 'pdf' | 'image' | 'audio' | 'video' | 'spreadsheet';

export default function FileConvertersPage() {
  const [activeConverter, setActiveConverter] = useState<ConverterType>('pdf');

  const renderConverter = () => {
    switch (activeConverter) {
      case 'pdf':
        return <PDFConverter />;
      case 'image':
        return <ImageConverter />;
      case 'audio':
        return <AudioConverter />;
      case 'video':
        return <VideoConverter />;
      case 'spreadsheet':
        return <SpreadsheetConverter />;
      default:
        return <PDFConverter />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-3">Free File Converters</h1>
            <p className="text-gray-600">
              Convert your files to different formats easily. No signup required.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <ConverterSelector 
              activeConverter={activeConverter} 
              setActiveConverter={setActiveConverter} 
            />
            <div className="p-6">
              {renderConverter()}
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              Your files are securely processed in your browser. We don't upload or store your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 