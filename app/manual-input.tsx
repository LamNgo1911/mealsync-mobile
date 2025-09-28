import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Header } from "../components/Header";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

type Ingredient = {
  id: string;
  name: string;
};

export default function ManualInputScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [inputText, setInputText] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const addIngredient = () => {
    if (inputText.trim()) {
      const newIngredient: Ingredient = {
        id: Date.now().toString(),
        name: inputText.trim(),
      };
      setIngredients([...ingredients, newIngredient]);
      setInputText("");
    }
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const findRecipes = () => {
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }
    alert(
      `Searching recipes with: ${ingredients.map((i) => i.name).join(", ")}`
    );
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header title="Manual Input" showBackButton />

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={[styles.sectionTitle, { color: colors.neutral[900] }]}>
          Add Ingredients
        </Text>

        <View style={styles.inputRow}>
          <View
            style={[
              styles.textInputContainer,
              { backgroundColor: colors.neutral[100] },
            ]}
          >
            <TextInput
              placeholder="Enter ingredient name"
              value={inputText}
              onChangeText={setInputText}
              style={[styles.textInput, { color: colors.neutral[700] }]}
              placeholderTextColor={colors.neutral[400]}
              onSubmitEditing={addIngredient}
              returnKeyType="done"
            />
          </View>

          <Pressable
            style={[
              styles.addButton,
              {
                backgroundColor: colors.primary[600],
                shadowColor: colors.black,
              },
            ]}
            onPress={addIngredient}
          >
            <Text style={[styles.addButtonText, { color: colors.white }]}>
              Add
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Ingredients List */}
      <View style={styles.listSection}>
        <Text style={[styles.sectionTitle, { color: colors.neutral[900] }]}>
          Your Ingredients ({ingredients.length})
        </Text>

        {ingredients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.neutral[500] }]}>
              No ingredients added yet.{"\n"}Start by typing an ingredient
              above.
            </Text>
          </View>
        ) : (
          <FlatList
            data={ingredients}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.ingredientItem,
                  { backgroundColor: colors.neutral[100] },
                ]}
              >
                <Text
                  style={[
                    styles.ingredientName,
                    { color: colors.neutral[900] },
                  ]}
                >
                  {item.name}
                </Text>
                <Pressable
                  onPress={() => removeIngredient(item.id)}
                  style={styles.removeButton}
                >
                  <Text
                    style={[styles.removeButtonText, { color: colors.error }]}
                  >
                    ×
                  </Text>
                </Pressable>
              </View>
            )}
            ListFooterComponent={
              <View style={{ paddingBottom: Spacing[6] }}>
                <Pressable
                  style={[
                    styles.findRecipesButton,
                    { backgroundColor: colors.success },
                  ]}
                  onPress={findRecipes}
                >
                  <Text
                    style={[
                      styles.findRecipesButtonText,
                      { color: colors.white },
                    ]}
                  >
                    Find Recipes ({ingredients.length} ingredients)
                  </Text>
                </Pressable>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 56,
    paddingBottom: Spacing[4],
    paddingHorizontal: Spacing[6],
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButtonText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
  headerDoneButton: {
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
  },
  inputSection: {
    paddingHorizontal: Spacing[6],
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
    marginBottom: Spacing[3],
  },
  inputRow: {
    flexDirection: "row",
    gap: Spacing[3],
    alignItems: "center",
  },
  textInputContainer: {
    flex: 1,
    borderRadius: BorderRadius["2xl"],
    paddingHorizontal: Spacing[4],
    height: 58, // Added height for alignment
    justifyContent: "center",
  },
  textInput: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
  },
  addButton: {
    borderRadius: BorderRadius["2xl"],
    paddingHorizontal: Spacing[6],
    justifyContent: "center",
    height: 58, // Match height of text input
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  addButtonText: {
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.lg,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: Spacing[6],
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontFamily: Fonts.regular,
    fontSize: FontSizes.lg,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[3],
  },
  ingredientName: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  removeButton: {
    marginLeft: Spacing[4],
  },
  removeButtonText: {
    fontSize: FontSizes.xl,
  },
  findRecipesButton: {
    borderRadius: BorderRadius["2xl"],
    padding: Spacing[4],
    alignItems: "center",
    marginTop: Spacing[4],
  },
  findRecipesButtonText: {
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.lg,
  },
});
