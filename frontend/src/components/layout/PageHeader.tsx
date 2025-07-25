import { motion } from 'framer-motion';

const PageHeader = ({ title, children }:any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-shrink-0"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <div className="flex items-center gap-2">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;