import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BrandedDesign = ({ destination, duration }) => {
  const [countdown, setCountdown] = useState(duration);

  // This countdown and redirect logic is the same as the minimal design
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
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="flex flex-col items-center"
      >
        {/* Placeholder for your logo */}
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <p className="text-4xl font-bold">S</p>
        </div>
        
        <h1 className="text-4xl font-bold">MyMind</h1>
        <p className="text-white/80 mt-2">is redirecting you to</p>
        <p className="text-2xl font-semibold mt-4 bg-white/10 px-4 py-2 rounded-md">{domain}</p>
        
        <div className="absolute bottom-10">
          <p className="text-sm text-white/60">This will take {countdown} seconds...</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BrandedDesign;