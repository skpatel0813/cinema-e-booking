// DetailedModal.js

import React from 'react';
import '../styles/modal.css';  // Import the CSS file



const DetailedModal = ({ show, onClose, movie }) => {
  if (!show || !movie) return null; // Render nothing if show is false or movie is null

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        
        {/* Movie Title */}
        <h2>{movie.title}</h2>
        
        {/* Movie Trailer */}
        {movie.trailer ? (
          <div className="trailer-container">
            <iframe 
              width="100%" 
              height="400px" 
              src={movie.trailer} 
              title="Movie Trailer" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p>Trailer not available</p> // Fallback message if trailer is not available
        )}
        
        {/* Movie Details */}
        <div className="movie-details">
          <p><strong>Synopsis:</strong> {movie.synopsis || 'Not available'}</p>
          <p><strong>Cast:</strong> {movie.cast || 'Not available'}</p>
          <p><strong>Director:</strong> {movie.director || 'Not available'}</p>
          <p><strong>Producer:</strong> {movie.producer || 'Not available'}</p>
        </div>
        
        {/* Book Now Button */}
        <button className="book-now-btn">
          Get Tickets
        </button>
      </div>
    </div>
  );
};

export default DetailedModal;
