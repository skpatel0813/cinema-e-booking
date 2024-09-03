// Home.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('/api/movies/home')
      .then(response => {
        console.log('Response Data:', response.data); // Log the data to see its structure
        if (Array.isArray(response.data)) {
          setMovies(response.data); // Ensure movies is set with the data array
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);
  

  return (
    <div>
      <h1>Now Playing</h1>
      <div className="movie-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {Array.isArray(movies) && movies.map(movie => (
          <div key={movie.movie_id} className="movie-card" style={{ margin: '20px', textAlign: 'center' }}>
            <img 
              src={movie.poster_url} // Ensure this correctly accesses the posterUrl field
              alt={movie.title} 
              style={{ width: '200px', height: '300px', objectFit: 'cover' }}
              onError={(e) => e.target.style.display = 'none'} // Fallback for broken images
            />
            <h2>{movie.title}</h2>
            <p>{movie.synopsis}</p> {/* Ensure 'synopsis' is part of the data returned */}
            <a href={`/movies/${movie.movie_id}`}>View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
