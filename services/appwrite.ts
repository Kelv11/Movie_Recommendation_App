// appwrite.ts
import { Client, Databases, ID, Query } from "react-native-appwrite";

// Add Movie type interface
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  // Add other movie properties as needed
}

// Debug environment variables
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

// Add validation with helpful error messages
if (!DATABASE_ID) {
  console.error(
    "Missing EXPO_PUBLIC_APPWRITE_DATABASE_ID in environment variables"
  );
  throw new Error("DATABASE_ID is required");
}

if (!COLLECTION_ID) {
  console.error(
    "Missing EXPO_PUBLIC_APPWRITE_COLLECTION_ID in environment variables"
  );
  throw new Error("COLLECTION_ID is required");
}

if (!PROJECT_ID) {
  console.error(
    "Missing EXPO_PUBLIC_APPWRITE_PROJECT_ID in environment variables"
  );
  throw new Error("PROJECT_ID is required");
}

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // Check if this exact search term + movie combination already exists
    const existingDocs = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", query), Query.equal("movie_id", movie.id)]
    );

    if (existingDocs.documents.length > 0) {
      // Update existing document - increment count
      const existingDoc = existingDocs.documents[0];

      const result = await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingDoc.$id,
        {
          count: existingDoc.count + 1,
          timestamp: new Date().toISOString(),
        }
      );

      return {
        success: true,
        documentId: result.$id,
        action: "updated",
        newCount: result.count,
      };
    } else {
      // Create new document
      const documentData = {
        searchTerm: query, // Required string
        movie_id: movie.id, // Required integer
        movie_title: movie.title, // Required string
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Poster", // Required URL
        timestamp: new Date().toISOString(), // Required datetime
        // count will use default value of 1
      };

      const result = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        documentData
      );

      return {
        success: true,
        documentId: result.$id,
        action: "created",
        newCount: 1,
      };
    }
  } catch (error) {
    // Keep this error log for debugging issues
    console.error("Error updating search count:", error);
    return { success: false, error };
  }
};

// Optional: Add function to get popular searches
export const getPopularSearches = async (limit: number = 10) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("count"),
      Query.limit(limit),
    ]);

    return { success: true, data: result.documents };
  } catch (error) {
    console.error("Error fetching popular searches:", error);
    return { success: false, error };
  }
};
