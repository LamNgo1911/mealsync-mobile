import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Explore Ingredients & Recipes</Text>
      <Button
        title="Go to Recipe Detail"
        onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: '123' } })}
      />
    </View>
  );
}
