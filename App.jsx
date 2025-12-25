import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/LoginScreen';
import SignupScreen from './src/SignupScreen';
import BottomNavigation from './src/BottomNavigation';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Main App (Bottom Tabs) */}
        <Stack.Screen
          name="MainApp"
          component={BottomNavigation}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
