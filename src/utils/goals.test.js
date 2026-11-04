import test from 'node:test'
import assert from 'node:assert/strict'
import {
  validateGoalForm, goalFromForm, goalToForm, baselineFor, goalTitle,
  addGoal, updateGoal, completeGoal, reopenGoal, deleteGoal, splitGoals,
  goalProgress, loadGoals, saveGoals,
} from './goals.js'

const NO_WEIGHT = { entries: [], startingKg: null, targetKg: null }
const ctx = (over = {}) => ({ weightData: NO_WEIGHT, thisWeek: 0, records: [], ...over })

test('validation: each goal type checks its own target', () => {
  assert.equal(validateGoalForm({ type: 'weight', target: '75', exercise: '' }).isValid, true)
  assert.ok(validateGoalForm({ type: 'weight', target: '5', exercise: '' }).errors.target)
  assert.equal(validateGoalForm({ type: 'workouts', target: '4', exercise: '' }).isValid, true)
  assert.ok(validateGoalForm({ type: 'workouts', target: '0', exercise: '' }).errors.target)
  assert.ok(validateGoalForm({ type: 'workouts', target: '2.5', exercise: '' }).errors.target)
  assert.ok(validateGoalForm({ type: 'workouts', target: '99', exercise: '' }).errors.target)
  assert.ok(validateGoalForm({ type: 'bogus', target: '4', exercise: '' }).errors.type)
})

test('validation: strength goals need an exercise and a positive target', () => {
  assert.equal(validateGoalForm({ type: 'strength', target: '100', exercise: 'Bench Press' }).isValid, true)
  assert.ok(validateGoalForm({ type: 'strength', target: '100', exercise: '  ' }).errors.exercise)
  assert.ok(validateGoalForm({ type: 'strength', target: '-5', exercise: 'Squat' }).errors.target)
  assert.ok(validateGoalForm({ type: 'strength', target: '', exercise: 'Squat' }).errors.target)
})

test('goalFromForm gives numbers and tidy text; goalToForm reverses it', () => {
  const goal = goalFromForm({ type: 'strength', target: '100', exercise: '  Bench   Press ' })
  assert.deepEqual(goal, { type: 'strength', target: 100, exercise: 'Bench Press' })
  assert.deepEqual(goalToForm(goal), { type: 'strength', target: '100', exercise: 'Bench Press' })
  assert.equal(goalFromForm({ type: 'weight', target: '75', exercise: 'stale' }).exercise, '')
})

test('addGoal puts the new goal first, pending; baseline only comes from the caller', () => {
  const goals = addGoal([], { type: 'weight', target: 75, exercise: '', baselineKg: 82 }, '2026-11-04T10:00:00Z', 'g1')
  const next = addGoal(goals, { type: 'workouts', target: 4, exercise: '' }, '2026-11-04T11:00:00Z', 'g2')
  assert.deepEqual(next.map((g) => g.id), ['g2', 'g1'])
  assert.equal(next[0].completed, false)
  assert.equal(next[0].baselineKg, null)
  assert.equal(next[1].baselineKg, 82)
})

test('baselineFor only applies to weight goals', () => {
  const data = { entries: [{ id: 'a', date: '2026-10-01', weightKg: 82 }], startingKg: null, targetKg: null }
  assert.equal(baselineFor('weight', data), 82)
  assert.equal(baselineFor('workouts', data), null)
  assert.equal(baselineFor('weight', NO_WEIGHT), null)
})

test('update, complete, reopen and delete are immutable and keep the rest', () => {
  const goals = addGoal([], { type: 'strength', target: 100, exercise: 'Squat' }, '2026-11-04T10:00:00Z', 'g1')
  const edited = updateGoal(goals, 'g1', { target: 110, exercise: 'Back Squat' })
  assert.equal(edited[0].target, 110)
  assert.equal(edited[0].exercise, 'Back Squat')
  assert.equal(goals[0].target, 100)

  const done = completeGoal(edited, 'g1', '2026-11-05T00:00:00Z')
  assert.equal(done[0].completed, true)
  assert.equal(done[0].completedAt, '2026-11-05T00:00:00Z')

  const reopened = reopenGoal(done, 'g1')
  assert.equal(reopened[0].completed, false)
  assert.equal(reopened[0].completedAt, null)

  assert.deepEqual(deleteGoal(reopened, 'g1'), [])
})

test('updateGoal never gives a non-strength goal an exercise', () => {
  const goals = addGoal([], { type: 'workouts', target: 3, exercise: '' }, '2026-11-04T10:00:00Z', 'g1')
  assert.equal(updateGoal(goals, 'g1', { target: 4, exercise: 'Squat' })[0].exercise, '')
})

test('splitGoals separates pending from achieved', () => {
  let goals = addGoal([], { type: 'workouts', target: 3, exercise: '' }, '2026-11-01T00:00:00Z', 'a')
  goals = addGoal(goals, { type: 'workouts', target: 4, exercise: '' }, '2026-11-02T00:00:00Z', 'b')
  goals = addGoal(goals, { type: 'workouts', target: 5, exercise: '' }, '2026-11-03T00:00:00Z', 'c')
  goals = completeGoal(goals, 'a', '2026-11-06T00:00:00Z')
  const { pending, achieved } = splitGoals(goals)
  assert.deepEqual(pending.map((g) => g.id), ['c', 'b'])
  assert.deepEqual(achieved.map((g) => g.id), ['a'])
})

test('goalTitle reads naturally', () => {
  assert.equal(goalTitle({ type: 'weight', target: 75, exercise: '' }), 'Reach 75 kg')
  assert.equal(goalTitle({ type: 'workouts', target: 4, exercise: '' }), 'Work out 4× per week')
  assert.equal(goalTitle({ type: 'strength', target: 100, exercise: 'Bench Press' }), 'Bench Press: 100 kg')
})

test('progress: weekly workouts is this week divided by the target, capped at 100', () => {
  const goal = { type: 'workouts', target: 4 }
  assert.equal(goalProgress(goal, ctx({ thisWeek: 1 })).percent, 25)
  assert.equal(goalProgress(goal, ctx({ thisWeek: 6 })).percent, 100)
  assert.equal(goalProgress(goal, ctx()).percent, 0)
})

test('progress: strength uses the best lift for that exercise, ignoring case', () => {
  const goal = { type: 'strength', target: 100, exercise: 'bench press' }
  const records = [{ key: 'bench press', name: 'Bench Press', prKg: 80 }]
  assert.equal(goalProgress(goal, ctx({ records })).percent, 80)
  assert.equal(goalProgress(goal, ctx()).percent, 0)
  assert.equal(goalProgress(goal, ctx({ records: [{ key: 'bench press', prKg: 120 }] })).percent, 100)
})

test('progress: weight goal runs from the starting weight to the target (losing)', () => {
  const goal = { type: 'weight', target: 80, baselineKg: 90 }
  const data = (kg) => ({ entries: [{ id: 'a', date: '2026-11-01', weightKg: kg }], startingKg: null, targetKg: null })
  assert.equal(goalProgress(goal, ctx({ weightData: data(85) })).percent, 50)
  assert.equal(goalProgress(goal, ctx({ weightData: data(95) })).percent, 0)
  assert.equal(goalProgress(goal, ctx({ weightData: data(79) })).percent, 100)
})

test('progress: weight goal works for gaining too, and says so when there is no data', () => {
  const goal = { type: 'weight', target: 80, baselineKg: 70 }
  const data = { entries: [{ id: 'a', date: '2026-11-01', weightKg: 75 }], startingKg: null, targetKg: null }
  assert.equal(goalProgress(goal, ctx({ weightData: data })).percent, 50)
  assert.equal(goalProgress(goal, ctx()).percent, null)
})

test('progress: a weight goal with no saved baseline falls back to the earliest weigh-in', () => {
  const goal = { type: 'weight', target: 80, baselineKg: null }
  const data = {
    entries: [
      { id: 'a', date: '2026-10-01', weightKg: 90 },
      { id: 'b', date: '2026-11-01', weightKg: 85 },
    ],
    startingKg: null, targetKg: null,
  }
  assert.equal(goalProgress(goal, ctx({ weightData: data })).percent, 50)
})

test('storage: round-trips, and bad data gives an empty list', () => {
  const store = {}
  const storage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v } }
  const goals = addGoal([], { type: 'weight', target: 75, exercise: '', baselineKg: 82 }, '2026-11-04T10:00:00Z', 'g1')
  assert.equal(saveGoals(goals, storage), true)
  assert.deepEqual(loadGoals(storage), goals)

  assert.deepEqual(loadGoals({ getItem: () => 'not json' }), [])
  assert.deepEqual(loadGoals({ getItem: () => '{"a":1}' }), [])
  assert.deepEqual(loadGoals({ getItem: () => JSON.stringify([{ id: 'x', type: 'weight' }, null, { id: 'y', type: 'nope', target: 1 }]) }), [])
  assert.equal(saveGoals(goals, { setItem: () => { throw new Error('full') } }), false)
})
