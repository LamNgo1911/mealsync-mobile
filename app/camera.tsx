import { CameraView } from "expo-camera";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Animated, Pressable, Text, View } from "react-native";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const startScanning = () => {
    setProcessing(true);
    setProgress(0);

    // Start rotating border animation
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    rotation.start();

    // Update progress every 100ms
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3.33; // Increment to reach 100% in 3 seconds
      });
    }, 100);

    // Stop processing after 3 seconds
    setTimeout(() => {
      rotation.stop();
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
          // Start scanning automatically after photo is taken
          setTimeout(() => startScanning(), 500); // Small delay for photo display
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take photo");
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  if (photo) {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="pt-14 pb-6 px-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-lg text-blue-600">✕ Close</Text>
          </Pressable>
        </View>

        {/* Photo in Circular Container */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <View style={{ position: "relative" }}>
            {/* Rotating Border */}
            {processing && (
              <Animated.View
                style={{
                  position: "absolute",
                  width: 280,
                  height: 280,
                  borderRadius: 140,
                  borderWidth: 4,
                  borderColor: "transparent",
                  borderTopColor: "#10B981",
                  borderRightColor: "#10B981",
                  transform: [{ rotate: spin }],
                  top: -10,
                  left: -10,
                }}
              />
            )}

            {/* Photo Circle */}
            <View
              style={{
                width: 260,
                height: 260,
                borderRadius: 130,
                overflow: "hidden",
                borderWidth: processing ? 0 : 2,
                borderColor: "#E5E7EB",
              }}
            >
              <Image
                source={{ uri: photo }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
          </View>

          {/* Processing Text and Progress */}
          {processing && (
            <View style={{ alignItems: "center", marginTop: 30 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#10B981",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Scanning ingredients...
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#10B981",
                  textAlign: "center",
                }}
              >
                {Math.round(progress)}%
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Button */}
        {!processing && (
          <View className="p-6">
            <Pressable
              style={{
                backgroundColor: "#6B7280",
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
              }}
              onPress={retakePhoto}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
                Retake Photo
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

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
      <View className="absolute bottom-0 left-0 right-0 p-6">
        <View className="items-center">
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
    </View>
  );
}
