import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { BASE_URL } from "../api/client";
import { colors } from "../constants/colors";

export default function MovieCard({ movie, style, onToggle }) {
  return (
    <Link
      href={{ pathname: "/movie/[id]", params: { id: movie.id, title: movie.title } }}
      asChild
    >
      <Pressable style={StyleSheet.flatten([styles.card, style])}>
        <View style={styles.poster}>
          {movie.imageUrl ? (
            <Image source={{ uri: BASE_URL + movie.imageUrl }} style={styles.image} />
          ) : (
            <Text style={styles.posterEmpty}>🎬</Text>
          )}

          <Pressable
            style={[styles.toggle, movie.watched && styles.toggleOn]}
            onPress={onToggle}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={movie.watched ? "Markera som osedd" : "Markera som sedd"}
          >
            <Text style={[styles.toggleText, movie.watched && styles.toggleTextOn]}>✓</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>
          <Text style={styles.meta}>{movie.type}</Text>

          {movie.watched ? (
            <Text style={styles.stars}>{stars(movie.rating)}</Text>
          ) : (
            <Text style={styles.meta}>Inte sedd än</Text>
          )}

          {movie.notes && (
            <Text style={styles.notes} numberOfLines={3}>
              {movie.notes}
            </Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

// Betyg 4 blir ★★★★☆. Sedd utan betyg visas bara som "Sedd".
function stars(rating) {
  if (!rating) return "Sedd";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
  },
  poster: {
    aspectRatio: 2 / 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  posterEmpty: {
    fontSize: 40,
    opacity: 0.4,
  },
  toggle: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  toggleOn: {
    borderColor: colors.text,
    backgroundColor: colors.text,
  },
  toggleText: {
    color: colors.text,
    fontWeight: "700",
  },
  toggleTextOn: {
    color: colors.bg,
  },
  body: {
    padding: 8,
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
  },
  stars: {
    color: colors.text,
    fontSize: 14,
  },
  notes: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
});
