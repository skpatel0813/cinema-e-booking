// UserManagement.js - Updated component for managing users
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar'; // Import NavBar component
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all users from the backend
    axios.get('http://localhost:8081/user') // Ensure the correct URL and port
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleEditUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDeleteUser = (userId) => {
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Delete user from backend
      axios.delete(`http://localhost:8081/user/${userId}`)
        .then(() => {
          // Update the state to remove the deleted user
          setUsers(users.filter(user => user.id !== userId));
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  };

  const handleSuspendUser = (userId) => {
    // Send suspension request to the backend with isSuspended: true
    axios.put(`http://localhost:8081/user/${userId}/suspend`, { isSuspended: true })
      .then(() => {
        // Update the state to mark the user as suspended
        setUsers(users.map(user => user.id === userId ? { ...user, isSuspended: true } : user));
      })
      .catch(error => console.error('Error suspending user:', error));
  };

  const handleUnsuspendUser = (userId) => {
    // Send unsuspension request to the backend with isSuspended: false
    axios.put(`http://localhost:8081/user/${userId}/suspend`, { isSuspended: false })
      .then(() => {
        // Update the state to mark the user as unsuspended
        setUsers(users.map(user => user.id === userId ? { ...user, isSuspended: false } : user));
      })
      .catch(error => console.error('Error unsuspending user:', error));
  };

  const categorizedUsers = (category) => {
    if (category === 'admin') {
      return users.filter(user => user.role === 'admin');
    } else if (category === 'user') {
      return users.filter(user => user.role === 'user' && !user.isSuspended);
    } else if (category === 'suspended') {
      return users.filter(user => user.isSuspended);
    }
    return [];
  };

  return (
    <div className="user-management-container">
      <NavBar
        onLoginClick={() => navigate('/login')}
        onLogout={() => navigate('/')}
        onEditProfileClick={() => navigate('/edit-profile')}
      />
      <h1>User Management</h1>
      <div className="user-table">
        <h2>Administrators</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categorizedUsers('admin').map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEditUser(user.id)}>Edit User</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="user-table">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categorizedUsers('user').map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEditUser(user.id)}>Edit User</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
                    Delete User
                  </button>
                  <button onClick={() => handleSuspendUser(user.id)} className="suspend-button">
                    Suspend User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="user-table">
        <h2>Suspended Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categorizedUsers('suspended').map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEditUser(user.id)}>Edit User</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
                    Delete User
                  </button>
                  <button onClick={() => handleUnsuspendUser(user.id)} className="unsuspend-button">
                    Unsuspend User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
