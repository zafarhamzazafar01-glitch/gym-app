import test from 'node:test'
import assert from 'node:assert/strict'
import {
  weekRange, countThisWeek, exerciseKey, exerciseRecords, latestWorkout, latestWeighIn, buildProgress,
} from './progress.js'

const TODAY = '2026-11-04' // a Wednesday

const workout = (date, exercises, name = 'Session', createdAt = date) => ({
  id: date + name, date, name, notes: '', createdAt, updatedAt: createdAt,
  exercises: exercises.map(([n, kg], i) => ({ id: String(i), name: n, sets: 3, reps: 8, weightKg: kg })),
})

test('weekRange runs Monday to Sunday, including on a Sunday and a Monday', () => {
  assert.deepEqual(weekRange('2026-11-04'), { start: '2026-11-02', end: '2026-11-08' })
  assert.deepEqual(weekRange('2026-11-08'), { start: '2026-11-02', end: '2026-11-08' })
  assert.deepEqual(weekRange('2026-11-02'), { start: '2026-11-02', end: '2026-11-08' })
  assert.deepEqual(weekRange('2026-12-31'), { start: '2026-12-28', end: '2027-01-03' })
})

test('countThisWeek only counts workouts inside the current week', () => {
  const list = [
    workout('2026-11-01', []), // Sunday before
    workout('2026-11-02', []),
    workout('2026-11-04', []),
    workout('2026-11-08', []),
    workout('2026-11-09', []), // next Monday
  ]
  assert.equal(countThisWeek(list, TODAY), 3)
  assert.equal(countThisWeek([], TODAY), 0)
})

test('exerciseKey ignores case and extra spaces', () => {
  assert.equal(exerciseKey('  Bench   Press '), exerciseKey('bench press'))
})

test('exerciseRecords: PR, first weight and improvement across workouts', () => {
  const list = [
    workout('2026-10-01', [['Bench Press', 60]]),
    workout('2026-10-15', [['bench press', 70]]),
    workout('2026-10-29', [['Bench Press', 65]]),
  ]
  const [bench] = exerciseRecords(list)
  assert.equal(bench.prKg, 70)
  assert.equal(bench.prDate, '2026-10-15')
  assert.equal(bench.firstKg, 60)
  assert.equal(bench.sessions, 3)
  assert.equal(bench.improvementKg, 10)
})

test('exerciseRecords: one workout has no improvement, and 0 kg exercises are skipped', () => {
  const list = [workout('2026-10-01', [['Squat', 100], ['Plank', 0], ['', 50]])]
  const records = exerciseRecords(list)
  assert.equal(records.length, 1)
  assert.equal(records[0].improvementKg, null)
})

test('exerciseRecords: newest record first, and ignores broken saved data', () => {
  const list = [
    workout('2026-10-01', [['Squat', 100]]),
    workout('2026-10-20', [['Deadlift', 120]]),
    null,
    { date: 5 },
    { date: '2026-10-21', exercises: [null, { name: 3, weightKg: 9 }] },
  ]
  assert.deepEqual(exerciseRecords(list).map((r) => r.name), ['Deadlift', 'Squat'])
})

test('latestWorkout picks the newest by date', () => {
  const list = [workout('2026-10-01', [['A', 1]], 'Old'), workout('2026-10-20', [['A', 1], ['B', 2]], 'New')]
  assert.deepEqual(latestWorkout(list), { name: 'New', date: '2026-10-20', exerciseCount: 2 })
  assert.equal(latestWorkout([]), null)
})

test('latestWeighIn gives the newest entry and its change from the one before', () => {
  assert.equal(latestWeighIn([]), null)
  const entries = [
    { id: 'b', date: '2026-10-10', weightKg: 79 },
    { id: 'a', date: '2026-10-01', weightKg: 80.2 },
  ]
  assert.deepEqual(latestWeighIn(entries), { date: '2026-10-10', weightKg: 79, changeKg: -1.2 })
  assert.equal(latestWeighIn([entries[0]]).changeKg, null)
})

test('buildProgress with no data gives honest zeros and nulls', () => {
  const p = buildProgress([], { entries: [], startingKg: null, targetKg: null }, TODAY)
  assert.equal(p.totalWorkouts, 0)
  assert.equal(p.thisWeek, 0)
  assert.deepEqual(p.records, [])
  assert.equal(p.newestRecord, null)
  assert.equal(p.latestWorkout, null)
  assert.equal(p.latestWeighIn, null)
  assert.equal(p.weight.currentKg, null)
})
