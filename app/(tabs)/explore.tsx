import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { Header } from "../../components/Header";
import { RecipeCard } from "../../components/RecipeCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import {
  BorderRadius,
  Colors,
  FontSizes,
  Spacing,
} from "../../constants/theme";
import { getExploreRecipes } from "../../data/recipes";

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
    <View style={styles.container}>
      <Header title="Explore" />

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search recipes"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            placeholderTextColor={Colors.neutral[400]}
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
        contentContainerStyle={styles.listContentContainer}
        columnWrapperStyle={styles.listColumnWrapper}
        renderItem={({ item }) => {
          if ((item as SkeletonItem).skeleton) {
            return (
              <View style={styles.cardContainer}>
                <SkeletonCard />
              </View>
            );
          }
          const r = item as Recipe;
          return (
            <View style={styles.cardContainer}>
              <RecipeCard
                id={r.id}
                name={r.title}
                imageUrl={r.image}
                rating={r.rating}
                tags={[r.tag]}
                onPress={(id) =>
                  router.push({ pathname: "/recipe/[id]", params: { id } })
                }
              />
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchContainer: {
    paddingHorizontal: Spacing[6],
    marginBottom: Spacing[4],
  },
  searchBox: {
    borderRadius: BorderRadius["2xl"],
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 20, // px-5
    height: 56, // h-14
    justifyContent: "center",
  },
  searchInput: {
    fontSize: FontSizes.lg,
    color: Colors.neutral[700],
    height: "100%",
  },
  listContentContainer: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[6],
  },
  listColumnWrapper: {
    justifyContent: "space-between",
    gap: Spacing[6],
  },
  cardContainer: {
    flex: 1,
  },
  separator: {
    height: 28, // h-7
  },
});
