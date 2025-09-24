import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { RecipeSection } from "../../components/RecipeSection";
import { getRecommendedRecipes } from "../../data/recipes";
import "../../global.css";

const RECOMMENDED_MEALS = getRecommendedRecipes();

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const takePhoto = async () => {
    const { status } = await Camera.getCameraPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Camera.requestCameraPermissionsAsync();
      if (newStatus !== "granted") {
        alert("Camera permission is required to take photos");
        return;
      }
    }
    router.push("/camera");
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="MealSync" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan Ingredients Section */}
        <View className="px-6 mb-8">
          <Text className="text-2xl font-bold text-neutral-900 mb-4">
            Scan Ingredients
          </Text>

          <View className="flex-row gap-4">
            <Pressable
              className="flex-1 bg-primary-500 rounded-xl p-5 items-center justify-center shadow-sm"
              onPress={takePhoto}
            >
              <Text className="text-2xl mb-2">📷</Text>
              <Text className="text-base font-medium text-white">
                Take Photo
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 bg-accent-500 rounded-xl p-5 items-center justify-center shadow-sm"
              onPress={() => router.push("/manual-input")}
            >
              <Text className="text-2xl mb-2">✏️</Text>
              <Text className="text-base font-medium text-white">
                Manual Input
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Recommended Meals Section */}
        <RecipeSection
          title="Recommended Meals"
          recipes={RECOMMENDED_MEALS}
          loading={loading}
          showCategory={true}
        />
      </ScrollView>
    </View>
  );
}
