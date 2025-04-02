import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import CreateMenu from './components/CreateMenu';
// import ViewMenus from './components/ViewMenus';
// import UpdateMenu from './components/UpdateMenu';
// import DeleteMenu from './components/DeleteMenu';
// import MenuCrud from './components/MenuCrud';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentSignup from './components/StudentUserSignup';
import MessUserSignup from './components/MessUserSignup';
// import Profile from './components/Profile';
import MessUser from './pages/Mess User/MessUser';
import AdminUser from './pages/Admin User/AdminUser';
import './App.css';
import About from './pages/About';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import MessUserProfile from './pages/Mess User/MessUserProfile';
import MenuManager from './pages/Mess User/MenuManager';
import ProfilePage from './pages/Student user/ProfilePage';
import MessUserPage from './pages/Mess User/MessUserPage';




const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/messuser-signup" element={<MessUserSignup />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/menu-crud" element={<MenuCrud />} />
        <Route path="/create-menu" element={<CreateMenu />} />
        <Route path="/view-menus" element={<ViewMenus />} />
        <Route path="/update-menu" element={<UpdateMenu />} />
        <Route path="/delete-menu" element={<DeleteMenu />} /> */}
        {/* mess user dashboard */}
        {/* <Route path="/messDashboard" element={<MessUser/>}></Route> */}
        <Route path="/messDashboard" element={<MessUserPage/>}></Route>
        {/* admin dashboard */}
        <Route path="/adminDashboard" element={<AdminUser/>}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/mess-user/profile" element={<MessUserProfile />} />
        <Route path="/menu-manager" element={<MenuManager />} />
        <Route path="/profile" element={<ProfilePage />} />



      </Routes>
    </BrowserRouter>
  );
};

export default App;