import React from 'react';
import { View, Text } from 'react-native';

const days = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];

export default function WeeklyActivityGraph() {
  return (
    <View className="flex-row items-end justify-between h-32 px-2">
      {days.map((day) => (
        <View key={day} className="flex-1 items-center space-y-2 px-1">
          <View className="w-full h-full bg-input-background rounded-md overflow-hidden justify-end">
            <View className="bg-green-500" style={{ height: 0 }} />
          </View>
          <Text className="text-xs text-gray-400">{day}</Text>
        </View>
      ))}
    </View>
  );
}
