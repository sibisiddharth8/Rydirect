import { motion } from 'framer-motion';
import { Link as LinkIcon, Plus } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  onAction: () => void;
  actionText: string;
}

const EmptyState = ({ title, message, onAction, actionText }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <LinkIcon className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      <div className="mt-6 flex justify-center">
        <Button onClick={onAction}>
          <Plus size={16} />
          {actionText}
        </Button>
      </div>
    </motion.div>
  );
};

export default EmptyState;