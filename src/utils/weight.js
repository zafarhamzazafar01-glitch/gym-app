// Pure logic for the Weight Tracker: shape, validation, CRUD, summary and storage.
//
// WeightData = { entries: Entry[], startingKg: number | null, targetKg: number | null }
// Entry      = { id, date: 'YYYY-MM-DD', weightKg: number }
//
// startingKg null means "use the earliest logged entry".
export const WEIGHT_STORAGE_KEY = 'fittrack.weight.v1'

export const MIN_KG = 20
export const MAX_KG = 500

export const EMPTY_WEIGHT_DATA = { entries: [], startingKg: null, targetKg: null }

let counter = 0
export function newWeightId() {
  counter += 1
  return `${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 7)}`
}

// Validates a number typed as text. Returns an error string, or undefined if fine.
export function validateKg(value) {
  const text = String(value).trim()
  if (text === '') return 'Enter a weight.'
  const n = Number(text)
  if (!Number.isFinite(n)) return 'Enter a number.'
  if (n < MIN_KG || n > MAX_KG) return `Between ${MIN_KG} and ${MAX_KG} kg.`
  return undefined
}

// form = { date, weight } (strings). `ignoreId` is the entry being edited.
// Returns { isValid, errors: { date, weight } }.
export function validateEntryForm(form, entries, today, ignoreId = null) {
  const errors = {}
  if (!form.date) errors.date = 'Pick a date.'
  else if (form.date > today) errors.date = "Date can't be in the future."
  else if (entries.some((e) => e.date === form.date && e.id !== ignoreId)) {
    errors.date = 'You already logged this date. Edit that entry instead.'
  }
  const weightError = validateKg(form.weight)
  if (weightError) errors.weight = weightError
  return { isValid: Object.keys(errors).length === 0, errors }
}

// Goals are optional: blank is allowed and means "not set".
export function validateGoalsForm(form) {
  const errors = {}
  for (const key of ['startingKg', 'targetKg']) {
    if (String(form[key]).trim() !== '') {
      const error = validateKg(form[key])
      if (error) errors[key] = error
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors }
}

export function goalsFromForm(form) {
  const toNumber = (v) => (String(v).trim() === '' ? null : Number(v))
  return { startingKg: toNumber(form.startingKg), targetKg: toNumber(form.targetKg) }
}

export function sortByDate(entries) {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date))
}

export function addEntry(entries, { date, weightKg }, id = newWeightId()) {
  return [...entries, { id, date, weightKg }]
}

export function updateEntry(entries, id, { date, weightKg }) {
  return entries.map((e) => (e.id === id ? { ...e, date, weightKg } : e))
}

export function deleteEntry(entries, id) {
  return entries.filter((e) => e.id !== id)
}

const round1 = (n) => Math.round(n * 10) / 10

// Everything the stat cards need. Fields are null when they can't be known yet.
// progress is 0-100: how far you've moved from the starting weight toward the target.
export function summarize({ entries, startingKg, targetKg }) {
  const sorted = sortByDate(entries)
  const currentKg = sorted.length ? sorted[sorted.length - 1].weightKg : null
  const start = startingKg ?? (sorted.length ? sorted[0].weightKg : null)

  const changeKg = currentKg !== null && start !== null ? round1(currentKg - start) : null
  const toGoKg = currentKg !== null && targetKg !== null ? round1(currentKg - targetKg) : null

  let progress = null
  if (currentKg !== null && start !== null && targetKg !== null && start !== targetKg) {
    progress = Math.max(0, Math.min(100, ((start - currentKg) / (start - targetKg)) * 100))
  }
  return { currentKg, startingKg: start, targetKg, changeKg, toGoKg, progress }
}

// Never throws: bad/missing/corrupt data gives empty data.
export function loadWeightData(storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(WEIGHT_STORAGE_KEY))
    if (!parsed || !Array.isArray(parsed.entries)) return EMPTY_WEIGHT_DATA
    const num = (v) => (Number.isFinite(v) ? v : null)
    return {
      entries: parsed.entries.filter(
        (e) => e && typeof e.date === 'string' && Number.isFinite(e.weightKg),
      ),
      startingKg: num(parsed.startingKg),
      targetKg: num(parsed.targetKg),
    }
  } catch {
    return EMPTY_WEIGHT_DATA
  }
}

// Returns true if saved, false if the browser refused.
export function saveWeightData(data, storage = globalThis.localStorage) {
  try {
    storage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}
