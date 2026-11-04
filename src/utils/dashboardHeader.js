// Greeting and date line for the top of the dashboard.
// `now` is injectable so these can be tested in plain Node.

export function getGreeting(now = new Date()) {
  const hour = now.getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export function formatLongDate(now = new Date()) {
  return now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
