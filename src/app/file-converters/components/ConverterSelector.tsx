interface ConverterSelectorProps {
  activeConverter: 'pdf' | 'image' | 'audio' | 'video' | 'spreadsheet';
  setActiveConverter: (converter: 'pdf' | 'image' | 'audio' | 'video' | 'spreadsheet') => void;
}

const ConverterSelector: React.FC<ConverterSelectorProps> = ({ activeConverter, setActiveConverter }) => {
  const converters = [
    {
      id: 'pdf',
      name: 'PDF Converter',
      description: 'Convert PDF to Word and vice versa',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'image',
      name: 'Image Converter',
      description: 'Convert between image formats',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'audio',
      name: 'Audio Converter',
      description: 'Convert between audio formats',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
    {
      id: 'video',
      name: 'Video Converter',
      description: 'Convert between video formats',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'spreadsheet',
      name: 'Spreadsheet Converter',
      description: 'Convert between spreadsheet formats',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
      {converters.map((converter) => (
        <button
          key={converter.id}
          onClick={() => setActiveConverter(converter.id)}
          className={`p-4 text-left transition-colors ${
            activeConverter === converter.id
              ? 'bg-primary-50 text-primary-700'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center mb-2">
            <div className={`${
              activeConverter === converter.id
                ? 'text-primary-600'
                : 'text-gray-500'
            }`}>
              {converter.icon}
            </div>
            <h3 className="ml-2 font-medium">{converter.name}</h3>
          </div>
          <p className="text-sm text-gray-600">{converter.description}</p>
        </button>
      ))}
    </div>
  );
};

export default ConverterSelector; 