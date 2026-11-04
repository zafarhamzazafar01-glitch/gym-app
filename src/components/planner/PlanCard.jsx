import { Pencil, Trash2 } from 'lucide-react'

export default function PlanCard({ plan, isEditing, onEdit, onDelete }) {
  return (
    <li className={`plan-card ${isEditing ? 'is-editing' : ''}`}>
      <div className="plan-card-head">
        <div>
          <h4>{plan.name}</h4>
          <span className={`muscle-tag muscle-${plan.muscle.toLowerCase()}`}>{plan.muscle}</span>
        </div>
        <div className="row-actions">
          <button type="button" className="btn btn-ghost btn-icon" onClick={onEdit} aria-label={`Edit ${plan.name}`} title="Edit">
            <Pencil size={15} />
          </button>
          <button type="button" className="btn btn-ghost btn-icon btn-danger" onClick={onDelete} aria-label={`Delete ${plan.name}`} title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <ul className="exercise-summary">
        {plan.exercises.map((ex) => (
          <li key={ex.id}>
            <span>{ex.name}</span>
            <span className="muted">
              {ex.sets} × {ex.reps}{ex.weightKg > 0 ? ` @ ${ex.weightKg} kg` : ''}
            </span>
          </li>
        ))}
      </ul>
    </li>
  )
}
