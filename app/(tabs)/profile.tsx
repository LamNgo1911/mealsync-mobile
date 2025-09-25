import { ScrollView, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { RecipeSection } from "../../components/RecipeSection";
import { getSavedRecipes } from "../../data/recipes";

const SAVED_RECIPES = getSavedRecipes();

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

        <RecipeSection
          title="Saved Recipes"
          recipes={SAVED_RECIPES}
          showCategory={false}
        />
      </ScrollView>
    </View>
  );
}
