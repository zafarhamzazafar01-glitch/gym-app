import { useState } from 'react'
import {
  loadWeightData, saveWeightData, addEntry, updateEntry, deleteEntry,
} from '../utils/weight.js'

// Owns the weight data: state + CRUD + localStorage sync.
export function useWeight() {
  const [data, setData] = useState(loadWeightData)
  const [saveFailed, setSaveFailed] = useState(false)

  function commit(change) {
    const next = change(data)
    setData(next)
    setSaveFailed(!saveWeightData(next))
  }

  return {
    data,
    saveFailed,
    add: (fields) => commit((d) => ({ ...d, entries: addEntry(d.entries, fields) })),
    update: (id, fields) => commit((d) => ({ ...d, entries: updateEntry(d.entries, id, fields) })),
    remove: (id) => commit((d) => ({ ...d, entries: deleteEntry(d.entries, id) })),
    setGoals: (goals) => commit((d) => ({ ...d, ...goals })),
  }
}
