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
import {
  BorderRadius,
  Colors,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";

type Ingredient = {
  id: string;
  name: string;
};

export default function ManualInputScreen() {
  const router = useRouter();
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.headerButtonText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Manual Input</Text>
          <Pressable onPress={findRecipes}>
            <Text style={[styles.headerButtonText, styles.headerDoneButton]}>
              Done
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Add Ingredients</Text>

        <View style={styles.inputRow}>
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder="Enter ingredient name"
              value={inputText}
              onChangeText={setInputText}
              style={styles.textInput}
              placeholderTextColor={Colors.neutral[400]}
              onSubmitEditing={addIngredient}
              returnKeyType="done"
            />
          </View>

          <Pressable style={styles.addButton} onPress={addIngredient}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Ingredients List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          Your Ingredients ({ingredients.length})
        </Text>

        {ingredients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
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
              <View style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>{item.name}</Text>
                <Pressable
                  onPress={() => removeIngredient(item.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </Pressable>
              </View>
            )}
            ListFooterComponent={
              <View style={{ paddingBottom: Spacing[6] }}>
                <Pressable
                  style={styles.findRecipesButton}
                  onPress={findRecipes}
                >
                  <Text style={styles.findRecipesButtonText}>
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
    backgroundColor: Colors.white,
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
    color: Colors.primary[600],
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    color: Colors.neutral[900],
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
    color: Colors.neutral[900],
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
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: Spacing[4],
    height: 58, // Added height for alignment
    justifyContent: "center",
  },
  textInput: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    color: Colors.neutral[700],
  },
  addButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius["2xl"],
    paddingHorizontal: Spacing[6],
    justifyContent: "center",
    height: 58, // Match height of text input
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  addButtonText: {
    color: Colors.white,
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
    color: Colors.neutral[500],
    textAlign: "center",
    fontFamily: Fonts.regular,
    fontSize: FontSizes.lg,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[3],
  },
  ingredientName: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    color: Colors.neutral[900],
    flex: 1,
  },
  removeButton: {
    marginLeft: Spacing[4],
  },
  removeButtonText: {
    color: Colors.error,
    fontSize: FontSizes.xl,
  },
  findRecipesButton: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing[4],
    alignItems: "center",
    marginTop: Spacing[4],
  },
  findRecipesButtonText: {
    color: Colors.white,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.lg,
  },
});
