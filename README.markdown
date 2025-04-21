# iTunes Search App

A React Native app built with Expo to search for music tracks and artists using the iTunes Search API. Search, view details, play previews, add to favorites, and rate your favorite tracks.

## Features

- Search for tracks or artists via the iTunes Search API.
- View detailed track/artist info (album, genre, duration, release date).
- Play audio previews using `expo-av`.
- Add tracks to favorites and rate them (1-5 stars).
- Manage favorites: view, rate, or remove items.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/itunes-search-app.git
   cd itunes-search-app
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start the Expo Server**:

   ```bash
   npx expo start
   ```

   - Install the Expo Go app on your iOS or Android device.
   - Scan the QR code displayed in the terminal or browser with the Expo Go app to run the app on your device.
   - Alternatively, run on an emulator: `npx expo start --android` or `npx expo start --ios`.

## Usage

- **Search Screen**: Enter a track or artist name, select "Track" or "Artist", and press "Search".
- **Details Screen**: Tap a result to view details, play a preview, add to favorites, or rate the track.
- **Favorites Screen**: View your favorites, tap to see details, or remove items.

## Dependencies

- **Expo**: `~52.0.46`
- **React Native**: `0.76.9`
- **React Navigation**: `@react-navigation/native` (`^6.1.6`), `@react-navigation/native-stack` (`^6.9.12`)
- **Redux**: `react-redux` (`^9.1.0`), `@reduxjs/toolkit` (`^2.2.3`)
- **React Native Elements**: `@rneui/base` (`^4.0.0-rc.7`), `@rneui/themed` (`^4.0.0-rc.8`)
- **Other**: `expo-av` (`~15.0.2`), `react-native-reanimated` (`~3.16.1`), `@react-native-async-storage/async-storage` (`1.23.1`)

## Project Structure

- `src/components/`: Reusable UI components (`ListItem.js`, `FavoriteItem.js`).
- `src/navigation/`: Navigation setup (`AppNavigator.js`).
- `src/redux/`: Redux store and slice (`store.js`, `searchSlice.js`).
- `src/screens/`: App screens (`SearchScreen.js`, `DetailsScreen.js`, `FavoritesScreen.js`).
- `src/styles/`: Shared styles (`styles.js`).
- `src/utils/`: Utility functions (`storage.js` for AsyncStorage).

## License

MIT License
