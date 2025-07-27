import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { uploadImage } from '../../../api/uploadService';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  label: string;
  imageUrl: string | null;
  onUploadSuccess: (url: string) => void;
  onRemove: () => void;
}

const ImageUpload = ({ label, imageUrl, onUploadSuccess, onRemove }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToast();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await uploadImage(file);
      onUploadSuccess(data.imageUrl);
      addToast('Image uploaded successfully!', 'success');
    } catch (error) {
      addToast(error.response?.data?.error || 'Image upload failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess, addToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
  });

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="mt-1 flex items-center gap-4">
        <div
          {...getRootProps()}
          className={`w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center text-center p-2
                      cursor-pointer transition-colors duration-200
                      ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-dashed border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : imageUrl ? (
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
          ) : (
            <div className="text-slate-400">
              <UploadCloud size={24} className="mx-auto" />
              <p className="text-xs mt-1">Drop or click</p>
            </div>
          )}
        </div>
        {imageUrl && (
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

export default ImageUpload;