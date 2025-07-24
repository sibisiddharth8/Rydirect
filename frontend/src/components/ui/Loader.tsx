import { motion } from 'framer-motion';

const Loader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <motion.div
        style={{
          width: 50,
          height: 50,
          border: '5px solid #e2e8f0', // slate-200
          borderTopColor: '#3b82f6', // blue-500
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          loop: Infinity,
          ease: "linear",
          duration: 1,
        }}
      />
      <p className="mt-4 text-sm text-slate-500">{text}</p>
    </div>
  );
};

export default Loader;