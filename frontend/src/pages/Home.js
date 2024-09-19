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
    switch (selectedCategory) {
      case 'nowPlaying':
        return movies.slice(0, 5);
      case 'comingSoon':
        return movies.slice(5, 10);
      case 'onDemand':
        return movies.slice(10, 15);
      default:
        return [];
    }
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
      return <p>No movies available in this category.</p>;
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
