import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { uploadImage } from '../../api/uploadService';
import { Camera, X } from 'lucide-react'; // Import the X icon

interface ProfileImageUploadProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  name: string;
}

const ProfileImageUpload = ({ imageUrl, onImageChange, name }: ProfileImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await uploadImage(file);
      onImageChange(data.imageUrl); 
      addToast('Image selected! Click "Save Profile" to confirm.', 'info');
    } catch (error) {
      addToast('Image upload failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex gap-4 flex-col items-center md:items-start">
      <div className="relative w-40 h-40 flex-shrink-0">
        <img
          src={imageUrl || `https://ui-avatars.com/api/?name=${name || 'S'}&background=3b82f6&color=fff&size=128`}
          alt="Profile"
          className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
        />
        <label
          htmlFor="profile-image-upload"
          className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-transform hover:scale-110"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <Camera size={16} />
          )}
          <input id="profile-image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
        </label>
      </div>
      
      {/* --- THIS IS THE FIX --- */}
      {/* Add a remove button that only shows if an image exists */}
      {imageUrl && (
        <button 
          type="button" 
          onClick={() => onImageChange(null)}
          className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-100 rounded-md hover:bg-red-200"
        >
          <X size={14}/> Remove Image
        </button>
      )}
    </div>
  );
};

export default ProfileImageUpload;