import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { useMoviesContext } from "../../context/MoviesContext";
import RatingStars from "../../components/RatingStars";
import { BASE_URL } from "../../api/client";
import { colors } from "../../constants/colors";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const { movies, loading, error, saveMovie, uploadImage } = useMoviesContext();

  // id från adressen är en sträng, filmens id är ett tal.
  const movie = movies.find((m) => String(m.id) === id);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.error}>{error ?? "Filmen hittades inte."}</Text>
      </View>
    );
  }

  // PUT ersätter hela filmen, så hela objektet skickas med ändringen ovanpå.
  function update(changes) {
    saveMovie(movie.id, { ...movie, ...changes });
  }

  async function pickPoster() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) return;

    uploadImage(movie.id, new File(result.assets[0].uri));
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

      <Pressable style={styles.pickButton} onPress={pickPoster}>
        <Text style={styles.pickButtonText}>
          {movie.imageUrl ? "Byt affisch" : "Välj affisch"}
        </Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.toggle, movie.watched && styles.toggleOn]}
        onPress={() => update({ watched: !movie.watched, rating: null })}
        accessibilityRole="button"
      >
        <Text style={[styles.toggleText, movie.watched && styles.toggleTextOn]}>
          {movie.watched ? "✓ Sedd" : "Markera som sedd"}
        </Text>
      </Pressable>

      {movie.watched && (
        <View style={styles.rating}>
          <Text style={styles.label}>Ditt betyg</Text>
          <RatingStars value={movie.rating} onChange={(rating) => update({ rating })} />
        </View>
      )}

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
    pickButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 6,
  },
  pickButtonText: {
    color: colors.text,
    fontSize: 14,
  },
  toggle: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 6,
  },
  toggleOn: {
    borderColor: colors.text,
    backgroundColor: colors.text,
  },
  toggleText: {
    color: colors.text,
    fontWeight: "600",
  },
  toggleTextOn: {
    color: colors.bg,
  },
  rating: {
    gap: 4,
    marginTop: 8,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
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
