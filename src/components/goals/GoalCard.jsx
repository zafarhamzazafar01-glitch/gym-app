import { Scale, Dumbbell, Medal, Check, RotateCcw, Pencil, Trash2 } from 'lucide-react'
import { goalTitle, GOAL_TYPE_LABELS } from '../../utils/goals.js'

const ICONS = { weight: Scale, workouts: Dumbbell, strength: Medal }

// completedAt is a full timestamp, so show it in the user's own time zone.
function completedText(completedAt) {
  if (!completedAt) return 'Completed'
  const date = new Date(completedAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  return `Completed ${date}`
}

export default function GoalCard({ goal, progress, isEditing, onComplete, onReopen, onEdit, onDelete }) {
  const Icon = ICONS[goal.type]
  const title = goalTitle(goal)
  // An achieved goal stays at 100% even if your numbers change later.
  const percent = goal.completed ? 100 : progress.percent
  const reached = !goal.completed && percent === 100

  return (
    <li className={`workout-card goal-card ${isEditing ? 'is-editing' : ''} ${goal.completed ? 'is-achieved' : ''}`}>
      <div className="goal-card-head">
        <div className="stat-icon goal-icon">
          <Icon size={20} />
        </div>
        <div className="goal-card-title">
          <h3>{title}</h3>
          <p className="muted">{GOAL_TYPE_LABELS[goal.type]}</p>
        </div>
        <div className="row-actions">
          {goal.completed ? (
            <button type="button" className="btn btn-ghost" onClick={onReopen} aria-label={`Reopen ${title}`}>
              <RotateCcw size={15} /> Reopen
            </button>
          ) : (
            <>
              <button type="button" className="btn btn-ghost" onClick={onComplete} aria-label={`Mark ${title} complete`}>
                <Check size={15} /> Complete
              </button>
              <button type="button" className="btn btn-ghost btn-icon" onClick={onEdit} aria-label={`Edit ${title}`} title="Edit">
                <Pencil size={15} />
              </button>
            </>
          )}
          <button type="button" className="btn btn-ghost btn-icon btn-danger" onClick={onDelete} aria-label={`Delete ${title}`} title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label={`${title} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent === null ? undefined : Math.round(percent)}
      >
        <div className="progress-fill" style={{ width: `${percent ?? 0}%` }} />
      </div>

      <div className="goal-card-foot">
        <span className="muted">
          {goal.completed ? completedText(goal.completedAt) : progress.detail}
        </span>
        <strong>{percent === null ? '—' : `${Math.round(percent)}%`}</strong>
      </div>
      {reached && <p className="goal-reached">Target reached. Mark it complete when you're ready.</p>}
    </li>
  )
}
