import { Dumbbell, Scale, Medal } from 'lucide-react'
import { formatDate } from '../../utils/progress.js'

function Card({ icon: Icon, title, children }) {
  return (
    <div className="card recent-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <p className="stat-label">{title}</p>
      {children}
    </div>
  )
}

function changeText(changeKg) {
  if (changeKg === null) return 'First weigh-in'
  if (changeKg === 0) return 'No change from last time'
  return `${changeKg > 0 ? '+' : ''}${changeKg} kg from last time`
}

export default function RecentProgress({ progress }) {
  const { latestWorkout, latestWeighIn, newestRecord } = progress

  return (
    <section>
      <h2 className="section-title">Recent progress</h2>
      <div className="recent-grid">
        <Card icon={Dumbbell} title="Latest workout">
          {latestWorkout ? (
            <>
              <p className="stat-value recent-value">{latestWorkout.name}</p>
              <p className="stat-hint">
                {formatDate(latestWorkout.date, true)} · {latestWorkout.exerciseCount}{' '}
                {latestWorkout.exerciseCount === 1 ? 'exercise' : 'exercises'}
              </p>
            </>
          ) : (
            <p className="muted">No workouts logged yet.</p>
          )}
        </Card>

        <Card icon={Scale} title="Latest weigh-in">
          {latestWeighIn ? (
            <>
              <p className="stat-value recent-value">{latestWeighIn.weightKg} kg</p>
              <p className="stat-hint">
                {formatDate(latestWeighIn.date, true)} · {changeText(latestWeighIn.changeKg)}
              </p>
            </>
          ) : (
            <p className="muted">No weigh-ins yet.</p>
          )}
        </Card>

        <Card icon={Medal} title="Newest personal record">
          {newestRecord ? (
            <>
              <p className="stat-value recent-value">{newestRecord.prKg} kg</p>
              <p className="stat-hint">
                {newestRecord.name} · {formatDate(newestRecord.prDate, true)}
              </p>
            </>
          ) : (
            <p className="muted">No lifts with weight logged yet.</p>
          )}
        </Card>
      </div>
    </section>
  )
}
