import { Redirect, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Redirect href="/home" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
