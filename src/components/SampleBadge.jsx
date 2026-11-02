// Small label so sample data is never mistaken for real data.
export default function SampleBadge({ text = 'Sample data' }) {
  return <span className="sample-badge">{text}</span>
}
