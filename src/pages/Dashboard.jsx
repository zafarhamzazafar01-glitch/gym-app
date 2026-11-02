import { CalendarCheck, Trophy, Scale, Target } from 'lucide-react'
import StatCard from '../components/StatCard'
import SampleBadge from '../components/SampleBadge'
import WeightChart from '../components/WeightChart'
import RecentWorkouts from '../components/RecentWorkouts'
import TodaysWorkout from '../components/TodaysWorkout'
import {
  SAMPLE_USER,
  SAMPLE_WEIGHT_HISTORY,
  SAMPLE_RECENT_WORKOUTS,
  SAMPLE_TOTAL_WORKOUTS,
} from '../data/sampleData'
import '../styles/dashboard.css'

export default function Dashboard() {
  // Numbers are calculated from the sample data above - still sample values!
  const workoutsThisWeek = SAMPLE_RECENT_WORKOUTS.filter((w) => w.thisWeek).length
  const goal = SAMPLE_USER.weeklyWorkoutGoal
  const weights = SAMPLE_WEIGHT_HISTORY
  const currentWeight = weights[weights.length - 1].weight
  const change = (currentWeight - weights[0].weight).toFixed(1)

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard icon={CalendarCheck} label="Workouts This Week" value={workoutsThisWeek} hint="Sample value" />
        <StatCard icon={Trophy} label="Total Workouts" value={SAMPLE_TOTAL_WORKOUTS} hint="Sample value" />
        <StatCard
          icon={Scale}
          label="Current Weight"
          value={`${currentWeight} ${SAMPLE_USER.unit}`}
          hint={`${change} ${SAMPLE_USER.unit} since first entry (sample)`}
        />
        <StatCard
          icon={Target}
          label="Weekly Workout Goal"
          value={`${workoutsThisWeek} / ${goal}`}
          progress={(workoutsThisWeek / goal) * 100}
          hint="Sample value"
        />
      </div>

      <div className="grid-main">
        <WeightChart />
        <TodaysWorkout />
      </div>

      <RecentWorkouts />

      <p className="muted footnote">
        <SampleBadge /> Everything on this page is placeholder data until you start logging your own.
      </p>
    </div>
  )
}
