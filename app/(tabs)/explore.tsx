import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { RecipeCard } from "../../components/RecipeCard";
import "../../global.css";

type Recipe = {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  tag: string;
};

const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Vegan Delight",
    imageUrl: "...",
    rating: 4.5,
    tag: "Vegan",
  },
  {
    id: "2",
    title: "Quick & Easy Pasta",
    imageUrl: "...",
    rating: 4.2,
    tag: "20 min",
  },
  // ...
];

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_RECIPES;
    return MOCK_RECIPES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) || r.tag.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <View className="flex-1 bg-white">
      <View className="pt-14 pb-4 px-6">
        <Text className="text-3xl font-bold text-gray-900">Explore</Text>
        <View className="mt-5 rounded-2xl bg-gray-100 px-5 py-4">
          <TextInput
            placeholder="Search recipes"
            value={query}
            onChangeText={setQuery}
            className="text-lg text-gray-700"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        columnWrapperStyle={{ gap: 24 }}
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width: "48%" }}>
            <RecipeCard
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl}
              rating={item.rating}
              tag={item.tag}
              onPress={(id) =>
                router.push({ pathname: "/recipe/[id]", params: { id } })
              }
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 28 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
