import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '../../providers/SessionProvider';
import SplashScreen from '../screens/SplashScreen';

// Import all our screens
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen'; // Import SignUp
import ProfileScreen from '../screens/ProfileScreen';

// Import our custom header
import { CustomHeader } from '../components/CustomHeader';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <SplashScreen onAnimationFinish={() => {}} />;
  }

  return (
    <Stack.Navigator initialRouteName={user ? 'Home' : 'Intro'}>
      {!user ? (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group
          screenOptions={{
            header: (props) => <CustomHeader {...props} />,
            headerTransparent: true,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
        </Stack.Group>
      )}

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerStyle: { backgroundColor: '#26394C' },
            headerTitleStyle: { color: 'white' },
            headerTintColor: 'white',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
