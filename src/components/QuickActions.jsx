import { Plus, Scale } from 'lucide-react'

export default function QuickActions({ onNavigate }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Quick Actions</h2>
      </div>
      <div className="quick-actions">
        <button className="secondary-btn" onClick={() => onNavigate('workouts')}>
          <Plus size={16} /> Add Workout
        </button>
        <button className="secondary-btn" onClick={() => onNavigate('weight')}>
          <Scale size={16} /> Update Weight
        </button>
      </div>
    </section>
  )
}
