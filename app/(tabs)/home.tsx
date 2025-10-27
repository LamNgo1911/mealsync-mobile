import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Greeting } from "../../components/Greeting";
import { Header } from "../../components/Header";
import { RecipeSection } from "../../components/RecipeSection";
import { SearchBar } from "../../components/SearchBar";
import { TodaysPick } from "../../components/TodaysPick";
import { Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { useGetRecipesQuery } from "../../store/api/recipeApiSlice";

export default function HomeScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: recommendedRecipes,
    isLoading: isLoadingRecommended,
    isError: isErrorRecommended,
  } = useGetRecipesQuery({ page: 1, limit: 10 });

  // Get the first 2 recipes as today's picks
  const todaysPicks =
    recommendedRecipes?.data && recommendedRecipes.data.length >= 2
      ? recommendedRecipes.data.slice(0, 2)
      : [];

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // TODO: Implement search functionality
  };

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
});
