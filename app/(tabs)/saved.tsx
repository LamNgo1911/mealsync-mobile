import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Header } from "../../components/Header";
import { RecipeCard } from "../../components/RecipeCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import { Fonts, FontSizes, FontWeights, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { useGetSavedRecipesQuery } from "../../store/api/recipeApiSlice";
import { Recipe } from "../../types/recipe";

const PAGE_SIZE = 4; // 2x2 grid
const { width } = Dimensions.get("window");

type SkeletonItem = { id: string; skeleton: true };
type ListItem = Recipe | SkeletonItem;

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [page, setPage] = useState(1);

  // refs
  const outerFlatListRef = useRef<FlatList<number>>(null);

  // Fetch saved recipes from API
  const { data, isLoading, isFetching } = useGetSavedRecipesQuery({
    page,
    limit: PAGE_SIZE,
  });

  const recipes = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const loading = isLoading || isFetching;

  const createSkeletonsForPage = (pageNum: number) =>
    Array.from({ length: PAGE_SIZE }).map((_, i) => ({
      id: `s-${pageNum}-${i}`,
      skeleton: true,
    })) as SkeletonItem[];

  const dataForList: ListItem[] =
    loading && recipes.length === 0
      ? createSkeletonsForPage(1)
      : recipes.length % 2 !== 0
        ? [...recipes, { id: `placeholder-${recipes.length}` } as Recipe] // for even grid
        : recipes;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    outerFlatListRef.current?.scrollToIndex({
      index: newPage - 1,
      animated: true,
    });
  };

  const PaginationControls = () => (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Pressable
          key={p}
          onPress={() => handlePageChange(p)}
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
      <Text style={[styles.title, { color: colors.neutral[900] }]}>
        Saved Recipes
      </Text>

      {!loading && recipes.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateIcon, { color: colors.neutral[400] }]}>
              💾
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.neutral[600] }]}>
              No saved recipes yet
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.neutral[500] }]}>
              Tap the bookmark icon on recipes to save them here
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={<View style={styles.headerSpacer} />}
          data={[{}]} // Dummy data to render the single item below
          keyExtractor={() => "profile-content"}
          renderItem={() => (
            <>
              {/* Swipeable Pagination */}
              <FlatList
                ref={outerFlatListRef}
                style={styles.outerFlatList}
                contentContainerStyle={styles.outerFlatListContent}
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
                  const newPage =
                    Math.round(e.nativeEvent.contentOffset.x / width) + 1;
                  if (newPage !== page) {
                    setPage(newPage);
                  }
                }}
                renderItem={({ item: pageNum }) => {
                  const pageData =
                    page === pageNum
                      ? dataForList
                      : createSkeletonsForPage(pageNum);

                  return (
                    <View style={{ width }}>
                      <FlatList
                        data={pageData}
                        keyExtractor={(it, idx) => `${(it as any).id}-${idx}`}
                        numColumns={2}
                        scrollEnabled={false} // Important: disable scroll on inner list
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
                                onPress={() =>
                                  router.push({
                                    pathname: "/recipe/[id]",
                                    params: { id: r.id },
                                  })
                                }
                              />
                            </View>
                          );
                        }}
                        ItemSeparatorComponent={() => (
                          <View style={styles.separator} />
                        )}
                      />
                    </View>
                  );
                }}
              />
              {totalPages > 1 && <PaginationControls />}
            </>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSpacer: {
    height: Spacing[4],
  },
  title: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    marginBottom: Spacing[4],
    paddingHorizontal: Spacing[6],
  },
  outerFlatList: {
    flex: 1,
  },
  outerFlatListContent: {
    flexGrow: 1,
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
    height: Spacing[6],
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing[6],
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[10],
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: Spacing[4],
  },
  emptyStateText: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing[2],
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
});
