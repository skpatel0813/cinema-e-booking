import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import NavBar component
import EditProfileModal from '../components/EditProfileModal'; // Import EditProfileModal component
import '../styles/Showtimes.css';

const Showtimes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showtimes, setShowtimes] = useState([]); // Array to store fetched showtimes
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // Modal state

  // Get movie title from location state
  useEffect(() => {
    if (location.state && location.state.movieTitle) {
      setSelectedMovie(location.state.movieTitle);

      // Retrieve movieId from location state or fallback to localStorage
      const movieId = location.state.movieId || localStorage.getItem('selectedMovieId');
      if (movieId) {
        fetchShowtimes(movieId);
      }
    }
  }, [location.state]);

  // Fetch showtimes for the selected movie from the database
  const fetchShowtimes = async (movieId) => {
    movieId = localStorage.getItem('selectedMovieId');
    try {
      const response = await axios.get(`/api/movies/${movieId}/getShowtimes`); // Fetch showtimes by movie ID
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
    const currentDateTime = new Date(); // Current date and time

    // Combine selectedDate and showtime into a valid Date string
    const showtimeDateTimeString = `${selectedDate} ${showtime}`;
    const showtimeDateTime = new Date(showtimeDateTimeString);

    console.log('Current DateTime:', currentDateTime);
    console.log('Showtime String:', showtimeDateTimeString);
    console.log('Showtime DateTime:', showtimeDateTime);

    // Return true if the showtime has passed, false otherwise
    return showtimeDateTime < currentDateTime;
  };

  const handleShowtimeClick = (showtime) => {
    if (!isPastShowtime(showtime)) {
      // Store the selected showtime in local storage
      localStorage.setItem('selectedShowtime', `${selectedDate} ${showtime}`);

      navigate('/tickets', { state: { movieTitle: selectedMovie, selectedDate, selectedTime: showtime } });
    }
  };

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true); // Open the modal
  };

  const closeEditProfileModal = () => {
    setIsEditProfileOpen(false); // Close the modal
  };

  return (
    <div>
      {/* Include NavBar at the top */}
      <NavBar 
        onLoginClick={() => console.log('Login')} 
        userName="User" 
        onLogout={() => console.log('Logout')} 
        onEditProfileClick={handleEditProfileClick} // Use modal opening function
      />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={closeEditProfileModal} />

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
            {showtimes
              .filter((showtime) => !isPastShowtime(showtime)) // Exclude past showtimes
              .map((showtime, index) => (
                <button
                  key={index}
                  className="pill-button"
                  onClick={() => handleShowtimeClick(showtime)}
                >
                  {showtime}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showtimes;
