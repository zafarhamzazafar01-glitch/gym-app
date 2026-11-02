import { Clock, ListChecks } from 'lucide-react'
import SampleBadge from './SampleBadge'
import { SAMPLE_RECENT_WORKOUTS } from '../data/sampleData'

export default function RecentWorkouts() {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Recent Workouts</h2>
        <SampleBadge />
      </div>
      <ul className="workout-list">
        {SAMPLE_RECENT_WORKOUTS.map((w) => (
          <li key={w.id} className="workout-row">
            <div>
              <p className="workout-name">{w.name}</p>
              <p className="muted">{w.date}</p>
            </div>
            <div className="workout-meta">
              <span><Clock size={14} /> {w.duration} min</span>
              <span><ListChecks size={14} /> {w.exercises} exercises</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
