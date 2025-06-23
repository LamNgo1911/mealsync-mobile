import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <>
      <Redirect href="/home" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
