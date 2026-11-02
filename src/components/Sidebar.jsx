import { X } from 'lucide-react'
import Logo from './Logo'
import { NAV_ITEMS } from '../data/navItems'
import '../styles/sidebar.css'

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <>
      {/* Dark overlay behind the drawer on mobile */}
      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => onNavigate(id)}
              title={label}
            >
              <Icon size={20} />
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
