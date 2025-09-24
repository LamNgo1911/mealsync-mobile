import { Camera, CameraView } from "expo-camera";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Pressable, Text, View } from "react-native";
import "../global.css";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

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
          Alert.alert("Error", "No photo URI received");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take photo");
      }
    }
  };

  const retakePhoto = () => setPhoto(null);

  if (hasPermission === null) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg mb-4">No access to camera</Text>
        <Pressable
          className="bg-blue-500 px-6 py-3 rounded-lg"
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
          <Pressable onPress={() => router.back()}>
            <Text className="text-lg text-primary-600">✕ Close</Text>
          </Pressable>
        </View>

        {/* Photo Container */}
        <View className="flex-1 items-center justify-center">
          <View className="relative">
            <View className="w-72 h-72 rounded-full overflow-hidden bg-neutral-100 border-2 border-neutral-200 z-10">
              <Image
                source={{ uri: photo }}
                className="w-full h-full"
                contentFit="cover"
              />
            </View>

            {processing && (
              <Animated.View
                style={{
                  position: "absolute",
                  width: 320,
                  height: 320,
                  borderRadius: 160,
                  borderWidth: 4,
                  borderColor: "transparent",
                  borderTopColor: "#10b981",
                  borderRightColor: "#10b981",
                  top: -10,
                  left: -10,
                  zIndex: 20,
                  transform: [{ rotate: spin }],
                }}
              />
            )}
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
              className="bg-neutral-500 rounded-2xl p-4 items-center shadow-sm"
              onPress={retakePhoto}
            >
              <Text className="text-white font-semibold text-lg">
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
      <CameraView ref={cameraRef} className="flex-1" facing="back" />

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
