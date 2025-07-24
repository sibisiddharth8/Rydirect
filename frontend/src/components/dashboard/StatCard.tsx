import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: Icon;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
    >
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full`} style={{ backgroundColor: color }}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </motion.div>
  );
};

export default StatCard;