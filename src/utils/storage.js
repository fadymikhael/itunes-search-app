import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (e) {
    Alert.alert("Error", "Failed to save favorites");
  }
};

export const loadFavoritesFromStorage = async (dispatch, loadFavoritesAction) => {
  try {
    const data = await AsyncStorage.getItem("favorites");
    const favorites = data ? JSON.parse(data) : [];
    dispatch(loadFavoritesAction(favorites));
  } catch (e) {
    Alert.alert("Error", "Failed to load favorites");
  }
};