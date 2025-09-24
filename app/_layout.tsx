import { Redirect, Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <Redirect href="/home" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
