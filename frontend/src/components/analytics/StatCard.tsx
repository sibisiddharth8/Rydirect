import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, note }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
      {note && <p className="text-xs text-slate-400 mt-1">{note}</p>}
    </motion.div>
  );
};

export default StatCard;