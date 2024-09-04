// MovieSlider.js

import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const MovieSlider = ({ movies }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <Slider {...settings}>
      {movies.map(movie => (
        <div key={movie.movie_id} className="movie-card">
          <img 
            src={movie.poster_url} 
            alt={movie.title} 
            style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10px' }}
          />
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

// Custom Arrows for Slider
const SampleNextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick} style={{ display: 'block', background: '#000' }} />
  );
}

const SamplePrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick} style={{ display: 'block', background: '#000' }} />
  );
}

export default MovieSlider;
