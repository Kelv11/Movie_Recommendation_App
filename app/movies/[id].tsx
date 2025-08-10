import SaveButton from "@/components/SaveButton";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails(id as string));

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="bg-primary flex-1 justify-center items-center">
          <StatusBar barStyle="light-content" backgroundColor="#161622" />
          <ActivityIndicator size="large" color="#FF8C00" />
          <Text className="text-white mt-4">Loading movie details...</Text>
        </View>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="bg-primary flex-1 justify-center items-center px-5">
          <StatusBar barStyle="light-content" backgroundColor="#161622" />
          <Text className="text-red-500 text-center text-lg mb-4">
            {error?.message || "Failed to load movie details"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-orange-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-primary">
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Hero Section with Poster and Gradient Overlay */}
          <View className="relative">
            {/* Background Image (Backdrop) */}
            {movie.backdrop_path && (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                }}
                style={{
                  width: width,
                  height: height * 0.6,
                  position: "absolute",
                  top: 0,
                  opacity: 0.3,
                }}
                resizeMode="cover"
              />
            )}

            {/* Dark Gradient Overlay */}
            <View
              style={{
                width: width,
                height: height * 0.6,
                background:
                  "linear-gradient(180deg, rgba(22,22,34,0.7) 0%, rgba(22,22,34,0.9) 70%, rgba(22,22,34,1) 100%)",
              }}
              className="absolute top-0"
            />

            {/* Safe Area for Status Bar */}
            <SafeAreaView>
              {/* Header with Back Button and Save Button */}
              <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="bg-black/60 rounded-full p-3 backdrop-blur-sm"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  }}
                >
                  <Text className="text-white text-lg font-bold">←</Text>
                </TouchableOpacity>

                <Text className="text-white font-semibold text-lg opacity-90">
                  Movie Details
                </Text>

                {/* Save Button */}
                <SaveButton
                  movie={{
                    movie_id: String(movie.id),
                    title: movie.title,
                    poster_url: movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image",
                  }}
                  size={24}
                  className="bg-black/60 backdrop-blur-sm"
                />
              </View>
            </SafeAreaView>

            {/* Main Content Area */}
            <View
              className="flex-row px-5 mt-8"
              style={{ minHeight: height * 0.35 }}
            >
              {/* Movie Poster */}
              <View className="mr-4">
                <View
                  className="rounded-2xl overflow-hidden bg-gray-800"
                  style={{
                    width: 140,
                    height: 210,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                  }}
                >
                  <Image
                    source={{
                      uri: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image",
                    }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Movie Info */}
              <View className="flex-1 justify-end pb-6">
                {/* Title */}
                <Text className="text-white font-bold text-2xl mb-3 leading-tight">
                  {movie.title}
                </Text>

                {/* Rating */}
                {movie.vote_average > 0 && (
                  <View className="flex-row items-center mb-3">
                    <View className="bg-yellow-500 rounded-lg px-3 py-2 mr-3">
                      <Text className="text-black font-bold text-sm">
                        {movie.vote_average.toFixed(1)}
                      </Text>
                    </View>
                    <Text className="text-gray-300 text-sm">
                      ({movie.vote_count} votes)
                    </Text>
                  </View>
                )}

                {/* Release Date & Runtime */}
                <View className="flex-row items-center mb-3">
                  {movie.release_date && (
                    <View className="bg-gray-700/70 rounded-lg px-3 py-1 mr-2">
                      <Text className="text-white text-sm">
                        {movie.release_date.split("-")[0]}
                      </Text>
                    </View>
                  )}
                  {movie.runtime && (
                    <View className="bg-gray-700/70 rounded-lg px-3 py-1">
                      <Text className="text-white text-sm">
                        {movie.runtime} min
                      </Text>
                    </View>
                  )}
                </View>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <View className="flex-row flex-wrap">
                    {movie.genres.slice(0, 3).map((genre) => (
                      <View
                        key={genre.id}
                        className="bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 mr-2 mb-1"
                      >
                        <Text className="text-orange-300 text-xs font-medium">
                          {genre.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View className="px-5 mt-8">
            {/* Tagline */}
            {movie.tagline && (
              <View className="mb-6">
                <Text className="text-orange-400 text-center italic text-lg font-medium">
                  {"${movie.tagline}"}
                </Text>
              </View>
            )}

            {/* Overview */}
            {movie.overview && (
              <View className="mb-8">
                <Text className="text-white font-bold text-xl mb-4">
                  Overview
                </Text>
                <View className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700/30">
                  <Text className="text-gray-200 text-base leading-6">
                    {movie.overview}
                  </Text>
                </View>
              </View>
            )}

            {/* Additional Info */}
            <View className="space-y-4">
              {movie.status && (
                <View className="flex-row items-center justify-between py-3 border-b border-gray-700/30">
                  <Text className="text-gray-400 font-medium">Status</Text>
                  <Text className="text-white font-semibold">
                    {movie.status}
                  </Text>
                </View>
              )}

              {movie.budget > 0 && (
                <View className="flex-row items-center justify-between py-3 border-b border-gray-700/30">
                  <Text className="text-gray-400 font-medium">Budget</Text>
                  <Text className="text-white font-semibold">
                    ${(movie.budget / 1000000).toFixed(1)}M
                  </Text>
                </View>
              )}

              {movie.revenue > 0 && (
                <View className="flex-row items-center justify-between py-3 border-b border-gray-700/30">
                  <Text className="text-gray-400 font-medium">Revenue</Text>
                  <Text className="text-white font-semibold">
                    ${(movie.revenue / 1000000).toFixed(1)}M
                  </Text>
                </View>
              )}
            </View>

            {/* Production Companies */}
            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <View className="mt-8">
                  <Text className="text-white font-bold text-xl mb-4">
                    Production Companies
                  </Text>
                  <View className="flex-row flex-wrap">
                    {movie.production_companies.slice(0, 4).map((company) => (
                      <View
                        key={company.id}
                        className="bg-gray-800/50 rounded-xl p-3 mr-3 mb-3 border border-gray-600/30"
                      >
                        <Text className="text-gray-200 text-sm font-medium">
                          {company.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default MovieDetails;
