import { Menu } from 'lucide-react'
import Logo from './Logo'
import SampleBadge from './SampleBadge'
import { SAMPLE_USER } from '../data/sampleData'
import '../styles/header.css'

export default function Header({ onMenuClick }) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      {/* Logo only shows here on mobile/tablet; the sidebar has it on desktop */}
      <div className="header-logo">
        <Logo />
      </div>

      <div className="welcome">
        <h1>Welcome back, {SAMPLE_USER.name} 👋</h1>
        <p>Let&apos;s make today count.</p>
      </div>

      <SampleBadge />
    </header>
  )
}
