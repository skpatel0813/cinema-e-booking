import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar'; 
import DetailedModal from '../components/DetailedModal'; 
import LoginModal from '../components/LoginModal'; 
import EditProfileModal from '../components/EditProfileModal'; // Import EditProfileModal
import '../styles/Home.css'; 
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); 
  const [showDetailedModal, setShowDetailedModal] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [showRegisterModal, setShowRegisterModal] = useState(false); 
  const [showEditProfileModal, setShowEditProfileModal] = useState(false); // For Edit Profile Modal
  const [selectedCategory, setSelectedCategory] = useState('nowPlaying'); 
  const [userName, setUserName] = useState(''); 
  const movieListRef = useRef(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUserName = localStorage.getItem('user');
    if (storedUserName) {
      setUserName(storedUserName);
    }

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

  const handleViewDetails = (movie) => {
    setSelectedMovie(movie);
    setShowDetailedModal(true); 
  };

  const handleCloseDetailedModal = () => {
    setShowDetailedModal(false); 
    setSelectedMovie(null); 
  };

  const handleLoginClick = () => {
    setShowRegisterModal(false); 
    setShowLoginModal(true); 
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false); 
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false); 
    setShowRegisterModal(true); 
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false); 
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false); 
    setShowLoginModal(true); 
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setUserName(''); 
    navigate('/'); 
  };

  const handleEditProfileClick = () => {
    setShowEditProfileModal(true); // Show Edit Profile Modal
  };

  const handleCloseEditProfileModal = () => {
    setShowEditProfileModal(false); // Hide Edit Profile Modal
  };

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

  const nowPlayingMovies = movies.slice(0, 5);
  const comingSoonMovies = movies.slice(5, 10);
  const onDemandMovies = movies.slice(10, 15);

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
      <div className="carousel-container">
        <button className="scroll-arrow left" onClick={scrollLeft}>&lt;</button> 
        <div className="movie-list" ref={movieListRef}>
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
        <button className="scroll-arrow right" onClick={scrollRight}>&gt;</button> 
      </div>
    );
  };

  return (
    <div>
      <NavBar 
        onLoginClick={handleLoginClick} 
        userName={userName} 
        onLogout={handleLogout} 
        onEditProfileClick={handleEditProfileClick} // Pass Edit Profile handler
      /> 

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
      
      <DetailedModal show={showDetailedModal} onClose={handleCloseDetailedModal} movie={selectedMovie} />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <EditProfileModal 
        isOpen={showEditProfileModal} 
        onClose={handleCloseEditProfileModal}
      /> 
    </div>
  );
};

export default Home;
