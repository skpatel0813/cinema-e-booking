import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ onLoginClick, userName, onLogout, onEditProfileClick, onFilterChange, onSearchChange, onClearFilters }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const filterRef = useRef(null); // Reference to the filter dropdown

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }

    // Close filter dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleFilterApply = () => {
    onFilterChange({ categories: selectedCategories, date: selectedDate });
    setFilterDropdownOpen(false); // Close the filter dropdown after applying
  };

  const handleClearFilters = () => {
    setSelectedCategories([]); // Clear selected categories
    setSelectedDate(''); // Reset date input
    onClearFilters(); // Reset filters in parent component
  };

  const handleSearchChange = (event) => {
    onSearchChange(event.target.value);  // Pass the search query to the parent
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    if (onLogout) {
      onLogout();
    }

    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleAddMovieClick = () => {
    navigate('/add-movie');
  };

  return (
    <nav>
      <ul className="nav-list">
        <li className="nav-item left"><Link to="/">Home</Link></li>
        {role === 'admin' && (
          <li className="nav-item left">
            <button className="add-movie-btn" onClick={handleAddMovieClick}>Add Movie</button>
          </li>
        )}
        <li className="nav-item center">
          <div className="filter-search-container">  {/* Added a container to hold the filter button and search bar */}
            <button className="filter-btn" onClick={toggleFilterDropdown}>Filter</button>
            <input type="text" placeholder="Search" className="search-bar" onChange={handleSearchChange} />
          </div>
          {filterDropdownOpen && (
            <div className="filter-dropdown" ref={filterRef}>
              <button className="close-filter-btn" onClick={() => setFilterDropdownOpen(false)}>X</button>
              <div className="filter-section">
                <h4>Categories</h4>
                {['Adventure', 'Action', 'Thriller', 'Comedy', 'Horror', 'Drama', 'Musical'].map((category) => (
                  <button
                    key={category}
                    className={`pill-btn ${selectedCategories.includes(category) ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="filter-section">
                <h4>Date</h4>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="date-input"
                />
              </div>
              <button className="apply-filter-btn" onClick={handleFilterApply}>
                Apply Filter
              </button>
              <button className="clear-filter-btn" onClick={handleClearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </li>
        <li className="nav-item right">
          {userName ? (
            <div className="user-section">
              <span onClick={toggleDropdown} className="user-name">Welcome, {userName}</span>
              {dropdownOpen && (
                <div className="dropdown">
                  <button className="dropdown-btn" onClick={onEditProfileClick}>Edit Profile</button>
                  <button className="dropdown-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>Login</button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
