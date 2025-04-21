import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { styles } from "../styles/styles";

export default function ListItem({ item, index, onPress }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(300)}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={() => (scale.value = 0.98)}
          onPressOut={() => (scale.value = 1)}
          style={styles.cardContainer}
        >
          <View style={[styles.card, localStyles.card]}>
            <Image
              source={{ uri: item.artworkUrl100 || "https://via.placeholder.com/100/cccccc/ffffff?text=Music" }}
              style={styles.thumbnail}
            />
            <View style={styles.cardContent}>
              <Text style={styles.title} numberOfLines={1}>
                {item.trackName || item.artistName || "Unknown"}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {item.artistName || "Unknown Artist"}
              </Text>
              {item.collectionName && (
                <Text style={styles.albumText} numberOfLines={1}>
                  {item.collectionName}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
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