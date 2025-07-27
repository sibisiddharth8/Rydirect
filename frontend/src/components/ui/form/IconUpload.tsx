import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Link as LinkIcon } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { uploadImage } from '../../../api/uploadService';
import { motion } from 'framer-motion';

interface IconUploadProps {
  iconUrl: string | null;
  onUploadSuccess: (url: string) => void;
  onRemove: () => void;
}

const IconUpload = ({ iconUrl, onUploadSuccess, onRemove }: IconUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToast();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await uploadImage(file);
      onUploadSuccess(data.imageUrl);
      addToast('Icon uploaded successfully!', 'success');
    } catch (error) {
      addToast(error.response?.data?.error || 'Icon upload failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess, addToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp', '.svg'] },
    multiple: false,
  });

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Custom Icon</label>
      <div className="mt-1 flex items-center gap-3">
        <div
          {...getRootProps()}
          className={`w-12 h-12 flex-shrink-0 rounded-lg border-2 border-dashed flex items-center justify-center 
                      cursor-pointer transition-colors duration-200
                      ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-dashed border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : iconUrl ? (
            <img src={iconUrl} alt="Icon" className="w-full h-full object-cover rounded-md" />
          ) : (
            <LinkIcon size={20} className="text-slate-400" />
          )}
        </div>
        
        {iconUrl && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 text-xs text-red-600 hover:underline"
          >
            <X size={12} /> Remove
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default IconUpload;