import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Greeting } from "../../components/Greeting";
import { Header } from "../../components/Header";
import { RecipeCard } from "../../components/RecipeCard";
import { RecipeSection } from "../../components/RecipeSection";
import { SearchBar } from "../../components/SearchBar";
import { TodaysPick } from "../../components/TodaysPick";
import { Fonts, FontSizes, FontWeights, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { useGetRecipesQuery } from "../../store/api/recipeApiSlice";

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const {
    data: recommendedRecipes,
    isLoading: isLoadingRecommended,
    isError: isErrorRecommended,
  } = useGetRecipesQuery({ page: 1, limit: 10 });

  // Fetch search results when there's a search query
  const { data: searchResults, isLoading: isLoadingSearch } =
    useGetRecipesQuery(
      { page: 1, limit: 20, query: debouncedQuery },
      { skip: !debouncedQuery }
    );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get the first 2 recipes as today's picks
  const todaysPicks =
    recommendedRecipes?.data && recommendedRecipes.data.length >= 2
      ? recommendedRecipes.data.slice(0, 2)
      : [];

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const isSearching = debouncedQuery.length > 0;
  const showSearchResults = isSearching;

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Personalized Greeting */}
          <Greeting userName="Chef" />

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <SearchBar
              placeholder="Search recipes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleSearch}
            />
          </View>

          {/* Show search results if searching, otherwise show regular content */}
          {showSearchResults ? (
            <View style={styles.searchResultsContainer}>
              <Text
                style={[
                  styles.searchResultsTitle,
                  { color: colors.neutral[900] },
                ]}
              >
                Search Results for "{debouncedQuery}"
              </Text>
              {isLoadingSearch ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
              ) : searchResults?.data && searchResults.data.length > 0 ? (
                <FlatList
                  data={searchResults.data}
                  renderItem={({ item }) => (
                    <View style={styles.searchResultItem}>
                      <RecipeCard
                        recipe={item}
                        onPress={(id) =>
                          router.push({
                            pathname: "/recipe/[id]",
                            params: { id },
                          })
                        }
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => (
                    <View style={{ height: Spacing[4] }} />
                  )}
                />
              ) : (
                <Text
                  style={[styles.noResultsText, { color: colors.neutral[500] }]}
                >
                  No recipes found
                </Text>
              )}
            </View>
          ) : (
            <>
              {/* Today's Pick Section */}
              {todaysPicks.length > 0 && !isLoadingRecommended && (
                <TodaysPick recipes={todaysPicks} />
              )}

              {/* Recent Recipes Section */}
              <RecipeSection
                title="Your Recent Recipes"
                recipes={recommendedRecipes?.data?.slice(2) ?? []}
                loading={isLoadingRecommended}
                layout="grid"
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: Spacing[10],
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  searchBarContainer: {
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
  },
  searchResultsContainer: {
    width: "100%",
    paddingHorizontal: Spacing[6],
  },
  searchResultsTitle: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    marginBottom: Spacing[4],
  },
  searchResultItem: {
    width: "100%",
  },
  loadingContainer: {
    paddingVertical: Spacing[8],
    alignItems: "center",
  },
  noResultsText: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
    textAlign: "center",
    paddingVertical: Spacing[8],
  },
});
