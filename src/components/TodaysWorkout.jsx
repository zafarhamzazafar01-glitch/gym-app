import { Play, Timer } from 'lucide-react'
import SampleBadge from './SampleBadge'
import { SAMPLE_TODAYS_WORKOUT as plan } from '../data/sampleData'

export default function TodaysWorkout() {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Today&apos;s Plan</h2>
        <SampleBadge />
      </div>
      <p className="plan-title">{plan.name}</p>
      <p className="muted plan-sub">
        {plan.focus} · <Timer size={14} /> ~{plan.estimatedMinutes} min
      </p>
      <ul className="exercise-list">
        {plan.exercises.map((ex) => (
          <li key={ex.name}>
            <span>{ex.name}</span>
            <span className="muted">{ex.sets} × {ex.reps}</span>
          </li>
        ))}
      </ul>
      {/* Not wired up yet: workout logging comes in a later step */}
      <button className="primary-btn" disabled title="Coming soon">
        <Play size={16} /> Start workout (coming soon)
      </button>
    </section>
  )
}
