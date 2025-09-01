import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile, UserProfile } from '../services/userService';

type SessionContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  permissionStatus: string;
  setPermissionStatus: React.Dispatch<React.SetStateAction<string>>;
  // convenience alias for code that expects userProfile
  userProfile?: UserProfile | null;
  signOutAsync: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [steps, setSteps] = useState<number>(0);
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMountedRef.current) return;

      if (currentUser) {
        setIsLoading(true);
        let attempts = 0;

        const tryFetch = async () => {
          attempts += 1;
          try {
            const profile = await getUserProfile(currentUser.uid);
            if (profile) {
              if (isMountedRef.current) {
                setUser(profile);
                setSteps(profile.steps || 0);
                setIsLoading(false);
              }
              return;
            }
          } catch {
            // swallow and retry
          }

          if (attempts < 3 && isMountedRef.current) {
            retryTimeoutRef.current = setTimeout(tryFetch, attempts === 1 ? 400 : 1000);
          } else if (isMountedRef.current) {
            setUser(null);
            setIsLoading(false);
          }
        };

        tryFetch();
      } else {
        setUser(null);
        setSteps(0);
        setIsLoading(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      unsubscribe();
    };
  }, []);

  const signOutAsync = async () => {
    await signOut(auth);
    if (isMountedRef.current) {
      setUser(null);
      setSteps(0);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      steps,
      setSteps,
      permissionStatus,
      setPermissionStatus,
      userProfile: user,
      signOutAsync,
    }),
    [user, isLoading, steps, permissionStatus],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextValue => {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return ctx;
};
