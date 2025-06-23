import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Login Screen</Text>
      <Button
        title="Go to Register"
        onPress={() => router.push("/(auth)/register")}
      />
      <Button title="Login" onPress={() => router.replace("/(tabs)/home")} />
    </View>
  );
}
