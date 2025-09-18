import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

export type RecipeCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  rating?: number;
  tag?: string;
  onPress?: (id: string) => void;
};

function RecipeCardComponent({
  id,
  title,
  imageUrl,
  rating,
  tag,
  onPress,
}: RecipeCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      className="flex-1"
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View className="rounded-2xl overflow-hidden bg-white">
        <Image
          source={{ uri: imageUrl }}
          contentFit="cover"
          className="w-full h-48"
          transition={150}
        />
      </View>
      <Text
        className="mt-3 text-xl font-semibold text-gray-900"
        numberOfLines={2}
      >
        {title}
      </Text>
      <View className="mt-2 flex-row items-center gap-2">
        {typeof rating === "number" && (
          <Text className="text-base text-gray-700">{rating.toFixed(1)}</Text>
        )}
        {tag ? <Text className="text-base text-gray-500">• {tag}</Text> : null}
      </View>
    </Pressable>
  );
}

export const RecipeCard = memo(RecipeCardComponent);
