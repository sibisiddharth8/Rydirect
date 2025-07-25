import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';
import { getQrCodeDataUrl } from '../../api/utilityService';

const QrCodeModal = ({ isOpen, onClose, shortUrl }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

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
    // Extract short code from URL for the filename
    const filename = shortUrl.split('/').pop() || 'qrcode';
    link.download = `${filename}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link QR Code">
      <div className="flex flex-col items-center justify-center p-4">
        {loading ? (
          <Loader text="Generating QR Code..." />
        ) : (
          qrCodeUrl && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 rounded-lg border" />
              <p className="mt-4 text-sm font-semibold text-blue-600 break-all">{shortUrl}</p>
              <button
                onClick={handleDownload}
                className="mt-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Download size={16} />
                Download
              </button>
            </motion.div>
          )
        )}
      </div>
    </Modal>
  );
};

export default QrCodeModal;