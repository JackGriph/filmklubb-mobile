import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useMovies } from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";
import { colors } from "../constants/colors";

export default function Index() {
  const { movies, loading, error } = useMovies();

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={movies}
        keyExtractor={(movie) => String(movie.id)}
        renderItem={({ item }) => <MovieCard movie={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Inga filmer i listan än.</Text>}
      />
    </View>
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
  list: {
    padding: 12,
    gap: 12,
  },
  error: {
    backgroundColor: colors.accent,
    color: colors.text,
    padding: 12,
  },
  empty: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 24,
  },
});