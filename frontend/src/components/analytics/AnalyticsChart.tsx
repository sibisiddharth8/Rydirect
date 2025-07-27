import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 shadow-lg rounded-lg border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">{`Date: ${label}`}</p>
        <p className="text-sm text-blue-600">{`Clicks: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AnalyticsChart = ({ data }) => {
  return (
    <div className="bg-white pb-10 px-4 pt-4 rounded-lg shadow-md h-96">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Clicks Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;