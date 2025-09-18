import { Image } from "expo-image";
import { Text, View } from "react-native";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../assets/images/logo.png";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <View className="pt-14 pb-6 px-6">
      <View
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Centered Title */}
        <Text className="text-2xl font-semibold text-gray-900 text-center">
          {title}
        </Text>
        {/* Left Logo */}
        <View
          style={{
            position: "absolute",
            left: 0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={appIcon}
            style={{ width: 28, height: 28, borderRadius: 6 }}
            contentFit="cover"
            accessibilityLabel="App logo"
          />
        </View>
        {/* Right Settings */}
        <View
          style={{
            position: "absolute",
            right: 0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center">
            <Text className="text-base">⚙️</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
