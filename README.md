# 🎬 Movie Recommendation App

A cross-platform mobile application built with **React Native**, **TypeScript**, and **Tailwind CSS (NativeWind)** that allows users to discover trending and top-rated movies, search for titles, view detailed movie information, and save their favorites for easy access later.

---

## 📘 Project Overview
The **Movie Recommendation App** is designed to provide a smooth, modern movie discovery experience. It integrates with the **TMDB API** to fetch real-time data, displays it in a clean UI, and allows users to personalize their watchlist by saving favorites. The app demonstrates **API integration, state management, persistent storage, and responsive UI design**.

---

## 🚀 Features

### 🎥 Movie Discovery
- Browse **latest**, **trending**, and **top-rated** films.
- Fetches data in real time from TMDB.

### 🔍 Search
- Search movies by title with instant, live results.
- Debounced search for optimized API calls.

### 📄 Movie Details
- View synopsis, ratings, release date, and cast information.
- High-quality poster images.

### ⭐ Favorites Tab
- Save movies you’re interested in.
- Persistent storage so favorites remain after closing the app.

---

## 🛠 Tech Stack

**Frontend:**
- React Native (Expo)
- TypeScript
- NativeWind (Tailwind CSS for React Native)
- React Navigation

**State Management:**
- Context API

**API:**
- [TMDB API](https://developer.themoviedb.org/) for movie data

**Other Tools:**
- AsyncStorage for persistent favorites
- ESLint + Prettier for code quality
- dotenv for environment variable management

---

## 📂 Project Structure
```plaintext
Movie_Recommendation_App/
├── .vscode/          # VSCode workspace settings
├── app/              # App navigation and routing setup
├── assets/           # Images, icons, and fonts
├── components/       # Reusable UI components
├── constants/        # App-wide constants (colors, endpoints, etc.)
├── contexts/         # Context API for global state (favorites, etc.)
├── interfaces/       # TypeScript interfaces for type safety
├── services/         # API calls and data fetching logic
├── types/            # Shared TypeScript type definitions
├── app.json          # Expo configuration
├── babel.config.js   # Babel setup
├── eslint.config.js  # ESLint configuration
├── metro.config.js   # Metro bundler settings
├── nativewind-env.d.ts # Tailwind types for RN
├── package.json      # Project dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
⚙️ Installation & Setup
Prerequisites
Node.js ≥ 16.x

npm or yarn

Expo CLI

TMDB API Key

1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/Kelv11/Movie_Recommendation_App.git
cd Movie_Recommendation_App
2️⃣ Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
3️⃣ Configure Environment Variables
Create a .env file in the root directory:

env
Copy
Edit
EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key
4️⃣ Run the App
bash
Copy
Edit
npx expo start
Scan the QR code with the Expo Go app on your device to run it.

🧩 Customization
API Endpoint: Change TMDB requests in services/ to point to another source.

Theme: Update colors in tailwind.config.js.

UI Components: Modify layouts in components/ to match your branding.

✅ Best Practices Followed
Reusable, maintainable UI components.

Centralized API call logic.

Strong TypeScript typing for reliability.

Clean folder structure for scalability.

Persistent storage for user data.

🙌 Acknowledgements
React Native Documentation
TMDB API
NativeWind


TMDB API

NativeWind
