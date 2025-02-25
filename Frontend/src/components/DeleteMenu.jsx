import React, { useState } from 'react';
import axios from 'axios';

const DeleteMenu = () => {
  const [id, setId] = useState('');

  const handleChange = (e) => {
    setId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/menus/${id}`);
      alert('Menu deleted: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the menu.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="id" placeholder="ID" value={id} onChange={handleChange} required />
      <button type="submit">Delete Menu</button>
    </form>
  );
};

export default DeleteMenu;