import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SampleBadge from './SampleBadge'
import { SAMPLE_WEEKLY_ACTIVITY } from '../data/sampleData'

export default function WeeklyActivityChart() {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Weekly Workout Activity</h2>
        <SampleBadge />
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SAMPLE_WEEKLY_ACTIVITY} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#243229" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" stroke="#8da095" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis
              stroke="#8da095"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              allowDecimals={false}
              domain={[0, 'dataMax + 1']}
            />
            <Tooltip
              cursor={{ fill: 'rgba(34, 197, 94, 0.08)' }}
              contentStyle={{
                background: '#19241d',
                border: '1px solid #243229',
                borderRadius: 10,
                color: '#e8f0ea',
              }}
              formatter={(value) => [value, 'Workouts']}
            />
            <Bar dataKey="workouts" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
