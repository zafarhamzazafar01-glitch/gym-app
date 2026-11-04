import { useState } from 'react'
import PlanForm from '../components/planner/PlanForm'
import WeekSchedule from '../components/planner/WeekSchedule'
import { usePlanner } from '../hooks/usePlanner'
import '../styles/workouts.css' // shared form + button styles
import '../styles/planner.css'

export default function WorkoutPlanner() {
  const { plans, saveFailed, add, update, remove } = usePlanner()
  const [editingId, setEditingId] = useState(null) // null = planning a new workout
  const [defaultDay, setDefaultDay] = useState(undefined)

  const editing = plans.find((p) => p.id === editingId)

  function handleSave(fields) {
    if (editing) {
      update(editing.id, fields)
      setEditingId(null)
    } else {
      add(fields)
    }
  }

  function handleDelete(plan) {
    if (!window.confirm(`Delete "${plan.name}" from ${plan.day}?`)) return
    remove(plan.id)
    if (plan.id === editingId) setEditingId(null)
  }

  function handleEdit(id) {
    setEditingId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleAddToDay(day) {
    setEditingId(null)
    setDefaultDay(day)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="planner">
      {saveFailed && (
        <p className="form-summary" role="alert">
          Your browser blocked saving, so changes may be lost when you refresh.
        </p>
      )}
      {/* key remounts the form when you switch workout or day, so it starts with the right values */}
      <PlanForm
        key={editing ? editing.id : `new-${defaultDay}`}
        initial={editing}
        defaultDay={defaultDay}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
      />
      <WeekSchedule
        plans={plans}
        editingId={editingId}
        onAddToDay={handleAddToDay}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
