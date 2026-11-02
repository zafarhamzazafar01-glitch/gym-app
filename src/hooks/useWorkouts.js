import { useState } from 'react'
import { loadWorkouts, saveWorkouts } from '../utils/workoutStorage.js'
import { addWorkout, updateWorkout, deleteWorkout } from '../utils/workoutOperations.js'

// Owns the workout list: state + CRUD + localStorage sync.
export function useWorkouts() {
  // Lazy initialiser: reads localStorage once, on first render only.
  const [workouts, setWorkouts] = useState(loadWorkouts)
  const [saveFailed, setSaveFailed] = useState(false)

  // Every change goes through here: compute the new list, store it in
  // React state (re-renders the screen) and in localStorage (survives refresh).
  function commit(change) {
    const next = change(workouts)
    setWorkouts(next)
    setSaveFailed(!saveWorkouts(next))
  }

  return {
    workouts,
    saveFailed,
    add: (fields) => commit((list) => addWorkout(list, fields)),
    update: (id, fields) => commit((list) => updateWorkout(list, id, fields)),
    remove: (id) => commit((list) => deleteWorkout(list, id)),
  }
}
