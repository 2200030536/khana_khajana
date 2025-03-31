import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import Navbar from '../components/Navbar';

const Menu = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axiosInstance.get('/menus');
      // Sort menus by day to ensure Sunday comes first
      const sortedMenus = response.data.sort((a, b) => a.day - b.day);
      setMenus(sortedMenus);
    } catch (error) {
      console.error('Error fetching menus:', error);
      alert('An error occurred while fetching the menus.');
    }
  };

  const getDayName = (day) => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Specials',
    ];
    return days[day - 1] || 'Invalid day';
  };

  return (
    <div
    >
      <Navbar />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border-t-4 border-amber-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-700 mb-4">
                Weekly Menu
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Explore the delicious meals planned for the week.
              </p>
              <div className="flex justify-center items-center gap-2 mb-6">
                <div className="w-12 h-1 bg-amber-300 rounded"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="w-12 h-1 bg-amber-300 rounded"></div>
              </div>
            </div>

            {/* Menu List */}
            <div className="space-y-6">
              {menus.length > 0 ? (
                menus.map((menu) => (
                  <div
                    key={menu.id}
                    className="bg-amber-50 p-4 rounded-lg shadow-md"
                  >
                    <h3 className="text-amber-700 font-bold text-xl mb-2">
                      {getDayName(menu.day)}
                    </h3>
                    <p className="text-gray-600">
                      <strong>Breakfast:</strong> {menu.breakfast}
                    </p>
                    <p className="text-gray-600">
                      <strong>Lunch:</strong> {menu.lunch}
                    </p>
                    <p className="text-gray-600">
                      <strong>Snacks:</strong> {menu.snacks}
                    </p>
                    <p className="text-gray-600">
                      <strong>Dinner:</strong> {menu.dinner}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">
                  No menus available. Please check back later.
                </p>
              )}
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

export default Menu;