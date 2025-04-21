import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../redux/searchSlice";
import { saveFavorites } from "../utils/storage";
import { Icon } from "react-native-elements";
import FavoriteItem from "../components/FavoriteItem";
import { styles } from "../styles/styles";

export default function FavoritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.search.favorites);

  const removeFavoriteItem = (trackId) => {
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this item from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => {
            dispatch(removeFavorite(trackId));
            const updatedFavorites = favorites.filter(fav => fav.trackId !== trackId);
            saveFavorites(updatedFavorites);
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <FavoriteItem
      item={item}
      index={index}
      onPress={() => navigation.navigate("Details", { item })}
      onRemove={removeFavoriteItem}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.favoritesHeader}>Your Favorites</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.trackId.toString()} // Updated keyExtractor
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="heart-o" type="font-awesome" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Search for music and add tracks to your favorites list
            </Text>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => navigation.navigate("Search")}
            >
              <Text style={styles.searchButtonText}>Go to Search</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}