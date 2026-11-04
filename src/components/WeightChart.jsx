import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import SampleBadge from './SampleBadge'
import { SAMPLE_WEIGHT_HISTORY, SAMPLE_USER } from '../data/sampleData'

export default function WeightChart() {
  const unit = SAMPLE_USER.unit
  return (
    <section className="card">
      <div className="card-head">
        <h2>Weight Progress</h2>
        <SampleBadge />
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SAMPLE_WEIGHT_HISTORY} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#243229" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" stroke="#8da095" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis
              stroke="#8da095"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(v) => Math.round(v)}
            />
            <Tooltip
              contentStyle={{
                background: '#19241d',
                border: '1px solid #243229',
                borderRadius: 10,
                color: '#e8f0ea',
              }}
              formatter={(value) => [`${value} ${unit}`, 'Weight']}
            />
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
    </section>
  )
}
