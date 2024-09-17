import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';  // Import the NavBar component
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
    showTimes: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData({
      ...movieData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example API call to submit movie data
    fetch('http://localhost:8081/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    })
    .then(response => response.json())
    .then(() => {
      alert('Movie added successfully!');
      navigate('/'); // Redirect to home after successful movie addition
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
      {/* Include NavBar without the search bar */}
      <NavBar
        onLoginClick={() => navigate('/login')}
        userName={localStorage.getItem('user')} // Pass userName from localStorage
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
          <input type="text" name="showDates" placeholder="Show Dates" value={movieData.showDates} onChange={handleChange} required />
          <input type="text" name="showTimes" placeholder="Show Times" value={movieData.showTimes} onChange={handleChange} required />
          <button type="submit">Add Movie</button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
