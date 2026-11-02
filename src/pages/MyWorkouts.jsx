import { useState } from 'react'
import WorkoutForm from '../components/workouts/WorkoutForm'
import WorkoutList from '../components/workouts/WorkoutList'
import { useWorkouts } from '../hooks/useWorkouts'
import { sortWorkouts } from '../utils/workoutOperations.js'
import '../styles/workouts.css'

export default function MyWorkouts() {
  const { workouts, saveFailed, add, update, remove } = useWorkouts()
  const [editingId, setEditingId] = useState(null) // null = creating a new workout

  const editing = workouts.find((w) => w.id === editingId)

  function handleSave(fields) {
    if (editing) {
      update(editing.id, fields)
      setEditingId(null)
    } else {
      add(fields)
    }
  }

  function handleDelete(workout) {
    if (!window.confirm(`Delete "${workout.name}"? This cannot be undone.`)) return
    remove(workout.id)
    if (workout.id === editingId) setEditingId(null)
  }

  function handleEdit(id) {
    setEditingId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="my-workouts">
      {saveFailed && (
        <p className="form-summary" role="alert">
          Your browser blocked saving, so changes may be lost when you refresh.
        </p>
      )}
      {/* key remounts the form when you switch workout, so it starts with the right values */}
      <WorkoutForm
        key={editing ? editing.id : 'new'}
        initial={editing}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
      />
      <WorkoutList
        workouts={sortWorkouts(workouts)}
        editingId={editingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
