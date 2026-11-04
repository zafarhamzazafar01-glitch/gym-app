import { Dumbbell, CalendarCheck, Scale, Medal } from 'lucide-react'
import StatCard from '../StatCard'
import { formatDate, weekRange } from '../../utils/progress.js'

function weightHint(weight) {
  if (weight.changeKg === null) return 'Log a weigh-in in Weight Tracker'
  if (weight.changeKg === 0) return 'No change since start'
  return `${weight.changeKg > 0 ? '+' : ''}${weight.changeKg} kg since start`
}

export default function ProgressStats({ progress, today }) {
  const { start, end } = weekRange(today)
  const { totalWorkouts, thisWeek, records, weight } = progress

  return (
    <div className="stats-grid">
      <StatCard
        icon={Dumbbell}
        label="Total workouts"
        value={totalWorkouts}
        hint={totalWorkouts === 0 ? 'Log one in My Workouts' : 'Logged in My Workouts'}
      />
      <StatCard
        icon={CalendarCheck}
        label="This week"
        value={thisWeek}
        hint={`${formatDate(start)} – ${formatDate(end)}`}
      />
      <StatCard
        icon={Scale}
        label="Current weight"
        value={weight.currentKg === null ? '—' : `${weight.currentKg} kg`}
        hint={weightHint(weight)}
      />
      <StatCard
        icon={Medal}
        label="Personal records"
        value={records.length}
        hint={records.length === 0 ? 'Log a workout with weights' : 'Exercises with a best lift'}
      />
    </div>
  )
}
