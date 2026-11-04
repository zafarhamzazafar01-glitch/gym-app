import { useState } from 'react'
import { Plus, Save, X } from 'lucide-react'
import FormField from '../workouts/FormField'
import {
  GOAL_TYPES, GOAL_TYPE_LABELS, emptyGoalForm, goalToForm, validateGoalForm, goalFromForm,
} from '../../utils/goals.js'

const TARGET_LABEL = {
  weight: 'Target weight (kg)',
  workouts: 'Workouts per week',
  strength: 'Target weight (kg)',
}

const TARGET_PLACEHOLDER = { weight: '75.0', workouts: '4', strength: '100' }

// Used for both "add" and "edit": pass `initial` (a saved goal) to edit.
// The parent changes `key` to reset the form. The goal type can't change while editing.
export default function GoalForm({ initial, exerciseNames, onSave, onCancel }) {
  const isEditing = Boolean(initial)
  const [form, setForm] = useState(() => (initial ? goalToForm(initial) : emptyGoalForm()))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function updateForm(next) {
    setForm(next)
    if (submitted) setErrors(validateGoalForm(next).errors)
  }

  const setField = (key) => (e) => updateForm({ ...form, [key]: e.target.value })

  // A different type means a different kind of target, so start the target afresh.
  const setType = (e) => updateForm({ ...emptyGoalForm(e.target.value) })

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const result = validateGoalForm(form)
    setErrors(result.errors)
    if (!result.isValid) return
    onSave(goalFromForm(form))
    if (!isEditing) {
      setForm(emptyGoalForm(form.type))
      setSubmitted(false)
      setErrors({})
    }
  }

  return (
    <form className="card workout-form" onSubmit={handleSubmit} noValidate>
      <div className="card-head">
        <h2>{isEditing ? 'Edit Goal' : 'Set a Goal'}</h2>
        {isEditing && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      <div className="goal-form-grid">
        <FormField label="Goal type" error={errors.type}>
          {(p) => (
            <select {...p} value={form.type} onChange={setType} disabled={isEditing}>
              {GOAL_TYPES.map((t) => (
                <option key={t} value={t}>{GOAL_TYPE_LABELS[t]}</option>
              ))}
            </select>
          )}
        </FormField>

        {form.type === 'strength' && (
          <FormField label="Exercise" error={errors.exercise}>
            {(p) => (
              <>
                <input {...p} type="text" list="goal-exercises" maxLength={60} value={form.exercise} onChange={setField('exercise')} placeholder="Bench Press" />
                <datalist id="goal-exercises">
                  {exerciseNames.map((n) => <option key={n} value={n} />)}
                </datalist>
              </>
            )}
          </FormField>
        )}

        <FormField label={TARGET_LABEL[form.type]} error={errors.target}>
          {(p) => (
            <input
              {...p}
              type="number"
              inputMode={form.type === 'workouts' ? 'numeric' : 'decimal'}
              step={form.type === 'workouts' ? '1' : '0.1'}
              min="0"
              value={form.target}
              onChange={setField('target')}
              placeholder={TARGET_PLACEHOLDER[form.type]}
            />
          )}
        </FormField>

        <button type="submit" className="btn btn-primary goal-submit">
          {isEditing ? <Save size={16} /> : <Plus size={16} />} {isEditing ? 'Save Changes' : 'Add Goal'}
        </button>
      </div>
    </form>
  )
}
