import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import { Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';

const ShareProfileModal = ({ isOpen, onClose, url }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (url) {
      QRCode.toDataURL(url, { width: 300, margin: 2 }, (err, dataUrl) => {
        if (err) console.error(err);
        setQrCodeUrl(dataUrl);
      });
    }
  }, [url]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('Profile URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Profile">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm text-slate-500 mb-4">
          Share this QR code or copy the link below.
        </p>
        {qrCodeUrl && <img src={qrCodeUrl} alt="Profile QR Code" className="rounded-lg border" />}
        <div className="w-full mt-4 flex items-center justify-between bg-slate-100 p-2 rounded-lg">
          <span className="text-sm text-slate-600 truncate ml-2">{url}</span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-md bg-white text-slate-500 hover:bg-slate-200"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareProfileModal;