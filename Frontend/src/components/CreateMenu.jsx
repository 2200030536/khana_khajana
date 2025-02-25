import React, { useState } from 'react';
import axios from 'axios';

const CreateMenu = () => {
  const [formData, setFormData] = useState({
    id: '',
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: '',
    day: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/menus', formData);
      alert('Menu created: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the menu.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required />
      <input type="text" name="breakfast" placeholder="Breakfast" value={formData.breakfast} onChange={handleChange} required />
      <input type="text" name="lunch" placeholder="Lunch" value={formData.lunch} onChange={handleChange} required />
      <input type="text" name="snacks" placeholder="Snacks" value={formData.snacks} onChange={handleChange} required />
      <input type="text" name="dinner" placeholder="Dinner" value={formData.dinner} onChange={handleChange} required />
      <input type="text" name="day" placeholder="Day" value={formData.day} onChange={handleChange} required />
      <button type="submit">Create Menu</button>
    </form>
  );
};

export default CreateMenu;