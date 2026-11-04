import { useState } from 'react'
import { Play, Trophy, Scale, Flame, CalendarCheck } from 'lucide-react'
import StatCard from '../components/StatCard'
import SampleBadge from '../components/SampleBadge'
import WeeklyActivityChart from '../components/WeeklyActivityChart'
import WeightChart from '../components/WeightChart'
import RecentWorkouts from '../components/RecentWorkouts'
import PersonalRecords from '../components/PersonalRecords'
import QuickActions from '../components/QuickActions'
import {
  SAMPLE_USER,
  SAMPLE_WEIGHT_HISTORY,
  SAMPLE_RECENT_WORKOUTS,
  SAMPLE_TOTAL_WORKOUTS,
  SAMPLE_STREAK_DAYS,
} from '../data/sampleData'
import { getGreeting, formatLongDate } from '../utils/dashboardHeader'
import '../styles/dashboard.css'

export default function Dashboard({ onNavigate }) {
  // Numbers are calculated from the sample data above - still sample values!
  const workoutsThisWeek = SAMPLE_RECENT_WORKOUTS.filter((w) => w.thisWeek).length
  const goal = SAMPLE_USER.weeklyWorkoutGoal
  const weights = SAMPLE_WEIGHT_HISTORY
  const currentWeight = weights[weights.length - 1].weight
  const change = (currentWeight - weights[0].weight).toFixed(1)
  const [now] = useState(() => new Date())

  return (
    <div className="dashboard">
      <section className="dash-hero">
        <div>
          <h2 className="dash-greeting">{getGreeting(now)}, {SAMPLE_USER.name}!</h2>
          <p className="muted">{formatLongDate(now)}</p>
        </div>
        <button className="primary-btn hero-btn" onClick={() => onNavigate('workouts')}>
          <Play size={16} /> Start Workout
        </button>
      </section>

      <h2 className="section-title">Fitness Overview</h2>
      <div className="stats-grid">
        <StatCard icon={Trophy} label="Workouts" value={SAMPLE_TOTAL_WORKOUTS} hint="Total logged (sample)" />
        <StatCard
          icon={Scale}
          label="Weight"
          value={`${currentWeight} ${SAMPLE_USER.unit}`}
          hint={`${change} ${SAMPLE_USER.unit} since first entry (sample)`}
        />
        <StatCard icon={Flame} label="Streak" value={`${SAMPLE_STREAK_DAYS} days`} hint="Sample value" />
        <StatCard
          icon={CalendarCheck}
          label="This Week"
          value={`${workoutsThisWeek} / ${goal}`}
          progress={(workoutsThisWeek / goal) * 100}
          hint="Weekly goal (sample)"
        />
      </div>

      <div className="grid-main">
        <WeeklyActivityChart />
        <WeightChart />
      </div>

      <RecentWorkouts />

      <div className="grid-main">
        <PersonalRecords />
        <QuickActions onNavigate={onNavigate} />
      </div>

      <p className="muted footnote">
        <SampleBadge /> Everything on this page is placeholder data until you start logging your own.
      </p>
    </div>
  )
}
