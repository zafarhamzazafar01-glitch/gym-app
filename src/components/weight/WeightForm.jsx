import { useState } from 'react'
import { Save, X } from 'lucide-react'
import FormField from '../workouts/FormField'
import { todayISO } from '../../utils/workoutModel.js'
import { validateEntryForm } from '../../utils/weight.js'

// Used for both "add" and "edit": pass `initial` (a saved entry) to edit.
// The parent changes `key` to reset the form.
export default function WeightForm({ initial, entries, onSave, onCancel }) {
  const isEditing = Boolean(initial)
  const [form, setForm] = useState(() => ({
    date: initial ? initial.date : todayISO(),
    weight: initial ? String(initial.weightKg) : '',
  }))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function updateForm(next) {
    setForm(next)
    if (submitted) setErrors(validateEntryForm(next, entries, todayISO(), initial?.id).errors)
  }

  const setField = (key) => (e) => updateForm({ ...form, [key]: e.target.value })

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const result = validateEntryForm(form, entries, todayISO(), initial?.id)
    setErrors(result.errors)
    if (!result.isValid) return
    onSave({ date: form.date, weightKg: Number(form.weight) })
    if (!isEditing) {
      setForm({ date: todayISO(), weight: '' })
      setSubmitted(false)
      setErrors({})
    }
  }

  return (
    <form className="card workout-form" onSubmit={handleSubmit} noValidate>
      <div className="card-head">
        <h2>{isEditing ? 'Edit Weigh-in' : 'Add Weight'}</h2>
        {isEditing && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      <div className="weight-form-grid">
        <FormField label="Date" error={errors.date}>
          {(p) => <input {...p} type="date" max={todayISO()} value={form.date} onChange={setField('date')} />}
        </FormField>
        <FormField label="Weight (kg)" error={errors.weight}>
          {(p) => (
            <input {...p} type="number" inputMode="decimal" step="0.1" min="0" value={form.weight} onChange={setField('weight')} placeholder="80.0" />
          )}
        </FormField>
        <button type="submit" className="btn btn-primary weight-submit">
          <Save size={16} /> {isEditing ? 'Save Changes' : 'Add Weight'}
        </button>
      </div>
    </form>
  )
}
