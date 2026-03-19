const rawBase = import.meta.env.VITE_API_BASE || ''
const normalizedBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase

export const apiUrl = (path) => {
  if (!normalizedBase) return path
  return `${normalizedBase}${path}`
}
