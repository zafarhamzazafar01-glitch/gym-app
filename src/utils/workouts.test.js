import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emptyForm, workoutToForm, formToWorkoutFields } from './workoutModel.js'
import { validateWorkoutForm } from './workoutValidation.js'
import { loadWorkouts, saveWorkouts, STORAGE_KEY } from './workoutStorage.js'
import { addWorkout, updateWorkout, deleteWorkout, sortWorkouts } from './workoutOperations.js'

// Minimal in-memory stand-in for localStorage.
function fakeStorage(initial = {}) {
  const data = { ...initial }
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v) },
  }
}

function validForm() {
  const form = emptyForm()
  form.name = 'Push Day'
  form.exercises[0] = { ...form.exercises[0], name: 'Bench Press', sets: '3', reps: '10', weightKg: '60' }
  return form
}

test('valid form passes validation', () => {
  assert.equal(validateWorkoutForm(validForm()).isValid, true)
})

test('empty form shows helpful errors', () => {
  const { errors, isValid } = validateWorkoutForm(emptyForm())
  assert.equal(isValid, false)
  assert.match(errors.name, /name/i)
  const exErrors = Object.values(errors.exerciseErrors)[0]
  assert.ok(exErrors.name && exErrors.sets && exErrors.reps && exErrors.weightKg)
})

test('rejects bad numbers and no exercises', () => {
  const form = validForm()
  form.exercises[0].sets = '2.5'
  form.exercises[0].reps = '0'
  form.exercises[0].weightKg = '-5'
  const e = Object.values(validateWorkoutForm(form).errors.exerciseErrors)[0]
  assert.ok(e.sets && e.reps && e.weightKg)

  form.exercises = []
  assert.ok(validateWorkoutForm(form).errors.exercises)
})

test('weight 0 (bodyweight) is allowed', () => {
  const form = validForm()
  form.exercises[0].weightKg = '0'
  assert.equal(validateWorkoutForm(form).isValid, true)
})

test('form <-> workout conversion keeps the data shape', () => {
  const fields = formToWorkoutFields(validForm())
  assert.deepEqual(Object.keys(fields).sort(), ['date', 'exercises', 'name', 'notes'])
  assert.deepEqual(Object.keys(fields.exercises[0]).sort(), ['id', 'name', 'reps', 'sets', 'weightKg'])
  assert.strictEqual(fields.exercises[0].sets, 3)
  assert.strictEqual(fields.exercises[0].weightKg, 60)
  assert.deepEqual(formToWorkoutFields(workoutToForm({ ...fields })), fields)
})

test('create, edit, delete', () => {
  let list = addWorkout([], formToWorkoutFields(validForm()), '2026-01-01T00:00:00Z')
  assert.equal(list.length, 1)
  assert.ok(list[0].id)
  const id = list[0].id

  const before = list
  list = updateWorkout(list, id, { name: 'Pull Day' }, '2026-01-02T00:00:00Z')
  assert.equal(list[0].name, 'Pull Day')
  assert.equal(list[0].createdAt, '2026-01-01T00:00:00Z')
  assert.equal(list[0].updatedAt, '2026-01-02T00:00:00Z')
  assert.equal(before[0].name, 'Push Day', 'original list is not mutated')

  list = deleteWorkout(list, id)
  assert.equal(list.length, 0)
})

test('history is sorted newest date first', () => {
  const mk = (date) => ({ date, createdAt: '2026-01-01' })
  const sorted = sortWorkouts([mk('2026-03-01'), mk('2026-05-01'), mk('2026-04-01')])
  assert.deepEqual(sorted.map((w) => w.date), ['2026-05-01', '2026-04-01', '2026-03-01'])
})

test('saved workouts survive a "refresh" (load after save)', () => {
  const storage = fakeStorage()
  const list = addWorkout([], formToWorkoutFields(validForm()))
  assert.equal(saveWorkouts(list, storage), true)
  assert.deepEqual(loadWorkouts(storage), list)
})

test('corrupt or missing storage gives an empty list instead of crashing', () => {
  assert.deepEqual(loadWorkouts(fakeStorage()), [])
  assert.deepEqual(loadWorkouts(fakeStorage({ [STORAGE_KEY]: '{not json' })), [])
  assert.deepEqual(loadWorkouts(fakeStorage({ [STORAGE_KEY]: '{"a":1}' })), [])
})

test('saveWorkouts reports failure when the browser refuses', () => {
  const full = { getItem: () => null, setItem: () => { throw new Error('quota') } }
  assert.equal(saveWorkouts([], full), false)
})
