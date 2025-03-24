import Link from 'next/link';

const converters = [
  {
    title: 'PDF Converter',
    description: 'Convert PDF to DOCX and vice versa',
    href: '/file-converters/pdf',
    icon: '📄'
  },
  {
    title: 'Image Converter',
    description: 'Convert between JPG, PNG, WEBP, and GIF',
    href: '/file-converters/image',
    icon: '🖼️'
  },
  {
    title: 'Audio Converter',
    description: 'Convert between MP3, WAV, OGG, and M4A',
    href: '/file-converters/audio',
    icon: '🎵'
  },
  {
    title: 'Video Converter',
    description: 'Convert between MP4, WEBM, MOV, and AVI',
    href: '/file-converters/video',
    icon: '🎥'
  },
  {
    title: 'Spreadsheet Converter',
    description: 'Convert between XLSX, CSV, XLS, and ODS',
    href: '/file-converters/spreadsheet',
    icon: '📊'
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        File Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Convert your files to different formats with our easy-to-use online converters.
        No registration required, and all processing happens in your browser for maximum privacy.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {converters.map((converter) => (
          <Link
            key={converter.href}
            href={converter.href}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{converter.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {converter.title}
            </h2>
            <p className="text-gray-600">{converter.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 