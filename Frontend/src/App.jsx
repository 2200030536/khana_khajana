import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateMenu from './components/CreateMenu';
import ViewMenus from './components/ViewMenus';
import UpdateMenu from './components/UpdateMenu';
import DeleteMenu from './components/DeleteMenu';
import MenuCrud from './components/MenuCrud';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import StudentSignup from './components/StudentUserSignup';
import MessUserSignup from './components/MessUserSignup';
import Profile from './components/Profile';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/messuser-signup" element={<MessUserSignup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/menu-crud" element={<MenuCrud />} />
        <Route path="/create-menu" element={<CreateMenu />} />
        <Route path="/view-menus" element={<ViewMenus />} />
        <Route path="/update-menu" element={<UpdateMenu />} />
        <Route path="/delete-menu" element={<DeleteMenu />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;