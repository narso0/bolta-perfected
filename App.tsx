import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from './src/components/ui/toaster';
import LinearGradient from 'react-native-linear-gradient';
import { SessionProvider } from './providers/SessionProvider';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <LinearGradient colors={['#394242', '#26394C']} style={StyleSheet.absoluteFill} />
    <ActivityIndicator size="large" color="#ffffff" />
  </View>
);

export default function App() {
  return (
    <SessionProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <Toaster />
      </SafeAreaProvider>
    </SessionProvider>
  );
}
