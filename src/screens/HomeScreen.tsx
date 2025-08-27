import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../../providers/SessionProvider';
import { useStepCounter } from '../hooks/useStepCounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Coins, Flame } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const dailyGoal = 10000;

export default function HomeScreen({ navigation }: any) {
  const { user, isLoading } = useSession();
  const { stepCount } = useStepCounter();
  const coins = Math.floor(stepCount / 1000);
  const progressPercent = Math.min((stepCount / dailyGoal) * 100, 100);
  const weekData: { day: string; steps: number }[] = [];

  if (isLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#394242', '#26394C']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 128, paddingBottom: 32 }}
        >
          <View className="mb-6">
            <Text className="text-3xl font-bold text-white">გამარჯობა, {user?.username}! 👋</Text>
            <Text className="text-gray-400">განაგრძე სიარული შენი მიზნებისკენ</Text>
          </View>

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
          </View>

          <Card className="mb-6 bg-login-card border-0 items-center p-6 rounded-2xl">
            <CircularProgress size={180} strokeWidth={15} progressPercent={progressPercent}>
              <Text className="text-4xl font-bold text-white">{stepCount.toLocaleString()}</Text>
              <Text className="text-sm text-gray-400">ნაბიჯი</Text>
            </CircularProgress>
          </Card>

          <Card className="mb-6 bg-login-card border-0">
            <CardHeader className="mb-4">
              <CardTitle className="text-white">ამ კვირის აქტივობა</CardTitle>
            </CardHeader>
            <CardContent className="flex-row justify-center items-center h-32 px-2">
              {weekData.length === 0 ? (
                <Text className="text-gray-400">No activity yet</Text>
              ) : null}
            </CardContent>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
