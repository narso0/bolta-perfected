import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db as _db } from '../config/firebase';
import { getUserProfile, UserProfile } from '../services/userService';

type SessionContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  signOutAsync: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signOutAsync,
    }),
    [user, isLoading],
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
