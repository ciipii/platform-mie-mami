import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Close mobile menu if open
      setIsMenuOpen(false);

      // Scroll to section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'menu', 'contact'];
      const scrollPosition = window.scrollY + 100; // Add offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F1F1F1] backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <button onClick={() => scrollToSection('home')} className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
              <span className="ml-2 text-[#E64516] font-semibold text-lg hidden sm:block">Mie</span><span className='text-[#441E1B] font-semibold text-lg hidden sm:block'>Mami</span>
            </button>
          </div>

          {/* Navigation Links - Middle (hidden on mobile) */}
          <div className="hidden md:block flex-1">
            <div className="flex justify-center">
              <div className="flex space-x-4">
                <button
                  onClick={() => scrollToSection('home')}
                  className={`text-[#441E1B] hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'home' ? 'bg-gray-200' : ''}`}
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className={`text-[#441E1B] hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'about' ? 'bg-gray-200' : ''}`}
                >
                  About
                </button>

                <button
                  onClick={() => scrollToSection('menu')}
                  className={`text-[#441E1B] hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'menu' ? 'bg-gray-200' : ''}`}
                >
                  Menu
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`text-[#441E1B] hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'contact' ? 'bg-gray-200' : ''}`}
                >
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Login Button - Right */}
          <div className="hidden md:block">
            <Link to="/login" className="bg-[#441E1B] hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => scrollToSection('home')}
              className={`text-[#441E1B] hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium ${activeSection === 'home' ? 'bg-gray-200' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`text-[#441E1B] hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium ${activeSection === 'about' ? 'bg-gray-200' : ''}`}
            >
              About
            </button>

            <button
              onClick={() => scrollToSection('menu')}
              className={`text-[#441E1B] hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium ${activeSection === 'menu' ? 'bg-gray-200' : ''}`}
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`text-[#441E1B] hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium ${activeSection === 'contact' ? 'bg-gray-200' : ''}`}
            >
              Contact
            </button>
            <Link to="/login" className="w-full text-left bg-[#441E1B] hover:bg-indigo-700 text-white block px-3 py-2 rounded-md text-base font-medium mt-1">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
