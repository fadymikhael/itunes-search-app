import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Icon, Rating } from "react-native-elements";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { styles } from "../styles/styles";

export default function FavoriteItem({ item, index, onPress, onRemove }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(300)}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => (scale.value = 0.98)}
        onPressOut={() => (scale.value = 1)}
      >
        <View style={[styles.favoriteCard, localStyles.card]}>
          <View style={styles.favoriteCardContent}>
            <Image
              source={{
                uri:
                  item.artworkUrl100 ||
                  "https://via.placeholder.com/100/cccccc/ffffff?text=Music",
              }}
              style={styles.thumbnail}
            />
            <View style={styles.favoriteTextContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.trackName || item.artistName || "Unknown"}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {item.artistName || "Unknown Artist"}
              </Text>
              <Rating
                readonly
                startingValue={item.rating}
                imageSize={16}
                style={styles.favoriteRating}
              />
            </View>
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => onRemove(item.trackId)}
            >
              <Icon
                name="trash"
                type="font-awesome"
                size={18}
                color="#ff3b30"
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
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
    margin: 10,
  },
});
