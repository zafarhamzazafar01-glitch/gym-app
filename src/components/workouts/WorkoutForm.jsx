import { useState } from 'react'
import { Plus, Save, X } from 'lucide-react'
import FormField from './FormField'
import ExerciseFields from './ExerciseFields'
import { emptyForm, emptyExercise, workoutToForm, formToWorkoutFields } from '../../utils/workoutModel.js'
import { validateWorkoutForm } from '../../utils/workoutValidation.js'

const NO_ERRORS = { exerciseErrors: {} }

// Used for both "new" and "edit": pass `initial` (a saved workout) to edit.
// The parent gives it a changing `key`, so switching workouts resets the form.
export default function WorkoutForm({ initial, onSave, onCancel }) {
  const isEditing = Boolean(initial)
  const [form, setForm] = useState(() => (initial ? workoutToForm(initial) : emptyForm()))
  const [errors, setErrors] = useState(NO_ERRORS)
  const [submitted, setSubmitted] = useState(false)

  // Update the form, and (once the user has tried to save) re-validate live
  // so error messages disappear as soon as the problem is fixed.
  function updateForm(next) {
    setForm(next)
    if (submitted) setErrors(validateWorkoutForm(next).errors)
  }

  const setField = (key) => (e) => updateForm({ ...form, [key]: e.target.value })

  const changeExercise = (updated) =>
    updateForm({ ...form, exercises: form.exercises.map((ex) => (ex.id === updated.id ? updated : ex)) })
  const addExercise = () => updateForm({ ...form, exercises: [...form.exercises, emptyExercise()] })
  const removeExercise = (id) =>
    updateForm({ ...form, exercises: form.exercises.filter((ex) => ex.id !== id) })

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const result = validateWorkoutForm(form)
    setErrors(result.errors)
    if (!result.isValid) return
    onSave(formToWorkoutFields(form))
    if (!isEditing) {
      setForm(emptyForm())
      setSubmitted(false)
      setErrors(NO_ERRORS)
    }
  }

  const hasErrors =
    ['date', 'name', 'exercises', 'notes'].some((k) => errors[k]) ||
    Object.keys(errors.exerciseErrors).length > 0

  return (
    <form className="card workout-form" onSubmit={handleSubmit} noValidate>
      <div className="card-head">
        <h2>{isEditing ? 'Edit Workout' : 'New Workout'}</h2>
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

      <div className="form-grid">
        <FormField label="Date" error={errors.date}>
          {(p) => <input {...p} type="date" value={form.date} onChange={setField('date')} />}
        </FormField>
        <FormField label="Workout name" error={errors.name}>
          {(p) => <input {...p} type="text" value={form.name} onChange={setField('name')} placeholder="Push Day" />}
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

      <FormField label="Notes (optional)" error={errors.notes}>
        {(p) => <textarea {...p} rows={3} value={form.notes} onChange={setField('notes')} placeholder="How did it feel?" />}
      </FormField>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          <Save size={16} /> {isEditing ? 'Save Changes' : 'Save Workout'}
        </button>
      </div>
    </form>
  )
}
