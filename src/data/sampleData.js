// ============================================================
// SAMPLE DATA ONLY - none of this is real user data.
// Later, this file will be replaced by data the user enters
// (saved in the browser or a database).
// ============================================================

export const SAMPLE_USER = {
  name: 'Hamza',
  weeklyWorkoutGoal: 4,
  unit: 'kg',
}

// Each entry: one weigh-in
export const SAMPLE_WEIGHT_HISTORY = [
  { date: 'Sep 8', weight: 82.4 },
  { date: 'Sep 15', weight: 81.9 },
  { date: 'Sep 22', weight: 81.5 },
  { date: 'Sep 29', weight: 81.1 },
  { date: 'Oct 6', weight: 80.8 },
  { date: 'Oct 13', weight: 80.2 },
  { date: 'Oct 20', weight: 79.9 },
  { date: 'Oct 27', weight: 79.4 },
]

// Most recent first
export const SAMPLE_RECENT_WORKOUTS = [
  { id: 1, name: 'Push Day', date: 'Mon, Oct 27', duration: 58, exercises: 6, thisWeek: true },
  { id: 2, name: 'Leg Day', date: 'Sat, Oct 25', duration: 65, exercises: 7, thisWeek: true },
  { id: 3, name: 'Pull Day', date: 'Thu, Oct 23', duration: 52, exercises: 6, thisWeek: false },
  { id: 4, name: 'Cardio & Core', date: 'Tue, Oct 21', duration: 40, exercises: 5, thisWeek: false },
]

export const SAMPLE_TOTAL_WORKOUTS = 47

// Consecutive days with a workout
export const SAMPLE_STREAK_DAYS = 5

// Workouts logged per day, this week
export const SAMPLE_WEEKLY_ACTIVITY = [
  { day: 'Mon', workouts: 1 },
  { day: 'Tue', workouts: 0 },
  { day: 'Wed', workouts: 1 },
  { day: 'Thu', workouts: 1 },
  { day: 'Fri', workouts: 0 },
  { day: 'Sat', workouts: 1 },
  { day: 'Sun', workouts: 0 },
]

export const SAMPLE_PERSONAL_RECORDS = [
  { lift: 'Bench Press', weight: 90 },
  { lift: 'Squat', weight: 120 },
  { lift: 'Deadlift', weight: 150 },
]
