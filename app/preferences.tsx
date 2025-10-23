import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { User, UserRole } from "../types/user";

// --- Mock Data ---
// In a real app, you would fetch this from your context or API
const MOCK_USER: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "ethan.carter@example.com",
  name: "Ethan Carter",
  role: UserRole.USER,
  userPreference: {
    id: "pref-1",
    dietaryRestrictions: ["Vegetarian"],
    allergies: ["Peanuts"], // Assuming this maps to disliked ingredients for now
    preferredCuisines: ["Italian", "Mexican"],
    notifications: {
      push: true,
      email: false,
    },
  },
};

// --- Constants for each step ---
const DIETARY_RESTRICTIONS = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Soy-Free",
];
const FAVORITE_CUISINES = [
  "Italian",
  "Mexican",
  "Chinese",
  "Indian",
  "Japanese",
  "Thai",
  "French",
  "Spanish",
];

// --- Component ---
export default function UpdatePreferencesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [step, setStep] = useState(1);

  // --- State for each step, initialized with mock data ---
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(
    MOCK_USER.userPreference.dietaryRestrictions
  );
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>(
    MOCK_USER.userPreference.preferredCuisines
  );
  const [dislikedIngredients, setDislikedIngredients] = useState<
    { id: string; name: string }[]
  >(
    MOCK_USER.userPreference.allergies.map((name) => ({
      id: name,
      name,
    }))
  );
  const [ingredientInput, setIngredientInput] = useState("");

  // --- Handlers ---
  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSave = () => {
    // TODO: Save updated preferences to the backend
    Alert.alert("Preferences Updated", "Your profile has been saved.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const toggleSelection = (
    item: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addDislikedIngredient = () => {
    if (ingredientInput.trim()) {
      setDislikedIngredients([
        ...dislikedIngredients,
        { id: Date.now().toString(), name: ingredientInput.trim() },
      ]);
      setIngredientInput("");
    }
  };

  const removeDislikedIngredient = (id: string) => {
    setDislikedIngredients(dislikedIngredients.filter((i) => i.id !== id));
  };

  // --- Render methods for each step ---
  const renderStep1 = () => (
    <>
      <Text style={[styles.sectionTitle, { color: colors.neutral[800] }]}>
        Do you have any dietary restrictions?
      </Text>
      <View style={styles.tagContainer}>
        {DIETARY_RESTRICTIONS.map((restriction) => (
          <Tag
            key={restriction}
            label={restriction}
            isSelected={dietaryRestrictions.includes(restriction)}
            onPress={() =>
              toggleSelection(
                restriction,
                dietaryRestrictions,
                setDietaryRestrictions
              )
            }
          />
        ))}
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={[styles.sectionTitle, { color: colors.neutral[800] }]}>
        What are your favorite cuisines?
      </Text>
      <View style={styles.tagContainer}>
        {FAVORITE_CUISINES.map((cuisine) => (
          <Tag
            key={cuisine}
            label={cuisine}
            isSelected={favoriteCuisines.includes(cuisine)}
            onPress={() =>
              toggleSelection(cuisine, favoriteCuisines, setFavoriteCuisines)
            }
          />
        ))}
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={[styles.sectionTitle, { color: colors.neutral[800] }]}>
        Are there any ingredients you dislike?
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.neutral[100] }]}
          placeholder="e.g., cilantro, mushrooms"
          value={ingredientInput}
          onChangeText={setIngredientInput}
          onSubmitEditing={addDislikedIngredient}
          returnKeyType="done"
          placeholderTextColor={colors.neutral[400]}
        />
        <Pressable
          style={[styles.addButton, { backgroundColor: colors.primary[500] }]}
          onPress={addDislikedIngredient}
        >
          <Text style={[styles.addButtonText, { color: colors.white }]}>
            Add
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={dislikedIngredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.ingredientItem,
              { backgroundColor: colors.neutral[50] },
            ]}
          >
            <Text
              style={[styles.ingredientName, { color: colors.neutral[700] }]}
            >
              {item.name}
            </Text>
            <Pressable onPress={() => removeDislikedIngredient(item.id)}>
              <Text style={[styles.removeButtonText, { color: colors.error }]}>
                ×
              </Text>
            </Pressable>
          </View>
        )}
      />
    </>
  );

  const STEPS = [
    { title: "Dietary Restrictions", render: renderStep1 },
    { title: "Favorite Cuisines", render: renderStep2 },
    { title: "Disliked Ingredients", render: renderStep3 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.neutral[200],
            backgroundColor: colors.white,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backIcon}>
          <Text style={[styles.backIconText, { color: colors.neutral[800] }]}>
            ‹
          </Text>
        </Pressable>
        <View>
          <Text style={[styles.headerTitle, { color: colors.neutral[900] }]}>
            Update Your Preferences
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.neutral[500] }]}>
            Step {step} of {STEPS.length}: {STEPS[step - 1].title}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {STEPS[step - 1].render()}
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.neutral[200],
            backgroundColor: colors.white,
          },
        ]}
      >
        <View style={styles.footerButtons}>
          {step > 1 && (
            <Pressable
              style={[
                styles.button,
                styles.backButton,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.neutral[300],
                },
              ]}
              onPress={handleBack}
            >
              <Text
                style={[
                  styles.buttonText,
                  styles.backButtonText,
                  { color: colors.neutral[800] },
                ]}
              >
                Back
              </Text>
            </Pressable>
          )}
          {step < STEPS.length ? (
            <Pressable
              style={[
                styles.button,
                styles.nextButton,
                { backgroundColor: colors.primary[600] },
              ]}
              onPress={handleNext}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>
                Next
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.button,
                styles.nextButton,
                { backgroundColor: colors.primary[600] },
              ]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>
                Save Changes
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

// --- Reusable Tag Component ---
const Tag = ({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <Pressable
      style={[
        styles.tag,
        {
          backgroundColor: colors.neutral[100],
          borderColor: colors.neutral[200],
        },
        isSelected && {
          backgroundColor: colors.primary[500],
          borderColor: colors.primary[500],
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tagText,
          { color: colors.neutral[700] },
          isSelected && { color: colors.white },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    position: "relative",
  },
  backIcon: {
    position: "absolute",
    left: Spacing[6],
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  backIconText: {
    fontSize: FontSizes["3xl"],
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginTop: Spacing[1],
  },
  contentContainer: {
    flexGrow: 1,
    padding: Spacing[6],
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing[4],
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
  tagSelected: {},
  tagText: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.medium,
  },
  tagTextSelected: {},
  footer: {
    padding: Spacing[6],
    borderTopWidth: 1,
  },
  footerButtons: {
    flexDirection: "row",
    gap: Spacing[3],
  },
  button: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    alignItems: "center",
  },
  nextButton: {},
  backButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.lg,
  },
  backButtonText: {},
  // Ingredient Input Styles
  inputRow: {
    flexDirection: "row",
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  textInput: {
    flex: 1,
    paddingHorizontal: Spacing[4],
    height: 58,
    borderRadius: BorderRadius.xl,
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing[5],
    borderRadius: BorderRadius.xl,
  },
  addButtonText: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.base,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[2],
  },
  ingredientName: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
  },
  removeButtonText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
  },
});
