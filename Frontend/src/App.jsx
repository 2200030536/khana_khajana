import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateMenu from './components/CreateMenu';
import ViewMenus from './components/ViewMenus';
import UpdateMenu from './components/UpdateMenu';
import DeleteMenu from './components/DeleteMenu';
import Home from './Home';
import Login from './components/Login';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-menu" element={<CreateMenu />} />
        <Route path="/view-menus" element={<ViewMenus />} />
        <Route path="/update-menu" element={<UpdateMenu />} />
        <Route path="/delete-menu" element={<DeleteMenu />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;