import SampleBadge from './SampleBadge'
import { SAMPLE_RECENT_WORKOUTS } from '../data/sampleData'

export default function RecentWorkouts() {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Recent Workouts</h2>
        <SampleBadge />
      </div>
      <div className="table-wrap">
        <table className="workout-table">
          <thead>
            <tr>
              <th>Workout</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Exercises</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_RECENT_WORKOUTS.map((w) => (
              <tr key={w.id}>
                <td className="workout-name">{w.name}</td>
                <td>{w.date}</td>
                <td>{w.duration} min</td>
                <td>{w.exercises}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
