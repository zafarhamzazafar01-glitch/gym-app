import { Pencil, Trash2 } from 'lucide-react'

function formatDate(iso) {
  // Parse as local noon so the date never shifts a day due to timezones.
  return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function WorkoutCard({ workout, isEditing, onEdit, onDelete }) {
  return (
    <li className={`workout-card ${isEditing ? 'is-editing' : ''}`}>
      <div className="workout-card-head">
        <div>
          <h3>{workout.name}</h3>
          <p className="muted">{formatDate(workout.date)}</p>
        </div>
        <div className="row-actions">
          <button className="btn btn-ghost btn-icon" onClick={onEdit} aria-label={`Edit ${workout.name}`}>
            <Pencil size={16} />
          </button>
          <button className="btn btn-ghost btn-icon btn-danger" onClick={onDelete} aria-label={`Delete ${workout.name}`}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <ul className="exercise-summary">
        {workout.exercises.map((e) => (
          <li key={e.id}>
            <span>{e.name}</span>
            <span className="muted">{e.sets} × {e.reps} @ {e.weightKg} kg</span>
          </li>
        ))}
      </ul>

      {workout.notes && <p className="workout-notes">{workout.notes}</p>}
    </li>
  )
}
