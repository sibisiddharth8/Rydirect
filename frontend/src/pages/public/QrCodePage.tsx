import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getQrPageData } from '../../api/publicService';
import { getQrCodeDataUrl } from '../../api/utilityService';
import Loader from '../../components/ui/Loader';
import { Link as LinkIcon, ScanLine, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const QrCodePage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [data, setData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  
  const fullShortUrl = `${import.meta.env.VITE_LINKS_BASE_URL}/${shortCode}`;

  useEffect(() => {
    if (shortCode) {
      const fetchData = async () => {
        try {
          const [pageData, qrData] = await Promise.all([
            getQrPageData(shortCode),
            getQrCodeDataUrl(fullShortUrl)
          ]);
          setData(pageData);
          setQrCodeUrl(qrData.qrCodeUrl);
        } catch (error) {
          console.error("Failed to load QR page data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [shortCode, fullShortUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    addToast('Short link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100"><Loader /></div>;
  }
  
  if (!data?.link) {
      return <div className="min-h-screen flex items-center justify-center">Link not found.</div>
  }

  const { user, link } = data;
  const domain = new URL(link.redirectTo).hostname.replace('www.', '');

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-100">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      {/* Creator Info (Top Left) */}
      <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6 z-20 flex items-center gap-3"
      >
          <img 
              src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.name || 'S'}&background=e2e8f0&color=64748b&size=40`}
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-white shadow"
          />
          <div>
              <p className="text-xs text-slate-500">Link from</p>
              <p className="font-semibold text-slate-700">{user?.name || "MyMind"}</p>
          </div>
      </motion.div>

      {/* Main QR Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative z-10 w-full max-w-sm backdrop-blur-xl rounded-2xl border border-white/20 text-center p-6 sm:p-8 flex flex-col items-center"
      >
        <div className="flex items-center gap-4 mb-6 justify-center mr-12">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              {link.iconUrl ? <img src={link.iconUrl} alt={link.name} className="w-8 h-8 object-contain" /> : <LinkIcon size={24} className="text-slate-400" />}
          </div>
          <div>
              <h1 className="text-xl font-bold text-slate-800 text-left">{link.name}</h1>
              <p className="text-sm text-slate-500 text-left">{domain}</p>
          </div>
        </div>
        
        <div className="relative inline-block p-4 bg-white rounded-xl border border-slate-200">
          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-52 h-52 sm:w-64 sm:h-64 rounded-lg" />}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center justify-center gap-2">
              <ScanLine size={20} /> Scan Me
          </h2>
          <p className="text-xs text-slate-500 mt-1">Open your camera and point it at the code</p>
        </div>
        
        <div 
          onClick={handleCopy}
          className="w-full mt-4 flex items-center justify-between bg-slate-100 p-2 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
        >
            <span className="text-sm text-slate-600 truncate ml-2 font-medium">{fullShortUrl}</span>
            <div className="p-2 rounded-md bg-white text-slate-500 shadow-sm">
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </div>
        </div>
      </motion.div>

      {/* copyrights */}
      <div className="absolute bottom-4 sm:left-4 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} <span className="font-semibold">Sibi Siddharth S.</span> All rights reserved.
      </div>
    </div>
  );
};

export default QrCodePage;