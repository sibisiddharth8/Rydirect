import { motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-6 rounded-lg"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
};

export default AuthCard;