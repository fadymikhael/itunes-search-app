import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "../screens/SearchScreen";
import DetailsScreen from "../screens/DetailsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4B0082",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: "iTunes Search" }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}