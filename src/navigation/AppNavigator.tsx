import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen'; // <-- 1. Import the Login screen

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Intro"> 
      <Stack.Screen 
        name="Intro" 
        component={IntroScreen} 
        options={{ headerShown: false }}
      />
      
      {/* 2. Add the Login screen to the stack */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Marketplace" component={MarketplaceScreen} options={{ title: 'Rewards' }} />
    </Stack.Navigator>
  );
}