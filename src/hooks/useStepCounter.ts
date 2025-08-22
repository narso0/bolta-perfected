import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext';
import { updateUserStats } from '../lib/firebase';
import { auth } from '../lib/firebase'; // <-- THIS IS THE FIX

const STEPS_STORAGE_KEY = 'bolta_daily_step_count';

export const useStepCounter = () => {
  const { user } = useUser();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    const loadSavedSteps = async () => {
      try {
        const savedStepsString = await AsyncStorage.getItem(STEPS_STORAGE_KEY);
        if (savedStepsString !== null) {
          setStepCount(JSON.parse(savedStepsString));
        }
      } catch (e) {
        console.error('Failed to load steps from storage', e);
      }
    };
    loadSavedSteps();
  }, []);

  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        const permission = await Pedometer.requestPermissionsAsync();
        if (permission.granted) {
          subscription = Pedometer.watchStepCount(async (result) => {
            const newStepCount = result.steps;
            setStepCount(newStepCount);

            try {
              await AsyncStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(newStepCount));
            } catch (e) {
              console.error('Failed to save steps to storage', e);
            }

            if (user) {
              const coins = Math.floor(newStepCount / 1000);
              const uid = auth.currentUser?.uid;
              if (uid) {
                updateUserStats(uid, { totalSteps: newStepCount, coins: coins });
              }
            }
          });
        }
      }
    };
    subscribe();
    return () => {
      subscription?.remove();
    };
  }, [user]);

  return { stepCount, isPedometerAvailable };
};
