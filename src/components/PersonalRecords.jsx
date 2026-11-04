import { Medal } from 'lucide-react'
import SampleBadge from './SampleBadge'
import { SAMPLE_PERSONAL_RECORDS, SAMPLE_USER } from '../data/sampleData'

export default function PersonalRecords() {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Personal Records</h2>
        <SampleBadge />
      </div>
      <div className="pr-grid">
        {SAMPLE_PERSONAL_RECORDS.map((pr) => (
          <div key={pr.lift} className="pr-item">
            <Medal size={18} />
            <p className="muted">{pr.lift}</p>
            <p className="pr-value">{pr.weight} {SAMPLE_USER.unit}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
