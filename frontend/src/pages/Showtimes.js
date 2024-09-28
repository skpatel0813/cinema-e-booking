import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Showtimes.css';

const Showtimes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeSlots = [
    '8:00 AM', '11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM', '11:00 PM'
  ];

  // Get movie title from location state
  useEffect(() => {
    if (location.state && location.state.movieTitle) {
      setSelectedMovie(location.state.movieTitle);
    }
  }, [location.state]);

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

  const isPastShowtime = (timeSlot) => {
    const currentDateTime = new Date();
    const [hours, minutes, period] = timeSlot.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);

    let slotHours = parseInt(hours);
    if (period === 'PM' && slotHours !== 12) slotHours += 12;
    if (period === 'AM' && slotHours === 12) slotHours = 0;

    const showtimeDate = new Date(selectedDate);
    showtimeDate.setHours(slotHours);
    showtimeDate.setMinutes(parseInt(minutes));
    showtimeDate.setSeconds(0);

    return showtimeDate < currentDateTime;
  };

  const handleShowtimeClick = (timeSlot) => {
    if (!isPastShowtime(timeSlot)) {
      // Store the selected showtime in local storage
      localStorage.setItem('selectedShowtime', `${selectedDate} ${timeSlot}`);

      navigate('/tickets', { state: { movieTitle: selectedMovie, selectedDate, selectedTime: timeSlot } });
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
          {timeSlots.map((slot, index) => (
            <button
              key={index}
              className={`pill-button ${isPastShowtime(slot) ? 'disabled' : ''}`}
              onClick={() => handleShowtimeClick(slot)}
              disabled={isPastShowtime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Showtimes;
