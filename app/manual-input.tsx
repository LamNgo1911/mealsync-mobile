import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type Ingredient = {
  id: string;
  name: string;
};

export default function ManualInputScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const addIngredient = () => {
    if (inputText.trim()) {
      const newIngredient: Ingredient = {
        id: Date.now().toString(),
        name: inputText.trim(),
      };
      setIngredients([...ingredients, newIngredient]);
      setInputText("");
    }
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const findRecipes = () => {
    if (ingredients.length === 0) {
      Alert.alert("No ingredients", "Please add at least one ingredient");
      return;
    }

    Alert.alert(
      "Recipe Search",
      `Searching recipes with: ${ingredients.map((i) => i.name).join(", ")}`
    );
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-14 pb-4 px-6">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Text className="text-lg text-blue-600">Cancel</Text>
          </Pressable>
          <Text className="text-xl font-semibold text-gray-900">
            Manual Input
          </Text>
          <Pressable onPress={findRecipes}>
            <Text className="text-lg text-blue-600 font-medium">Done</Text>
          </Pressable>
        </View>
      </View>

      {/* Input Section */}
      <View className="px-6 mb-6">
        <Text className="text-lg font-medium text-gray-900 mb-3">
          Add Ingredients
        </Text>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-gray-100 px-4 py-3">
            <TextInput
              placeholder="Enter ingredient name"
              value={inputText}
              onChangeText={setInputText}
              className="text-lg text-gray-700"
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={addIngredient}
              returnKeyType="done"
            />
          </View>

          <Pressable
            className="bg-blue-600 rounded-2xl px-6 py-3 justify-center"
            onPress={addIngredient}
          >
            <Text className="text-white font-medium text-lg">Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Ingredients List */}
      <View className="flex-1 px-6">
        <Text className="text-lg font-medium text-gray-900 mb-3">
          Your Ingredients ({ingredients.length})
        </Text>

        {ingredients.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-center text-lg">
              No ingredients added yet.{"\n"}
              Start by typing an ingredient above.
            </Text>
          </View>
        ) : (
          <FlatList
            data={ingredients}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4 mb-3">
                <Text className="text-lg text-gray-900 flex-1">
                  {item.name}
                </Text>
                <Pressable
                  onPress={() => removeIngredient(item.id)}
                  className="ml-4"
                >
                  <Text className="text-red-500 text-xl">×</Text>
                </Pressable>
              </View>
            )}
            ListFooterComponent={
              <View className="pb-6">
                <Pressable
                  className="bg-green-600 rounded-2xl p-4 items-center mt-4"
                  onPress={findRecipes}
                >
                  <Text className="text-white font-semibold text-lg">
                    Find Recipes ({ingredients.length} ingredients)
                  </Text>
                </Pressable>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
