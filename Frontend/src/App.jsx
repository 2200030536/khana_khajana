import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentSignup from './components/StudentUserSignup';
import MessUserSignup from './components/MessUserSignup';
import AdminUser from './pages/Admin User/AdminUser';
import About from './pages/About';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import MessUserProfile from './pages/Mess User/MessUserProfile';
import MenuManager from './pages/Mess User/MenuManager';
import MessUserPage from './pages/Mess User/MessUserPage';
import MealPlans from './pages/Student User/MealsPlans';
import ProfilePage from './pages/Student User/ProfilePage';



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/messuser-signup" element={<MessUserSignup />} />
        <Route path="/messDashboard" element={<MessUserPage/>}></Route>
        {/* admin dashboard */}
        <Route path="/adminDashboard" element={<AdminUser/>}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/mess-user/profile" element={<MessUserProfile />} />
        <Route path="/menu-manager" element={<MenuManager />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/meals-plans" element={<MealPlans />} />



      </Routes>
    </BrowserRouter>
  );
};

export default App;