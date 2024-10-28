import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AddMovie.css';

const AddMovie = () => {
  const [movieData, setMovieData] = useState({
    title: '',
    category: '',
    cast: '',
    director: '',
    producer: '',
    synopsis: '',
    reviews: '',
    trailerPicture: '',
    trailerVideo: '',
    ratingCode: '',
    showDates: '',
    show_time_1: '', // Individual showtime fields
    show_time_2: '',
    show_time_3: '',
    show_time_4: '',
    show_time_5: '',
    status: 'Coming Soon', // Dropdown menu value
    isNowPlaying: false, // Boolean for Now Playing status
    isComingSoon: true,  // Boolean for Coming Soon status
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'status') {
      setMovieData({
        ...movieData,
        status: value,
        isNowPlaying: value === 'Now Playing',
        isComingSoon: value === 'Coming Soon',
      });
    } else {
      setMovieData({
        ...movieData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit movie data with status booleans
    const moviePayload = {
      ...movieData,
      isNowPlaying: movieData.status === 'Now Playing',
      isComingSoon: movieData.status === 'Coming Soon',
    };

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
      navigate('/');
    })
    .catch(error => {
      console.error('Error adding movie:', error);
      alert('Failed to add movie.');
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  return (
    <div>
      {localStorage.getItem("role") == "admin" ? (
      <div>
        <NavBar
          onLoginClick={() => navigate('/login')}
          userName={localStorage.getItem('user')}
          onLogout={handleLogout}
          onEditProfileClick={() => navigate('/edit-profile')}
        />

        <div className="add-movie-container">
          <h2>Add Movie</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Title" value={movieData.title} onChange={handleChange} required />
            <input type="text" name="category" placeholder="Category" value={movieData.category} onChange={handleChange} required />
            <input type="text" name="cast" placeholder="Cast" value={movieData.cast} onChange={handleChange} required />
            <input type="text" name="director" placeholder="Director" value={movieData.director} onChange={handleChange} required />
            <input type="text" name="producer" placeholder="Producer" value={movieData.producer} onChange={handleChange} required />
            <textarea name="synopsis" placeholder="Synopsis" value={movieData.synopsis} onChange={handleChange} required />
            <textarea name="reviews" placeholder="Reviews" value={movieData.reviews} onChange={handleChange} />
            <input type="text" name="trailerPicture" placeholder="Trailer Picture URL" value={movieData.trailerPicture} onChange={handleChange} required />
            <input type="text" name="trailerVideo" placeholder="Trailer Video URL" value={movieData.trailerVideo} onChange={handleChange} required />
            <input type="text" name="ratingCode" placeholder="MPAA-US Film Rating Code" value={movieData.ratingCode} onChange={handleChange} required />

            {/* Five showtimes with time input type */}
            <div>
              <label>Showtime 1:</label>
              <input type="time" name="show_time_1" value={movieData.show_time_1} onChange={handleChange} required />
            </div>
            <div>
              <label>Showtime 2:</label>
              <input type="time" name="show_time_2" value={movieData.show_time_2} onChange={handleChange} required />
            </div>
            <div>
              <label>Showtime 3:</label>
              <input type="time" name="show_time_3" value={movieData.show_time_3} onChange={handleChange} required />
            </div>
            <div>
              <label>Showtime 4:</label>
              <input type="time" name="show_time_4" value={movieData.show_time_4} onChange={handleChange} required />
            </div>
            <div>
              <label>Showtime 5:</label>
              <input type="time" name="show_time_5" value={movieData.show_time_5} onChange={handleChange} required />
            </div>

            {/* Dropdown for movie status */}
            <select name="status" value={movieData.status} onChange={handleChange}>
              <option value="Coming Soon">Coming Soon</option>
              <option value="Now Playing">Now Playing</option>
            </select>

            <button type="submit">Add Movie</button>
          </form>
        </div>
      </div>
      ) : (
        <div>
          Error: Unqualified user role to access this page.
          <br></br>
          <Link to='/'>Home</Link>
        </div>
      )}
    </div>
  );
};

export default AddMovie;
