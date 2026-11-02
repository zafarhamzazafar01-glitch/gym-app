export default function StatCard({ icon: Icon, label, value, hint, progress }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {progress !== undefined && (
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      )}
      {hint && <p className="stat-hint">{hint}</p>}
    </div>
  )
}
