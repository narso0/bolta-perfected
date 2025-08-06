import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export const useStepCounter = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        const permission = await Pedometer.requestPermissionsAsync();
        if (permission.granted) {
          subscription = Pedometer.watchStepCount(result => {
            // To make the simulator more interesting, let's pretend every step is 10 for faster testing
            setStepCount(result.steps * 10);
          });
        }
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { stepCount, isPedometerAvailable };
};