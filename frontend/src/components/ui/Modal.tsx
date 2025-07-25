import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>

          {/* Fixed Footer */}
          {footer && (
            <div className="flex-shrink-0 p-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-2xl">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;