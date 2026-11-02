import WorkoutCard from './WorkoutCard'

export default function WorkoutList({ workouts, editingId, onEdit, onDelete }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Workout History</h2>
        <span className="muted">{workouts.length} saved</span>
      </div>

      {workouts.length === 0 ? (
        <p className="muted empty-state">No workouts yet. Fill in the form and press Save Workout.</p>
      ) : (
        <ul className="workout-history">
          {workouts.map((w) => (
            <WorkoutCard
              key={w.id}
              workout={w}
              isEditing={w.id === editingId}
              onEdit={() => onEdit(w.id)}
              onDelete={() => onDelete(w)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
