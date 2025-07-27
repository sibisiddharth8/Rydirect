import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
  success: <CheckCircle className="text-green-600" />,
  error: <AlertTriangle className="text-red-600" />,
  info: <Info className="text-blue-600" />,
};

const Toast = ({ message, type, onDismiss }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      // Enhanced glass effect: more transparency, stronger blur, soft border, and deeper shadow
      className="group relative w-full bg-white/40 backdrop-blur-lg shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black/5 border border-white/20"
    >
      <div className="w-full p-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <p className="flex-1 text-sm font-semibold text-slate-900" style={{ textShadow: '0px 1px 2px rgba(255,255,255,0.5)' }}>
            {message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="cursor-pointer absolute top-1 right-1 p-1.5 rounded-full text-slate-500 hover:bg-black/10 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 z-[100]">
            <div className="w-full max-w-sm space-y-3">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ToastContainer;