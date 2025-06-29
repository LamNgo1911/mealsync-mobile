import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  console.log(router);
  return (
    <View>
      <Text>Register Screen</Text>
      <Button title="Back to Login" onPress={() => router.back()} />
    </View>
  );
}
