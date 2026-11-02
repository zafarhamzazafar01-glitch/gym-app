// Pure CRUD functions: take the current list, return a NEW list.
// Never mutate the old array - React needs a new array to notice a change.
import { newId } from './workoutModel.js'

export function addWorkout(workouts, fields, now = new Date().toISOString()) {
  const workout = { id: newId(), ...fields, createdAt: now, updatedAt: now }
  return [workout, ...workouts]
}

export function updateWorkout(workouts, id, fields, now = new Date().toISOString()) {
  return workouts.map((w) => (w.id === id ? { ...w, ...fields, updatedAt: now } : w))
}

export function deleteWorkout(workouts, id) {
  return workouts.filter((w) => w.id !== id)
}

// Newest workout date first; ties broken by when it was created.
export function sortWorkouts(workouts) {
  return [...workouts].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  )
}
