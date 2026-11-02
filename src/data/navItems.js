import {
  LayoutDashboard,
  Dumbbell,
  CalendarDays,
  Scale,
  TrendingUp,
  Target,
} from 'lucide-react'

// The sidebar menu. To add a page, add a line here.
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'workouts', label: 'My Workouts', icon: Dumbbell },
  { id: 'planner', label: 'Workout Planner', icon: CalendarDays },
  { id: 'weight', label: 'Weight Tracker', icon: Scale },
  { id: 'progress', label: 'My Progress', icon: TrendingUp },
  { id: 'goals', label: 'My Goals', icon: Target },
]
