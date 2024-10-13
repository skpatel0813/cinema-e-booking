import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/modal.css';
import LoginModal from './LoginModal';

const DetailedModal = ({ show, onClose, movie, isLoggedIn, response }) => {
  const [loginPromptVisible, setLoginPromptVisible] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userId, setUserId] = useState(null); // State to store userId
  const navigate = useNavigate();

  
  useEffect(() => {
    // Retrieve userId from local storage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  if (!show || !movie) return null;

  const handleGetTicketsClick = () => {
    console.log("Is user logged in? ", isLoggedIn); // Debugging log
    console.log("User ID:", userId); // Log the user ID

    if (isLoggedIn) {
      console.log("Navigating to showtimes with movie title:", movie.title); // Debugging log

      // Store the movie ID in local storage
      localStorage.setItem('selectedMovieId', movie.id);

      navigate('/showtimes', { state: { movieTitle: movie.title } });
    } else {
      console.log("Showing login prompt"); // Debugging log
      setLoginPromptVisible(true);
    }
  };

  const closeLoginPrompt = () => {
    setLoginPromptVisible(false);
  };

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
    setLoginPromptVisible(false);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>

        {/* Movie Title */}
        <h2>{movie.title}</h2>

        {/* Movie Trailer */}
        {movie.trailerUrl ? (
          <div className="trailer-container">
            <iframe 
              width="100%" 
              height="400px" 
              src={movie.trailerUrl} 
              title="Movie Trailer" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p>Trailer not available</p>
        )}

        {/* Movie Details */}
        <div className="movie-details">
          <p><strong>Synopsis:</strong> {movie.synopsis || 'Not available'}</p>
          <p><strong>Cast:</strong> {movie.cast || 'Not available'}</p>
          <p><strong>Director:</strong> {movie.director || 'Not available'}</p>
          <p><strong>Producer:</strong> {movie.producer || 'Not available'}</p>
          <p><strong>Rating:</strong> {movie.ratingCode || 'Not available'}</p>
        </div>

        {/* Book Now Button */}
        <button className="book-now-btn" onClick={handleGetTicketsClick}>
          Get Tickets
        </button>
      </div>

      {/* Login Prompt Modal */}
      {loginPromptVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeLoginPrompt}>&times;</span>
            <p>You need to sign in to get tickets</p>
            <button className="login-button" onClick={handleLoginModalOpen}>Sign In</button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
    </div>
  );
};

export default DetailedModal;
