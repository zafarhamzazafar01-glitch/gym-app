import { useState } from 'react'
import { Save } from 'lucide-react'
import FormField from '../workouts/FormField'
import { validateGoalsForm, goalsFromForm } from '../../utils/weight.js'

const toText = (n) => (n === null ? '' : String(n))

// Starting weight is optional: leave it blank to use your first logged entry.
export default function GoalsForm({ startingKg, targetKg, onSave }) {
  const [form, setForm] = useState({ startingKg: toText(startingKg), targetKg: toText(targetKg) })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const setField = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value })
    setSaved(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const result = validateGoalsForm(form)
    setErrors(result.errors)
    if (!result.isValid) return
    onSave(goalsFromForm(form))
    setSaved(true)
  }

  return (
    <form className="card workout-form" onSubmit={handleSubmit} noValidate>
      <div className="card-head">
        <h2>Goals</h2>
        {saved && <span className="muted" role="status">Saved</span>}
      </div>
      <div className="weight-form-grid">
        <FormField label="Starting weight (kg)" error={errors.startingKg}>
          {(p) => (
            <input {...p} type="number" inputMode="decimal" step="0.1" min="0" value={form.startingKg} onChange={setField('startingKg')} placeholder="Auto: first entry" />
          )}
        </FormField>
        <FormField label="Target weight (kg)" error={errors.targetKg}>
          {(p) => (
            <input {...p} type="number" inputMode="decimal" step="0.1" min="0" value={form.targetKg} onChange={setField('targetKg')} placeholder="75.0" />
          )}
        </FormField>
        <button type="submit" className="btn btn-secondary weight-submit">
          <Save size={16} /> Save Goals
        </button>
      </div>
    </form>
  )
}
