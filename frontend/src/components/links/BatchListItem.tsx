import { useState } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import Button from '../ui/Button';

const BatchListItem = ({ batch, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(batch.name);

  const handleSave = () => {
    onUpdate(batch.id, name);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(batch.name);
    setIsEditing(false);
  };

  return (
    <li className="group flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
      {isEditing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="flex-grow border-slate-300 rounded-md shadow-sm text-sm"
          autoFocus
        />
      ) : (
        <span className="text-sm text-slate-700">{batch.name}</span>
      )}
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-100 rounded-md"><Check size={16} /></button>
            <button onClick={handleCancel} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><X size={16} /></button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="p-2 text-slate-500 hover:bg-slate-200 rounded-md"><Edit size={16} /></button>
            <button onClick={() => onDelete(batch)} className="p-2 text-slate-500 hover:bg-slate-200 rounded-md"><Trash2 size={16} /></button>
          </>
        )}
      </div>
    </li>
  );
};

export default BatchListItem;