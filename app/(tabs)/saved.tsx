// app/(tabs)/saved.tsx
import SaveButton from "@/components/SaveButton";
import { SavedMovie, useSavedMovies } from "@/contexts/SavedMoviesContext";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const SavedMovieCard: React.FC<{ movie: SavedMovie }> = ({ movie }) => {
  return (
    <Link href={`/movies/${movie.movie_id}`} asChild>
      <TouchableOpacity className="flex-row bg-gray-900 p-3 mb-3 rounded-lg">
        <Image
          source={{ uri: movie.poster_url }}
          className="w-20 h-28 rounded-lg"
          resizeMode="cover"
        />

        <View className="flex-1 ml-3 justify-between">
          <View>
            <Text
              className="text-white text-lg font-bold mb-1"
              numberOfLines={2}
            >
              {movie.title}
            </Text>
            <Text className="text-gray-400 text-sm">
              Saved on {movie.savedAt.toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row justify-end">
            <SaveButton
              movie={{
                movie_id: movie.movie_id,
                title: movie.title,
                poster_url: movie.poster_url,
              }}
              size={20}
              className="bg-transparent p-1"
            />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default function SavedMoviesScreen() {
  const { savedMovies } = useSavedMovies();

  if (savedMovies.length === 0) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-6">
        <Text className="text-white text-xl font-bold mb-2">
          No Saved Movies
        </Text>
        <Text className="text-gray-400 text-center">
          Start exploring movies and save your favorites to see them here!
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="px-4 pt-12 pb-4">
        <Text className="text-white text-2xl font-bold">
          Saved Movies ({savedMovies.length})
        </Text>
      </View>

      <FlatList
        data={savedMovies}
        keyExtractor={(item) => item.movie_id}
        renderItem={({ item }) => <SavedMovieCard movie={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
