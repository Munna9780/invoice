import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">InvioceFreeTool</h3>
            <p className="text-gray-300">
              Free online tools to make your work easier. No registration, no downloads, 100% free.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/invoice-generator" className="hover:text-primary-300">
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/file-converters" className="hover:text-primary-300">
                  File Converters
                </Link>
              </li>
              <li>
                <Link href="/youtube-tools" className="hover:text-primary-300">
                  YouTube Tools
                </Link>
              </li>
              <li>
                <Link href="/url-shortener" className="hover:text-primary-300">
                  URL Shortener
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/blog" className="hover:text-primary-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary-300">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-primary-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} InvioceFreeTool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 