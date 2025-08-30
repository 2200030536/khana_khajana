import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/messuser-signup" element={<MessUserSignup />} />
          
          {/* Protected Routes */}
          <Route path="/messDashboard" element={
            <ProtectedRoute allowedUserTypes={['messUser']}>
              <MessUserPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedUserTypes={['studentUser']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/adminDashboard" element={
            <ProtectedRoute allowedUserTypes={['admin']}>
              <AdminUser />
            </ProtectedRoute>
          } />
          <Route path="/meals-plans" element={
            <ProtectedRoute allowedUserTypes={['studentUser']}>
              <MealPlans />
            </ProtectedRoute>
          } />
          
          {/* Mess User Protected Routes */}
          <Route path="/mess-user/profile" element={
            <ProtectedRoute allowedUserTypes={['messUser']}>
              <MessUserProfile />
            </ProtectedRoute>
          } />
          <Route path="/menu-manager" element={
            <ProtectedRoute allowedUserTypes={['messUser']}>
              <MenuManager />
            </ProtectedRoute>
          } />
          
          {/* Public Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;