import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Signup = () => {
  return (
    <div >
      <Navbar />
      
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-amber-500">
            <div className="flex flex-col items-center mb-8">
              {/* Person Add Icon */}
              <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-amber-700">Signup</h2>
              
              <div className="w-12 h-1 bg-amber-300 rounded mt-2 mb-4"></div>
              
              <p className="text-gray-600 text-center mb-4">
                Choose your account type to get started
              </p>
            </div>

            <div className="space-y-4">
              {/* Student Signup Button */}
              <Link 
                to="/student-signup" 
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Student Signup
              </Link>
              
              {/* Mess User Signup Button */}
              <Link 
                to="/messuser-signup" 
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Mess User Signup
              </Link>
            </div>
            
            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-amber-600 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
          
          {/* Simple footer without date/time or user info */}
          <div className="text-center mt-6 text-gray-500 text-xs">
            <p>© 2025 Khana Khajana - Your daily mess companion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;