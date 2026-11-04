import ProgressStats from '../components/progress/ProgressStats'
import StrengthRecords from '../components/progress/StrengthRecords'
import RecentProgress from '../components/progress/RecentProgress'
import WeightLineChart from '../components/weight/WeightLineChart'
import { useProgressData } from '../hooks/useProgressData'
import { buildProgress } from '../utils/progress.js'
import { todayISO } from '../utils/workoutModel.js'
import '../styles/dashboard.css' // stat cards + chart box + records
import '../styles/workouts.css' // shared card + button styles
import '../styles/progress.css'

export default function MyProgress() {
  const { workouts, weightData } = useProgressData()
  const today = todayISO()
  const progress = buildProgress(workouts, weightData, today)

  return (
    <div className="progress-page">
      <ProgressStats progress={progress} today={today} />
      <WeightLineChart entries={weightData.entries} targetKg={weightData.targetKg} />
      <StrengthRecords records={progress.records} />
      <RecentProgress progress={progress} />
    </div>
  )
}
