// UserManagement.js - Updated component for managing users
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8081/user');
      console.log('Fetched users:', response.data); // Debugging: Log fetched data
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle user actions
  const handleEditUser = (userId) => navigate(`/edit-user/${userId}`);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8081/user/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        console.log(`User ${userId} deleted successfully`);
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete the user. Please try again.');
      }
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      await axios.put(`http://localhost:8081/user/${userId}/suspend`, { isSuspended: true });
      console.log(`User ${userId} suspended`);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error suspending user:', err);
      alert('Failed to suspend the user. Please try again.');
    }
  };

  const handleUnsuspendUser = async (userId) => {
    try {
      await axios.put(`http://localhost:8081/user/${userId}/suspend`, { isSuspended: false });
      console.log(`User ${userId} unsuspended`);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error unsuspending user:', err);
      alert('Failed to unsuspend the user. Please try again.');
    }
  };

  // Categorize users by role or suspension status
  const categorizedUsers = (category) => {
    console.log(`Categorizing users by ${category}`); // Debugging categorization logic
    if (category === 'admin') {
      return users.filter(user => user.role === 'admin');
    } else if (category === 'user') {
      return users.filter(user => user.role === 'user' && !user.suspended); // Use 'suspended'
    } else if (category === 'suspended') {
      return users.filter(user => user.suspended); // Use 'suspended'
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
      {loading && <p>Loading users...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <>
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
                    <td>{user.firstName || user.name}</td>
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
                    <td>{user.firstName || user.name}</td>
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
                    <td>{user.firstName || user.name}</td>
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
        </>
      )}
    </div>
  );
};

export default UserManagement;
