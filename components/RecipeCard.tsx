import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

export type RecipeCardProps = {
  id: string;
  title: string;
  image: any;
  rating?: number;
  tag?: string;
  onPress?: (id: string) => void;
};

function RecipeCardComponent({
  id,
  title,
  image,
  rating,
  tag,
  onPress,
}: RecipeCardProps) {
  const source = typeof image === "string" ? { uri: image } : image;
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      className="flex-1"
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View
        style={{
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <Image
          source={source}
          contentFit="cover"
          style={{ width: "100%", height: 192 }}
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
