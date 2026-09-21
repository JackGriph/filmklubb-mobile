export const BASE_URL = 'http://10.0.60.125:5071'

export class ApiError extends Error {
  constructor(message, status, fieldErrors = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// Bygger ett ApiError ur ASP.NETs ProblemDetails-svar.
async function readError(response) {
  let body = null

  try {
    body = await response.json()
  } catch {
    // Tom eller icke-JSON body - då får statuskoden räcka.
  }

  if (body?.errors) {
    const messages = Object.values(body.errors).flat()
    return new ApiError(messages.join(' '), response.status, body.errors)
  }

  return new ApiError(
    body?.title ?? `Något gick fel (HTTP ${response.status}).`,
    response.status,
  )
}

async function request(path, { method = 'GET', body } = {}) {
  const isFormData = body instanceof FormData
  const headers = {}
  let payload

  if (isFormData) {
    // Content-Type sätts medvetet inte - webbläsaren måste lägga till
    // sin egen boundary-parameter, annars kan servern inte parsa filen.
    payload = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let response

  try {
    response = await fetch(`${BASE_URL}${path}`, { method, headers, body: payload })
  } catch {
    // fetch rejectar bara när servern inte svarar alls.
    throw new ApiError('Kunde inte nå servern. Kontrollera att backend är igång.', 0)
  }

  if (!response.ok) {
    throw await readError(response)
  }

  // 204 har tom body - response.json() skulle kasta här.
  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const getJson = (path) => request(path)
export const postJson = (path, body) => request(path, { method: 'POST', body })
export const putJson = (path, body) => request(path, { method: 'PUT', body })
export const del = (path) => request(path, { method: 'DELETE' })
export const postFormData = (path, formData) => request(path, { method: 'POST', body: formData })