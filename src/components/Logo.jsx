import { Activity } from 'lucide-react'

export default function Logo() {
  return (
    <div className="logo">
      <span className="logo-mark">
        <Activity size={20} strokeWidth={2.5} />
      </span>
      <span className="logo-text">
        Fit<span>Track</span>
      </span>
    </div>
  )
}
