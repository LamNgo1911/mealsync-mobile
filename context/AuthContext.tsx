import { User, UserRole } from "@/types/user";
import * as Google from "expo-auth-session/providers/google";
import { useRouter, useSegments } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  signIn: () => void;
  signInWithGoogle: () => void;
  signOut: () => void;
  user: User | null;
  scanCount: number;
  incrementScanCount: () => void;
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [scanCount, setScanCount] = useState(0);

  // For demonstration purposes, we'll simulate loading a session.
  useEffect(() => {
    // Here you would normally check for a stored token, e.g., in AsyncStorage
    // For now, we'll just assume the user is logged out.
    // setIsLoading(false); // This line was removed as per the new_code, as isLoading is no longer in AuthContextType
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Replace with your own client IDs
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  async function fetchUserInfo(token: string) {
    const result = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (result.ok) {
      const googleUser = await result.json();
      // Use the Google user info to sign in
      setUser({
        id: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        // Set default values for other fields
        role: UserRole.USER,
        userPreference: {
          id: "pref-id",
          dietaryRestrictions: [],
          allergies: [],
          preferredCuisines: [],
          notifications: { push: true, email: false },
        },
      });
      setScanCount(0);
      router.replace("/(tabs)/home");
    }
  }

  // useProtectedRoute(user ? user.id : null);

  const authContextValue: AuthContextType = useMemo(
    () => ({
      signIn: () => {
        // Simulate sign-in
        setUser({
          id: "test-user-id",
          email: "test@example.com",
          name: "Test User",
          role: UserRole.USER,
          userPreference: {
            id: "pref-id",
            dietaryRestrictions: [],
            allergies: [],
            preferredCuisines: [],
            notifications: { push: true, email: false },
          },
        });
        setScanCount(0); // Reset scan count on sign-in
        router.replace("/(tabs)/home");
      },
      signInWithGoogle: () => {
        promptAsync();
      },
      signOut: () => {
        setUser(null);
        router.replace("/(auth)/login");
      },
      user,
      scanCount,
      incrementScanCount: () => {
        setScanCount((prev) => prev + 1);
      },
    }),
    [user, scanCount, router, request, response, promptAsync]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
