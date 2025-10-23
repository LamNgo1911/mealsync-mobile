import { SplashScreen, Stack } from "expo-router";

export default function AuthLayout() {
  SplashScreen.hideAsync();
  return <Stack screenOptions={{ headerShown: false }} />;
}
