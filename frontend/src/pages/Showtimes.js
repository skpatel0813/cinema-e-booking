import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Showtimes.css';

const Showtimes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showtimes, setShowtimes] = useState([]); // Array to store fetched showtimes

  // Get movie title from location state
  useEffect(() => {
    if (location.state && location.state.movieTitle) {
      setSelectedMovie(location.state.movieTitle);
      fetchShowtimes(location.state.movieId); // Assuming movieId is also passed in location.state
    }
  }, [location.state]);

  // Fetch showtimes for the selected movie from the database
  const fetchShowtimes = async (movieId) => {

    movieId = localStorage.getItem('selectedMovieId');
    try {
      const response = await axios.get(`/api/movies/${movieId}/showtimes`); // Fetch showtimes by movie ID
      setShowtimes(response.data); // Assuming the API returns an array of showtimes
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    }
  };

  // Generate dates for 2 weeks
  useEffect(() => {
    const today = new Date();
    const datesArray = [];

    for (let i = 0; i < 14; i++) {
      const current = new Date(today);
      current.setDate(today.getDate() + i);
      datesArray.push(current.toDateString());
    }

    setDates(datesArray);
    setSelectedDate(datesArray[0]); // Default to today
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDropdownOpen(false); // Close the dropdown after selecting a date
  };

  const isPastShowtime = (showtime) => {
    const currentDateTime = new Date();
    const showtimeDateTime = new Date(`${selectedDate}T${showtime}`); // Assuming showtime is in 'HH:mm' format

    return showtimeDateTime < currentDateTime;
  };

  const handleShowtimeClick = (showtime) => {
    if (!isPastShowtime(showtime)) {
      // Store the selected showtime in local storage
      localStorage.setItem('selectedShowtime', `${selectedDate} ${showtime}`);

      navigate('/tickets', { state: { movieTitle: selectedMovie, selectedDate, selectedTime: showtime } });
    }
  };

  return (
    <div className="showtimes-container">
      <div className="showtimes-header">
        <h2>{selectedMovie || 'Select a Movie'}</h2>
        <div className="dropdown">
          <button className="dropdown-button" onClick={toggleDropdown}>
            {selectedDate} &#9660; {/* Downward arrow */}
          </button>
          {dropdownOpen && (
            <div className="dropdown-content">
              {dates.map((date, index) => (
                <button key={index} onClick={() => handleDateChange(date)}>
                  {date}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="showtimes-body">
        <h3>Select a Time</h3>
        <div className="time-slots">
          {showtimes.map((showtime, index) => (
            <button
              key={index}
              className={`pill-button ${isPastShowtime(showtime) ? 'disabled' : ''}`}
              onClick={() => handleShowtimeClick(showtime)}
              disabled={isPastShowtime(showtime)}
            >
              {showtime}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Showtimes;
