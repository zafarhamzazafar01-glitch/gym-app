// Everything that touches localStorage lives here.
export const STORAGE_KEY = 'fittrack.workouts.v1'

// Never throws: bad/missing/corrupt data just gives an empty list.
export function loadWorkouts(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Returns true if saved, false if the browser refused (private mode, quota full).
export function saveWorkouts(workouts, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(workouts))
    return true
  } catch {
    return false
  }
}
