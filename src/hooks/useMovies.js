import { useCallback, useEffect, useState } from 'react'
import {
  createMovie,
  fetchMovies,
  updateMovie as apiUpdateMovie,
  uploadMovieImage,
} from '../api/movies'

export function useMovies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Hämtning vid mount. setState sker i callbacks i stället för synkront
  // i effektens body, vilket är vad react-hooks-regeln kräver.
  // cancelled hindrar att ett svar som landar efter unmount sätter state.
  useEffect(() => {
    let cancelled = false

    fetchMovies()
      .then((data) => {
        if (!cancelled) setMovies(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Anropas från en händelsehanterare ("Försök igen")
  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setMovies(await fetchMovies())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Byter ut en film mot serverns uppdaterade version.
  const replaceMovie = (updated) => {
    setMovies((current) => current.map((m) => (m.id === updated.id ? updated : m)))
  }

  // Alla muteringar följer samma mönster: nolla felet, kör anropet,
  // uppdatera listan. Fel fångas till bannern i stället för att kastas
  // vidare, så komponenterna slipper egna try/catch.
  const runMutation = async (action, onSuccess) => {
    setError(null)

    try {
      const result = await action()
      onSuccess(result)
      return result
    } catch (err) {
      setError(err.message)
      return null
    }
  }

  const addMovie = (data) =>
    runMutation(
      () => createMovie(data),
      (created) => setMovies((current) => [created, ...current]),
    )

  const saveMovie = (id, data) =>
    runMutation(() => apiUpdateMovie(id, data), replaceMovie)

  const uploadImage = (id, file) =>
    runMutation(() => uploadMovieImage(id, file), replaceMovie)

  return {
    movies,
    loading,
    error,
    reload,
    addMovie,
    saveMovie,
    uploadImage,
    clearError: () => setError(null),
  }
}