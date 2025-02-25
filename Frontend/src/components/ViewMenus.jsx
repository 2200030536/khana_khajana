import React, { useState } from 'react';
import axios from 'axios';

const ViewMenus = () => {
  const [menus, setMenus] = useState([]);

  const fetchMenus = async () => {
    try {
      const response = await axios.get('/menus');
      setMenus(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching the menus.');
    }
  };

  return (
    <div>
      <button onClick={fetchMenus}>View Menus</button>
      <pre>{JSON.stringify(menus, null, 2)}</pre>
    </div>
  );
};

export default ViewMenus;