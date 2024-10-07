import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import DetailedModal from '../components/DetailedModal';
import LoginModal from '../components/LoginModal';
import EditProfileModal from '../components/EditProfileModal';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('nowPlaying');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [browseAll, setBrowseAll] = useState(false);
  const [showTimes, setShowTimes] = useState([]);
  const [selectedShowTime, setSelectedShowTime] = useState('');
  const movieListRef = useRef(null);
  const navigate = useNavigate();

  // Function to convert 12-hour time to 24-hour time
  const convertTo24Hour = (time12h) => {
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours, 10); // Ensure hours is an integer

    if (period === 'PM' && hours !== 12) {
      hours = hours + 12; // Convert PM hours except 12 PM to 24-hour format
    }
    if (period === 'AM' && hours === 12) {
      hours = 0; // Convert 12 AM to 00
    }

    // Return time in HH:mm:ss format
    return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem('user');
    const storedUserRole = localStorage.getItem('role');

    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (storedUserRole) {
      setUserRole(storedUserRole);
    }

    setIsLoggedIn(!!storedUserName);

    // Fetch movies for the home page
    axios.get('/api/movies/home')
      .then(response => {
        if (Array.isArray(response.data)) {
          setMovies(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  useEffect(() => {
    if (filterDate) {
      const currentDate = new Date();
      const selectedDate = new Date(filterDate);

      const times = ['8:00 AM', '12:00 PM', '2:30 PM', '3:30 PM', '8:00 PM', '11:00 PM'];
      const filteredTimes = times.filter(time => {
        const [hour, period] = time.split(' ');
        let hour24;

        if (period === 'AM') {
          hour24 = hour === '12' ? 0 : parseInt(hour);
        } else {
          hour24 = hour === '12' ? 12 : parseInt(hour) + 12;
        }

        selectedDate.setHours(hour24, 0, 0, 0);
        return selectedDate > currentDate;
      });

      setShowTimes(filteredTimes);
    }
  }, [filterDate]);

  const handleViewDetails = (movie) => {
    if (movie) {
      setSelectedMovie(movie);
      setShowDetailedModal(true);
    } else {
      console.error('Movie or movie_id is undefined');
    }
  };

  const handleEditMovie = (movie) => {
    if (movie) {
      navigate(`/edit-movie/${movie.id}`);
    } else {
      console.error('Movie or movie_id is undefined');
    }
  };

  const handleCloseDetailedModal = () => {
    setShowDetailedModal(false);
    setSelectedMovie(null);
  };

  const handleCloseEditProfileModal = () => {
    setShowEditProfileModal(false);
  };

  const handleLogout = () => {
    setUserName('');
    setUserRole('');
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  const scrollLeft = () => {
    movieListRef.current.scrollBy({
      left: -500,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    movieListRef.current.scrollBy({
      left: 500,
      behavior: 'smooth'
    });
  };

  const getCategoryMovies = () => {
    let filteredMovies = movies;

    if (selectedCategories.length > 0) {
      filteredMovies = filteredMovies.filter(movie =>
        selectedCategories.includes(movie.category)
      );
    }

    if (searchTerm) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected showtime (convert selected time to 24-hour format)
    if (selectedShowTime) {
      const selectedShowTime24 = convertTo24Hour(selectedShowTime);
      filteredMovies = filteredMovies.filter(movie => {
        return [movie.show_time_1, movie.show_time_2, movie.show_time_3, movie.show_time_4, movie.show_time_5]
          .some(showtime => showtime && showtime.startsWith(selectedShowTime24));
      });
    }

    return filteredMovies;
  };

  const renderAdminMovies = () => {
    if (movies.length === 0) {
      return <p>No movies available.</p>;
    }

    return (
      <div className="admin-movie-list">
        {movies.map(movie => (
          <div key={movie.movie_id || movie.title} className="movie-card">
            <img 
              src={movie.poster_url} 
              alt={movie.title} 
              className="movie-poster"
              onError={(e) => e.target.style.display = 'none'}
            />
            <h2>{movie.title}</h2>
            <button className="edit-movie-btn" onClick={() => handleEditMovie(movie)}>
              Edit Movie
            </button>
          </div>
        ))}
      </div>
    );
  };

  // New function to render Now Playing movies, limiting to 5 if not admin
  const renderNowPlayingMovies = () => {
    let nowPlayingMovies = movies.filter(movie => movie.isNowPlaying);

    if (userRole !== 'admin' && !browseAll) {
      nowPlayingMovies = nowPlayingMovies.slice(0, 5); // Show only 5 if not an admin and not browsing all
    }

    if (nowPlayingMovies.length === 0) {
      return <p>No movies currently playing.</p>;
    }

    return (
      <div className="carousel-container">
        <button className="scroll-arrow left" onClick={scrollLeft}>&lt;</button>
        <div className="movie-list" ref={movieListRef}>
          {nowPlayingMovies.map(movie => (
            <div key={movie.movie_id || movie.title} className="movie-card">
              <img 
                src={movie.poster_url} 
                alt={movie.title} 
                className="movie-poster"
                onError={(e) => e.target.style.display = 'none'}
              />
              <h2>{movie.title}</h2>
              <button className="book-now-btn" onClick={() => handleViewDetails(movie)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
        <button className="scroll-arrow right" onClick={scrollRight}>&gt;</button>
      </div>
    );
  };

  // New function to render Coming Soon movies, limiting to 5 if not admin
  const renderComingSoonMovies = () => {
    let comingSoonMovies = movies.filter(movie => movie.isComingSoon);

    if (userRole !== 'admin' && !browseAll) {
      comingSoonMovies = comingSoonMovies.slice(0, 5); // Show only 5 if not an admin and not browsing all
    }

    if (comingSoonMovies.length === 0) {
      return <p>No upcoming movies available.</p>;
    }

    return (
      <div className="carousel-container">
        <button className="scroll-arrow left" onClick={scrollLeft}>&lt;</button>
        <div className="movie-list" ref={movieListRef}>
          {comingSoonMovies.map(movie => (
            <div key={movie.movie_id || movie.title} className="movie-card">
              <img 
                src={movie.poster_url} 
                alt={movie.title} 
                className="movie-poster"
                onError={(e) => e.target.style.display = 'none'}
              />
              <h2>{movie.title}</h2>
              <button className="book-now-btn" onClick={() => handleViewDetails(movie)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
        <button className="scroll-arrow right" onClick={scrollRight}>&gt;</button>
      </div>
    );
  };

  const renderMovies = () => {
    const categoryMovies = getCategoryMovies();

    if (categoryMovies.length === 0) {
      return <p>No movies available with the selected filters.</p>;
    }

    return (
      <div className="carousel-container">
        <button className="scroll-arrow left" onClick={scrollLeft}>&lt;</button>
        <div className="movie-list" ref={movieListRef}>
          {categoryMovies.map(movie => (
            <div key={movie.movie_id || movie.title} className="movie-card">
              <img 
                src={movie.poster_url} 
                alt={movie.title} 
                className="movie-poster"
                onError={(e) => e.target.style.display = 'none'}
              />
              <h2>{movie.title}</h2>
              <button className="book-now-btn" onClick={() => handleViewDetails(movie)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
        <button className="scroll-arrow right" onClick={scrollRight}>&gt;</button>
      </div>
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prevState => 
      prevState.includes(category) 
        ? prevState.filter(item => item !== category) 
        : [...prevState, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setFilterDate('');
    setSearchTerm('');
    setShowTimes([]);
    setSelectedShowTime('');
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 14);
    return today.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div>
      <NavBar 
        onLoginClick={() => setShowLoginModal(true)} 
        userName={userName} 
        onLogout={handleLogout} 
        onEditProfileClick={() => setShowEditProfileModal(true)}
      />

      {/* Admins see all movies without carousel */}
      {userRole === 'admin' ? (
        renderAdminMovies()
      ) : (
        <>
          <div className="header">
            <h1>Movies to Watch</h1>
            <div className="nav-links">
              <span 
                className={selectedCategory === 'nowPlaying' ? 'active-link' : ''} 
                onClick={() => setSelectedCategory('nowPlaying')}
              >
                Now Playing
              </span>
              <span 
                className={selectedCategory === 'comingSoon' ? 'active-link' : ''} 
                onClick={() => setSelectedCategory('comingSoon')}
              >
                Coming Soon
              </span>
              <button 
                className="browse-all-button"
                onClick={() => setBrowseAll(!browseAll)}
              >
                {browseAll ? 'Back to Carousel' : 'Browse All Movies'}
              </button>
              <div className="filter-container">
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="filter-button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  Filter
                </button>
                {showFilterDropdown && (
                  <div className="filter-dropdown">
                    <div className="categories">
                      {['Adventure', 'Comedy', 'Horror', 'Thriller', 'Drama', 'Action'].map(category => (
                        <button
                          key={category}
                          className={`pill-button ${selectedCategories.includes(category) ? 'selected' : ''}`}
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <div className="date-filter">
                      <input
                        type="date"
                        value={filterDate}
                        min={getMinDate()}
                        max={getMaxDate()}
                        onChange={(e) => setFilterDate(e.target.value)}
                      />
                    </div>
                    {/* Dropdown for selecting showtime */}
                    <div className="showtime-filter">
                      {showTimes.length > 0 && (
                        <select
                          value={selectedShowTime}
                          onChange={(e) => setSelectedShowTime(e.target.value)}
                        >
                          <option value="">Select Showtime</option>
                          {showTimes.map((time, index) => (
                            <option key={index} value={time}>{time}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <button
                      className="clear-filters-btn"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Render movies based on the selected view */}
          {browseAll ? (
            selectedCategory === 'nowPlaying' ? renderNowPlayingMovies() : renderComingSoonMovies()
          ) : (
            selectedCategory === 'nowPlaying' ? renderNowPlayingMovies() : renderComingSoonMovies()
          )}
        </>
      )}

      {/* Detailed Movie Modal */}
      <DetailedModal 
        show={showDetailedModal} 
        onClose={handleCloseDetailedModal} 
        movie={selectedMovie} 
        isLoggedIn={isLoggedIn}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={showEditProfileModal} 
        onClose={handleCloseEditProfileModal}
      />
    </div>
  );
};

export default Home;
