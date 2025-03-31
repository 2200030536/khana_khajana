import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Navbar />
      

      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border-t-4 border-amber-500">
            
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-700 mb-4">
                Khana Khajana
              </h1>
              
              <p className="text-lg text-gray-600 mb-4">
                Your personal mess management solution
              </p>
              
              <div className="flex justify-center items-center gap-2 mb-6">
                <div className="w-12 h-1 bg-amber-300 rounded"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="w-12 h-1 bg-amber-300 rounded"></div>
              </div>
              
              <p className="text-gray-600 max-w-2xl mx-auto">
                Managing your daily meals made simple. Check today's menu, track your meal preferences,
                and connect with your mess community all in one place.
              </p>
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-amber-700 font-bold text-xl">Today's Menu</p>
                <p className="text-gray-600 text-sm">Special North Indian</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-amber-700 font-bold text-xl">65+</p>
                <p className="text-gray-600 text-sm">Active Members</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-amber-700 font-bold text-xl">4.8/5</p>
                <p className="text-gray-600 text-sm">User Rating</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-amber-700 font-bold text-xl">7 Days</p>
                <p className="text-gray-600 text-sm">Meal Planning</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <Link 
                to="/login" 
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Login to Account
              </Link>
              
              <Link 
                to="/signup" 
                className="flex items-center gap-2 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-lg font-medium transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                  <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Create New Account
              </Link>
            </div>
            
            {/* Testimonial/Quote */}
            <div className="mt-12 bg-amber-50 p-6 rounded-lg italic text-center border-l-4 border-amber-300">
              <p className="text-gray-700">"The food we eat today is a reflection of what we'll be tomorrow. Choose wisely!"</p>
            </div>
          </div>
          
          {/* Footer note */}
          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>© 2025 Khana Khajana - Your daily mess companion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;