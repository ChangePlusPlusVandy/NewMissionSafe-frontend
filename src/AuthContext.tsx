import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  confirmPasswordReset,
  onAuthStateChanged,
} from "firebase/auth";
import React, { useContext, useState, useEffect, createContext } from "react";
import auth from "./firebase";
import type { UserCredential, User } from "firebase/auth";
import { getStaffByID } from "./utils/staffInterface";
import type { staffType } from "./utils/models/staffModel";

interface AuthContextData {
  currentUser: User | null;
  mongoUser: staffType | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => User | null;
  getMongoUser: () => staffType | null;
  forgotPassword: (email: string) => Promise<void>;
  confirmReset: (code: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mongoUser, setMongoUser] = useState<staffType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async function registerUser(name: string, email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        void updateProfile(userCredential.user, {
          displayName: name,
        });
      }
    );
  }

  async function logout(): Promise<void> {
    return await signOut(auth);
  }

  function getUser(): User | null {
    return currentUser;
  }

	function getMongoUser(): staffType | null {
    return mongoUser;
  }

  async function forgotPassword(email: string): Promise<void> {
    return await sendPasswordResetEmail(auth, email);
  }

  async function confirmReset(code: string, password: string): Promise<void> {
    return await confirmPasswordReset(auth, code, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user == null) {
        setMongoUser(null);
      } else {
        user?.getIdToken().then((t) => {
          if (t == null) {
            console.log("No token available");
          } else {
            //review: should there be error handling here and how would it work (error state in context maybe?)
            //review: is there a disadvantage to calling getStaffByID directly?
            getStaffByID(user.uid, t).then((newMongoUser) => {
              setMongoUser(newMongoUser);
            });
          }
        });
      }

      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
		mongoUser,
    login,
    registerUser,
    logout,
    getUser,
		getMongoUser,
    forgotPassword,
    confirmReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
