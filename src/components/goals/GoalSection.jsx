import GoalCard from './GoalCard'
import { goalProgress } from '../../utils/goals.js'

// One titled list of goals (Pending or Achieved).
export default function GoalSection({ title, goals, emptyText, context, editingId, actions }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2>{title}</h2>
        <span className="muted">{goals.length}</span>
      </div>
      {goals.length === 0 ? (
        <p className="muted empty-state">{emptyText}</p>
      ) : (
        <ul className="workout-history">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              progress={goalProgress(goal, context)}
              isEditing={goal.id === editingId}
              onComplete={() => actions.complete(goal.id)}
              onReopen={() => actions.reopen(goal.id)}
              onEdit={() => actions.edit(goal.id)}
              onDelete={() => actions.remove(goal)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
