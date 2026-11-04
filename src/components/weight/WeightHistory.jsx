import { Pencil, Trash2 } from 'lucide-react'
import { sortByDate } from '../../utils/weight.js'

function longDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function WeightHistory({ entries, editingId, onEdit, onDelete }) {
  // Oldest first so each row can show its change from the previous weigh-in.
  const oldestFirst = sortByDate(entries)
  const rows = oldestFirst
    .map((e, i) => ({ ...e, delta: i === 0 ? null : Math.round((e.weightKg - oldestFirst[i - 1].weightKg) * 10) / 10 }))
    .reverse()

  return (
    <section className="card">
      <div className="card-head">
        <h2>Weight History</h2>
        <span className="muted">{entries.length} logged</span>
      </div>

      {rows.length === 0 ? (
        <p className="muted empty-state">No weigh-ins yet. Use the form above to add one.</p>
      ) : (
        <ul className="workout-history">
          {rows.map((e) => (
            <li key={e.id} className={`workout-card weight-row ${e.id === editingId ? 'is-editing' : ''}`}>
              <div>
                <strong>{e.weightKg} kg</strong>
                <p className="muted">{longDate(e.date)}</p>
              </div>
              {e.delta !== null && e.delta !== 0 && (
                <span className={`weight-delta ${e.delta < 0 ? 'down' : 'up'}`}>
                  {e.delta > 0 ? '+' : ''}{e.delta} kg
                </span>
              )}
              <div className="row-actions">
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => onEdit(e.id)} aria-label={`Edit weigh-in from ${longDate(e.date)}`} title="Edit">
                  <Pencil size={15} />
                </button>
                <button type="button" className="btn btn-ghost btn-icon btn-danger" onClick={() => onDelete(e)} aria-label={`Delete weigh-in from ${longDate(e.date)}`} title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
