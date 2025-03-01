import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments, SplashScreen, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { LoadingScreen } from "@/components/LoadingScreen";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { user } = useAuthStore();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Set up the auth state listener
  useEffect(() => {
    // Only run the navigation logic after the first render
    if (!isNavigationReady) {
      setIsNavigationReady(true);
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    
    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if not signed in
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page if signed in
      router.replace('/');
    }
  }, [user, segments, isNavigationReady]);
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const { user, loadSession, isLoading: authLoading } = useAuthStore();
  const { fetchUserProfile, isLoading: userLoading } = useUserStore();
  
  // Load the auth session on app start
  useEffect(() => {
    async function prepare() {
      try {
        // Load the auth session
        await loadSession();
        
        // If user is authenticated, fetch their profile
        if (user) {
          await fetchUserProfile();
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  
  // Use the protected route hook
  useProtectedRoute();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded && appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, appIsReady]);

  // Show a loading screen until everything is ready
  if (!loaded || !appIsReady || authLoading) {
    return <LoadingScreen message="Starting up..." />;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen 
        name="payment" 
        options={{ 
          title: "Subscription Plans",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="conversation/[id]" 
        options={{ 
          title: "Conversation",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="document/[id]" 
        options={{ 
          title: "Document Details",
          headerBackTitle: "Library",
        }} 
      />
      <Stack.Screen 
        name="practice/[id]" 
        options={{ 
          title: "Practice Session",
          headerBackTitle: "Practice",
        }} 
      />
    </Stack>
  );
}