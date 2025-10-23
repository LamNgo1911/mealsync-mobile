import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AutocompleteInput } from "../components/AutocompleteInput";
import { Header } from "../components/Header";
import { MultiSelectList } from "../components/MultiSelectList";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { getExploreRecipes } from "../data/recipes";

// Get unique values for filters from the mock data
const allRecipes = getExploreRecipes();
const CUISINES = [...new Set(allRecipes.map((r) => r.cuisine))];
const TAGS = [...new Set(allRecipes.flatMap((r) => r.tags))];
const INGREDIENTS = [
  ...new Set(allRecipes.flatMap((r) => r.ingredients.map((i) => i.name))),
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const TIME_OPTIONS = [
  { label: "Under 30 min", value: 30 },
  { label: "Under 60 min", value: 60 },
];
const SERVING_OPTIONS = [
  { label: "1-2 servings", value: 2 },
  { label: "3-4 servings", value: 4 },
  { label: "5+ servings", value: 5 },
];

export default function FilterScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [maxTotalTime, setMaxTotalTime] = useState<number | null>(null);
  const [minServings, setMinServings] = useState<number | null>(null);

  const handleApplyFilters = () => {
    // Navigate back to explore screen with filters as params
    router.back();
  };

  const handleResetFilters = () => {
    setSelectedCuisines([]);
    setSelectedTags([]);
    setSelectedIngredients([]);
    setSelectedDifficulty(null);
    setMaxTotalTime(null);
    setMinServings(null);
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header title="Filters" showBackButton />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Cuisine Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[800] }]}>
            Cuisine
          </Text>
          <MultiSelectList
            title="Cuisines"
            options={CUISINES}
            selectedOptions={selectedCuisines}
            onSelectionChange={setSelectedCuisines}
            trigger={(onPress) => (
              <Pressable
                style={[
                  styles.selectButton,
                  { borderColor: colors.neutral[300] },
                ]}
                onPress={onPress}
              >
                <Text
                  style={[styles.selectText, { color: colors.neutral[700] }]}
                >
                  {selectedCuisines.length > 0
                    ? `${selectedCuisines.length} selected`
                    : "Select cuisines"}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[800] }]}>
            Ingredients
          </Text>
          <AutocompleteInput
            placeholder="Search for ingredients..."
            options={INGREDIENTS}
            selectedOptions={selectedIngredients}
            onSelectionChange={setSelectedIngredients}
          />
        </View>

        {/* Tags Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[800] }]}>
            Tags & Dietary
          </Text>
          <MultiSelectList
            title="Tags & Dietary"
            options={TAGS}
            selectedOptions={selectedTags}
            onSelectionChange={setSelectedTags}
            trigger={(onPress) => (
              <Pressable
                style={[
                  styles.selectButton,
                  { borderColor: colors.neutral[300] },
                ]}
                onPress={onPress}
              >
                <Text
                  style={[styles.selectText, { color: colors.neutral[700] }]}
                >
                  {selectedTags.length > 0
                    ? `${selectedTags.length} selected`
                    : "Select tags"}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* Difficulty Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[800] }]}>
            Difficulty
          </Text>
          <View style={styles.tagContainer}>
            {DIFFICULTIES.map((difficulty) => (
              <Pressable
                key={difficulty}
                style={[
                  styles.tag,
                  selectedDifficulty === difficulty
                    ? {
                        backgroundColor: colors.primary[500],
                        borderColor: colors.primary[500],
                      }
                    : {
                        backgroundColor: colors.neutral[100],
                        borderColor: colors.neutral[200],
                      },
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedDifficulty === difficulty
                      ? { color: colors.white }
                      : { color: colors.neutral[700] },
                  ]}
                >
                  {difficulty}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Total Time Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[800] }]}>
            Total Time
          </Text>
          <View style={styles.tagContainer}>
            {TIME_OPTIONS.map((option) => (
              <Pressable
                key={option.label}
                style={[
                  styles.tag,
                  maxTotalTime === option.value
                    ? {
                        backgroundColor: colors.primary[500],
                        borderColor: colors.primary[500],
                      }
                    : {
                        backgroundColor: colors.neutral[100],
                        borderColor: colors.neutral[200],
                      },
                ]}
                onPress={() => setMaxTotalTime(option.value)}
              >
                <Text
                  style={[
                    styles.tagText,
                    maxTotalTime === option.value
                      ? { color: colors.white }
                      : { color: colors.neutral[700] },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Servings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[800] }]}>
            Servings
          </Text>
          <View style={styles.tagContainer}>
            {SERVING_OPTIONS.map((option) => (
              <Pressable
                key={option.label}
                style={[
                  styles.tag,
                  minServings === option.value
                    ? {
                        backgroundColor: colors.primary[500],
                        borderColor: colors.primary[500],
                      }
                    : {
                        backgroundColor: colors.neutral[100],
                        borderColor: colors.neutral[200],
                      },
                ]}
                onPress={() => setMinServings(option.value)}
              >
                <Text
                  style={[
                    styles.tagText,
                    minServings === option.value
                      ? { color: colors.white }
                      : { color: colors.neutral[700] },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.white,
            borderTopColor: colors.neutral[200],
          },
        ]}
      >
        <Pressable
          style={[styles.button, styles.resetButton]}
          onPress={handleResetFilters}
        >
          <Text style={[styles.buttonText, { color: colors.neutral[800] }]}>
            Reset
          </Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary[600] }]}
          onPress={handleApplyFilters}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>
            Apply Filters
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing[6],
  },
  section: {
    marginBottom: Spacing[8],
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing[4],
  },
  selectButton: {
    padding: Spacing[4],
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
  },
  selectText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[3],
  },
  tag: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.medium,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing[6],
    borderTopWidth: 1,
    gap: Spacing[4],
  },
  button: {
    flex: 1,
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
});
