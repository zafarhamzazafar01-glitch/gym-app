import { useState } from 'react'
import GoalForm from '../components/goals/GoalForm'
import GoalSection from '../components/goals/GoalSection'
import { useGoals } from '../hooks/useGoals'
import { useProgressData } from '../hooks/useProgressData'
import { buildProgress } from '../utils/progress.js'
import { baselineFor, goalTitle, splitGoals } from '../utils/goals.js'
import { todayISO } from '../utils/workoutModel.js'
import '../styles/dashboard.css' // progress bar + stat icon
import '../styles/workouts.css' // shared form, card and button styles
import '../styles/goals.css'

export default function MyGoals() {
  const { goals, saveFailed, add, update, complete, reopen, remove } = useGoals()
  const { workouts, weightData } = useProgressData()
  const [editingId, setEditingId] = useState(null) // null = adding a new goal

  const progress = buildProgress(workouts, weightData, todayISO())
  const context = { weightData, thisWeek: progress.thisWeek, records: progress.records }
  const { pending, achieved } = splitGoals(goals)
  const editing = goals.find((g) => g.id === editingId)

  function handleSave(fields) {
    if (editing) {
      update(editing.id, fields)
      setEditingId(null)
    } else {
      // A new weight goal remembers your weight at the time, as its starting line.
      add({ ...fields, baselineKg: baselineFor(fields.type, weightData) })
    }
  }

  function handleDelete(goal) {
    if (!window.confirm(`Delete the goal "${goalTitle(goal)}"?`)) return
    remove(goal.id)
    if (goal.id === editingId) setEditingId(null)
  }

  function handleEdit(id) {
    setEditingId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const actions = { complete, reopen, edit: handleEdit, remove: handleDelete }

  return (
    <div className="goals-page">
      {saveFailed && (
        <p className="form-summary" role="alert">
          Your browser blocked saving, so changes may be lost when you refresh.
        </p>
      )}
      {/* key remounts the form when you switch goal, so it starts with the right values */}
      <GoalForm
        key={editing ? editing.id : 'new'}
        initial={editing}
        exerciseNames={progress.records.map((r) => r.name)}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
      />
      <GoalSection
        title="Pending goals"
        goals={pending}
        emptyText={goals.length === 0 ? 'No goals yet. Set your first one above.' : 'No pending goals. Set a new one above.'}
        context={context}
        editingId={editingId}
        actions={actions}
      />
      <GoalSection
        title="Achieved goals"
        goals={achieved}
        emptyText="Goals you complete will show up here."
        context={context}
        editingId={editingId}
        actions={actions}
      />
    </div>
  )
}
