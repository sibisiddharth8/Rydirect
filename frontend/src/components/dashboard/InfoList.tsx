import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const listVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1 
    } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const InfoList = ({ title, items }) => {
  return (
    <motion.div
      variants={listVariants}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <motion.li 
            key={index}
            variants={itemVariants}
            className="flex items-center justify-between text-sm"
          >
            <div>
              <p className="font-medium text-slate-700">{item.primary}</p>
              <p className="text-slate-500">{item.secondary}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">{item.value}</span>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default InfoList;