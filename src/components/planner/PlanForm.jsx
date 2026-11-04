import { useState } from 'react'
import { Plus, Save, X } from 'lucide-react'
import FormField from '../workouts/FormField'
import ExerciseFields from '../workouts/ExerciseFields'
import {
  DAYS, MUSCLE_GROUPS, emptyPlanForm, emptyPlanExercise, planToForm, formToPlanFields, validatePlanForm,
} from '../../utils/planner.js'

const NO_ERRORS = { exerciseErrors: {} }

// Used for both "new" and "edit": pass `initial` (a saved plan) to edit,
// or `defaultDay` to pre-select a day for a new one. The parent changes `key`
// to reset the form.
export default function PlanForm({ initial, defaultDay, onSave, onCancel }) {
  const isEditing = Boolean(initial)
  const [form, setForm] = useState(() => (initial ? planToForm(initial) : emptyPlanForm(defaultDay)))
  const [errors, setErrors] = useState(NO_ERRORS)
  const [submitted, setSubmitted] = useState(false)

  function updateForm(next) {
    setForm(next)
    if (submitted) setErrors(validatePlanForm(next).errors)
  }

  const setField = (key) => (e) => updateForm({ ...form, [key]: e.target.value })
  const changeExercise = (updated) =>
    updateForm({ ...form, exercises: form.exercises.map((ex) => (ex.id === updated.id ? updated : ex)) })
  const addExercise = () => updateForm({ ...form, exercises: [...form.exercises, emptyPlanExercise()] })
  const removeExercise = (id) =>
    updateForm({ ...form, exercises: form.exercises.filter((ex) => ex.id !== id) })

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const result = validatePlanForm(form)
    setErrors(result.errors)
    if (!result.isValid) return
    onSave(formToPlanFields(form))
    if (!isEditing) {
      setForm(emptyPlanForm(form.day))
      setSubmitted(false)
      setErrors(NO_ERRORS)
    }
  }

  const hasErrors =
    ['name', 'day', 'muscle', 'exercises'].some((k) => errors[k]) ||
    Object.keys(errors.exerciseErrors).length > 0

  return (
    <form className="card workout-form" onSubmit={handleSubmit} noValidate>
      <div className="card-head">
        <h2>{isEditing ? 'Edit Planned Workout' : 'Plan a Workout'}</h2>
        {isEditing && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      {submitted && hasErrors && (
        <p className="form-summary" role="alert">
          Please fix the highlighted fields below, then save again.
        </p>
      )}

      <div className="plan-form-grid">
        <FormField label="Workout name" error={errors.name}>
          {(p) => <input {...p} type="text" value={form.name} onChange={setField('name')} placeholder="Push Day" />}
        </FormField>
        <FormField label="Day" error={errors.day}>
          {(p) => (
            <select {...p} value={form.day} onChange={setField('day')}>
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </select>
          )}
        </FormField>
        <FormField label="Target muscle group" error={errors.muscle}>
          {(p) => (
            <select {...p} value={form.muscle} onChange={setField('muscle')}>
              {MUSCLE_GROUPS.map((m) => <option key={m}>{m}</option>)}
            </select>
          )}
        </FormField>
      </div>

      <h3 className="form-subhead">Exercises</h3>
      {errors.exercises && <p className="field-error" role="alert">{errors.exercises}</p>}
      {form.exercises.map((ex, i) => (
        <ExerciseFields
          key={ex.id}
          exercise={ex}
          index={i}
          errors={errors.exerciseErrors[ex.id]}
          canRemove={form.exercises.length > 1}
          onChange={changeExercise}
          onRemove={() => removeExercise(ex.id)}
        />
      ))}
      <button type="button" className="btn btn-secondary" onClick={addExercise}>
        <Plus size={16} /> Add exercise
      </button>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          <Save size={16} /> {isEditing ? 'Save Changes' : 'Add to Planner'}
        </button>
      </div>
    </form>
  )
}
