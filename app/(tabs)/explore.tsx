import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
// @ts-expect-error: Metro provides asset module typing
import meal1 from "../../assets/images/meal1.webp";
import { Header } from "../../components/Header";
import { RecipeCard } from "../../components/RecipeCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import "../../global.css";

type Recipe = {
  id: string;
  title: string;
  image: any;
  rating: number;
  tag: string;
};
type SkeletonItem = { id: string; skeleton: true };

const MOCK_RECIPES: Recipe[] = [
  { id: "1", title: "Vegan Delight", image: meal1, rating: 4.5, tag: "Vegan" },
  {
    id: "2",
    title: "Quick & Easy Pasta",
    image: meal1,
    rating: 4.2,
    tag: "20 min",
  },
  {
    id: "3",
    title: "Spicy Chicken Stir-Fry",
    image: meal1,
    rating: 4.8,
    tag: "Spicy",
  },
  {
    id: "4",
    title: "Mediterranean Salad",
    image: meal1,
    rating: 4.6,
    tag: "Healthy",
  },
  {
    id: "5",
    title: "Hearty Beef Stew",
    image: meal1,
    rating: 4.3,
    tag: "Comfort",
  },
  {
    id: "6",
    title: "Fresh Salmon Grill",
    image: meal1,
    rating: 4.7,
    tag: "Light",
  },
];

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
        <View className="rounded-2xl bg-gray-100 px-5 h-14 justify-center">
          <TextInput
            placeholder="Search recipes"
            value={query}
            onChangeText={setQuery}
            className="text-lg text-gray-700"
            placeholderTextColor="#9CA3AF"
            style={{
              lineHeight: 20, // 👈 force a stable line height
              textAlignVertical: "center", // 👈 Android vertical align
            }}
          />
        </View>
      </View>

      {/* Recipes List */}
      <FlatList
        numColumns={2}
        data={
          (loading
            ? (Array.from({ length: 6 }).map((_, i) => ({
                id: `s-${i}`,
                skeleton: true,
              })) as SkeletonItem[])
            : data) as (Recipe | SkeletonItem)[]
        }
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-6 pb-6 "
        columnWrapperClassName="justify-between gap-6"
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

// SkeletonCard moved to components/SkeletonCard
