import { createContext, useContext } from "react";
import { useMovies } from "../hooks/useMovies";

// Listskärmen och detaljvyn delar samma filmlista. Ändras en film i
// detaljvyn syns det direkt i listan, utan att något behöver hämtas om.
const MoviesContext = createContext(null);

export function MoviesProvider({ children }) {
  const movies = useMovies();
  return <MoviesContext.Provider value={movies}>{children}</MoviesContext.Provider>;
}

export function useMoviesContext() {
  return useContext(MoviesContext);
}
