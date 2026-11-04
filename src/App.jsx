import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import { NAV_ITEMS } from './data/navItems'
import Header from './components/Header'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import MyWorkouts from './pages/MyWorkouts'
import WorkoutPlanner from './pages/WorkoutPlanner'
import WeightTracker from './pages/WeightTracker'
import MyProgress from './pages/MyProgress'
import MyGoals from './pages/MyGoals'
import Placeholder from './pages/Placeholder'
import './styles/layout.css'

export default function App() {
  // Which page is showing, and whether the mobile menu is open.
  const [activePage, setActivePage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  // The app starts on the welcome page until the user presses Get started.
  const [started, setStarted] = useState(false)

  function handleNavigate(id) {
    setActivePage(id)
    setMenuOpen(false) // close the drawer on mobile after choosing
  }

  const current = NAV_ITEMS.find((item) => item.id === activePage)

  // Push a history entry on start so the browser Back button returns to the
  // welcome page (and Forward re-opens the app).
  function handleStart() {
    window.history.pushState({ app: true }, '')
    setStarted(true)
  }

  useEffect(() => {
    const onPopState = (e) => setStarted(Boolean(e.state?.app))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  if (!started) {
    return <Welcome onStart={handleStart} />
  }

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <div className="main">
        <Header onMenuClick={() => setMenuOpen(true)} />
        <main className="content">
          {activePage === 'dashboard' ? (
            <Dashboard onNavigate={handleNavigate} />
          ) : activePage === 'workouts' ? (
            <MyWorkouts />
          ) : activePage === 'planner' ? (
            <WorkoutPlanner />
          ) : activePage === 'weight' ? (
            <WeightTracker />
          ) : activePage === 'progress' ? (
            <MyProgress />
          ) : activePage === 'goals' ? (
            <MyGoals />
          ) : (
            <Placeholder title={current.label} icon={current.icon} />
          )}
        </main>
      </div>
    </div>
  )
}
