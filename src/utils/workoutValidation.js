// Returns { errors, isValid }.
// errors = { date?, name?, exercises?, exerciseErrors: { [exerciseId]: { name?, sets?, reps?, weightKg? } } }

const MAX_SETS = 50
const MAX_REPS = 1000
const MAX_WEIGHT_KG = 1000

function isBlank(value) {
  return String(value).trim() === ''
}

function validateExercise(e) {
  const errs = {}

  if (isBlank(e.name)) errs.name = 'Enter an exercise name.'

  if (isBlank(e.sets)) errs.sets = 'Enter the number of sets.'
  else if (!Number.isInteger(Number(e.sets)) || Number(e.sets) < 1 || Number(e.sets) > MAX_SETS)
    errs.sets = `Sets must be a whole number from 1 to ${MAX_SETS}.`

  if (isBlank(e.reps)) errs.reps = 'Enter the reps per set.'
  else if (!Number.isInteger(Number(e.reps)) || Number(e.reps) < 1 || Number(e.reps) > MAX_REPS)
    errs.reps = `Reps must be a whole number from 1 to ${MAX_REPS}.`

  if (isBlank(e.weightKg)) errs.weightKg = 'Enter the weight (use 0 for bodyweight).'
  else if (!Number.isFinite(Number(e.weightKg)) || Number(e.weightKg) < 0 || Number(e.weightKg) > MAX_WEIGHT_KG)
    errs.weightKg = `Weight must be a number from 0 to ${MAX_WEIGHT_KG} kg.`

  return errs
}

export function validateWorkoutForm(form) {
  const errors = { exerciseErrors: {} }

  if (isBlank(form.date)) errors.date = 'Choose the workout date.'
  else if (Number.isNaN(Date.parse(form.date))) errors.date = 'That date is not valid.'

  if (isBlank(form.name)) errors.name = 'Give your workout a name, e.g. "Push Day".'
  else if (form.name.trim().length > 60) errors.name = 'Keep the name under 60 characters.'

  if (form.exercises.length === 0) errors.exercises = 'Add at least one exercise.'

  for (const e of form.exercises) {
    const errs = validateExercise(e)
    if (Object.keys(errs).length > 0) errors.exerciseErrors[e.id] = errs
  }

  if (form.notes.length > 500) errors.notes = 'Notes can be at most 500 characters.'

  const isValid =
    !errors.date && !errors.name && !errors.exercises && !errors.notes &&
    Object.keys(errors.exerciseErrors).length === 0

  return { errors, isValid }
}
