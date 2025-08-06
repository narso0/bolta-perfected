import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useStepCounter } from '../hooks/useStepCounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/CircularProgress'; // Import our new component
import { Coins, Flame } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const mockUser = {
  name: 'asdfds',
};

const dailyGoal = 10000;

export default function HomeScreen({ navigation }: any) {
  const { stepCount } = useStepCounter();
  const coins = Math.floor(stepCount / 1000);
  const progressPercent = Math.min((stepCount / dailyGoal) * 100, 100);

  const weekData = [
    { day: 'ორშ', steps: 8450 },
    { day: 'სამ', steps: 12300 },
    { day: 'ოთხ', steps: 9800 },
    { day: 'ხუთ', steps: 11200 },
    { day: 'პარ', steps: 10500 },
    { day: 'შაბ', steps: 15600 },
    { day: 'კვი', steps: stepCount },
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#394242', '#26394C']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white">გამარჯობა, {mockUser.name}! 👋</Text>
          <Text className="text-gray-400">განაგრძე სიარული შენი მიზნებისკენ</Text>
        </View>

        {/* Top Cards */}
        <View className="flex-row gap-4 mb-6">
          <Card className="flex-1 bg-yellow-400 border-0">
            <CardContent className="p-4">
              <Text className="text-yellow-900">დღევანდელი ქოინები</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-3xl font-bold text-yellow-900">{coins}</Text>
                <Coins className="h-8 w-8 text-yellow-900 opacity-50" />
              </View>
            </CardContent>
          </Card>
          <Card className="flex-1 bg-green-500 border-0">
            <CardContent className="p-4">
              <Text className="text-green-900">სტრიკი</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-3xl font-bold text-green-900">3 დღე</Text>
                <Flame className="h-8 w-8 text-green-900 opacity-50" />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* New Circular Progress Meter */}
        <Card className="mb-6 bg-login-card border-0 items-center p-6 rounded-2xl">
          <CircularProgress size={180} strokeWidth={15} progressPercent={progressPercent}>
            <Text className="text-4xl font-bold text-white">{stepCount.toLocaleString()}</Text>
            <Text className="text-sm text-gray-400">ნაბიჯი</Text>
          </CircularProgress>
        </Card>

        {/* This Week Card */}
        <Card className="mb-6 bg-login-card border-0">
          <CardHeader>
            <CardTitle className="text-white">ამ კვირის აქტივობა</CardTitle>
          </CardHeader>
          <CardContent className="flex-row justify-between items-end h-32 px-3">
            {weekData.map((dayData) => (
              <View key={dayData.day} className="flex-1 items-center space-y-2 px-1">
                <View className="w-full h-full bg-input-background rounded-md overflow-hidden justify-end">
                  <View
                    className="bg-green-500"
                    style={{ height: `${Math.min(dayData.steps / dailyGoal, 1) * 100}%` }}
                  />
                </View>
                <Text className="text-xs text-gray-400">{dayData.day}</Text>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* How You Earn Card */}
        <Card className="bg-login-card border-0">
          <CardContent className="p-4 text-center items-center">
            <Text className="text-white font-bold">როგორ აგროვებ ბოლთაქოინებს?</Text>
            <Text className="text-gray-400 mt-1">ყოველ 1,000 ნაბიჯზე = 1 ბოლთაქოინი</Text>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}