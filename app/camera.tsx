import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Header } from "../components/Header";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useDetectIngredientsMutation } from "../store/api/ingredientRecognitionApiSlice";
import {
  mapUserPreferenceForRecipe,
  useGenerateRecipesMutation,
} from "../store/api/recipeApiSlice";
import { RootState } from "../store/store";

type InputMode = "camera" | "gallery" | "text";

export default function CameraScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { scanCount, incrementScanCount, user } = useAuth();
  const authToken = useSelector((state: RootState) => state.auth.token);

  const cameraRef = useRef<CameraView>(null);
  const [inputMode, setInputMode] = useState<InputMode>("camera");
  const [photo, setPhoto] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotationLoop = useRef<Animated.CompositeAnimation | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const [detectIngredients] = useDetectIngredientsMutation();
  const [generateRecipes] = useGenerateRecipesMutation();
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const takePicture = async () => {
    if (scanCount >= 100) {
      router.push("/subscription");
      return;
    }

    if (!cameraRef.current) {
      Alert.alert("Error", "Camera reference is not available.");
      return;
    }

    try {
      // Take photo as JPEG directly
      const result = await cameraRef.current.takePictureAsync({
        quality: 1,
        imageType: "jpg",
        skipProcessing: false, // let Expo normalize orientation
      });

      if (!result?.uri) {
        Alert.alert("Error", "Failed to capture photo.");
        return;
      }

      setPhoto(result.uri);
      incrementScanCount(); // Increment scan count
      startScanning(result.uri);
    } catch (error) {
      let message = error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Error", `Failed to take photo: ${message}`);
    }
  };

  const pickFromGallery = async () => {
    if (scanCount >= 100) {
      router.push("/subscription");
      return;
    }

    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!status) {
        Alert.alert(
          "Permission Required",
          "Please grant access to your photo library."
        );
        return;
      }

      // Pick an image from the gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setPhoto(uri);
        incrementScanCount(); // Increment scan count
        startScanning(uri);
      }
    } catch (error) {
      let message = error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Error", `Failed to pick image: ${message}`);
    }
  };

  const startScanning = async (imageUri: string) => {
    setProcessing(true);
    setProgress(0);

    // Start rotation animation
    rotationLoop.current = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotationLoop.current.start();

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: `photo_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      // Step 1: Detect ingredients (0% -> 50%)
      setProgress(10); // Starting detection
      const detectionResponse = await detectIngredients(formData).unwrap();
      setProgress(50); // Detection complete

      // Extract ingredients from response: { success: true, data: ["ingredient1", "ingredient2", ...] }
      const ingredients = detectionResponse.data || [];

      console.log("Detected ingredients: ", ingredients);

      if (!ingredients.length) {
        throw new Error("No ingredients detected.");
      }

      // Step 2: Generate recipes (50% -> 100%)
      setProgress(60); // Starting recipe generation
      const recipesResponse = await generateRecipes({
        ingredients,
        userPreference: mapUserPreferenceForRecipe(user?.userPreference),
      }).unwrap();
      setProgress(100); // Complete

      router.push({
        pathname: "/recipe-suggestions",
        params: {
          ingredients: ingredients.join(", "),
          recipes: JSON.stringify(recipesResponse.data),
        },
      });

      setProcessing(false);
      setPhoto(null);
    } catch (error) {
      console.error("Ingredient scan error:", error);
      Alert.alert(
        "Error",
        "We couldn't detect any ingredients. Please try again with a clearer photo."
      );
      setProcessing(false);
      setPhoto(null);
    } finally {
      if (rotationLoop.current) rotationLoop.current.stop();
      rotateAnim.setValue(0);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setProcessing(false);
    setProgress(0);
    if (rotationLoop.current) rotationLoop.current.stop();
    rotateAnim.setValue(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  // Permissions handling
  if (!permission) {
    return (
      <View
        style={[styles.permissionContainer, { backgroundColor: colors.black }]}
      >
        <Text style={[styles.permissionText, { color: colors.white }]}>
          Loading Camera...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={[styles.permissionContainer, { backgroundColor: colors.black }]}
      >
        <Text
          style={[
            styles.permissionText,
            { marginBottom: Spacing[4], color: colors.white },
          ]}
        >
          We need your permission to show the camera. Please grant permission in
          your device settings.
        </Text>
        <Pressable
          style={[styles.permissionButton, { backgroundColor: colors.info }]}
          onPress={requestPermission}
        >
          <Text style={[styles.permissionButtonText, { color: colors.white }]}>
            Grant Permission
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.permissionButton,
            { backgroundColor: colors.neutral[600] },
          ]}
          onPress={() => router.back()}
        >
          <Text style={[styles.permissionButtonText, { color: colors.white }]}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  // Photo view with scanning animation
  if (photo) {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <View style={[styles.container, { backgroundColor: colors.white }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={retakePhoto} style={styles.retakeButtonContainer}>
            <Ionicons
              name="refresh"
              size={20}
              color={colors.primary[600]}
              style={styles.retakeIcon}
            />
            <Text style={[styles.retakeButton, { color: colors.primary[600] }]}>
              Retake
            </Text>
          </Pressable>
        </View>

        {/* Photo Container */}
        <View style={styles.photoWrapper}>
          <View style={{ width: 304, height: 304 }}>
            {processing && (
              <Animated.View
                style={[
                  styles.spinner,
                  {
                    transform: [{ rotate: spin }],
                    borderColor: colors.transparent,
                    borderTopColor: colors.primary[500],
                    borderRightColor: colors.primary[500],
                  },
                ]}
              />
            )}
            <View
              style={[
                styles.photoContainer,
                {
                  backgroundColor: colors.neutral[100],
                  borderColor: colors.neutral[200],
                },
              ]}
            >
              <Image
                source={{ uri: photo }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          </View>

          {processing && (
            <View style={styles.processingContainer}>
              <Text
                style={[styles.processingText, { color: colors.accent[500] }]}
              >
                Scanning ingredients...
              </Text>
              <Text
                style={[styles.progressText, { color: colors.accent[500] }]}
              >
                {Math.round(progress)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Default camera view
  return (
    <View style={[styles.cameraContainer, { backgroundColor: colors.black }]}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        facing="back"
      />
      <Header title="Scan" showBackButton />

      {/* Mode Picker Bar */}
      <View
        style={[styles.modePickerContainer, { backgroundColor: colors.white }]}
      >
        <Pressable
          style={[
            styles.modeButton,
            {
              backgroundColor:
                inputMode === "camera" ? colors.primary[50] : "transparent",
            },
          ]}
          onPress={() => setInputMode("camera")}
        >
          <Ionicons
            name="camera"
            size={18}
            color={
              inputMode === "camera" ? colors.primary[500] : colors.neutral[500]
            }
          />
        </Pressable>

        <Pressable
          style={[
            styles.modeButton,
            {
              backgroundColor:
                inputMode === "gallery" ? colors.primary[50] : "transparent",
            },
          ]}
          onPress={() => {
            setInputMode("gallery");
            pickFromGallery();
          }}
        >
          <Ionicons
            name="images"
            size={18}
            color={
              inputMode === "gallery"
                ? colors.primary[500]
                : colors.neutral[500]
            }
          />
        </Pressable>

        <Pressable
          style={[
            styles.modeButton,
            {
              backgroundColor:
                inputMode === "text" ? colors.primary[50] : "transparent",
            },
          ]}
          onPress={() => router.push("/manual-input")}
        >
          <Ionicons
            name="document-text"
            size={18}
            color={
              inputMode === "text" ? colors.primary[500] : colors.neutral[500]
            }
          />
        </Pressable>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <Pressable
          style={[styles.shutterButton, { backgroundColor: colors.white }]}
          onPress={takePicture}
        >
          <View
            style={[
              styles.shutterInnerButton,
              { borderColor: colors.neutral[300] },
            ]}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing[6],
  },
  permissionText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  permissionButton: {
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[4],
  },
  permissionButtonText: {
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
  header: {
    paddingTop: 56,
    paddingBottom: Spacing[6],
    paddingHorizontal: Spacing[6],
  },
  retakeButtonContainer: { flexDirection: "row", alignItems: "center" },
  retakeIcon: { marginRight: Spacing[2] },
  retakeButton: { fontSize: FontSizes.lg, fontFamily: Fonts.medium },
  photoWrapper: { flex: 1, alignItems: "center", justifyContent: "center" },
  spinner: {
    position: "absolute",
    width: 304,
    height: 304,
    borderRadius: 152,
    borderWidth: 4,
    zIndex: 20,
  },
  photoContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 288,
    height: 288,
    borderRadius: 144,
    overflow: "hidden",
    borderWidth: 2,
    zIndex: 10,
  },
  processingContainer: {
    position: "absolute",
    bottom: Spacing[20],
    left: 0,
    right: 0,
    alignItems: "center",
  },
  processingText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing[2],
    textAlign: "center",
  },
  progressText: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  cameraContainer: { flex: 1 },
  modePickerContainer: {
    position: "absolute",
    bottom: 130,
    left: Spacing[12],
    right: Spacing[12],
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    gap: Spacing[1],
  },
  modeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[1],
    borderRadius: BorderRadius.full,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing[6],
    alignItems: "center",
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInnerButton: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    borderWidth: 4,
  },
});
