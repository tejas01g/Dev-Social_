import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your screens
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import AddPostScreen from './AddPostScreen';
import NotificationScreen from './NotificationScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  // Function to render tab bar icon
  const renderTabBarIcon = (routeName, focused, color, size) => {
    let iconName;
    let iconSize = size;

    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Search':
        iconName = focused ? 'search' : 'search-outline';
        break;
      case 'Add':
        iconName = focused ? 'add-circle' : 'add-circle-outline';
        iconSize = 34; // Larger for Add button
        break;
      case 'Notifications':
        iconName = focused ? 'notifications' : 'notifications-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      default:
        iconName = 'ellipse-outline';
    }

    // Special styling for Add button
    if (routeName === 'Add') {
      return (
        <View style={styles.addButtonContainer}>
          <Ionicons
            name={iconName}
            size={iconSize}
            color={focused ? '#0EA5E9' : '#888'}
          />
        </View>
      );
    }

    return <Ionicons name={iconName} size={iconSize} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ focused, color, size }) => {
          return renderTabBarIcon(route.name, focused, color, size);
        },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarAccessibilityLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarAccessibilityLabel: 'Search',
        }}
      />
      <Tab.Screen 
        name="Add" 
        component={AddPostScreen}
        options={{
          tabBarAccessibilityLabel: 'Add Post',
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen}
        options={{
          tabBarAccessibilityLabel: 'Notifications',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarAccessibilityLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 5,
    paddingTop: 5,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Android Elevation
    elevation: 8,
  },
  addButtonContainer: {
    top: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android Elevation
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
});

export default BottomNavigation;