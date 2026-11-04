import { useState } from 'react'
import { loadPlans, savePlans, addPlan, updatePlan, deletePlan } from '../utils/planner.js'

// Owns the planned workouts: state + CRUD + localStorage sync.
export function usePlanner() {
  const [plans, setPlans] = useState(loadPlans)
  const [saveFailed, setSaveFailed] = useState(false)

  function commit(change) {
    const next = change(plans)
    setPlans(next)
    setSaveFailed(!savePlans(next))
  }

  return {
    plans,
    saveFailed,
    add: (fields) => commit((list) => addPlan(list, fields)),
    update: (id, fields) => commit((list) => updatePlan(list, id, fields)),
    remove: (id) => commit((list) => deletePlan(list, id)),
  }
}
