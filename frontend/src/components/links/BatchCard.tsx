import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';

interface BatchCardProps {
  batch: {
    id: string;
    name: string;
    _count: { links: number };
  };
  onClick: (batchId: string) => void;
  isActive: boolean;
}

const BatchCard = ({ batch, onClick, isActive }: BatchCardProps) => {
  // Softer, more professional active state
  const activeClasses = isActive 
    ? 'bg-blue-100 border-blue-500 text-blue-700' 
    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(batch.id)}
      className={`p-3 rounded-lg cursor-pointer border transition-colors duration-200 flex items-center gap-3 ${activeClasses}`}
    >
      <Folder size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'}/>
      <div>
        <h4 className="font-semibold text-sm leading-tight w-[10ch] truncate">{batch.name}</h4>
        <p className={`text-xs pt-1 leading-tight ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
          {batch._count.links} links
        </p>
      </div>
    </motion.div>
  );
};

export default BatchCard;