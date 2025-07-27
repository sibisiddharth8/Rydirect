import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';
import { getQrCodeDataUrl } from '../../api/utilityService';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import RydirectLogo from '../../assets/Rydirect Logo 256x256.png'

const QrCodeModal = ({ isOpen, onClose, shortUrl }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && shortUrl) {
      const fetchQrCode = async () => {
        setLoading(true);
        try {
          const data = await getQrCodeDataUrl(shortUrl);
          setQrCodeUrl(data.qrCodeUrl);
        } catch (error) {
          console.error("Failed to fetch QR code", error);
        } finally {
          setLoading(false);
        }
      };
      fetchQrCode();
    }
  }, [isOpen, shortUrl]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    const filename = shortUrl.split('/').pop() || 'qrcode';
    link.download = `${filename}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    addToast('Short link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Link">
      <div className="flex flex-col items-center justify-center p-4">
        {loading ? (
          <div className="h-72">
            <Loader text="Generating QR Code..." />
          </div>
        ) : (
          qrCodeUrl && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-4"
            >
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 rounded-lg" />
                {/* Your logo in the center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={RydirectLogo} alt="Rydirect Logo" className="w-10 h-10" />
                    </div>
                </div>
              </div>
              

                <div className="flex items-center justify-between bg-slate-100 p-2 rounded-lg w-full">
                    <span className="text-sm text-slate-600 truncate ml-2">{shortUrl}</span>
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-md bg-white text-slate-500 hover:bg-slate-200"
                        title="Copy link"
                    >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                </div>

            <Button onClick={handleDownload} className="cursor-pointer w-fit px-4 py-2 rounded-md flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
                  <Download size={16} />
                  <span className='text-sm font-medium'>Download PNG</span>
                </Button>
            </motion.div>
          )
        )}
      </div>
    </Modal>
  );
};

export default QrCodeModal;