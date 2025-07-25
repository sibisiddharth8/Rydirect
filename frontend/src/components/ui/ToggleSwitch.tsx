import { motion } from 'framer-motion';

const ToggleSwitch = ({ enabled, onChange, name, id }) => {
  return (
    <div
      onClick={() => onChange({ target: { name, checked: !enabled, type: 'checkbox' } })}
      className={`flex w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
        enabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
      }`}
    >
      <input type="checkbox" name={name} id={id} checked={enabled} onChange={() => {}} className="hidden" />
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        className="w-5 h-5 m-0.5 bg-white rounded-full shadow-md"
      />
    </div>
  );
};

export default ToggleSwitch;