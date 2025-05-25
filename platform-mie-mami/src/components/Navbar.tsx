import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import logo from '../assets/logo.svg';

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    delete axios.defaults.headers.common['Authorization'];
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileDropdownOpen && !target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

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

          {/* Cart Icon and Login/Profile Section - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-[#441E1B] transition-colors rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[10px] font-medium">
                  {getTotalItems() > 99 ? '99+' : getTotalItems()}
                </span>
              )}
            </Link>

            {/* Login/Profile Button */}
            {isLoggedIn ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={toggleProfileDropdown}
                  className="bg-[#441E1B] hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                  <svg className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-[#441E1B] hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile cart icon and menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-[#441E1B] transition-colors rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[10px] font-medium">
                  {getTotalItems() > 99 ? '99+' : getTotalItems()}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
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

            {/* Mobile Cart Link */}
            <Link
              to="/cart"
              className="text-[#441E1B] hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Cart</span>
              {getTotalItems() > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[10px] font-medium">
                  {getTotalItems() > 99 ? '99+' : getTotalItems()}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-[#441E1B] hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/orders"
                  className="text-[#441E1B] hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white block px-3 py-2 rounded-md text-base font-medium mt-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="w-full text-left bg-[#441E1B] hover:bg-indigo-700 text-white block px-3 py-2 rounded-md text-base font-medium mt-1">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
