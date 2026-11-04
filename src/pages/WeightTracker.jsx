import { useState } from 'react'
import WeightStats from '../components/weight/WeightStats'
import WeightForm from '../components/weight/WeightForm'
import GoalsForm from '../components/weight/GoalsForm'
import WeightLineChart from '../components/weight/WeightLineChart'
import WeightHistory from '../components/weight/WeightHistory'
import { useWeight } from '../hooks/useWeight'
import '../styles/dashboard.css' // stat cards + chart box
import '../styles/workouts.css' // shared form + button styles
import '../styles/weight.css'

export default function WeightTracker() {
  const { data, saveFailed, add, update, remove, setGoals } = useWeight()
  const [editingId, setEditingId] = useState(null) // null = adding a new weigh-in

  const editing = data.entries.find((e) => e.id === editingId)

  function handleSave(fields) {
    if (editing) {
      update(editing.id, fields)
      setEditingId(null)
    } else {
      add(fields)
    }
  }

  function handleDelete(entry) {
    if (!window.confirm(`Delete the ${entry.weightKg} kg weigh-in from ${entry.date}?`)) return
    remove(entry.id)
    if (entry.id === editingId) setEditingId(null)
  }

  function handleEdit(id) {
    setEditingId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="weight-tracker">
      {saveFailed && (
        <p className="form-summary" role="alert">
          Your browser blocked saving, so changes may be lost when you refresh.
        </p>
      )}
      <WeightStats data={data} />
      {/* key remounts the form when you switch entry, so it starts with the right values */}
      <WeightForm
        key={editing ? editing.id : 'new'}
        initial={editing}
        entries={data.entries}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
      />
      <WeightLineChart entries={data.entries} targetKg={data.targetKg} />
      <WeightHistory
        entries={data.entries}
        editingId={editingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <GoalsForm
        key={`${data.startingKg}-${data.targetKg}`}
        startingKg={data.startingKg}
        targetKg={data.targetKg}
        onSave={setGoals}
      />
    </div>
  )
}
