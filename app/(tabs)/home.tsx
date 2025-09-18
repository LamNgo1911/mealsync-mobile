import { Camera } from "expo-camera";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
// @ts-expect-error: Metro provides asset module typing
import meal1 from "../../assets/images/meal1.webp";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../../assets/images/logo.png";
import { SkeletonCard } from "../../components/SkeletonCard";
import "../../global.css";

type Meal = {
  id: string;
  title: string;
  category: string;
  image: any;
};

const RECOMMENDED_MEALS: Meal[] = [
  { id: "1", title: "Pasta Carbonara", category: "Italian", image: meal1 },
  {
    id: "2",
    title: "Mediterranean Salad",
    category: "Mediterranean",
    image: meal1,
  },
  { id: "3", title: "Tomato Soup", category: "Soup", image: meal1 },
];

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for recommended meals
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const takePhoto = async () => {
    const { status } = await Camera.getCameraPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Camera.requestCameraPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera permission is required to take photos"
        );
        return;
      }
    }
    router.push("/camera");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-14 pb-6 px-6">
        <View
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Centered Title */}
          <Text className="text-2xl font-semibold text-gray-900 text-center">
            MealSync
          </Text>
          {/* Left Logo */}
          <View
            style={{
              position: "absolute",
              left: 0,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={appIcon}
              style={{ width: 28, height: 28, borderRadius: 6 }}
              contentFit="cover"
              accessibilityLabel="App logo"
            />
          </View>
          {/* Right Settings */}
          <View
            style={{
              position: "absolute",
              right: 0,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center">
              <Text className="text-base">⚙️</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Scan Ingredients Section */}
        <View className="px-6 mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Scan Ingredients
          </Text>

          <View className="flex-row gap-4">
            <Pressable
              className="flex-1 border border-gray-200 rounded-xl p-5 items-center justify-center bg-white"
              onPress={takePhoto}
            >
              <View className="mb-2">
                <Text className="text-2xl">📷</Text>
              </View>
              <Text className="text-base font-medium text-gray-900">
                Take Photo
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 border border-gray-200 rounded-xl p-5 items-center justify-center bg-white"
              onPress={() => router.push("/manual-input")}
            >
              <View className="mb-2">
                <Text className="text-2xl">✏️</Text>
              </View>
              <Text className="text-base font-medium text-gray-900">
                Manual Input
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Recommended Meals Section */}
        <View className="px-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Recommended Meals
          </Text>

          {loading ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {[1, 2, 3].map((index) => (
                <View key={index} className="mr-4" style={{ width: 200 }}>
                  <SkeletonCard />
                  {/* Title skeleton */}
                  <View className="mt-3">
                    <View
                      style={{
                        height: 20,
                        backgroundColor: "#E5E7EB",
                        borderRadius: 4,
                        marginBottom: 8,
                        width: "80%",
                      }}
                    />
                    <View
                      style={{
                        height: 16,
                        backgroundColor: "#E5E7EB",
                        borderRadius: 4,
                        width: "60%",
                      }}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <FlatList
              horizontal
              data={RECOMMENDED_MEALS}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 24 }}
              renderItem={({ item }) => (
                <Pressable
                  className="mr-4"
                  style={{ width: 200 }}
                  onPress={() =>
                    router.push({
                      pathname: "/recipe/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <View className="rounded-2xl overflow-hidden bg-gray-50">
                    <Image
                      source={item.image}
                      style={{ width: "100%", height: 160 }}
                      contentFit="cover"
                    />
                  </View>
                  <View className="mt-3">
                    <Text className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {item.category}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
