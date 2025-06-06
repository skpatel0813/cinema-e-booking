// src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('/user/login', { email, password })
      .then(response => {
        const { userName, role, status, id } = response.data;
        if (id) {
          // Store user ID in localStorage
          localStorage.setItem('userId', id);
          onLoginSuccess(response.data); // Pass user data to parent component
        } else {
          console.error('userID is undefined in response:', response.data);
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
