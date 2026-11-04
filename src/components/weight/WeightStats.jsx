import { Scale, Flag, Target } from 'lucide-react'
import StatCard from '../StatCard'
import { summarize } from '../../utils/weight.js'

const kg = (n) => (n === null ? '—' : `${n} kg`)

function signed(n) {
  if (n === null) return undefined
  if (n === 0) return 'No change since start'
  return `${n > 0 ? '+' : ''}${n} kg since start`
}

export default function WeightStats({ data }) {
  const s = summarize(data)
  const toGoHint =
    s.toGoKg === null
      ? 'Set a target below'
      : s.toGoKg === 0
        ? 'Target reached!'
        : `${Math.abs(s.toGoKg)} kg ${s.toGoKg > 0 ? 'to lose' : 'to gain'}`

  return (
    <div className="stats-grid weight-stats">
      <StatCard icon={Scale} label="Current weight" value={kg(s.currentKg)} hint={signed(s.changeKg) ?? 'Log your first weigh-in'} />
      <StatCard icon={Flag} label="Starting weight" value={kg(s.startingKg)} hint={data.startingKg === null ? 'From your first entry' : 'Set by you'} />
      <StatCard
        icon={Target}
        label="Target weight"
        value={s.targetKg === null ? 'Not set' : kg(s.targetKg)}
        hint={toGoHint}
        progress={s.progress ?? undefined}
      />
    </div>
  )
}
