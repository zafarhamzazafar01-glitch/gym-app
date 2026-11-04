// Pure logic for the Workout Planner: shape, validation, CRUD and storage.
// Forms hold strings; saved planned workouts hold numbers.
export const PLANNER_STORAGE_KEY = 'fittrack.planner.v1'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const MUSCLE_GROUPS = ['Chest', 'Back', 'Arms', 'Legs', 'Shoulders']

let counter = 0
export function newPlanId() {
  counter += 1
  return `${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 7)}`
}

export function emptyPlanExercise() {
  return { id: newPlanId(), name: '', sets: '', reps: '', weightKg: '' }
}

export function emptyPlanForm(day = DAYS[0]) {
  return { day, name: '', muscle: MUSCLE_GROUPS[0], exercises: [emptyPlanExercise()] }
}

export function planToForm(plan) {
  return {
    day: plan.day,
    name: plan.name,
    muscle: plan.muscle,
    exercises: plan.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      sets: String(ex.sets),
      reps: String(ex.reps),
      weightKg: ex.weightKg > 0 ? String(ex.weightKg) : '',
    })),
  }
}

export function formToPlanFields(form) {
  return {
    day: form.day,
    name: form.name.trim(),
    muscle: form.muscle,
    exercises: form.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name.trim(),
      sets: Number(ex.sets),
      reps: Number(ex.reps),
      weightKg: ex.weightKg.trim() === '' ? 0 : Number(ex.weightKg),
    })),
  }
}

const isWholePositive = (v) => /^\d+$/.test(v.trim()) && Number(v) > 0

// Returns { isValid, errors } where errors = { name, day, muscle, exercises, exerciseErrors: {id: {...}} }.
export function validatePlanForm(form) {
  const errors = { exerciseErrors: {} }
  if (!form.name.trim()) errors.name = 'Give the workout a name.'
  if (!DAYS.includes(form.day)) errors.day = 'Pick a day.'
  if (!MUSCLE_GROUPS.includes(form.muscle)) errors.muscle = 'Pick a muscle group.'
  if (form.exercises.length === 0) errors.exercises = 'Add at least one exercise.'

  for (const ex of form.exercises) {
    const e = {}
    if (!ex.name.trim()) e.name = 'Required'
    if (!isWholePositive(ex.sets)) e.sets = 'Whole number > 0'
    if (!isWholePositive(ex.reps)) e.reps = 'Whole number > 0'
    const w = ex.weightKg.trim()
    if (w !== '' && !(Number.isFinite(Number(w)) && Number(w) >= 0)) e.weightKg = '0 or more'
    if (Object.keys(e).length) errors.exerciseErrors[ex.id] = e
  }

  const isValid =
    !errors.name && !errors.day && !errors.muscle && !errors.exercises &&
    Object.keys(errors.exerciseErrors).length === 0
  return { isValid, errors }
}

export function addPlan(plans, fields, id = newPlanId()) {
  return [...plans, { id, ...fields }]
}

export function updatePlan(plans, id, fields) {
  return plans.map((p) => (p.id === id ? { ...p, ...fields } : p))
}

export function deletePlan(plans, id) {
  return plans.filter((p) => p.id !== id)
}

// { Monday: [...], ..., Sunday: [...] } — every day is present, even if empty.
export function groupByDay(plans) {
  const byDay = Object.fromEntries(DAYS.map((d) => [d, []]))
  for (const p of plans) if (byDay[p.day]) byDay[p.day].push(p)
  return byDay
}

// Never throws: bad/missing/corrupt data gives an empty list.
export function loadPlans(storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(PLANNER_STORAGE_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Returns true if saved, false if the browser refused.
export function savePlans(plans, storage = globalThis.localStorage) {
  try {
    storage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(plans))
    return true
  } catch {
    return false
  }
}
