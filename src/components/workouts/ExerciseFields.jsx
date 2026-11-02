import { Trash2 } from 'lucide-react'
import FormField from './FormField'

// One exercise row inside the form.
export default function ExerciseFields({ exercise, index, errors = {}, canRemove, onChange, onRemove }) {
  function field(key) {
    return (e) => onChange({ ...exercise, [key]: e.target.value })
  }

  return (
    <fieldset className="exercise-row">
      <legend>Exercise {index + 1}</legend>

      <FormField label="Exercise name" error={errors.name} className="ex-name">
        {(p) => <input {...p} type="text" value={exercise.name} onChange={field('name')} placeholder="Bench Press" />}
      </FormField>
      <FormField label="Sets" error={errors.sets}>
        {(p) => <input {...p} type="number" inputMode="numeric" min="1" step="1" value={exercise.sets} onChange={field('sets')} />}
      </FormField>
      <FormField label="Reps per set" error={errors.reps}>
        {(p) => <input {...p} type="number" inputMode="numeric" min="1" step="1" value={exercise.reps} onChange={field('reps')} />}
      </FormField>
      <FormField label="Weight (kg)" error={errors.weightKg}>
        {(p) => <input {...p} type="number" inputMode="decimal" min="0" step="0.5" value={exercise.weightKg} onChange={field('weightKg')} />}
      </FormField>

      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label={`Remove exercise ${index + 1}`}
        title={canRemove ? 'Remove exercise' : 'A workout needs at least one exercise'}
      >
        <Trash2 size={16} />
      </button>
    </fieldset>
  )
}
