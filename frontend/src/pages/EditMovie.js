import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import NavBar component
import '../styles/EditMovie.css';

const EditMovie = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movieDetails, setMovieDetails] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // For redirecting the user

  // Fetch movie details by ID
  useEffect(() => {
    if (id) {
      console.log('Movie ID:', id);
      axios.get(`/api/movies/${id}`)
        .then(response => {
          setMovieDetails(response.data);
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
    const { name, value } = e.target;
    setMovieDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
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
          navigate('/'); // Redirect to the homepage after deletion
        })
        .catch(error => {
          console.error('Error deleting movie:', error);
          setError('Error deleting movie');
        });
    }
  };

  return (
    <div>
      {/* Add the NavBar component here */}
      <NavBar 
        onLoginClick={() => console.log('Login')} 
        userName="Admin" 
        onLogout={() => console.log('Logout')} 
        onEditProfileClick={() => console.log('Edit Profile')}
        userType="admin" 
      />

      {/* Main content for editing the movie */}
      <div className="edit-movie-container">
        <h1>Edit Movie</h1>
        {error && <p className="error">{error}</p>}
        {movieDetails ? (
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
                type="number"
                name="price"
                value={movieDetails.price}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Delete movie button */}
            <button type="button" className="delete-button" onClick={handleDelete}>
              Delete Movie
            </button>
          </form>
        ) : (
          <p>Loading movie details...</p>
        )}
      </div>
    </div>
  );
};

export default EditMovie;
