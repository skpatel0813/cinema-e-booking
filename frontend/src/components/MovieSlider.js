// MovieSlider.js

import React from 'react';
import Slider from 'react-slick'; // Importing the Slick slider library
import "slick-carousel/slick/slick.css"; // Slick slider default styles
import "slick-carousel/slick/slick-theme.css"; // Additional theme styles for Slick slider

// MovieSlider component to display a carousel of movie cards
const MovieSlider = ({ movies }) => {
  // Slider configuration settings
  const settings = {
    dots: false, // Disable dots for navigation
    infinite: true, // Enable infinite scrolling
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 4, // Number of slides visible at a time
    slidesToScroll: 1, // Number of slides to scroll at a time
    nextArrow: <SampleNextArrow />, // Custom component for the next arrow
    prevArrow: <SamplePrevArrow />  // Custom component for the previous arrow
  };

  return (
    // Render the slider using the settings defined above
    <Slider {...settings}>
      {movies.map(movie => (
        // Each movie card is rendered inside a <div> with a unique key
        <div key={movie.movie_id} className="movie-card">
          {/* Movie poster */}
          <img 
            src={movie.poster_url} 
            alt={movie.title} 
            style={{ 
              width: '100%', 
              height: 'auto', 
              objectFit: 'cover', 
              borderRadius: '10px' 
            }} 
          />
          {/* Movie information */}
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.duration} | {movie.rating}</p>
            <p>Released {movie.release_date}</p>
            <button className="get-tickets-btn">Get Tickets</button>
          </div>
        </div>
      ))}
    </Slider>
  );
};

// Custom Next Arrow for the slider
const SampleNextArrow = (props) => {
  const { className, onClick } = props; // Props provided by the Slick slider library
  return (
    <div 
      className={className} 
      onClick={onClick} 
      style={{ display: 'block', background: '#000' }} 
    />
  );
};

// Custom Previous Arrow for the slider
const SamplePrevArrow = (props) => {
  const { className, onClick } = props; // Props provided by the Slick slider library
  return (
    <div 
      className={className} 
      onClick={onClick} 
      style={{ display: 'block', background: '#000' }} 
    />
  );
};

export default MovieSlider;
