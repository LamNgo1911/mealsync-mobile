import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { RecipeSection } from "../../components/RecipeSection";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "../../constants/theme";
import { getRecommendedRecipes } from "../../data/recipes";

const RECOMMENDED_MEALS = getRecommendedRecipes();

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
    <View style={styles.container}>
      <Header title="MealSync" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan Ingredients Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Scan Ingredients</Text>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={takePhoto}
            >
              <Text style={styles.buttonEmoji}>📷</Text>
              <Text style={styles.buttonText}>Take Photo</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.accentButton]}
              onPress={() => router.push("/manual-input")}
            >
              <Text style={styles.buttonEmoji}>✏️</Text>
              <Text style={styles.buttonText}>Manual Input</Text>
            </Pressable>
          </View>
        </View>

        {/* Recommended Meals Section */}
        <RecipeSection
          title="Recommended Meals"
          recipes={RECOMMENDED_MEALS}
          loading={loading}
          showCategory={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    color: Colors.neutral[900],
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // Basic shadow for Android
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: Colors.primary[500],
  },
  accentButton: {
    backgroundColor: Colors.accent[500],
  },
  buttonEmoji: {
    fontSize: FontSizes["2xl"],
    marginBottom: Spacing[2],
  },
  buttonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: Colors.white,
  },
});
