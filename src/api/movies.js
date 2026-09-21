import { getJson, postJson, putJson, del, postFormData } from './client'

const BASE = '/api/movies'

export const fetchMovies = () => getJson(BASE)

export const fetchMovie = (id) => getJson(`${BASE}/${id}`)

export const createMovie = (movie) => postJson(BASE, movie)

export const updateMovie = (id, movie) => putJson(`${BASE}/${id}`, movie)

export const deleteMovie = (id) => del(`${BASE}/${id}`)

export function uploadMovieImage(id, file) {
  const formData = new FormData()
  // Nyckeln måste heta "file" - den matchar parameternamnet
  // i UploadImage(int id, IFormFile file) på serversidan.
  formData.append('file', file)

  return postFormData(`${BASE}/${id}/image`, formData)
}