import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  if (moviesLoading || trendingLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Image source={images.bg} className="absolute w-full h-full z-0" />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (moviesError || trendingError) {
    return (
      <View className="flex-1 bg-primary justify-center items-center px-5">
        <Image source={images.bg} className="absolute w-full h-full z-0" />
        <Text className="text-red-500 text-center">
          Error: {moviesError?.message || trendingError?.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        <SearchBar
          onPress={() => router.push("/search")}
          placeholder="Search for a movie"
        />

        {trendingMovies && trendingMovies.length > 0 && (
          <View className="mt-10">
            <Text className="text-lg text-white font-bold mb-3">
              Trending Movies
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4 mt-3"
              data={trendingMovies}
              contentContainerStyle={{
                gap: 26,
              }}
              renderItem={({ item, index }) => (
                <TrendingCard movie={item} index={index} />
              )}
              keyExtractor={(item, index) =>
                `trending-${index}-${
                  item.movie_id || item.movie_id || Math.random()
                }`
              }
              ItemSeparatorComponent={() => <View className="w-4" />}
            />
          </View>
        )}

        <View className="mt-5">
          <Text className="text-lg text-white font-bold mt-5 mb-3">
            Latest Movies
          </Text>
          <FlatList
            data={movies || []}
            renderItem={({ item, index }) => <MovieCard {...item} />}
            keyExtractor={(item, index) =>
              `movie-${index}-${item.id || item.movie_id || Math.random()}`
            }
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            className="mt-2 pb-32"
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}
