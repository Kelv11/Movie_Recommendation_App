// contexts/SavedMoviesContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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
  isLoading: boolean;
}

const SavedMoviesContext = createContext<SavedMoviesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "@saved_movies";

interface SavedMoviesProviderProps {
  children: ReactNode;
}

export const SavedMoviesProvider: React.FC<SavedMoviesProviderProps> = ({
  children,
}) => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved movies from AsyncStorage on app start
  useEffect(() => {
    loadSavedMovies();
  }, []);

  const loadSavedMovies = async () => {
    try {
      setIsLoading(true);
      const storedMovies = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMovies) {
        const parsedMovies = JSON.parse(storedMovies);
        // Convert savedAt strings back to Date objects
        const moviesWithDates = parsedMovies.map((movie: any) => ({
          ...movie,
          savedAt: new Date(movie.savedAt),
        }));
        setSavedMovies(moviesWithDates);
      }
    } catch (error) {
      console.error("Error loading saved movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSavedMovies = async (movies: SavedMovie[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    } catch (error) {
      console.error("Error saving movies:", error);
    }
  };

  const addMovie = (movie: Omit<SavedMovie, "savedAt">) => {
    setSavedMovies((prev) => {
      // Check if movie is already saved
      if (prev.some((savedMovie) => savedMovie.movie_id === movie.movie_id)) {
        return prev;
      }
      const newMovies = [...prev, { ...movie, savedAt: new Date() }];
      saveSavedMovies(newMovies); // Persist to storage
      return newMovies;
    });
  };

  const removeMovie = (movieId: string) => {
    setSavedMovies((prev) => {
      const newMovies = prev.filter((movie) => movie.movie_id !== movieId);
      saveSavedMovies(newMovies); // Persist to storage
      return newMovies;
    });
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
    isLoading,
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
