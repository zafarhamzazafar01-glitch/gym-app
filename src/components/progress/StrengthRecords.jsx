import { useState } from 'react'
import { Medal } from 'lucide-react'
import { formatDate } from '../../utils/progress.js'

const VISIBLE = 6

export default function StrengthRecords({ records }) {
  const [showAll, setShowAll] = useState(false)
  const shown = showAll ? records : records.slice(0, VISIBLE)

  return (
    <section className="card">
      <div className="card-head">
        <h2>Strength &amp; Records</h2>
        {records.length > 0 && <span className="muted">Best weight per exercise</span>}
      </div>

      {records.length === 0 ? (
        <p className="muted empty-state">
          Log a workout with exercise weights in My Workouts to see your records here.
        </p>
      ) : (
        <>
          <div className="record-grid">
            {shown.map((r) => (
              <div key={r.key} className="record-item">
                <Medal size={18} />
                <p className="muted record-name">{r.name}</p>
                <p className="pr-value">{r.prKg} kg</p>
                <p className="muted record-meta">Set {formatDate(r.prDate)}</p>
                {r.improvementKg === null ? (
                  <p className="muted record-meta">First session logged</p>
                ) : (
                  <p className={`record-gain ${r.improvementKg > 0 ? 'up' : ''}`}>
                    {r.improvementKg > 0 ? '+' : ''}{r.improvementKg} kg since first session
                  </p>
                )}
              </div>
            ))}
          </div>
          {records.length > VISIBLE && (
            <button type="button" className="btn btn-ghost show-more" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show fewer' : `Show all ${records.length}`}
            </button>
          )}
        </>
      )}
    </section>
  )
}
