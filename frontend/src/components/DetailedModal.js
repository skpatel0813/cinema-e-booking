import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/modal.css';
import LoginModal from './LoginModal';

// The DetailedModal component displays detailed information about a movie.
// It includes a trailer, synopsis, cast, and other details, and allows users to book tickets if logged in.
const DetailedModal = ({ show, onClose, movie, isLoggedIn, response }) => {
  console.log("Movie prop in DetailedModal:", movie); // Debug log to check the movie object structure

  // State to manage the visibility of the login prompt
  const [loginPromptVisible, setLoginPromptVisible] = useState(false);

  // State to manage the visibility of the LoginModal component
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // State to store the user ID from local storage
  const [userId, setUserId] = useState(null);

  // Hook to navigate between pages
  const navigate = useNavigate();

  // Effect to retrieve the userId from local storage when the component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Return null if the modal should not be shown or the movie object is undefined
  if (!show || !movie) return null;

  // Handler for the "Get Tickets" button click
  const handleGetTicketsClick = () => {
    console.log("Is user logged in? ", isLoggedIn); // Debugging log
    console.log("User ID:", userId); // Log the user ID
    console.log("Movie ID:", movie.movieId); // Log the movie ID

    if (isLoggedIn) {
      // If the user is logged in, navigate to the showtimes page
      console.log("Navigating to showtimes with movie title:", movie.title);

      // Store the selected movie ID in local storage
      localStorage.setItem('selectedMovieId', movie.movieId);

      // Navigate to the showtimes page, passing movie details in the state
      navigate('/showtimes', { state: { movieTitle: movie.title, movieId: movie.id } });
    } else {
      // If the user is not logged in, show the login prompt
      console.log("Showing login prompt");
      setLoginPromptVisible(true);
    }
  };

  // Handler to close the login prompt
  const closeLoginPrompt = () => {
    setLoginPromptVisible(false);
  };

  // Handler to open the LoginModal
  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
    setLoginPromptVisible(false); // Close the login prompt when opening the modal
  };

  // Handler to close the LoginModal
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>

        {/* Display the movie title */}
        <h2>{movie.title}</h2>

        {/* Embed the movie trailer if available */}
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

        {/* Display movie details like synopsis, cast, director, etc. */}
        <div className="movie-details">
          <p><strong>Synopsis:</strong> {movie.synopsis || 'Not available'}</p>
          <p><strong>Cast:</strong> {movie.cast || 'Not available'}</p>
          <p><strong>Director:</strong> {movie.director || 'Not available'}</p>
          <p><strong>Producer:</strong> {movie.producer || 'Not available'}</p>
          <p><strong>Rating:</strong> {movie.ratingCode || 'Not available'}</p>
        </div>

        {/* Button to book tickets */}
        <button className="book-now-btn" onClick={handleGetTicketsClick}>
          Get Tickets
        </button>
      </div>

      {/* Modal to show a login prompt if the user is not logged in */}
      {loginPromptVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeLoginPrompt}>&times;</span>
            <p>You need to sign in to get tickets</p>
            <button className="login-button" onClick={handleLoginModalOpen}>Sign In</button>
          </div>
        </div>
      )}

      {/* Render the LoginModal component */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
    </div>
  );
};

export default DetailedModal;
