import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '@react-native-google-signin/google-signin';
import GoogleSignin from './../config/googleSignIn';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as fbSignOut,
} from 'firebase/auth';
import { auth } from '../config/firebase';

type AuthProviderProps = {
  children: React.ReactNode;
};

export type ContextType = {
  user: User | null;
  isLoadingUser: boolean;
  isSigning: boolean;
  signIn: () => void;
  signOut: () => void;
};

const init: ContextType = {
  user: null,
  isLoadingUser: true,
  isSigning: false,
  signIn: () => {},
  signOut: () => {},
};

const useAuthContext = (): ContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSigning, setIsSigning] = useState(false);

  const signIn = useCallback(async () => {
    try {
      setIsSigning(true);

      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();

      const googleCredential = GoogleAuthProvider.credential(user.idToken);
      await signInWithCredential(auth, googleCredential);

      setUser(user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSigning(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();

      await fbSignOut(auth);

      setUser(null);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getUserInfo = async () => {
    try {
      if (!user) {
        const userInfo = await GoogleSignin.getCurrentUser();
        setUser(userInfo);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const userMemo = useMemo(() => user, [user]);

  useEffect(() => {
    getUserInfo();
  }, []);

  return {
    user: userMemo,
    isLoadingUser,
    isSigning,
    signIn,
    signOut,
  };
};

export const AuthContext = createContext<ContextType>(init);

const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <AuthContext.Provider value={useAuthContext()}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
