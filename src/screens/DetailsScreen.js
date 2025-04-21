import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, setRating, removeFavorite } from "../redux/searchSlice";
import { saveFavorites } from "../utils/storage";
import { Icon, Rating } from "react-native-elements";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Audio } from "expo-av";
import { styles } from "../styles/styles";

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.search.favorites);
  const isFavorite = favorites.some((fav) => fav.trackId === item.trackId);
  const favoriteItem = favorites.find((fav) => fav.trackId === item.trackId);
  const rating = favoriteItem ? favoriteItem.rating : 0;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  useEffect(() => {
    navigation.setOptions({
      title: item.trackName || item.artistName || "Details",
    });

    async function configureAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (e) {}
    }
    configureAudio();

    return () => {
      if (sound) {
        sound.unloadAsync().catch((e) => {
          console.log("Error unloading sound:", e);
        });
      }
    };
  }, [navigation, item, sound]);

  async function playSound() {
    if (!item.previewUrl) {
      Alert.alert("Error", "No audio preview available for this item");
      return;
    }

    try {
      if (sound) {
        setIsPlaying(false);
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        return;
      }

      setIsLoading(true);
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: item.previewUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (e) {
      setIsPlaying(false);
      setIsLoading(false);
      Alert.alert("Error", `Failed to play audio preview: ${e.message}`);
    }
  }

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(false);
      if (sound) {
        sound.unloadAsync();
        setSound(null);
      }
    } else if (status.error) {
      Alert.alert("Error", `Playback error: ${status.error}`);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(item.trackId));
      const updatedFavorites = favorites.filter(fav => fav.trackId !== item.trackId);
      saveFavorites(updatedFavorites);
    } else {
      dispatch(addFavorite(item));
      const updatedFavorites = [...favorites, { ...item, rating: 0 }];
      saveFavorites(updatedFavorites);
    }
  };

  const rateItem = (value) => {
    if (!isFavorite) {
      Alert.alert(
        "Add to Favorites",
        "You need to add this item to favorites before rating it. Add now?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add",
            onPress: () => {
              dispatch(addFavorite({ ...item, rating: value }));
              const updatedFavorites = [...favorites, { ...item, rating: value }];
              saveFavorites(updatedFavorites);
            },
          },
        ]
      );
      return;
    }

    dispatch(setRating({ trackId: item.trackId, rating: value }));
    const updatedFavorites = favorites.map((fav) =>
      fav.trackId === item.trackId ? { ...fav, rating: value } : fav
    );
    saveFavorites(updatedFavorites);
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.detailCardContainer, animatedStyle]}>
        <View style={[styles.detailCard, localStyles.card]}>
          <Image
            source={{ uri: item.artworkUrl100 || "https://via.placeholder.com/100/cccccc/ffffff?text=Music" }}
            style={styles.detailImage}
          />
          <Text style={styles.detailTitle}>{item.trackName || item.artistName || "Unknown"}</Text>
          <Text style={styles.detailSubtitle}>{item.artistName || "Unknown Artist"}</Text>
          
          {item.collectionName && (
            <Text style={styles.detailText}>Album: {item.collectionName}</Text>
          )}
          
          <Text style={styles.detailText}>Genre: {item.primaryGenreName || "N/A"}</Text>
          
          {item.trackTimeMillis && (
            <Text style={styles.detailText}>
              Duration: {Math.floor(item.trackTimeMillis / 60000)}:
              {((item.trackTimeMillis % 60000) / 1000).toFixed(0).padStart(2, "0")}
            </Text>
          )}
          
          {item.releaseDate && (
            <Text style={styles.detailText}>
              Released: {new Date(item.releaseDate).toLocaleDateString()}
            </Text>
          )}
          
          <TouchableOpacity 
            style={[styles.playButton, isLoading && styles.disabledButton]}
            onPress={playSound}
            disabled={isLoading}
            onPressIn={() => (scale.value = 0.95)}
            onPressOut={() => (scale.value = 1)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.playButtonContent}>
                <Icon
                  name={isPlaying ? "stop" : "play"}
                  type="font-awesome"
                  color="#fff"
                  size={16}
                  style={styles.playIcon}
                />
                <Text style={styles.playButtonText}>
                  {isPlaying ? "Stop Preview" : "Play Preview"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Your Rating:</Text>
            <Rating
              startingValue={rating}
              onFinishRating={rateItem}
              imageSize={30}
              style={styles.rating}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.favoriteButton, 
              isFavorite ? styles.removeButton : styles.addButton
            ]}
            onPress={toggleFavorite}
            onPressIn={() => (scale.value = 0.95)}
            onPressOut={() => (scale.value = 1)}
          >
            <View style={styles.favoriteButtonContent}>
              <Icon
                name={isFavorite ? "heart-o" : "heart"}
                type="font-awesome"
                color="#fff"
                size={16}
                style={styles.favoriteIcon}
              />
              <Text style={styles.favoriteButtonText}>
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});