import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getGreeting, formatLongDate } from './dashboardHeader.js'

test('greeting follows the time of day', () => {
  assert.equal(getGreeting(new Date(2025, 10, 3, 6)), 'Good Morning')
  assert.equal(getGreeting(new Date(2025, 10, 3, 12)), 'Good Afternoon')
  assert.equal(getGreeting(new Date(2025, 10, 3, 18)), 'Good Evening')
})

test('long date shows weekday, month and day', () => {
  assert.equal(formatLongDate(new Date(2025, 10, 4)), 'Tuesday, November 4')
})
