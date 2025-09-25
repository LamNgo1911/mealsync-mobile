import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This hook can be used to access the user info.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(session: string | null | undefined) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !session &&
      !inAuthGroup
    ) {
      // Redirect to the login page.
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      // Redirect away from the auth pages.
      router.replace("/(tabs)/home");
    }
  }, [session, segments, router]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // For demonstration purposes, we'll simulate loading a session.
  useEffect(() => {
    // Here you would normally check for a stored token, e.g., in AsyncStorage
    // For now, we'll just assume the user is logged out.
    setIsLoading(false);
  }, []);

  useProtectedRoute(session);

  const signIn = () => {
    // Perform sign-in logic here, then set the session.
    // For now, we'll just set a dummy session.
    setSession("dummy-session-token");
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
