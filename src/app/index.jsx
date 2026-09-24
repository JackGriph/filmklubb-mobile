import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useMoviesContext } from "../context/MoviesContext";
import MovieCard from "../components/MovieCard";
import AddMovieForm from "../components/AddMovieForm";
import { colors } from "../constants/colors";

const GAP = 12;

export default function Index() {
  const { movies, loading, error, addMovie, saveMovie, clearError } = useMoviesContext();
  const [showForm, setShowForm] = useState(false);
  const { width } = useWindowDimensions();

  // Två kolumner: skärmbredden minus kantmarginal på båda sidor och
  // mellanrummet mellan korten, delat på två.
  const cardWidth = (width - GAP * 3) / 2;

  // Stänger formuläret när filmen faktiskt sparats.
  async function handleAdd(data) {
    const created = await addMovie(data);
    if (created) setShowForm(false);
  }

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  const unwatched = movies.filter((movie) => !movie.watched).length;
  const watched = movies.length - unwatched;

  return (
    <FlatList
      style={styles.screen}
      data={movies}
      keyExtractor={(movie) => String(movie.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          style={{ width: cardWidth }}
          onToggle={() => saveMovie(item.id, { ...item, watched: !item.watched, rating: null })}
        />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.stats}>
            {unwatched} att se · {watched} sedda
          </Text>

          {error && (
            <Pressable onPress={clearError}>
              <Text style={styles.error}>{error}</Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.toggle, showForm && styles.toggleOpen]}
            onPress={() => setShowForm(!showForm)}
          >
            <Text style={styles.toggleText}>{showForm ? "Avbryt" : "+ Lägg till film"}</Text>
          </Pressable>

          {showForm && <AddMovieForm onAdd={handleAdd} />}
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>Inga filmer i listan än.</Text>}
    />
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
    padding: GAP,
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
  header: {
    gap: 10,
    marginBottom: 4,
  },
  stats: {
    color: colors.muted,
    fontSize: 14,
  },
  error: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.accent,
    color: colors.text,
  },
  toggle: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  toggleOpen: {
    borderColor: colors.muted,
    backgroundColor: "transparent",
  },
  toggleText: {
    color: colors.text,
    fontWeight: "600",
  },
  empty: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 24,
  },
});
