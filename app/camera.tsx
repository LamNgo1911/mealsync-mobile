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
import "../global.css";

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
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Loading Camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 bg-black items-center justify-center p-6">
        <Text className="text-white text-lg text-center mb-4">
          We need your permission to show the camera. Please grant permission in
          your device settings.
        </Text>
        <Pressable
          className="bg-blue-500 px-6 py-3 rounded-lg mb-4"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </Pressable>
        <Pressable
          className="bg-neutral-600 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
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
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="pt-14 pb-6 px-6">
          <Pressable onPress={retakePhoto}>
            <Text className="text-lg text-primary-600">✕ Retake</Text>
          </Pressable>
        </View>

        {/* Photo Container */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ width: 304, height: 304 }}>
            {processing && (
              <Animated.View
                style={{
                  position: "absolute",
                  width: 304,
                  height: 304,
                  borderRadius: 152,
                  borderWidth: 4,
                  borderColor: "transparent",
                  borderTopColor: "#10b981",
                  borderRightColor: "#10b981",
                  zIndex: 20,
                  transform: [{ rotate: spin }],
                }}
              />
            )}
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                width: 288,
                height: 288,
                borderRadius: 144,
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
                borderWidth: 2,
                borderColor: "#e5e5e5",
                zIndex: 10,
              }}
            >
              <Image
                source={{ uri: photo }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          </View>

          {processing && (
            <View className="items-center mt-8">
              <Text className="text-lg font-semibold text-accent-500 mb-2.5 text-center">
                Scanning ingredients...
              </Text>
              <Text className="text-2xl font-bold text-accent-500 text-center">
                {Math.round(progress)}%
              </Text>
            </View>
          )}
        </View>

        {!processing && (
          <View className="p-6">
            <Pressable
              className="bg-accent-500 rounded-2xl p-4 items-center shadow-sm"
              onPress={startScanning}
            >
              <Text className="text-white font-semibold text-lg">
                Use Photo
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        className="flex-1"
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        facing="back"
      />

      {/* Header */}
      <View className="absolute top-0 left-0 right-0 pt-14 pb-4 px-6">
        <Pressable
          className="self-start bg-black/50 rounded-full p-3"
          onPress={() => router.back()}
        >
          <Text className="text-white text-lg">✕</Text>
        </Pressable>
      </View>

      {/* Bottom Controls */}
      <View className="absolute bottom-0 left-0 right-0 p-6 items-center">
        <Text className="text-white text-center mb-6">
          Point camera at ingredients to scan
        </Text>

        <Pressable
          className="w-20 h-20 bg-white rounded-full items-center justify-center"
          onPress={takePicture}
        >
          <View className="w-16 h-16 bg-white rounded-full border-4 border-gray-300" />
        </Pressable>
      </View>
    </View>
  );
}
