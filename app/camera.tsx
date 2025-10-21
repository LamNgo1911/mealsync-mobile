import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
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
import { useGenerateRecipesMutation } from "../store/api/recipeApiSlice";

export default function CameraScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { scanCount, incrementScanCount, user } = useAuth();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotationLoop = useRef<Animated.CompositeAnimation | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const scanTimeoutRef = useRef<number | null>(null);

  const [detectIngredients] = useDetectIngredientsMutation();
  const [generateRecipes] = useGenerateRecipesMutation();

  useEffect(() => {
    // We only need to request permission if it's not determined yet.
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const startScanning = async (imageUri: string) => {
    setProcessing(true);
    setProgress(0);

    rotationLoop.current = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    rotationLoop.current.start();

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 100;
        }
        return prev + 3.33;
      });
    }, 100);

    try {
      // Create FormData for multipart/form-data upload
      const formData = new FormData();

      // Extract filename from URI
      const filename = imageUri.split('/').pop() || 'photo.jpg';

      // Add image to FormData
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: 'image/jpeg',
      } as any);

      // Step 1: Detect ingredients from image
      const detectionResponse = await detectIngredients(formData).unwrap();

      // Extract ingredient names from response
      const ingredientList = detectionResponse.data.ingredients.map(
        (ing) => ing.name
      );

      // Step 2: Generate recipes based on detected ingredients and user preferences
      const userPreference = user?.userPreference
        ? {
            dietaryRestrictions: user.userPreference.dietaryRestrictions,
            cuisinePreferences: user.userPreference.preferredCuisines,
          }
        : undefined;

      const recipesResponse = await generateRecipes({
        ingredients: ingredientList,
        userPreference,
      }).unwrap();

      // Stop animations
      if (rotationLoop.current) {
        rotationLoop.current.stop();
      }
      rotateAnim.setValue(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProcessing(false);
      setProgress(0);

      // Navigate to suggestions screen with detected ingredients and generated recipes
      router.push({
        pathname: "/recipe-suggestions",
        params: {
          ingredients: ingredientList.join(", "),
          recipes: JSON.stringify(recipesResponse.data),
        },
      });

      // Reset photo state after navigating away
      setPhoto(null);
    } catch (error) {
      // Stop animations
      if (rotationLoop.current) {
        rotationLoop.current.stop();
      }
      rotateAnim.setValue(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProcessing(false);
      setProgress(0);

      let message = "Failed to process image. Please try again.";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'object' && error !== null && 'data' in error) {
        const apiError = error as any;
        message = apiError.data?.message || message;
      }
      Alert.alert("Error", message);

      // Reset photo so user can retake
      setPhoto(null);
    }
  };

  const takePicture = async () => {
    // Check user's scan limit
    // For now, we assume a "free" user who gets 1 scan.
    if (scanCount >= 100) {
      router.push("/subscription");
      return;
    }

    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync();

        if (result?.uri) {
          incrementScanCount(); // Increment scan count after successful photo
          setPhoto(result.uri);
          setTimeout(() => startScanning(result.uri), 500);
        } else {
          Alert.alert("Error", "No photo URI received from camera result.");
        }
      } catch (error) {
        let message = "An unknown error occurred.";
        if (error instanceof Error) {
          message = error.message;
        }
        Alert.alert("Error", `Failed to take photo: ${message}`);
      }
    } else {
      Alert.alert("Error", "Camera reference is not available.");
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setProcessing(false);
    setProgress(0);

    // Stop and clear all timers and animations
    if (rotationLoop.current) {
      rotationLoop.current.stop();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    // It's good practice to reset the animation value as well
    rotateAnim.setValue(0);
  };

  if (!permission) {
    // Camera permissions are still loading.
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
    // Camera permissions are not granted yet.
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

  return (
    <View style={[styles.cameraContainer, { backgroundColor: colors.black }]}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        facing="back"
      />

      <Header title="Scan" showBackButton />

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
  container: {
    flex: 1,
  },
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
  grantButton: {},
  backButton: {},
  permissionButtonText: {
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
  header: {
    paddingTop: 56,
    paddingBottom: Spacing[6],
    paddingHorizontal: Spacing[6],
  },
  retakeButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  retakeIcon: {
    marginRight: Spacing[2],
  },
  retakeButton: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
  },
  photoWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
  footer: {
    padding: Spacing[6],
  },
  button: {
    borderRadius: BorderRadius["2xl"],
    padding: Spacing[4],
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  usePhotoButton: {},
  usePhotoButtonText: {
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.lg,
  },
  cameraContainer: {
    flex: 1,
  },
  cameraHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 56,
    paddingBottom: Spacing[4],
    paddingHorizontal: Spacing[6],
  },
  closeButton: {
    alignSelf: "flex-start",
    borderRadius: BorderRadius.full,
    padding: Spacing[3],
  },
  closeButtonText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing[6],
    alignItems: "center",
  },
  instructionsText: {
    textAlign: "center",
    fontFamily: Fonts.regular,
    marginBottom: Spacing[6],
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
