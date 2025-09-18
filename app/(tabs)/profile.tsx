import { Image } from "expo-image";
import { Pressable, ScrollView, Text, View } from "react-native";
// @ts-expect-error: Metro provides asset module typing
import meal1 from "../../assets/images/meal1.webp";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../../assets/images/logo.png";
import "../../global.css";

type SavedRecipe = {
  id: string;
  title: string;
  image: any;
};

const SAVED_RECIPES: SavedRecipe[] = [
  { id: "1", title: "Creamy Tomato Pasta", image: meal1 },
  { id: "2", title: "Mediterranean Quinoa Salad", image: meal1 },
  { id: "3", title: "Spicy Chicken Curry", image: meal1 },
];

export default function ProfileScreen() {
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
            Profile
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
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
              <Text className="text-lg">⚙️</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="items-center px-6 mb-8">
          {/* Profile Image */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#D1B894",
              marginBottom: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Placeholder for profile image - you can replace with actual image */}
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#C4A47C",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 40, color: "#8B4513" }}>👤</Text>
            </View>
          </View>

          {/* User Info */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Ethan Carter
          </Text>
          <Text className="text-lg text-blue-500 mb-6">
            Foodie & Recipe Explorer
          </Text>
        </View>

        {/* Saved Recipes Section */}
        <View className="px-6">
          <Text className="text-2xl font-bold text-gray-900 mb-6">
            Saved Recipes
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {SAVED_RECIPES.map((recipe) => (
              <Pressable
                key={recipe.id}
                className="mr-4"
                style={{ width: 200 }}
              >
                <View className="rounded-2xl overflow-hidden bg-gray-50">
                  <Image
                    source={recipe.image}
                    style={{ width: "100%", height: 160 }}
                    contentFit="cover"
                  />
                </View>
                <View className="mt-3">
                  <Text className="text-lg font-semibold text-gray-900">
                    {recipe.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Additional spacing at bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
