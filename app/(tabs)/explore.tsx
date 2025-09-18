import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Animated, FlatList, Text, TextInput, View } from "react-native";
import { RecipeCard } from "../../components/RecipeCard";
// @ts-expect-error: Metro provides asset module typing
import meal1 from "../../assets/images/meal1.webp";
import "../../global.css";

type Recipe = {
  id: string;
  title: string;
  image: any;
  rating: number;
  tag: string;
};

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
      {/* Header */}
      <View className="pt-14 pb-4 px-6">
        <Text className="text-3xl font-bold text-gray-900">Explore</Text>

        {/* Search Box */}
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

      {/* Recipes List */}
      <FlatList
        numColumns={2}
        data={loading ? Array.from({ length: 6 }).map((_, i) => ({ id: `s-${i}` })) : data}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-6 pb-6 "
        columnWrapperClassName="justify-between gap-6"
        renderItem={({ item }) => (
          <View className="flex-1">
            {loading ? (
              <SkeletonCard />
            ) : (
              <RecipeCard
                id={item.id}
                title={item.title}
                image={item.image}
                rating={item.rating}
                tag={item.tag}
                onPress={(id) =>
                  router.push({ pathname: "/recipe/[id]", params: { id } })
                }
              />
            )}
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-7" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function SkeletonCard() {
  const opacity = new Animated.Value(0.5);
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View>
      <Animated.View
        style={{
          width: "100%",
          height: 192,
          borderRadius: 16,
          backgroundColor: "#E5E7EB",
          opacity,
        }}
      />
      <Animated.View
        style={{
          marginTop: 12,
          height: 22,
          borderRadius: 6,
          backgroundColor: "#E5E7EB",
          opacity,
        }}
      />
      <Animated.View
        style={{
          marginTop: 8,
          height: 18,
          width: "60%",
          borderRadius: 6,
          backgroundColor: "#E5E7EB",
          opacity,
        }}
      />
    </View>
  );
}
