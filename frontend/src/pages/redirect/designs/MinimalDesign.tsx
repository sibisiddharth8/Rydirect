import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MinimalDesign = ({ destination, duration }) => {
  const [countdown, setCountdown] = useState(duration);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = destination;
    }
  }, [countdown, destination]);

  const domain = new URL(destination).hostname.replace('www.', '');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-center p-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-slate-500">Redirecting you to</p>
        <h1 className="text-3xl font-bold text-slate-800 mt-1">{domain}</h1>
        <div className="mt-8 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-slate-400 mt-4">in {countdown} seconds...</p>
      </motion.div>
    </div>
  );
};

export default MinimalDesign;