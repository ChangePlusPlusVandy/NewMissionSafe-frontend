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
import { createStaff } from "./utils/staffInterface";

interface AuthContextData {
  currentUser: User | null;
  mongoUser: staffType | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    values: staffType
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async function registerUser(
    name: string,
    email: string,
    password: string,
    values: staffType
  ): Promise<void> {
    try {
      setIsRegistering(true);
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      const token = await userCredential.user.getIdToken();

      values = {
        ...values,
        firebaseUID: userCredential.user.uid,
        active: true,
      };

      await createStaff(values, token);

      await updateProfile(userCredential.user, {
        displayName: name,
      });
      setIsRegistering(false);
    } catch (error) {
      // Handle any errors here
      console.error("Error registering staff:", error);
      throw error;
    }
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
    if (!isRegistering) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);

        if (user == null) {
          setMongoUser(null);
        } else {
          try {
            const token = await user?.getIdToken();
            if (token == null) {
              console.log("No token available");
            } else {
              const newMongoUser = await getStaffByID(user.uid, token);
              setMongoUser(newMongoUser);
            }
          } catch (err) {
            alert("Error fetching user data.");
            logout();
          }
        }

        setIsLoading(false);
      });
      return unsubscribe;
    }
  }, [isRegistering]);

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
