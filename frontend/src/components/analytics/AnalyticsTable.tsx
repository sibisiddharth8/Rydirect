import { motion } from 'framer-motion';

const AnalyticsTable = ({ title, data }) => {
  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      {data.length > 0 ? (
        <ul className="space-y-4">
          {data.map((item, index) => {
            const percentage = totalClicks > 0 ? (item.clicks / totalClicks) * 100 : 0;
            return (
              <li key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 truncate">{item.name}</span>
                  <span className="font-semibold text-slate-800">{item.clicks}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div 
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 text-center py-8">No data available for this period.</p>
      )}
    </div>
  );
};

export default AnalyticsTable;