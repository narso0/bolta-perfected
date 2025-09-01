import { useEffect, useCallback } from 'react';
import { Pedometer } from 'expo-sensors';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSession } from '../../providers/SessionProvider';

export const useStepCounter = () => {
  const { user, userProfile, setSteps, permissionStatus, setPermissionStatus } = useSession();

  const handleStepCountUpdate = useCallback(
    async (newStepCount: number) => {
      if (user && (userProfile ?? user)) {
        setSteps(newStepCount);
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { steps: newStepCount });
      }
    },
    [user, userProfile, setSteps],
  );

  useEffect(() => {
    let subscription: Pedometer.Subscription | undefined;
    const subscribe = async () => {
      if (permissionStatus === 'granted') {
        subscription = Pedometer.watchStepCount((result) => {
          handleStepCountUpdate(result.steps);
        });
      }
    };
    subscribe();
    return () => subscription?.remove();
  }, [permissionStatus, handleStepCountUpdate]);

  const requestPermissions = async () => {
    const { status } = await Pedometer.requestPermissionsAsync();
    setPermissionStatus(status);
    return status === 'granted';
  };

  return { requestPermissions };
};
