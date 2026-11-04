import { useState } from 'react'
import {
  loadGoals, saveGoals, addGoal, updateGoal, completeGoal, reopenGoal, deleteGoal,
} from '../utils/goals.js'

// Owns the goals list: state + CRUD + localStorage sync.
export function useGoals() {
  const [goals, setGoals] = useState(loadGoals)
  const [saveFailed, setSaveFailed] = useState(false)

  function commit(change) {
    const next = change(goals)
    setGoals(next)
    setSaveFailed(!saveGoals(next))
  }

  return {
    goals,
    saveFailed,
    add: (fields) => commit((list) => addGoal(list, fields)),
    update: (id, fields) => commit((list) => updateGoal(list, id, fields)),
    complete: (id) => commit((list) => completeGoal(list, id)),
    reopen: (id) => commit((list) => reopenGoal(list, id)),
    remove: (id) => commit((list) => deleteGoal(list, id)),
  }
}
