// filepath: /S:/github/khana_khajana/Frontend/src/main.jsx
import React from 'react'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'
import App from './App';  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

  </StrictMode>,
)