import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setResults, loadFavorites } from "../redux/searchSlice"; // Added loadFavorites
import { loadFavoritesFromStorage } from "../utils/storage";
import ListItem from "../components/ListItem";
import { styles } from "../styles/styles";
import { Icon } from "react-native-elements";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("track");
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.search);

  useEffect(() => {
    loadFavoritesFromStorage(dispatch, loadFavorites);
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Search Error", error);
      dispatch(setError(null));
    }
  }, [error]);

  const search = async () => {
    if (!query.trim()) {
      Alert.alert("Error", "Please enter a search term");
      return;
    }

    dispatch(setLoading(true));
    
    try {
      const term = query.trim().replace(/\s+/g, "+");
      const url = `https://itunes.apple.com/search?term=${term}&entity=${searchType === "track" ? "song" : "musicArtist"}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      dispatch(setResults(data.results));
      dispatch(setLoading(false)); // Added this line
      
      if (data.results.length === 0) {
        Alert.alert("No Results", "No results found for your search");
      }
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };

  const renderItem = ({ item, index }) => (
    <ListItem
      item={item}
      index={index}
      onPress={() => navigation.navigate("Details", { item })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🎵 iTunes Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for tracks or artists..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={search}
      />
      <View style={styles.searchTypeContainer}>
        {["track", "artist"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.searchTypeButton, searchType === type && styles.activeButton]}
            onPress={() => setSearchType(type)}
          >
            <Text 
              style={[
                styles.searchTypeText, 
                searchType === type ? styles.activeSearchTypeText : styles.inactiveSearchTypeText
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.searchButton} onPress={search}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4B0082" style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => (item.trackId || item.artistId).toString()} // Updated keyExtractor
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            results.length === 0 && !loading ? (
              <Text style={styles.emptyText}>
                {query.trim() ? "No results found" : "Search for music tracks or artists"}
              </Text>
            ) : null
          }
        />
      )}
      
      <TouchableOpacity 
        style={styles.favoritesButton} 
        onPress={() => navigation.navigate("Favorites")}
      >
        <Icon name="heart" type="font-awesome" color="#fff" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}