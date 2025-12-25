import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "./HomeScreen";
import SearchScreen from "./SearchScreen";
import AddPostScreen from "./AddPostScreen";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

const BottomNavigation = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          height: 60,
          backgroundColor: "#fff",
        },

        tabBarShowLabel: false,

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";

          if (route.name === "Search")
            iconName = focused ? "search" : "search-outline";

          if (route.name === "Add")
            iconName = focused ? "add-circle" : "add-circle-outline";

          if (route.name === "Notifications")
            iconName = focused ? "notifications" : "notifications-outline";

          if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";

          return (
            <Ionicons
              name={iconName}
              size={route.name === "Add" ? 34 : 24}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: "#0EA5E9",
        tabBarInactiveTintColor: "#888",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add" component={AddPostScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
