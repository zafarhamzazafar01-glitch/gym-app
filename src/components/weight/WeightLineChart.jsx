import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { sortByDate } from '../../utils/weight.js'

// 'YYYY-MM-DD' -> 'Nov 4' (built from parts so time zones can't shift the day)
function shortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function WeightLineChart({ entries, targetKg }) {
  const points = sortByDate(entries).map((e) => ({ label: shortDate(e.date), weight: e.weightKg }))

  return (
    <section className="card">
      <div className="card-head">
        <h2>Weight Progress</h2>
        {targetKg !== null && <span className="muted">Dashed line = target</span>}
      </div>
      {points.length === 0 ? (
        <p className="muted empty-state">Add your first weigh-in to see your progress chart.</p>
      ) : (
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#243229" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="#8da095" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                stroke="#8da095"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                domain={[
                  (min) => Math.floor(Math.min(min, targetKg ?? min) - 1),
                  (max) => Math.ceil(Math.max(max, targetKg ?? max) + 1),
                ]}
              />
              <Tooltip
                contentStyle={{
                  background: '#19241d',
                  border: '1px solid #243229',
                  borderRadius: 10,
                  color: '#e8f0ea',
                }}
                formatter={(value) => [`${value} kg`, 'Weight']}
              />
              {targetKg !== null && (
                <ReferenceLine y={targetKg} stroke="#f5b942" strokeDasharray="6 4" />
              )}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 3, fill: '#22c55e' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
