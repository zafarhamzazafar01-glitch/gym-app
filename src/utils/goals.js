// Pure logic for My Goals: shape, validation, CRUD, progress and storage.
//
// Goal = {
//   id, type: 'weight' | 'workouts' | 'strength',
//   target: number,        // kg for weight/strength, workouts per week for 'workouts'
//   exercise: string,      // strength goals only ('' otherwise)
//   baselineKg: number | null,  // weight goals only: where you started
//   completed: boolean, completedAt: ISO string | null, createdAt: ISO string
// }
//
// Progress is never stored: it is worked out from the user's real logs.
import { summarize, validateKg } from './weight.js'
import { exerciseKey } from './progress.js'

export const GOALS_STORAGE_KEY = 'fittrack.goals.v1'

export const GOAL_TYPES = ['weight', 'workouts', 'strength']
export const GOAL_TYPE_LABELS = {
  weight: 'Target weight',
  workouts: 'Weekly workouts',
  strength: 'Strength target',
}

export const MAX_WEEKLY_WORKOUTS = 14
export const MAX_LIFT_KG = 1000

let counter = 0
export function newGoalId() {
  counter += 1
  return `${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 7)}`
}

const cleanName = (s) => String(s).trim().replace(/\s+/g, ' ')

// form = { type, target, exercise } (strings). Returns { isValid, errors }.
export function validateGoalForm(form) {
  const errors = {}
  if (!GOAL_TYPES.includes(form.type)) errors.type = 'Pick a goal type.'

  const text = String(form.target).trim()
  if (form.type === 'weight') {
    const error = validateKg(form.target)
    if (error) errors.target = error
  } else if (form.type === 'workouts') {
    const n = Number(text)
    if (text === '') errors.target = 'Enter how many workouts per week.'
    else if (!Number.isInteger(n) || n < 1 || n > MAX_WEEKLY_WORKOUTS) {
      errors.target = `A whole number from 1 to ${MAX_WEEKLY_WORKOUTS}.`
    }
  } else if (form.type === 'strength') {
    const n = Number(text)
    if (text === '') errors.target = 'Enter a target weight.'
    else if (!Number.isFinite(n) || n <= 0 || n > MAX_LIFT_KG) {
      errors.target = `Between 0 and ${MAX_LIFT_KG} kg.`
    }
    const name = cleanName(form.exercise)
    if (!name) errors.exercise = 'Enter the exercise name.'
    else if (name.length > 60) errors.exercise = 'Keep it under 60 characters.'
  }
  return { isValid: Object.keys(errors).length === 0, errors }
}

export function emptyGoalForm(type = 'weight') {
  return { type, target: '', exercise: '' }
}

export function goalToForm(goal) {
  return { type: goal.type, target: String(goal.target), exercise: goal.exercise }
}

// Form -> clean goal fields (real numbers, tidy text).
export function goalFromForm(form) {
  return {
    type: form.type,
    target: Number(form.target),
    exercise: form.type === 'strength' ? cleanName(form.exercise) : '',
  }
}

// A new weight goal remembers where you started so progress has a starting line.
export function baselineFor(type, weightData) {
  return type === 'weight' ? summarize(weightData).startingKg : null
}

export function goalTitle(goal) {
  if (goal.type === 'weight') return `Reach ${goal.target} kg`
  if (goal.type === 'workouts') return `Work out ${goal.target}× per week`
  return `${goal.exercise}: ${goal.target} kg`
}

export function addGoal(goals, fields, now = new Date().toISOString(), id = newGoalId()) {
  const goal = { baselineKg: null, ...fields, id, completed: false, completedAt: null, createdAt: now }
  return [goal, ...goals]
}

// Only target and exercise can change; the type and starting line stay put.
export function updateGoal(goals, id, { target, exercise }) {
  return goals.map((g) => (g.id === id ? { ...g, target, exercise: g.type === 'strength' ? exercise : '' } : g))
}

export function completeGoal(goals, id, now = new Date().toISOString()) {
  return goals.map((g) => (g.id === id ? { ...g, completed: true, completedAt: now } : g))
}

export function reopenGoal(goals, id) {
  return goals.map((g) => (g.id === id ? { ...g, completed: false, completedAt: null } : g))
}

export function deleteGoal(goals, id) {
  return goals.filter((g) => g.id !== id)
}

// Pending: newest first. Achieved: most recently completed first.
export function splitGoals(goals) {
  const pending = goals.filter((g) => !g.completed).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const achieved = goals
    .filter((g) => g.completed)
    .sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)))
  return { pending, achieved }
}

const clamp = (n) => Math.max(0, Math.min(100, n))

// ctx = { weightData, thisWeek, records } (from utils/progress.js).
// Returns { percent: 0-100 | null, detail }. percent is null when it can't be known yet.
export function goalProgress(goal, { weightData, thisWeek, records }) {
  if (goal.type === 'workouts') {
    return {
      percent: clamp((thisWeek / goal.target) * 100),
      detail: `${thisWeek} of ${goal.target} workouts this week`,
    }
  }

  if (goal.type === 'strength') {
    const record = records.find((r) => r.key === exerciseKey(goal.exercise))
    if (!record) return { percent: 0, detail: `No ${goal.exercise} with weight logged yet` }
    return {
      percent: clamp((record.prKg / goal.target) * 100),
      detail: `Best lift ${record.prKg} kg of ${goal.target} kg`,
    }
  }

  const { currentKg, startingKg } = summarize(weightData)
  const start = goal.baselineKg ?? startingKg
  if (currentKg === null || start === null) {
    return { percent: null, detail: 'Log a weigh-in to track this goal' }
  }
  const percent =
    start === goal.target
      ? currentKg === goal.target ? 100 : 0
      : clamp(((start - currentKg) / (start - goal.target)) * 100)
  return { percent, detail: `Now ${currentKg} kg · started ${start} kg · target ${goal.target} kg` }
}

// Never throws: bad/missing/corrupt data gives an empty list.
export function loadGoals(storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(GOALS_STORAGE_KEY))
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((g) => g && typeof g.id === 'string' && GOAL_TYPES.includes(g.type) && Number.isFinite(g.target))
      .map((g) => ({
        id: g.id,
        type: g.type,
        target: g.target,
        exercise: typeof g.exercise === 'string' ? g.exercise : '',
        baselineKg: Number.isFinite(g.baselineKg) ? g.baselineKg : null,
        completed: g.completed === true,
        completedAt: typeof g.completedAt === 'string' ? g.completedAt : null,
        createdAt: typeof g.createdAt === 'string' ? g.createdAt : '',
      }))
  } catch {
    return []
  }
}

// Returns true if saved, false if the browser refused.
export function saveGoals(goals, storage = globalThis.localStorage) {
  try {
    storage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals))
    return true
  } catch {
    return false
  }
}
