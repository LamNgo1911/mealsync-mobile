import { Image } from "expo-image";
import { Text, View } from "react-native";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../assets/images/logo.png";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <View className="pt-14 pb-6 px-6 bg-white">
      <View className="relative items-center justify-center">
        {/* Centered Title */}
        <Text className="text-2xl font-semibold text-neutral-900 text-center">
          {title}
        </Text>

        {/* Left Logo */}
        <View className="absolute left-0 flex-row items-center">
          <Image
            source={appIcon}
            style={{ width: 32, height: 32, borderRadius: 16 }}
            contentFit="cover"
            accessibilityLabel="App logo"
          />
        </View>

        {/* Right Settings */}
        <View className="absolute right-0 flex-row items-center">
          <View className="w-6 h-6 rounded-full bg-neutral-100 items-center justify-center">
            <Text className="text-base">⚙️</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
