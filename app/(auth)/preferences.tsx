import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { useUpdateUserPreferenceMutation } from "../../store/api/userApiSlice";
import { RootState } from "../../store/store";

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
export default function PreferencesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const user = useSelector((state: RootState) => state.auth.user);

  const [updateUserPreference, { isLoading }] =
    useUpdateUserPreferenceMutation();

  // --- State for each step ---
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [dislikedIngredients, setDislikedIngredients] = useState<
    { id: string; name: string }[]
  >([]);
  const [ingredientInput, setIngredientInput] = useState("");

  // --- Handlers ---
  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleFinish = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to save preferences.");
      router.replace("/(auth)/login");
      return;
    }

    const preference = {
      // Mapped to match the expected UserPreference type
      allergies: dietaryRestrictions,
      preferredCuisines: favoriteCuisines,
      dislikedIngredients: dislikedIngredients.map((i) => i.name),
      dietaryRestrictions: dietaryRestrictions,

      // Placeholder values for other required fields
      id: user.id, // Assuming preference id might be linked to user id
      notifications: {
        push: true,
        email: false,
      },
    };

    try {
      await updateUserPreference({ id: user.id, preference }).unwrap();
      Alert.alert("Preferences Saved!", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/home") },
      ]);
    } catch (err) {
      Alert.alert(
        "Save Failed",
        "Could not save your preferences. Please try again."
      );
      console.error(err);
    }
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
        <Text style={[styles.headerTitle, { color: colors.neutral[900] }]}>
          Tell Us Your Preferences
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.neutral[500] }]}>
          Step {step} of {STEPS.length}: {STEPS[step - 1].title}
        </Text>
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
              onPress={handleFinish}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.white }]}>
                  Finish
                </Text>
              )}
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
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FontSizes["2xl"],
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: FontSizes.lg,
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
