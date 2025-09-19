import { Image } from "expo-image";
import { Pressable, ScrollView, Text, View } from "react-native";
// @ts-expect-error: Metro provides asset module typing
import meal1 from "../../assets/images/meal1.webp";
import { Header } from "../../components/Header";
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
      <Header title="Profile" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="items-center px-6 mb-8">
          {/* Profile Image */}
          <View className="w-30 h-30 rounded-full bg-amber-200 mb-5 items-center justify-center">
            {/* Placeholder for profile image - you can replace with actual image */}
            <View className="w-25 h-25 rounded-full bg-amber-300 items-center justify-center">
              <Text className="text-4xl text-amber-800">👤</Text>
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
            className="pr-6"
          >
            {SAVED_RECIPES.map((recipe) => (
              <Pressable key={recipe.id} className="mr-4 w-50">
                <View className="rounded-2xl overflow-hidden bg-gray-50">
                  <Image
                    source={recipe.image}
                    className="w-full h-40"
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
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
