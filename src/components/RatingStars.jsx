import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function RatingStars({ value, onChange }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => onChange(star)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Sätt betyg ${star} av 5`}
        >
          <Text style={[styles.star, star <= value && styles.starOn]}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stars: {
    flexDirection: "row",
    gap: 6,
  },
  star: {
    fontSize: 34,
    color: colors.border,
  },
  starOn: {
    color: colors.text,
  },
});
