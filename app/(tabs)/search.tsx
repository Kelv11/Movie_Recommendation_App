import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTracked, setSearchTracked] = useState<string>("");
  const [trackingStatus, setTrackingStatus] = useState<{
    action?: "created" | "updated";
    count?: number;
  }>({});

  // Debounce the search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: debouncedSearchQuery }), false);

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
        setSearchTracked(""); // Reset tracking when search is cleared
        setTrackingStatus({}); // Reset tracking status
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  // Separate effect to track search counts after movies are loaded
  useEffect(() => {
    const trackSearch = async () => {
      // Only track if:
      // 1. Not currently loading
      // 2. No errors
      // 3. There's a search query
      // 4. We haven't already tracked this exact query
      // 5. We have movies to track with
      if (
        !loading &&
        !error &&
        debouncedSearchQuery.trim() &&
        searchTracked !== debouncedSearchQuery &&
        movies?.length > 0 &&
        movies[0]
      ) {
        try {
          console.log(`🔍 Tracking search: "${debouncedSearchQuery}"`);

          const result = await updateSearchCount(
            debouncedSearchQuery,
            movies[0]
          );

          if (result.success) {
            setSearchTracked(debouncedSearchQuery); // Mark as tracked
            setTrackingStatus({
              action: result.action,
              count: result.newCount,
            });
          } else {
            console.warn(`Search tracking failed:`, result.error);
            setTrackingStatus({});
          }
        } catch (err) {
          console.error(`Search tracking error:`, err);
          setTrackingStatus({});
        }
      }
    };

    trackSearch();
  }, [movies, loading, error, debouncedSearchQuery, searchTracked]);

  // Show loading indicator when user is typing (before debounce completes)
  const isTyping = searchQuery !== debouncedSearchQuery && searchQuery.trim();

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar
                placeholder="Search Movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>
            {(loading || isTyping) && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}
            {isTyping && (
              <Text className="text-gray-400 px-5 text-sm mb-3">
                Searching for &quot;{searchQuery}&quot;...
              </Text>
            )}
            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}
            {!loading &&
              !isTyping &&
              !error &&
              debouncedSearchQuery.trim() &&
              movies?.length === 0 && (
                <Text className="text-white px-5 my-3">
                  No movies found for &quot;{debouncedSearchQuery}&quot;
                </Text>
              )}
            {!loading &&
              !isTyping &&
              !error &&
              debouncedSearchQuery.trim() &&
              movies?.length > 0 && (
                <View className="px-5 mb-3">
                  <Text className="text-xl text-white font-bold">
                    Search Results for{" "}
                    <Text className="text-accent">{debouncedSearchQuery}</Text>
                  </Text>
                  {searchTracked === debouncedSearchQuery &&
                    trackingStatus.action && (
                      <Text className="text-xs text-green-400 mt-1">
                        ✓ Search{" "}
                        {trackingStatus.action === "updated"
                          ? `tracked (${trackingStatus.count} times)`
                          : "tracked for first time"}
                      </Text>
                    )}
                </View>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error && !isTyping ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {debouncedSearchQuery.trim()
                  ? "No movies found"
                  : "Search for a movie to get started..."}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
