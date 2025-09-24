import { Image } from "expo-image";
import { Pressable, ScrollView, Text, View } from "react-native";
// @ts-expect-error: Metro provides asset module typing
import meal1 from "../../assets/images/meal1.webp";
import { Header } from "../../components/Header";

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

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View className="items-center px-6 mb-8">
          {/* Profile Image */}
          <View className="w-32 h-32 rounded-full bg-yellow-400 mb-5 items-center justify-center">
            <View className="w-24 h-24 rounded-full bg-yellow-500 items-center justify-center">
              <Text className="text-4xl text-orange-900">👤</Text>
            </View>
          </View>

          {/* User Info */}
          <Text className="text-2xl font-bold text-slate-900 mb-2">
            Ethan Carter
          </Text>
          <Text className="text-lg text-blue-600 mb-6">
            Foodie & Recipe Explorer
          </Text>
        </View>

        {/* Saved Recipes Section */}
        <View className="px-6">
          <Text className="text-2xl font-bold text-slate-900 mb-4">
            Saved Recipes
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {SAVED_RECIPES.map((recipe) => (
              <Pressable key={recipe.id} className="mr-4 w-48">
                <View className="rounded-xl overflow-hidden bg-slate-50">
                  <Image
                    source={recipe.image}
                    className="w-full h-40"
                    contentFit="cover"
                  />
                </View>
                <View className="mt-3">
                  <Text className="text-lg font-semibold text-slate-900">
                    {recipe.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
