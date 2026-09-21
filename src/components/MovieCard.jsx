import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { BASE_URL } from "../api/client";
import { colors } from "../constants/colors";

export default function MovieCard({ movie }) {
  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <Pressable style={styles.card}>
        {movie.imageUrl ? (
          <Image source={{ uri: BASE_URL + movie.imageUrl }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterEmpty]}>
            <Text style={styles.posterEmptyText}>🎬</Text>
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.meta}>{movie.type}</Text>
          <Text style={styles.status}>
            {movie.watched
              ? `Sedd${movie.rating ? ` · ${movie.rating}/5` : ""}`
              : "Inte sedd än"}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
  },
  poster: {
    width: 64,
    height: 96,
    borderRadius: 6,
    backgroundColor: colors.bg,
  },
  posterEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterEmptyText: {
    fontSize: 28,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
  },
  status: {
    color: colors.muted,
    fontSize: 13,
  },
});