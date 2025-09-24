import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { Header } from "../../components/Header";
import { RecipeCard } from "../../components/RecipeCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import { getExploreRecipes } from "../../data/recipes";
import "../../global.css";

type Recipe = {
  id: string;
  title: string;
  image: any;
  rating: number;
  tag: string;
};
type SkeletonItem = { id: string; skeleton: true };

const MOCK_RECIPES = getExploreRecipes();

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

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
      <Header title="Explore" />

      {/* Search Box */}
      <View className="px-6 mb-4">
        <View className="rounded-2xl bg-neutral-100 px-5 h-14 justify-center">
          <TextInput
            placeholder="Search recipes"
            value={query}
            onChangeText={setQuery}
            className="text-lg text-neutral-700 h-full"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Recipes List */}
      <FlatList
        numColumns={2}
        data={
          (loading
            ? Array.from({ length: 6 }).map((_, i) => ({
                id: `s-${i}`,
                skeleton: true,
              }))
            : data) as (Recipe | SkeletonItem)[]
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        columnWrapperStyle={{ justifyContent: "space-between", gap: 24 }}
        renderItem={({ item }) => {
          if ((item as SkeletonItem).skeleton) {
            return (
              <View className="flex-1">
                <SkeletonCard />
              </View>
            );
          }
          const r = item as Recipe;
          return (
            <View className="flex-1">
              <RecipeCard
                id={r.id}
                title={r.title}
                image={r.image}
                rating={r.rating}
                tag={r.tag}
                onPress={(id) =>
                  router.push({ pathname: "/recipe/[id]", params: { id } })
                }
              />
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View className="h-7" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
