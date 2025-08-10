// contexts/SavedMoviesContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

export interface SavedMovie {
  movie_id: string;
  title: string;
  poster_url: string;
  savedAt: Date;
}

interface SavedMoviesContextType {
  savedMovies: SavedMovie[];
  addMovie: (movie: Omit<SavedMovie, "savedAt">) => void;
  removeMovie: (movieId: string) => void;
  isMovieSaved: (movieId: string) => boolean;
  toggleMovie: (movie: Omit<SavedMovie, "savedAt">) => void;
}

const SavedMoviesContext = createContext<SavedMoviesContextType | undefined>(
  undefined
);

interface SavedMoviesProviderProps {
  children: ReactNode;
}

export const SavedMoviesProvider: React.FC<SavedMoviesProviderProps> = ({
  children,
}) => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);

  const addMovie = (movie: Omit<SavedMovie, "savedAt">) => {
    setSavedMovies((prev) => {
      // Check if movie is already saved
      if (prev.some((savedMovie) => savedMovie.movie_id === movie.movie_id)) {
        return prev;
      }
      return [...prev, { ...movie, savedAt: new Date() }];
    });
  };

  const removeMovie = (movieId: string) => {
    setSavedMovies((prev) =>
      prev.filter((movie) => movie.movie_id !== movieId)
    );
  };

  const isMovieSaved = (movieId: string) => {
    return savedMovies.some((movie) => movie.movie_id === movieId);
  };

  const toggleMovie = (movie: Omit<SavedMovie, "savedAt">) => {
    if (isMovieSaved(movie.movie_id)) {
      removeMovie(movie.movie_id);
    } else {
      addMovie(movie);
    }
  };

  const value = {
    savedMovies,
    addMovie,
    removeMovie,
    isMovieSaved,
    toggleMovie,
  };

  return (
    <SavedMoviesContext.Provider value={value}>
      {children}
    </SavedMoviesContext.Provider>
  );
};

export const useSavedMovies = () => {
  const context = useContext(SavedMoviesContext);
  if (context === undefined) {
    throw new Error("useSavedMovies must be used within a SavedMoviesProvider");
  }
  return context;
};
