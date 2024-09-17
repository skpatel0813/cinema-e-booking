// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from ReactDOM
import App from './App';

// Use createRoot to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
