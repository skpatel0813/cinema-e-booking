import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/AddMovie.css';

// Component to add a new movie to the system
const AddMovie = () => {
  // State to manage the form inputs for movie details
  const [movieData, setMovieData] = useState({
    title: '',          // Movie title
    category: '',       // Movie category (e.g., Drama, Comedy)
    cast: '',           // Cast members
    director: '',       // Director's name
    producer: '',       // Producer's name
    synopsis: '',       // Brief synopsis of the movie
    reviews: '',        // Reviews for the movie
    posterUrl: '',      // URL of the movie poster
    trailerUrl: '',     // URL of the movie trailer
    ratingCode: '',     // MPAA-US Film Rating Code (e.g., PG, R)
    showDates: '',      // Dates when the movie will be shown
    show_time_1: '',    // Individual showtimes (1-5)
    show_time_2: '',
    show_time_3: '',
    show_time_4: '',
    show_time_5: '',
    status: 'Coming Soon', // Dropdown value for movie status
    isNowPlaying: false,   // Boolean indicating if the movie is currently playing
    isComingSoon: true,    // Boolean indicating if the movie is coming soon
  });

  const navigate = useNavigate(); // Hook to navigate between pages

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the status-related booleans based on the selected status
    if (name === 'status') {
      setMovieData({
        ...movieData,
        status: value,
        isNowPlaying: value === 'Now Playing',
        isComingSoon: value === 'Coming Soon',
      });
    } else {
      // Update other form fields
      setMovieData({
        ...movieData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the payload for submission
    const moviePayload = {
      ...movieData,
      isNowPlaying: movieData.status === 'Now Playing',
      isComingSoon: movieData.status === 'Coming Soon',
    };

    console.log('Movie Payload:', moviePayload); // Log the payload for debugging

    // API call to submit the new movie details
    fetch('http://localhost:8081/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moviePayload),
    })
      .then(response => response.json())
      .then(() => {
        alert('Movie added successfully!');
        navigate('/'); // Navigate to the home page after successful submission
      })
      .catch(error => {
        console.error('Error adding movie:', error);
        alert('Failed to add movie.');
      });
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user info from local storage
    localStorage.removeItem('role'); // Remove role info from local storage
    navigate('/'); // Navigate to the home page
    window.location.reload(); // Reload the page to reflect the changes
  };

  return (
    <div>
      {/* Navigation bar */}
      <NavBar
        onLoginClick={() => navigate('/login')}
        userName={localStorage.getItem('user')} // Retrieve username from local storage
        onLogout={handleLogout}
        onEditProfileClick={() => navigate('/edit-profile')}
      />

      {/* Add Movie Form */}
      <div className="add-movie-container">
        <h2>Add Movie</h2>
        <form onSubmit={handleSubmit}>
          {/* Input fields for movie details */}
          <input type="text" name="title" placeholder="Title" value={movieData.title} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Category" value={movieData.category} onChange={handleChange} required />
          <input type="text" name="cast" placeholder="Cast" value={movieData.cast} onChange={handleChange} required />
          <input type="text" name="director" placeholder="Director" value={movieData.director} onChange={handleChange} required />
          <input type="text" name="producer" placeholder="Producer" value={movieData.producer} onChange={handleChange} required />
          <textarea name="synopsis" placeholder="Synopsis" value={movieData.synopsis} onChange={handleChange} required />
          <textarea name="reviews" placeholder="Reviews" value={movieData.reviews} onChange={handleChange} />
          <input type="text" name="posterUrl" placeholder="Poster URL" value={movieData.posterUrl} onChange={handleChange} required />
          <input type="text" name="trailerUrl" placeholder="Trailer URL" value={movieData.trailerUrl} onChange={handleChange} required />
          <input type="text" name="ratingCode" placeholder="MPAA-US Film Rating Code" value={movieData.ratingCode} onChange={handleChange} required />

          {/* Input fields for showtimes */}
          <div>
            <label>Showtime 1:</label>
            <input type="time" name="show_time_1" value={movieData.show_time_1} onChange={handleChange} required />
          </div>
          <div>
            <label>Showtime 2:</label>
            <input type="time" name="show_time_2" value={movieData.show_time_2} onChange={handleChange} />
          </div>
          <div>
            <label>Showtime 3:</label>
            <input type="time" name="show_time_3" value={movieData.show_time_3} onChange={handleChange} />
          </div>
          <div>
            <label>Showtime 4:</label>
            <input type="time" name="show_time_4" value={movieData.show_time_4} onChange={handleChange} />
          </div>
          <div>
            <label>Showtime 5:</label>
            <input type="time" name="show_time_5" value={movieData.show_time_5} onChange={handleChange} />
          </div>

          {/* Dropdown for selecting movie status */}
          <select name="status" value={movieData.status} onChange={handleChange}>
            <option value="Coming Soon">Coming Soon</option>
            <option value="Now Playing">Now Playing</option>
          </select>

          <button type="submit">Add Movie</button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
