import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import '../styles/EditMovie.css';

const EditMovie = () => {
  const { id } = useParams(); 
  const [movieDetails, setMovieDetails] = useState({
    title: '',
    category: '',
    cast: '',
    director: '',
    producer: '',
    synopsis: '',
    reviews: '',
    trailer_url: '',
    poster_url: '',
    ratingCode: '',
    price: '',
    isNowPlaying: false,
    isComingSoon: false,
    isOnDemand: false,
    show_time_1: '', // Individual showtime fields
    show_time_2: '',
    show_time_3: '',
    show_time_4: '',
    show_time_5: '',
    status: 'Coming Soon', // Dropdown for movie status
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch movie details by ID
  useEffect(() => {
    if (id) {
      axios.get(`/api/movies/${id}`)
        .then(response => {
          setMovieDetails({
            title: response.data.title || '',
            category: response.data.category || '',
            cast: response.data.cast || '',
            director: response.data.director || '',
            producer: response.data.producer || '',
            synopsis: response.data.synopsis || '',
            reviews: response.data.reviews || '',
            trailer_url: response.data.trailer_url || '',
            poster_url: response.data.poster_url || '',
            ratingCode: response.data.ratingCode || '',
            price: response.data.price || '',
            isNowPlaying: response.data.isNowPlaying || false,
            isComingSoon: response.data.isComingSoon || false,
            isOnDemand: response.data.isOnDemand || false,
            show_time_1: response.data.show_time_1 || '',
            show_time_2: response.data.show_time_2 || '',
            show_time_3: response.data.show_time_3 || '',
            show_time_4: response.data.show_time_4 || '',
            show_time_5: response.data.show_time_5 || '',
            status: response.data.status || 'Coming Soon',
          });
        })
        .catch(error => {
          console.error('Error fetching movie details:', error);
          setError('Error fetching movie details');
        });
    } else {
      console.error('Movie ID is undefined');
      setError('Invalid movie ID');
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setMovieDetails(prevState => ({
        ...prevState,
        [name]: checked === true // Explicitly set the value to true if checked, otherwise false
      }));
    } else {
      setMovieDetails(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Handle form submission (update movie details)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Update movie details via a PUT request
    axios.put(`/api/movies/${id}`, movieDetails)
      .then(() => {
        alert('Movie updated successfully!');
        setIsSubmitting(false);
        navigate('/');
      })
      .catch(error => {
        console.error('Error updating movie:', error);
        setError('Error updating movie');
        setIsSubmitting(false);
      });
  };

  // Handle movie deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      axios.delete(`/api/movies/${id}`)
        .then(() => {
          alert('Movie deleted successfully!');
          navigate('/');
        })
        .catch(error => {
          console.error('Error deleting movie:', error);
          setError('Error deleting movie');
        });
    }
  };

  return (
    <div>
      <NavBar 
        onLoginClick={() => console.log('Login')} 
        userName="Admin" 
        onLogout={() => console.log('Logout')} 
        onEditProfileClick={() => console.log('Edit Profile')}
        userType="admin" 
      />

      <div className="edit-movie-container">
        <h1>Edit Movie</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={movieDetails.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={movieDetails.category}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Cast:</label>
            <input
              type="text"
              name="cast"
              value={movieDetails.cast}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Director:</label>
            <input
              type="text"
              name="director"
              value={movieDetails.director}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Producer:</label>
            <input
              type="text"
              name="producer"
              value={movieDetails.producer}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Synopsis:</label>
            <textarea
              name="synopsis"
              value={movieDetails.synopsis}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Reviews:</label>
            <textarea
              name="reviews"
              value={movieDetails.reviews}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Trailer Picture URL:</label>
            <input
              type="text"
              name="trailer_url"
              value={movieDetails.trailer_url}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Poster URL:</label>
            <input
              type="text"
              name="poster_url"
              value={movieDetails.poster_url}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>MPAA Rating Code:</label>
            <input
              type="text"
              name="ratingCode"
              value={movieDetails.ratingCode}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="text"
              name="price"
              value={movieDetails.price}
              onChange={handleChange}
            />
          </div>

          {/* Five showtimes with time input type */}
          <div>
            <label>Showtime 1:</label>
            <input
              type="time"
              name="show_time_1"
              value={movieDetails.show_time_1}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Showtime 2:</label>
            <input
              type="time"
              name="show_time_2"
              value={movieDetails.show_time_2}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Showtime 3:</label>
            <input
              type="time"
              name="show_time_3"
              value={movieDetails.show_time_3}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Showtime 4:</label>
            <input
              type="time"
              name="show_time_4"
              value={movieDetails.show_time_4}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Showtime 5:</label>
            <input
              type="time"
              name="show_time_5"
              value={movieDetails.show_time_5}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dropdown for movie status */}
          <div>
            <label>Status:</label>
            <select name="status" value={movieDetails.status} onChange={handleChange}>
              <option value="Coming Soon">Coming Soon</option>
              <option value="Now Playing">Now Playing</option>
            </select>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>

          <button type="button" className="delete-button" onClick={handleDelete}>
            Delete Movie
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;
