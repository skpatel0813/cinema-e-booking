import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import DetailedModal from '../components/DetailedModal';
import LoginModal from '../components/LoginModal';
import EditProfileModal from '../components/EditProfileModal';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('nowPlaying');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const movieListRef = useRef(null);
  const navigate = useNavigate();

  // Fetch movies and user information from localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('user');
    const storedUserRole = localStorage.getItem('role');
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }

    // Fetch movies for the home page
    axios.get('/api/movies/home')
      .then(response => {
        if (Array.isArray(response.data)) {
          setMovies(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  // Handle viewing movie details
  const handleViewDetails = (movie) => {
    if (movie) {
      setSelectedMovie(movie);
      setShowDetailedModal(true);
    } else {
      console.error('Movie or movie_id is undefined');
    }
  };

  // Handle movie editing (for admin)
  const handleEditMovie = (movie) => {
    if (movie) {
      navigate(`/edit-movie/${movie.id}`);
    } else {
      console.error('Movie or movie_id is undefined');
    }
  };

  // Close modals
  const handleCloseDetailedModal = () => {
    setShowDetailedModal(false);
    setSelectedMovie(null);
  };

  const handleCloseEditProfileModal = () => {
    setShowEditProfileModal(false);
  };

  // Logout
  const handleLogout = () => {
    setUserName('');
    setUserRole('');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Scroll for movie carousel
  const scrollLeft = () => {
    movieListRef.current.scrollBy({
      left: -500,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    movieListRef.current.scrollBy({
      left: 500,
      behavior: 'smooth'
    });
  };

  // Categorize movies
  const getCategoryMovies = () => {
    let filteredMovies = movies;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filteredMovies = filteredMovies.filter(movie =>
        selectedCategories.includes(movie.category)
      );
    }

    // Filter by date
    if (filterDate) {
      filteredMovies = filteredMovies.filter(movie => {
        const movieDate = new Date(movie.release_date).toISOString().split('T')[0];
        return movieDate === filterDate;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredMovies;
  };

  // Render movies for admin without a carousel
  const renderAdminMovies = () => {
    if (movies.length === 0) {
      return <p>No movies available.</p>;
    }

    return (
      <div className="admin-movie-list">
        {movies.map(movie => (
          <div key={movie.movie_id || movie.title} className="movie-card">
            <img 
              src={movie.poster_url} 
              alt={movie.title} 
              className="movie-poster"
              onError={(e) => e.target.style.display = 'none'}
            />
            <h2>{movie.title}</h2>
            <button className="edit-movie-btn" onClick={() => handleEditMovie(movie)}>
              Edit Movie
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Render movies in the selected category for regular users
  const renderMovies = () => {
    const categoryMovies = getCategoryMovies();

    if (categoryMovies.length === 0) {
      return <p>No movies available with the selected filters.</p>;
    }

    return (
      <div className="carousel-container">
        <button className="scroll-arrow left" onClick={scrollLeft}>&lt;</button>
        <div className="movie-list" ref={movieListRef}>
          {categoryMovies.map(movie => (
            <div key={movie.movie_id || movie.title} className="movie-card">
              <img 
                src={movie.poster_url} 
                alt={movie.title} 
                className="movie-poster"
                onError={(e) => e.target.style.display = 'none'}
              />
              <h2>{movie.title}</h2>
              <button className="book-now-btn" onClick={() => handleViewDetails(movie)}>
                Get Tickets
              </button>
            </div>
          ))}
        </div>
        <button className="scroll-arrow right" onClick={scrollRight}>&gt;</button>
      </div>
    );
  };

  // Handle category selection in filter
  const toggleCategory = (category) => {
    setSelectedCategories(prevState => 
      prevState.includes(category) 
        ? prevState.filter(item => item !== category) 
        : [...prevState, category]
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setFilterDate('');
    setSearchTerm('');
  };

  return (
    <div>
      <NavBar 
        onLoginClick={() => setShowLoginModal(true)} 
        userName={userName} 
        onLogout={handleLogout} 
        onEditProfileClick={() => setShowEditProfileModal(true)}
      />

      {/* Admins see all movies without carousel */}
      {userRole === 'admin' ? (
        renderAdminMovies()
      ) : (
        <>
          <div className="header">
            <h1>Movies to Watch</h1>
            <div className="nav-links">
              <span 
                className={selectedCategory === 'nowPlaying' ? 'active-link' : ''} 
                onClick={() => setSelectedCategory('nowPlaying')}
              >
                Now Playing
              </span>
              <span 
                className={selectedCategory === 'comingSoon' ? 'active-link' : ''} 
                onClick={() => setSelectedCategory('comingSoon')}
              >
                Coming Soon
              </span>
              <span 
                className={selectedCategory === 'onDemand' ? 'active-link' : ''} 
                onClick={() => setSelectedCategory('onDemand')}
              >
                On Demand
              </span>
              <div className="filter-container">
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="filter-button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  Filter
                </button>
                {showFilterDropdown && (
                  <div className="filter-dropdown">
                    <div className="categories">
                      {['Adventure', 'Comedy', 'Horror', 'Thriller', 'Drama', 'Action'].map(category => (
                        <button
                          key={category}
                          className={`pill-button ${selectedCategories.includes(category) ? 'selected' : ''}`}
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <div className="date-filter">
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                      />
                    </div>
                    <button
                      className="clear-filters-btn"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {renderMovies()}
        </>
      )}

      {/* Detailed Movie Modal */}
      <DetailedModal 
        show={showDetailedModal} 
        onClose={handleCloseDetailedModal} 
        movie={selectedMovie} 
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={showEditProfileModal} 
        onClose={handleCloseEditProfileModal}
      />
    </div>
  );
};

export default Home;
