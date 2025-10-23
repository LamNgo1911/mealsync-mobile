import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useInAppPurchase = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscription = async (planName: string) => {
    setLoading(true);
    console.log(`MOCK IAP: Starting purchase flow for ${planName}...`);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const success = true; // Change to false to test error cases
        if (success) {
          console.log("MOCK IAP: Purchase successful!");
          Alert.alert(
            "Subscription successful! (Mock)",
            "You are now subscribed.",
            [{ text: "OK", onPress: () => router.replace("/(tabs)/home") }]
          );
        } else {
          console.log("MOCK IAP: Purchase failed!");
          Alert.alert(
            "Purchase Error (Mock)",
            "Something went wrong. Please try again."
          );
        }
        setLoading(false);
        resolve();
      }, 2000); // Simulate network delay
    });
  };

  return { loading, handleSubscription };
};
