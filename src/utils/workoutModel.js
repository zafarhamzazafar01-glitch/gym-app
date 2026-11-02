// The ONE shape every workout in the app has:
//
// Workout  = { id, date, name, exercises: Exercise[], notes, createdAt, updatedAt }
// Exercise = { id, name, sets, reps, weightKg }
//
// date is 'YYYY-MM-DD'. sets / reps / weightKg are numbers once saved
// (the form keeps them as strings while the user is typing).

export function newId() {
  return crypto.randomUUID()
}

export function todayISO() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function emptyExercise() {
  return { id: newId(), name: '', sets: '', reps: '', weightKg: '' }
}

// Form values: all text, so inputs stay controlled and can be empty.
export function emptyForm() {
  return { date: todayISO(), name: '', exercises: [emptyExercise()], notes: '' }
}

// Saved workout -> form values (numbers become strings for the inputs).
export function workoutToForm(workout) {
  return {
    date: workout.date,
    name: workout.name,
    notes: workout.notes,
    exercises: workout.exercises.map((e) => ({
      id: e.id,
      name: e.name,
      sets: String(e.sets),
      reps: String(e.reps),
      weightKg: String(e.weightKg),
    })),
  }
}

// Form values -> clean workout fields (trimmed text, real numbers).
export function formToWorkoutFields(form) {
  return {
    date: form.date,
    name: form.name.trim(),
    notes: form.notes.trim(),
    exercises: form.exercises.map((e) => ({
      id: e.id,
      name: e.name.trim(),
      sets: Number(e.sets),
      reps: Number(e.reps),
      weightKg: Number(e.weightKg),
    })),
  }
}
