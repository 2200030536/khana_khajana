import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const pages = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Menu', path: '/menu' },
  { title: 'Contact', path: '/contact' }
];

const authPages = [
  { title: 'Login', path: '/login' },
  { title: 'Sign up', path: '/signup' }
];

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const navigateTo = (path) => {
    setIsNavOpen(false);
    setIsUserMenuOpen(false);
    if (path) navigate(path);
  };

  const isLoggedIn = false; // Change to use your authentication context/state
  
  // Current date/time and user from props
  const currentDateTime = "2025-03-31 05:55:22";
  const username = "rohitRanjanGIT";

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* Cutlery Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3z" fill="none"></path>
                <path d="M7 16v4"></path>
                <path d="M7 8V4"></path>
                <path d="M11 4v16"></path>
                <path d="M15 16v4"></path>
                <path d="M15 8V4"></path>
                <path d="M17 10L7 10"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-amber-700">Khana Khajana</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {pages.map((page) => (
                <Link
                  key={page.title}
                  to={page.path}
                  className="px-3 py-2 text-gray-700 hover:text-amber-600 transition-colors font-medium"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side - Auth buttons or User menu */}
          <div className="flex items-center">

            {isLoggedIn ? (
              <div className="relative ml-3">
                <button
                  onClick={toggleUserMenu}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <div className="h-8 w-8 rounded-full bg-amber-600 text-white flex items-center justify-center">
                    {username.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 text-xs text-gray-500">
                      Signed in as <span className="font-semibold">{username}</span>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => navigateTo('/profile')}>
                      Profile
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => navigateTo('/dashboard')}>
                      Dashboard
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={() => navigateTo()}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 border border-amber-600 text-sm font-medium rounded-md text-amber-600 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                    <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <button
                onClick={toggleNav}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-600 hover:bg-amber-50"
              >
                <svg className={`${isNavOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isNavOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isNavOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {pages.map((page) => (
            <Link
              key={page.title}
              to={page.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50"
              onClick={() => navigateTo(page.path)}
            >
              {page.title}
            </Link>
          ))}
        </div>
        

      </div>
    </nav>
  );
}

export default Navbar;