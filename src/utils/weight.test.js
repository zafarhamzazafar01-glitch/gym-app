import test from 'node:test'
import assert from 'node:assert/strict'
import {
  EMPTY_WEIGHT_DATA, validateKg, validateEntryForm, validateGoalsForm, goalsFromForm,
  addEntry, updateEntry, deleteEntry, sortByDate, summarize, loadWeightData, saveWeightData,
} from './weight.js'

const TODAY = '2026-11-04'

test('validateKg accepts sensible numbers and rejects the rest', () => {
  assert.equal(validateKg('80.5'), undefined)
  assert.ok(validateKg(''))
  assert.ok(validateKg('abc'))
  assert.ok(validateKg('5'))
  assert.ok(validateKg('900'))
})

test('entry form: needs date and weight, no future dates', () => {
  assert.equal(validateEntryForm({ date: TODAY, weight: '80' }, [], TODAY).isValid, true)
  assert.ok(validateEntryForm({ date: '', weight: '80' }, [], TODAY).errors.date)
  assert.ok(validateEntryForm({ date: '2026-12-01', weight: '80' }, [], TODAY).errors.date)
  assert.ok(validateEntryForm({ date: TODAY, weight: '' }, [], TODAY).errors.weight)
})

test('entry form: one entry per date, but editing your own entry is fine', () => {
  const entries = addEntry([], { date: '2026-11-01', weightKg: 80 }, 'a')
  const form = { date: '2026-11-01', weight: '79' }
  assert.ok(validateEntryForm(form, entries, TODAY).errors.date)
  assert.equal(validateEntryForm(form, entries, TODAY, 'a').isValid, true)
})

test('goals form: blank is allowed, bad numbers are not', () => {
  assert.equal(validateGoalsForm({ startingKg: '', targetKg: '' }).isValid, true)
  assert.ok(validateGoalsForm({ startingKg: '', targetKg: '3' }).errors.targetKg)
  assert.deepEqual(goalsFromForm({ startingKg: '', targetKg: '75' }), { startingKg: null, targetKg: 75 })
})

test('add / update / delete are immutable; sortByDate orders oldest first', () => {
  const a = addEntry([], { date: '2026-11-03', weightKg: 80 }, 'a')
  const b = addEntry(a, { date: '2026-11-01', weightKg: 81 }, 'b')
  const c = updateEntry(b, 'a', { date: '2026-11-03', weightKg: 79 })
  assert.equal(b[0].weightKg, 80)
  assert.equal(c[0].weightKg, 79)
  assert.deepEqual(sortByDate(c).map((e) => e.id), ['b', 'a'])
  assert.deepEqual(deleteEntry(c, 'a').map((e) => e.id), ['b'])
})

test('summarize with no data gives nulls', () => {
  const s = summarize(EMPTY_WEIGHT_DATA)
  assert.equal(s.currentKg, null)
  assert.equal(s.progress, null)
})

test('summarize uses earliest entry as starting weight unless overridden', () => {
  let entries = addEntry([], { date: '2026-11-03', weightKg: 78 }, 'a')
  entries = addEntry(entries, { date: '2026-11-01', weightKg: 82 }, 'b')
  const auto = summarize({ entries, startingKg: null, targetKg: 74 })
  assert.equal(auto.currentKg, 78)
  assert.equal(auto.startingKg, 82)
  assert.equal(auto.changeKg, -4)
  assert.equal(auto.toGoKg, 4)
  assert.equal(auto.progress, 50)
  assert.equal(summarize({ entries, startingKg: 90, targetKg: 74 }).startingKg, 90)
})

test('progress is clamped and safe when start equals target', () => {
  const entries = addEntry([], { date: '2026-11-01', weightKg: 85 }, 'a')
  assert.equal(summarize({ entries, startingKg: 80, targetKg: 70 }).progress, 0)
  assert.equal(summarize({ entries, startingKg: 100, targetKg: 90 }).progress, 100)
  assert.equal(summarize({ entries, startingKg: 85, targetKg: 85 }).progress, null)
})

test('storage round-trips and never throws', () => {
  const mem = { v: null, getItem() { return this.v }, setItem(_, v) { this.v = v } }
  assert.deepEqual(loadWeightData(mem), EMPTY_WEIGHT_DATA)
  const data = { entries: [{ id: 'a', date: '2026-11-01', weightKg: 80 }], startingKg: 82, targetKg: 75 }
  assert.equal(saveWeightData(data, mem), true)
  assert.deepEqual(loadWeightData(mem), data)
  mem.v = '{bad'
  assert.deepEqual(loadWeightData(mem), EMPTY_WEIGHT_DATA)
  mem.v = JSON.stringify({ entries: [{ date: 1 }, null, { id: 'x', date: 'd', weightKg: 70 }] })
  assert.equal(loadWeightData(mem).entries.length, 1)
  assert.equal(saveWeightData(data, { setItem() { throw new Error('full') } }), false)
})
