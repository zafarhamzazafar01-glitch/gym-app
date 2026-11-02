import '../styles/dashboard.css'

export default function Placeholder({ title, icon: Icon }) {
  return (
    <div className="card placeholder">
      <Icon size={40} />
      <h2>{title}</h2>
      <p className="muted">This page is coming soon. We&apos;ll build it in a later step.</p>
    </div>
  )
}
