import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import { Coins, User } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const coinCount = 123;
const userName = "asdfds";

export function CustomHeader({ navigation, route }: any) {
  const currentRouteName = route.name;

  return (
    // We wrap everything in a LinearGradient component
    <LinearGradient
        colors={['#26394C', '#394242']}
        // The style ensures it only takes up the header area
        style={{ paddingTop: 60, paddingBottom: 16, paddingHorizontal: 16 }}
    >
        <View className="w-full flex-row items-center justify-between">

          {/* --- LEFT SIDE GROUP --- */}
          <View className="flex-row items-center space-x-4">

            <View className="flex-row items-center bg-login-card p-1 rounded-lg">
              <Button
                size="sm"
                onPress={() => navigation.navigate('Home')}
                className={currentRouteName === 'Home' ? 'bg-button-primary' : 'bg-transparent'}
              >
                <Text className="text-white">მთავარი</Text>
              </Button>
              <Button
                size="sm"
                onPress={() => navigation.navigate('Marketplace')}
                className={currentRouteName === 'Marketplace' ? 'bg-button-primary' : 'bg-transparent'}
              >
                <Text className="text-white">ჯილდოები</Text>
              </Button>
            </View>
          </View>

          {/* --- RIGHT SIDE GROUP --- */}
          <View className="flex-row items-center space-x-2">
            <Button
              onPress={() => navigation.navigate('Profile')}
              className="flex-row items-center bg-login-card p-2 rounded-md space-x-2"
            >
              <User className="h-4 w-4 text-gray-400" />
            </Button>
          </View>

        </View>
    </LinearGradient>
  );
}