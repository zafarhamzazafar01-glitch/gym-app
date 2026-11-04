// Pure logic for My Progress. Nothing is stored here: every number is worked out
// from the workouts and weigh-ins the user has already logged.
//
// Week = Monday to Sunday (same as the Workout Planner).
// Personal record = the heaviest kg logged for an exercise.
// Improvement = personal record minus the first weight logged (needs 2+ workouts).
import { summarize, sortByDate } from './weight.js'

const pad = (n) => String(n).padStart(2, '0')
const round1 = (n) => Math.round(n * 10) / 10

function toISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Built from parts so time zones can't shift the day.
function fromISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// 'YYYY-MM-DD' -> 'Nov 4' (or 'Nov 4, 2026' with the year)
export function formatDate(iso, withYear = false) {
  return fromISO(iso).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', ...(withYear ? { year: 'numeric' } : {}),
  })
}

// The Monday and Sunday of the week containing `today`.
export function weekRange(today) {
  const d = fromISO(today)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  const start = toISO(d)
  d.setDate(d.getDate() + 6)
  return { start, end: toISO(d) }
}

// Saved data can't be trusted completely, so drop anything that isn't a workout.
function validWorkouts(workouts) {
  return workouts.filter((w) => w && typeof w.date === 'string' && Array.isArray(w.exercises))
}

function oldestFirst(workouts) {
  return validWorkouts(workouts).sort(
    (a, b) => a.date.localeCompare(b.date) || String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? '')),
  )
}

export function countThisWeek(workouts, today) {
  const { start, end } = weekRange(today)
  return validWorkouts(workouts).filter((w) => w.date >= start && w.date <= end).length
}

// "Bench  Press" and "bench press" are the same lift.
export function exerciseKey(name) {
  return String(name).trim().replace(/\s+/g, ' ').toLowerCase()
}

// One record per exercise: { key, name, prKg, prDate, firstKg, sessions, improvementKg }
// Exercises with no weight (0 kg / bodyweight) are skipped. Newest record first.
export function exerciseRecords(workouts) {
  const byKey = new Map()
  for (const workout of oldestFirst(workouts)) {
    // Heaviest entry per exercise inside this one workout.
    const best = new Map()
    for (const ex of workout.exercises) {
      if (!ex || typeof ex.name !== 'string' || !Number.isFinite(ex.weightKg) || ex.weightKg <= 0) continue
      const key = exerciseKey(ex.name)
      if (!key) continue
      const seen = best.get(key)
      if (!seen || ex.weightKg > seen.kg) best.set(key, { name: ex.name.trim(), kg: ex.weightKg })
    }
    for (const [key, { name, kg }] of best) {
      const rec = byKey.get(key)
      if (!rec) {
        byKey.set(key, { key, name, prKg: kg, prDate: workout.date, firstKg: kg, sessions: 1 })
      } else {
        rec.sessions += 1
        rec.name = name
        if (kg > rec.prKg) {
          rec.prKg = kg
          rec.prDate = workout.date
        }
      }
    }
  }
  return [...byKey.values()]
    .map((r) => ({ ...r, improvementKg: r.sessions > 1 ? round1(r.prKg - r.firstKg) : null }))
    .sort((a, b) => b.prDate.localeCompare(a.prDate) || a.name.localeCompare(b.name))
}

export function latestWorkout(workouts) {
  const sorted = oldestFirst(workouts)
  const last = sorted[sorted.length - 1]
  if (!last) return null
  return { name: last.name, date: last.date, exerciseCount: last.exercises.length }
}

// The newest weigh-in and how it differs from the one before it.
export function latestWeighIn(entries) {
  const sorted = sortByDate(entries)
  const last = sorted[sorted.length - 1]
  if (!last) return null
  const previous = sorted[sorted.length - 2]
  return {
    date: last.date,
    weightKg: last.weightKg,
    changeKg: previous ? round1(last.weightKg - previous.weightKg) : null,
  }
}

export function buildProgress(workouts, weightData, today) {
  const records = exerciseRecords(workouts)
  return {
    totalWorkouts: validWorkouts(workouts).length,
    thisWeek: countThisWeek(workouts, today),
    records,
    newestRecord: records[0] ?? null,
    latestWorkout: latestWorkout(workouts),
    latestWeighIn: latestWeighIn(weightData.entries),
    weight: summarize(weightData),
  }
}
