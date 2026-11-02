import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { NAV_ITEMS } from './data/navItems'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Placeholder from './pages/Placeholder'
import './styles/layout.css'

export default function App() {
  // Which page is showing, and whether the mobile menu is open.
  const [activePage, setActivePage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  function handleNavigate(id) {
    setActivePage(id)
    setMenuOpen(false) // close the drawer on mobile after choosing
  }

  const current = NAV_ITEMS.find((item) => item.id === activePage)

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
            <Dashboard />
          ) : (
            <Placeholder title={current.label} icon={current.icon} />
          )}
        </main>
      </div>
    </div>
  )
}
