'use client';

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            InvioceFreeTool
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/invoice-generator" className="hover:text-primary-600">
              Invoice Generator
            </Link>
            <Link href="/file-converters" className="hover:text-primary-600">
              File Converters
            </Link>
            <Link href="/youtube-tools" className="hover:text-primary-600">
              YouTube Tools
            </Link>
            <Link href="/url-shortener" className="hover:text-primary-600">
              URL Shortener
            </Link>
          </nav>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <nav className="md:hidden mt-4 space-y-3 pb-3">
            <Link 
              href="/invoice-generator"
              className="block py-2 hover:text-primary-600"
              onClick={toggleMenu}
            >
              Invoice Generator
            </Link>
            <Link 
              href="/file-converters"
              className="block py-2 hover:text-primary-600"
              onClick={toggleMenu}
            >
              File Converters
            </Link>
            <Link 
              href="/youtube-tools"
              className="block py-2 hover:text-primary-600"
              onClick={toggleMenu}
            >
              YouTube Tools
            </Link>
            <Link 
              href="/url-shortener"
              className="block py-2 hover:text-primary-600"
              onClick={toggleMenu}
            >
              URL Shortener
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 