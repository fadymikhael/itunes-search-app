import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    favorites: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
      state.loading = false;
      state.error = null;
    },
    addFavorite: (state, action) => {
      const item = action.payload;
      if (!state.favorites.find((fav) => fav.trackId === item.trackId)) {
        state.favorites.push({ ...item, rating: 0 });
      }
    },
    setRating: (state, action) => {
      const { trackId, rating } = action.payload;
      const fav = state.favorites.find((fav) => fav.trackId === trackId);
      if (fav) fav.rating = rating;
    },
    loadFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    removeFavorite: (state, action) => {
      const trackId = action.payload;
      state.favorites = state.favorites.filter((fav) => fav.trackId !== trackId);
    },
  },
  
});

export const {
  setLoading,
  setError,
  setResults,
  addFavorite,
  setRating,
  loadFavorites,
  removeFavorite,
} = searchSlice.actions;

export default searchSlice.reducer;