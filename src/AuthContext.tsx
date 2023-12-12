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

interface AuthContextData {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => User | null;
  forgotPassword: (email: string) => Promise<void>;
  confirmReset: (code: string, password: string) => Promise<void>;
  isStaff: Boolean | null;
  setIsStaff: (isStaff: boolean) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStaff, setIsStaff] = useState<Boolean | null>(null);

  async function login(email: string, password: string) {
    try{
      return await signInWithEmailAndPassword(auth, email, password);
    
    //CURRENTLY GETTING FIREBASE ERRORS AND MONGODB NOT IMPLEMENTED SO THE BELOW IS COMMMENTED OUT!
      /**
     
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userExistsInMongoDB = await verifyUserInMongoDB(userCredential.user);
      // Check if user exists in MongoDB
      if (userExistsInMongoDB) {
        return userCredential;
      } else {
        // If user does not exist in MongoDB, log them out of Firebase
        await logout();
        throw new Error("User not found in MongoDB");
      }
    **/
  } catch (error) {
    // Handle Firebase authentication errors or MongoDB verification errors
    throw error;
  }
  
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

  async function forgotPassword(email: string): Promise<void> {
    return await sendPasswordResetEmail(auth, email);
  }

  async function confirmReset(code: string, password: string): Promise<void> {
    return await confirmPasswordReset(auth, code, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    registerUser,
    logout,
    getUser,
    forgotPassword,
    confirmReset,
    isStaff,
    setIsStaff,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
