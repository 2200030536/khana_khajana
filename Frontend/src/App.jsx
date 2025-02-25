import React from 'react';
import CreateMenu from './components/CreateMenu';
import ViewMenus from './components/ViewMenus';
import UpdateMenu from './components/UpdateMenu';
import DeleteMenu from './components/DeleteMenu';
import './App.css';

const App = () => {
  return (
    <div>
      <h1>Daily Menu Management</h1>
      <CreateMenu />
      <ViewMenus />
      <UpdateMenu />
      <DeleteMenu />
    </div>
  );
};

export default App;
