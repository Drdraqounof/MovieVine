// Import React library (required to define React components)
import React from "react";

// Import CSS file for styling this specific MovieCard component
import "./MovieCard.css";

// Define a base URL for images from TMDB API.
// TMDB hosts movie poster images at specific paths — we’ll use this to load them.
const IMG_PATH = "https://image.tmdb.org/t/p/w500";

// Define the MovieCard component.
// It takes in two props:
//   - movie → the movie object (contains title, poster, rating, etc.)
//   - onSelect → a function passed from App.js that handles what happens when a movie is clicked
function MovieCard({ movie, onSelect }) {
  return (
    // Main movie card container.
    // When clicked, it triggers the onSelect() function and passes in the movie.
    <div className="movie" onClick={() => onSelect(movie)}>

      {/* Movie poster image */}
      <img
        // The `src` determines what image to show.
        // If the movie has a valid poster_path, combine it with IMG_PATH.
        // Otherwise, show a fallback "No Image" placeholder.
        src={
          movie.poster_path
            ? IMG_PATH + movie.poster_path
            : "https://via.placeholder.com/200x300?text=No+Image"
        }

        // The alt text describes the image for accessibility and SEO.
        alt={movie.title}
      />

      {/* Info section below the poster (title + rating) */}
      <div className="movie-info">
        {/* Movie title displayed as a heading */}
        <h3>{movie.title}</h3>

        {/* Movie rating (vote_average from TMDB) with a star emoji */}
        <p>⭐ {movie.vote_average}</p>
      </div>
    </div>
  );
}

// Export the MovieCard component so App.js can import and use it
export default MovieCard;

