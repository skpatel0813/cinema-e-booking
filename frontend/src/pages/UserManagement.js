// UserManagement.js - Updated component for managing users
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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

  const categorizedUsers = (category) => {
    return users.filter(user => user.role === category);
  };

  return (
    <div>
      {localStorage.getItem("role") == "admin" ? 
      (
        <div className="user-management-container">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div>
          Error: Unqualified user role to access this page.
          <br></br>
          <Link to='/'>Home</Link>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
