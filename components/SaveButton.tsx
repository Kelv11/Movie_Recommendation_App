// components/SaveButton.tsx
import { useSavedMovies } from "@/contexts/SavedMoviesContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface SaveButtonProps {
  movie: {
    movie_id: string;
    title: string;
    poster_url: string;
  };
  size?: number;
  className?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  movie,
  size = 24,
  className = "",
}) => {
  const { isMovieSaved, toggleMovie } = useSavedMovies();
  const isSaved = isMovieSaved(movie.movie_id);

  const handlePress = () => {
    toggleMovie(movie);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`p-2 rounded-full bg-black/50 ${className}`}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isSaved ? "bookmark" : "bookmark-outline"}
        size={size}
        color={isSaved ? "#FFD700" : "#FFFFFF"}
      />
    </TouchableOpacity>
  );
};

export default SaveButton;
