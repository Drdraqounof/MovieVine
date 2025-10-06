// Import React library and two React hooks (useState, useEffect)
import React, { useState, useEffect } from "react";

// Import the CSS file for app-wide styling
import "./App.css";

// Import MovieCard component from the components folder
import MovieCard from "./components/MovieCard";

// Your TMDB API key (needed for making requests)
const API_KEY = "a205628441593185d663c8f4ca780366";

// The base URL for TMDB API (to make various requests)
const BASE_URL = "https://api.themoviedb.org/3";

// The base YouTube URL for embedding trailers
const YT_BASE = "https://www.youtube.com/embed/";

// Define the main App component (the root of your movie app)
function App() {
  // State to store the list of movies fetched from the API
  const [movies, setMovies] = useState([]);

  // State to store the text the user types in the search bar
  const [query, setQuery] = useState("");

  // State to store the currently selected movie (for showing trailer modal)
  const [selectedMovie, setSelectedMovie] = useState(null);

  // useEffect runs once when the component first loads (mounts)
  // It fetches popular movies by default
  useEffect(() => {
    fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  }, []); // empty dependency array = runs only once on load

  // Function to fetch movie data from the API (popular or search)
  const fetchMovies = async (url) => {
    // Fetch movie data from the API URL passed in
    const res = await fetch(url);

    // Convert the API response into a JavaScript object (JSON)
    const data = await res.json();

    // Save the list of movies from the API response into state
    setMovies(data.results);
  };

  // Function to handle when the user submits the search form
  const handleSearch = (e) => {
    // Prevent the page from refreshing when the form submits
    e.preventDefault();

    // If the user actually typed something (not empty string)
    if (query.trim()) {
      // Fetch movies that match the search term
      fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    }
  };

  // Function called when a user clicks a movie poster
  const handleSelect = async (movie) => {
    // Make a request to TMDB for this movie's list of videos (trailers, teasers, etc.)
    const res = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`);

    // Parse the JSON response
    const data = await res.json();

    // Find the first video that is a "Trailer" and is hosted on YouTube
    const trailer = data.results.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    // If a YouTube trailer exists, save the movie and trailer info in state
    if (trailer) {
      setSelectedMovie({ ...movie, trailerKey: trailer.key });
    } else {
      // If no trailer was found, alert the user
      alert("No trailer available 😢");
    }
  };

  // The part of the app that gets displayed on screen
  return (
    <div className="App">
      {/* Header section: app title + search bar */}
      <header>
        {/* App title */}
        <h1>🎬 Movie Vine</h1>

        {/* Search form that lets user type and submit a movie name */}
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            value={query} // controlled input bound to query state
            onChange={(e) => setQuery(e.target.value)} // updates query as user types
          />
          <button type="submit">Search</button>
        </form>
      </header>

      {/* Main section where all movie cards are displayed */}
      <main className="movie-container">
        {/* If movies exist, map through them and render a MovieCard for each */}
        {movies.length > 0 ? (
          movies.map((movie) => (
            // MovieCard gets passed the movie info and click handler
            <MovieCard key={movie.id} movie={movie} onSelect={handleSelect} />
          ))
        ) : (
          // If no movies were found, show this message
          <p>No movies found</p>
        )}
      </main>

      {/* ============= MODAL SECTION (for playing trailer) ============= */}
      {selectedMovie && (
        // Modal background uses the movie's backdrop image from TMDB
        <div
          className="modal"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay for blur + allows clicking outside to close modal */}
          <div
            className="modal-overlay"
            onClick={() => setSelectedMovie(null)} // Close modal when clicked outside
          ></div>

          {/* Modal content box (sits above overlay) */}
          <div className="modal-content">
            {/* Close button (×) that closes the modal */}
            <button className="close-btn" onClick={() => setSelectedMovie(null)}>
              ×
            </button>

            {/* Main body of modal — includes video player and details */}
            <div className="modal-body">
              {/* YouTube trailer embed */}
              <iframe
                src={`https://www.youtube.com/embed/${selectedMovie.trailerKey}?autoplay=1`}
                title={selectedMovie.title} // sets the title of iframe (for accessibility)
                frameBorder="0" // removes border from the iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen // allows full-screen mode on video
              ></iframe>

              {/* Movie details below trailer */}
              <div className="movie-details">
                <h2>{selectedMovie.title}</h2> {/* Movie title */}
                <p><strong>⭐ {selectedMovie.vote_average}</strong></p> {/* Rating */}
                <p>{selectedMovie.overview}</p> {/* Movie description */}
                <p><em>Release Date:</em> {selectedMovie.release_date}</p> {/* Release date */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export the App component so index.js can render it
export default App;
