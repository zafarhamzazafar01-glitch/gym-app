import { useState } from 'react'
import { loadWorkouts } from '../utils/workoutStorage.js'
import { loadWeightData } from '../utils/weight.js'

// Read-only view of the workouts and weigh-ins the user has logged.
// It can't change them, so the Progress and Goals pages can't break those pages.
// Read once when the page opens; pages remount on navigation, so it is fresh each visit.
export function useProgressData() {
  const [workouts] = useState(loadWorkouts)
  const [weightData] = useState(loadWeightData)
  return { workouts, weightData }
}
