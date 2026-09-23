import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchMovie } from "../../api/movies";
import { BASE_URL } from "../../api/client";
import { colors } from "../../constants/colors";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchMovie(id)
      .then((data) => {
        if (!cancelled) setMovie(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {movie.imageUrl ? (
        <Image source={{ uri: BASE_URL + movie.imageUrl }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.posterEmpty]}>
          <Text style={styles.posterEmptyText}>🎬</Text>
        </View>
      )}

      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.meta}>{movie.type}</Text>

      <Text style={styles.status}>
        {movie.watched
          ? `Sedd${movie.rating ? ` · ${movie.rating}/5` : ""}`
          : "Inte sedd än"}
      </Text>

      {movie.notes && <Text style={styles.notes}>{movie.notes}</Text>}

      <Text style={styles.date}>
        Tillagd {new Date(movie.createdAt).toLocaleDateString("sv-SE")}
      </Text>

      {movie.watchedAt && (
        <Text style={styles.date}>
          Sedd {new Date(movie.watchedAt).toLocaleDateString("sv-SE")}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
    gap: 8,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 10,
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  posterEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterEmptyText: {
    fontSize: 64,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
  },
  status: {
    color: colors.text,
    fontSize: 15,
  },
  notes: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
  },
  date: {
    color: colors.muted,
    fontSize: 12,
  },
  error: {
    color: colors.text,
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
  },
});