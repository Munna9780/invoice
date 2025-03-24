'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try again later.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-block"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
} 