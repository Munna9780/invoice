'use client';

import { useState, useRef } from 'react';
import { convertAudio, downloadFile } from '../utils/converters';

const AudioConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'mp3' | 'wav' | 'ogg' | 'm4a'>('mp3');
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
      
      // Convert the audio file
      const convertedBlob = await convertAudio(selectedFile, targetFormat);
      
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
        <h2 className="text-xl font-semibold mb-2">Convert Audio Files</h2>
        <p className="text-gray-600">
          Convert your audio files to different formats while preserving quality.
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
          accept="audio/*"
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
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-2">
          {selectedFile ? selectedFile.name : 'Drag and drop your audio file here or click to browse'}
        </p>
        <p className="text-sm text-gray-500">
          Supported formats: MP3, WAV, OGG, M4A
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
            onChange={(e) => setTargetFormat(e.target.value as 'mp3' | 'wav' | 'ogg' | 'm4a')}
            className="input mb-4"
          >
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="ogg">OGG</option>
            <option value="m4a">M4A</option>
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
            Maintain audio quality during conversion
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Multiple Formats</h3>
          <p className="text-sm text-gray-600">
            Support for popular audio formats
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Fast Processing</h3>
          <p className="text-sm text-gray-600">
            Convert your audio files quickly
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioConverter; 