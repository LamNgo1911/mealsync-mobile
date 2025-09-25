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
  Colors,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // We only need to request permission if it's not determined yet.
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const startScanning = () => {
    setProcessing(true);
    setProgress(0);

    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    rotation.start();

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3.33;
      });
    }, 100);

    setTimeout(() => {
      rotation.stop();
      rotateAnim.setValue(0);
      clearInterval(progressInterval);
      setProcessing(false);
      setProgress(0);
      Alert.alert(
        "Success",
        "Photo captured! Ingredient scanning will be implemented next."
      );
      router.back();
    }, 3000);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync();

        if (result?.uri) {
          setPhoto(result.uri);
          setTimeout(() => startScanning(), 500);
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
    // It's good practice to reset the animation value as well
    rotateAnim.setValue(0);
  };

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading Camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <Text style={[styles.permissionText, { marginBottom: Spacing[4] }]}>
          We need your permission to show the camera. Please grant permission in
          your device settings.
        </Text>
        <Pressable
          style={[styles.permissionButton, styles.grantButton]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
        <Pressable
          style={[styles.permissionButton, styles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={retakePhoto}>
            <Text style={styles.retakeButton}>✕ Retake</Text>
          </Pressable>
        </View>

        {/* Photo Container */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ width: 304, height: 304 }}>
            {processing && (
              <Animated.View
                style={[
                  styles.spinner,
                  {
                    transform: [{ rotate: spin }],
                  },
                ]}
              />
            )}
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photo }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          </View>

          {processing && (
            <View style={styles.processingContainer}>
              <Text style={styles.processingText}>Scanning ingredients...</Text>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          )}
        </View>

        {!processing && (
          <View style={styles.footer}>
            <Pressable
              style={[styles.button, styles.usePhotoButton]}
              onPress={startScanning}
            >
              <Text style={styles.usePhotoButtonText}>Use Photo</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        facing="back"
      />

      <Header title="Scan" showBackButton />

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <Text style={styles.instructionsText}>
          Point camera at ingredients to scan
        </Text>

        <Pressable style={styles.shutterButton} onPress={takePicture}>
          <View style={styles.shutterInnerButton} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing[6],
  },
  permissionText: {
    color: Colors.white,
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
  grantButton: {
    backgroundColor: Colors.info,
  },
  backButton: {
    backgroundColor: Colors.neutral[600],
  },
  permissionButtonText: {
    color: Colors.white,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
  header: {
    paddingTop: 56,
    paddingBottom: Spacing[6],
    paddingHorizontal: Spacing[6],
  },
  retakeButton: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.primary[600],
  },
  spinner: {
    position: "absolute",
    width: 304,
    height: 304,
    borderRadius: 152,
    borderWidth: 4,
    borderColor: Colors.transparent,
    borderTopColor: Colors.primary[500],
    borderRightColor: Colors.primary[500],
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
    backgroundColor: Colors.neutral[100],
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    zIndex: 10,
  },
  processingContainer: {
    alignItems: "center",
    marginTop: Spacing[8],
  },
  processingText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    color: Colors.accent[500],
    marginBottom: Spacing[2],
    textAlign: "center",
  },
  progressText: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    color: Colors.accent[500],
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
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  usePhotoButton: {
    backgroundColor: Colors.accent[500],
  },
  usePhotoButtonText: {
    color: Colors.white,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.lg,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.black,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: BorderRadius.full,
    padding: Spacing[3],
  },
  closeButtonText: {
    color: Colors.white,
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
    color: Colors.white,
    textAlign: "center",
    fontFamily: Fonts.regular,
    marginBottom: Spacing[6],
  },
  shutterButton: {
    width: 80,
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInnerButton: {
    width: 64,
    height: 64,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    borderWidth: 4,
    borderColor: Colors.neutral[300],
  },
});
