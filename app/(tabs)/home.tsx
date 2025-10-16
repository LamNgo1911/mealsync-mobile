import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { RecipeSection } from "../../components/RecipeSection";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { useGetRecipesQuery } from "../../store/api/recipeApiSlice";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    data: recommendedRecipes,
    isLoading: isLoadingRecommended,
    isError: isErrorRecommended,
  } = useGetRecipesQuery({ page: 1, limit: 5 });

  console.log(recommendedRecipes);

  const takePhoto = async () => {
    const { status } = await Camera.getCameraPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Camera.requestCameraPermissionsAsync();
      if (newStatus !== "granted") {
        alert("Camera permission is required to take photos");
        return;
      }
    }
    router.push("/camera");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan Ingredients Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[900] }]}>
            Scan Ingredients
          </Text>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={[
                styles.button,
                styles.primaryButton,
                {
                  backgroundColor: colors.primary[500],
                  shadowColor: colors.black,
                },
              ]}
              onPress={takePhoto}
            >
              <Text style={styles.buttonEmoji}>📷</Text>
              <Text style={[styles.buttonText, { color: colors.white }]}>
                Take Photo
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.accentButton,
                {
                  backgroundColor: colors.accent[500],
                  shadowColor: colors.black,
                },
              ]}
              onPress={() => router.push("/manual-input")}
            >
              <Text style={styles.buttonEmoji}>✏️</Text>
              <Text style={[styles.buttonText, { color: colors.white }]}>
                Manual Input
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Recommended Meals Section */}
        <RecipeSection
          title="Recommended Meals"
          recipes={recommendedRecipes?.data ?? []}
          loading={isLoadingRecommended}
        />
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
  },
  sectionContainer: {
    paddingHorizontal: Spacing[6],
    marginBottom: Spacing[8],
  },
  sectionTitle: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    marginBottom: Spacing[4],
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: Spacing[4],
  },
  button: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    alignItems: "center",
    justifyContent: "center",
    // Basic shadow for iOS
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // Basic shadow for Android
    elevation: 2,
  },
  primaryButton: {},
  accentButton: {},
  buttonEmoji: {
    fontSize: FontSizes["2xl"],
    marginBottom: Spacing[2],
  },
  buttonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
  },
});
