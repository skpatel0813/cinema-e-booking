// Home.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DetailedModal from '../components/DetailedModal';  // Import the DetailedModal component
import '../styles/Home.css';  // Import CSS for styling

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // State to track selected movie
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    axios.get('/api/movies/home')
      .then(response => {
        console.log('Response Data:', response.data); // Log to verify data structure
        if (Array.isArray(response.data)) {
          setMovies(response.data); // Set movies state with data array
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  const handleViewDetails = (movie) => {
    console.log('Selected Movie:', movie); // Debugging log
    setSelectedMovie(movie); // Set the selected movie
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedMovie(null); // Reset the selected movie
  };

  return (
    <div>
      <div className="header">
        <h1>Movies to Watch</h1>
        <div className="nav-links">
          <span className="active-link">Now Playing</span>
          <span>Coming Soon</span>
          <span>On Demand</span>
        </div>
      </div>

      <div className="movie-list">
        {Array.isArray(movies) && movies.map(movie => (
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
      
      {/* Modal to show detailed movie information */}
      <DetailedModal show={showModal} onClose={handleCloseModal} movie={selectedMovie} />
    </div>
  );
};

export default Home;
