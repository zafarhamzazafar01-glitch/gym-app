import { Plus } from 'lucide-react'
import PlanCard from './PlanCard'
import { DAYS, groupByDay } from '../../utils/planner.js'

// Monday–Sunday columns, each listing that day's planned workouts.
export default function WeekSchedule({ plans, editingId, onAddToDay, onEdit, onDelete }) {
  const byDay = groupByDay(plans)

  return (
    <section className="card">
      <div className="card-head">
        <h2>Weekly Schedule</h2>
        <span className="muted">{plans.length} planned</span>
      </div>
      <div className="week-grid">
        {DAYS.map((day) => (
          <div className="day-col" key={day}>
            <div className="day-head">
              <h3>{day.slice(0, 3)}<span className="day-full">{day.slice(3)}</span></h3>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => onAddToDay(day)}
                aria-label={`Plan a workout for ${day}`}
                title={`Plan a workout for ${day}`}
              >
                <Plus size={15} />
              </button>
            </div>
            {byDay[day].length === 0 ? (
              <p className="muted day-rest">Rest day</p>
            ) : (
              <ul className="plan-list">
                {byDay[day].map((p) => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    isEditing={p.id === editingId}
                    onEdit={() => onEdit(p.id)}
                    onDelete={() => onDelete(p)}
                  />
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
