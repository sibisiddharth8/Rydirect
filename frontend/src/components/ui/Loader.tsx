import { motion } from 'framer-motion';

interface LoaderProps {
  text?: string;
  overlay?: boolean;
  className?: string;
}

const Loader = ({ text, overlay = false, className = '' }: LoaderProps) => {
  // The main loader content with the spinner and text
  const loaderContent = (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`w-8 h-8 border-3 border-dashed border-blue-600 border-t-transparent rounded-full animate-spin ${className}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="mt-4 text-sm font-semibold text-slate-600">{text}</p>}
    </div>
  );

  // If overlay is true, wrap it in a fixed container
  if (overlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      >
        {loaderContent}
      </motion.div>
    );
  }

  // By default, return the loader for use in a content area
  return (
    <div className="w-full h-full flex items-center justify-center">
      {loaderContent}
    </div>
  );
};

export default Loader;