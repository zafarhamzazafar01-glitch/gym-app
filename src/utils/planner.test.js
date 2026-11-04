import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DAYS, emptyPlanForm, validatePlanForm, formToPlanFields, planToForm,
  addPlan, updatePlan, deletePlan, groupByDay, loadPlans, savePlans,
} from './planner.js'

function validForm() {
  const form = emptyPlanForm('Tuesday')
  form.name = ' Push Day '
  Object.assign(form.exercises[0], { name: 'Bench Press', sets: '4', reps: '8', weightKg: '60' })
  return form
}

test('valid form passes and converts to numbers', () => {
  const form = validForm()
  assert.equal(validatePlanForm(form).isValid, true)
  const fields = formToPlanFields(form)
  assert.equal(fields.name, 'Push Day')
  assert.deepEqual(
    [fields.exercises[0].sets, fields.exercises[0].reps, fields.exercises[0].weightKg],
    [4, 8, 60],
  )
})

test('empty form reports errors; blank weight is allowed', () => {
  const { isValid, errors } = validatePlanForm(emptyPlanForm())
  assert.equal(isValid, false)
  assert.ok(errors.name)
  const form = validForm()
  form.exercises[0].weightKg = ''
  assert.equal(validatePlanForm(form).isValid, true)
  assert.equal(formToPlanFields(form).exercises[0].weightKg, 0)
})

test('rejects bad sets, reps and weight', () => {
  const form = validForm()
  Object.assign(form.exercises[0], { sets: '0', reps: '2.5', weightKg: '-1' })
  const e = validatePlanForm(form).errors.exerciseErrors[form.exercises[0].id]
  assert.ok(e.sets && e.reps && e.weightKg)
})

test('add / update / delete are immutable', () => {
  const a = addPlan([], formToPlanFields(validForm()), 'a')
  const b = updatePlan(a, 'a', { name: 'Pull' })
  assert.equal(a[0].name, 'Push Day')
  assert.equal(b[0].name, 'Pull')
  assert.deepEqual(deletePlan(b, 'a'), [])
})

test('planToForm round-trips', () => {
  const fields = formToPlanFields(validForm())
  assert.deepEqual(formToPlanFields(planToForm({ id: 'x', ...fields })), fields)
})

test('groupByDay includes every day', () => {
  const plans = addPlan([], formToPlanFields(validForm()), 'a')
  const g = groupByDay(plans)
  assert.deepEqual(Object.keys(g), DAYS)
  assert.equal(g.Tuesday.length, 1)
  assert.equal(g.Monday.length, 0)
})

test('storage round-trips and never throws', () => {
  const mem = { v: null, getItem() { return this.v }, setItem(_, v) { this.v = v } }
  assert.deepEqual(loadPlans(mem), [])
  assert.equal(savePlans([{ id: 1 }], mem), true)
  assert.deepEqual(loadPlans(mem), [{ id: 1 }])
  mem.v = '{bad'
  assert.deepEqual(loadPlans(mem), [])
  assert.equal(savePlans([], { setItem() { throw new Error('full') } }), false)
})
