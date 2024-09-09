import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import NavBar component
import DetailedModal from '../components/DetailedModal'; // Import the DetailedModal component
import LoginModal from '../components/LoginModal'; // Import the LoginModal component
import '../styles/Home.css'; // Import CSS for styling
import { useNavigate } from 'react-router-dom'; // To handle navigation

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // State to track selected movie
  const [showDetailedModal, setShowDetailedModal] = useState(false); // State to control detailed modal visibility
  const [showLoginModal, setShowLoginModal] = useState(false); // State to control login modal visibility
  const [showRegisterModal, setShowRegisterModal] = useState(false); // State to control register modal visibility
  const [selectedCategory, setSelectedCategory] = useState('nowPlaying'); // State to track selected category
  const [userName, setUserName] = useState(''); // State to track logged-in user
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Check if user is logged in by checking localStorage for username
    const storedUserName = localStorage.getItem('user');
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Fetch movie data
    axios.get('/api/movies/home')
      .then(response => {
        if (Array.isArray(response.data)) {
          setMovies(response.data); // Set movies state with data array
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  const handleViewDetails = (movie) => {
    setSelectedMovie(movie); // Set the selected movie
    setShowDetailedModal(true); // Show the detailed modal
  };

  const handleCloseDetailedModal = () => {
    setShowDetailedModal(false); // Hide the detailed modal
    setSelectedMovie(null); // Reset the selected movie
  };

  const handleLoginClick = () => {
    setShowRegisterModal(false); // Ensure RegisterModal is closed
    setShowLoginModal(true); // Show the login modal
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false); // Hide the login modal
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false); // Hide the login modal
    setShowRegisterModal(true); // Show the register modal
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false); // Hide the register modal
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false); // Hide the register modal
    setShowLoginModal(true); // Show the login modal
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user from local storage
    setUserName(''); // Reset userName state
    navigate('/'); // Redirect to home page
  };

  // Slice movies array for different categories
  const nowPlayingMovies = movies.slice(0, 5);
  const comingSoonMovies = movies.slice(5, 10);
  const onDemandMovies = movies.slice(10, 15);

  // Function to render movies based on selected category
  const renderMovies = () => {
    let categoryMovies = [];
    if (selectedCategory === 'nowPlaying') {
      categoryMovies = nowPlayingMovies;
    } else if (selectedCategory === 'comingSoon') {
      categoryMovies = comingSoonMovies;
    } else if (selectedCategory === 'onDemand') {
      categoryMovies = onDemandMovies;
    }

    return (
      <div className="movie-list">
        {categoryMovies.map(movie => (
          <div key={movie.movie_id} className="movie-card" onClick={() => handleViewDetails(movie)}>
            <img 
              src={movie.poster_url} 
              alt={movie.title} 
              className="movie-poster"
              onError={(e) => e.target.style.display = 'none'}
            />
            <h2>{movie.title}</h2>
            <button className="book-now-btn" onClick={() => handleViewDetails(movie)}>Get Tickets</button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Pass userName to NavBar and also pass handleLogout to allow the user to log out */}
      <NavBar onLoginClick={handleLoginClick} userName={userName} onLogout={handleLogout} /> 
      
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

      {/* Render movies based on selected category */}
      {renderMovies()}
      
      {/* Modal to show detailed movie information */}
      <DetailedModal show={showDetailedModal} onClose={handleCloseDetailedModal} movie={selectedMovie} />

      {/* Modal for login functionality */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />

    </div>
  );
};

export default Home;
