import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Header } from "../../components/Header";
import { RecipeCard } from "../../components/RecipeCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { getExploreRecipes } from "../../data/recipes";
import { Recipe } from "../../types";

type SkeletonItem = { id: string; skeleton: true };
type ListItem = Recipe | SkeletonItem;

const ALL_RECIPES = getExploreRecipes();
const PAGE_SIZE = 6;
const { width } = Dimensions.get("window");

// Simulate an API call that matches the backend pagination structure
const fetchRecipes = async (
  page: number,
  limit: number,
  query: string
): Promise<{
  data: Recipe[];
  totalPages: number;
}> => {
  const q = query.trim().toLowerCase();
  const filtered = ALL_RECIPES.filter(
    (r) =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.tags.some((tag) => tag.toLowerCase().includes(q))
  );

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const offset = (page - 1) * limit;
  const pageData = filtered.slice(offset, offset + limit);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

  return {
    data: pageData,
    totalPages,
  };
};

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // refs
  const outerFlatListRef = useRef<FlatList<number>>(null);
  const lastLoadedPageRef = useRef<number>(0);

  const loadRecipes = useCallback(
    async (newPage: number) => {
      setLoading(true);
      try {
        const response = await fetchRecipes(newPage, PAGE_SIZE, query);
        setRecipes(response.data);
        setTotalPages(response.totalPages);
        setPage(newPage);
        lastLoadedPageRef.current = newPage;
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    // Debounce search query and reset to page 1
    const handler = setTimeout(() => {
      outerFlatListRef.current?.scrollToIndex({ index: 0, animated: true });
      loadRecipes(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, loadRecipes]);

  // Initial load
  useEffect(() => {
    loadRecipes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const createSkeletonsForPage = (pageNum: number) =>
    Array.from({ length: PAGE_SIZE }).map((_, i) => ({
      id: `s-${pageNum}-${i}`,
      skeleton: true,
    })) as SkeletonItem[];

  const dataForList: ListItem[] =
    loading && recipes.length === 0
      ? Array.from({ length: PAGE_SIZE }).map((_, i) => ({
          id: `s-init-${i}`,
          skeleton: true,
        }))
      : recipes.length % 2 !== 0
        ? [...recipes, { id: `placeholder-${recipes.length}` } as Recipe]
        : recipes;

  const PaginationControls = () => (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Pressable
          key={p}
          onPress={() => {
            loadRecipes(p);
            outerFlatListRef.current?.scrollToIndex({
              index: p - 1,
              animated: true,
            });
          }}
          style={[
            styles.dot,
            p === page
              ? { ...styles.activeDot, backgroundColor: colors.primary[500] }
              : { ...styles.inactiveDot, backgroundColor: colors.neutral[300] },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header />

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <View
          style={[styles.searchBox, { backgroundColor: colors.neutral[100] }]}
        >
          <TextInput
            placeholder="Search recipes"
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: colors.neutral[700] }]}
            placeholderTextColor={colors.neutral[400]}
          />
          <Pressable onPress={() => router.push("/filter")}>
            <Ionicons
              name="options-outline"
              size={24}
              color={colors.neutral[500]}
            />
          </Pressable>
        </View>
      </View>

      {/* Swipeable Pagination */}
      <FlatList
        ref={outerFlatListRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={Array.from({ length: totalPages }, (_, i) => i + 1)}
        keyExtractor={(item) => `page-${item}`}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const newPage = Math.round(e.nativeEvent.contentOffset.x / width) + 1;
          if (newPage !== lastLoadedPageRef.current) {
            loadRecipes(newPage);
          } else {
            setPage(newPage);
          }
        }}
        renderItem={({ item: pageNum }) => {
          const pageData =
            page === pageNum ? dataForList : createSkeletonsForPage(pageNum);

          return (
            <View style={{ width, flex: 1 }}>
              <FlatList
                data={pageData}
                keyExtractor={(it, idx) => `${(it as any).id}-${idx}`}
                numColumns={2}
                contentContainerStyle={styles.listContentContainer}
                columnWrapperStyle={styles.listColumnWrapper}
                renderItem={({ item: innerItem }) => {
                  if ((innerItem as SkeletonItem).skeleton) {
                    return (
                      <View style={styles.cardContainer}>
                        <SkeletonCard />
                      </View>
                    );
                  }
                  const r = innerItem as Recipe;

                  if (!r.name) {
                    return (
                      <View
                        style={[styles.cardContainer, styles.placeholder]}
                      />
                    );
                  }

                  return (
                    <View style={styles.cardContainer}>
                      <RecipeCard
                        recipe={r}
                        onPress={(id) =>
                          router.push({
                            pathname: "/recipe/[id]",
                            params: { id },
                          })
                        }
                      />
                    </View>
                  );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
              />
            </View>
          );
        }}
      />

      {totalPages > 1 && <PaginationControls />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing[6],
    marginBottom: Spacing[4],
  },
  searchBox: {
    borderRadius: BorderRadius["2xl"],
    paddingHorizontal: 20,
    height: 56,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
  },
  searchInput: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    height: "100%",
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[2],
  },
  listColumnWrapper: {
    justifyContent: "space-between",
    gap: Spacing[6],
  },
  cardContainer: {
    flex: 1,
  },
  placeholder: {
    backgroundColor: "transparent",
  },
  separator: {
    height: 28,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing[4],
  },
  dot: {
    height: 8,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 8,
  },
  inactiveDot: {
    width: 8,
  },
});
