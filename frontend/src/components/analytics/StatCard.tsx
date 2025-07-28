import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, note }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
      className="bg-white p-5 rounded-xl shadow-md space-y-2"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`p-2 rounded-full ${color.replace('text-', 'bg-')}/10`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
      <p className="text-xl sm:text-3xl font-bold text-slate-800 truncate" title={value}>
        {value}
      </p>
      {note && <p className="text-xs text-slate-400">{note}</p>}
    </motion.div>
  );
};

export default StatCard;