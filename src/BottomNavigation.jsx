import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, BlurView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your screens
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import AddPostScreen from './AddPostScreen';
import MessageScreen from './MessageScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  const renderTabBarIcon = (routeName, focused, color, size) => {
    let iconName;
    let iconSize = size;

    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home-sharp' : 'home-outline';
        iconSize = focused ? 26 : 22;
        break;
      case 'Search':
        iconName = focused ? 'search-sharp' : 'search-outline';
        iconSize = focused ? 26 : 22;
        break;
      case 'Add':
        iconName = focused ? 'add-circle' : 'add-circle-outline';
        iconSize = focused ? 42 : 36;
        break;
      case 'Message':
        iconName = focused ? 'chatbubble-outline' : 'chatbubble-outline';
        iconSize = focused ? 26 : 22;
        break;
      case 'Profile':
        iconName = focused ? 'person-circle' : 'person-circle-outline';
        iconSize = focused ? 26 : 22;
        break;
      default:
        iconName = 'ellipse-outline';
    }

    if (routeName === 'Add') {
      return (
        <View style={styles.addButtonContainer}>
          <View style={[
            styles.addButtonInner,
            focused && styles.addButtonInnerFocused
          ]}>
            <Ionicons
              name={iconName}
              size={iconSize}
              color={focused ? '#c81bd4ff' : '#fff'}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={iconSize} color={color} />
        {focused && <View style={styles.activeIndicator} />}
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.85)"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.85)' }]} />
          )
        ),
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#c81bd4ff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
        tabBarIcon: ({ focused, color, size }) => {
          return renderTabBarIcon(route.name, focused, color, size);
        },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add" component={AddPostScreen} />
      <Tab.Screen name="Message" component={MessageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: '#c81bd4ff',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#c81bd4ff',
  },
  addButtonContainer: {
    top: -28,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(200, 27, 212, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#c81bd4ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  addButtonInnerFocused: {
    borderColor: '#c81bd4ff',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
});

export default BottomNavigation;