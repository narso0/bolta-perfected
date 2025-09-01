import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSession } from '../../providers/SessionProvider';

const STEPS_TODAY_KEY = 'bolta_steps_today';
const LAST_DATE_KEY = 'bolta_last_date';
const DAILY_GOAL = 100000; // 100k as requested

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const useStepCounter = () => {
  const { user } = useSession();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [stepCount, setStepCount] = useState(0);
  const prevIncrementRef = useRef<number>(0);
  const totalTodayRef = useRef<number>(0);
  const lastDateRef = useRef<string | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // Load persisted totals and ensure rollover on cold start
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STEPS_TODAY_KEY);
        totalTodayRef.current = saved ? JSON.parse(saved) : 0;
        setStepCount(totalTodayRef.current);
      } catch {}
      try {
        const last = await AsyncStorage.getItem(LAST_DATE_KEY);
        lastDateRef.current = last ?? null;
      } catch {}
      await handleRolloverIfNeeded();
    })();
  }, []);

  // Re-subscribe when app comes to foreground to fix post-kill behavior
  useEffect(() => {
    const handler = (state: string) => {
      if (appStateRef.current.match(/inactive|background/) && state === 'active') {
        startSubscription();
      }
      appStateRef.current = state as any;
    };
    const sub = AppState.addEventListener('change', handler);
    // start once when mounted
    startSubscription();
    return () => {
      sub.remove();
      stopSubscription();
    };
  }, [user?.uid]);

  let subscription: Pedometer.Subscription | null = null;

  const stopSubscription = () => {
    subscription?.remove();
    subscription = null;
  };

  const startSubscription = async () => {
    stopSubscription();
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));
    if (!isAvailable) return;
    const permission = await Pedometer.requestPermissionsAsync();
    if (!permission.granted) return;
    // reset incremental baseline on each (re)subscription
    prevIncrementRef.current = 0;
    subscription = Pedometer.watchStepCount(async (result) => {
      await handleRolloverIfNeeded();
      const inc = result.steps; // since subscription start
      const delta = Math.max(0, inc - prevIncrementRef.current);
      prevIncrementRef.current = inc;
      totalTodayRef.current += delta;
      setStepCount(totalTodayRef.current);
      try {
        await AsyncStorage.setItem(STEPS_TODAY_KEY, JSON.stringify(totalTodayRef.current));
        if (!lastDateRef.current) {
          const todayKey = formatDateKey(new Date());
          await AsyncStorage.setItem(LAST_DATE_KEY, todayKey);
          lastDateRef.current = todayKey;
        }
      } catch {}
      // Persist lightweight summary on user doc
      if (user) {
        try {
          const ref = doc(db, 'users', user.uid);
          await updateDoc(ref, {
            steps: totalTodayRef.current,
            bolts: Math.floor(totalTodayRef.current / 1000),
          });
        } catch {}
      }
    });
  };

  const handleRolloverIfNeeded = async () => {
    const now = new Date();
    const todayKey = formatDateKey(now);
    const lastKey = lastDateRef.current;
    if (lastKey && lastKey !== todayKey && user) {
      // Archive yesterday to daily_progress
      try {
        const dailyDoc = doc(db, 'users', user.uid, 'daily_progress', lastKey);
        await setDoc(
          dailyDoc,
          {
            steps: totalTodayRef.current,
            goal: DAILY_GOAL,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch {}
      // Reset for new day
      totalTodayRef.current = 0;
      prevIncrementRef.current = 0;
      setStepCount(0);
      try {
        await AsyncStorage.setItem(STEPS_TODAY_KEY, JSON.stringify(0));
        await AsyncStorage.setItem(LAST_DATE_KEY, todayKey);
      } catch {}
      lastDateRef.current = todayKey;
      if (user) {
        try {
          const ref = doc(db, 'users', user.uid);
          await updateDoc(ref, { steps: 0, bolts: 0 });
        } catch {}
      }
    } else if (!lastKey) {
      // Initialize last date on first run
      try {
        await AsyncStorage.setItem(LAST_DATE_KEY, todayKey);
      } catch {}
      lastDateRef.current = todayKey;
    }
  };

  const fetchWeeklyActivity = async (): Promise<number[]> => {
    if (!user) return [0, 0, 0, 0, 0, 0, 0];
    const out: number[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = formatDateKey(d);
      try {
        const ref = doc(db, 'users', user.uid, 'daily_progress', key);
        const snap = await getDoc(ref);
        out.push(snap.exists() ? (snap.data().steps as number) ?? 0 : 0);
      } catch {
        out.push(0);
      }
    }
    return out;
  };

  return { stepCount, isPedometerAvailable, fetchWeeklyActivity };
};
