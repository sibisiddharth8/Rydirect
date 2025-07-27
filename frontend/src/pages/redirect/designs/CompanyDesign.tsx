import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, ArrowRight, Pause, Play, SkipForward } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const CompanyDesign = ({ destination, duration, link, user, publicLinks }) => {
  const [countdown, setCountdown] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused || countdown <= 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdown <= 0) {
        window.location.href = destination;
      }
      return;
    }
    
    timerRef.current = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [countdown, destination, isPaused]);

  const domain = new URL(destination).hostname.replace('www.', '');

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    window.location.href = destination;
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-4 sm:p-8 relative overflow-hidden bg-slate-100">
      {/* Immersive Background */}
      {link.heroImageUrl && (
        <motion.div 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
        >
            <div 
                className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110" 
                style={{ backgroundImage: `url(${link.heroImageUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        </motion.div>
      )}

      {/* Creator's Branding (Top Left) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6 z-20 flex items-center gap-3"
      >
        <img 
          src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.name || 'S'}&background=e2e8f0&color=64748b&size=40`}
          alt="Profile" 
          className="w-10 h-10 rounded-full border-2 border-white shadow"
        />
        <div>
          <p className="text-xs text-slate-500">Presented by</p>
          <p className="font-semibold text-slate-700">{user?.name || "Sibi Siddharth S"}</p>
        </div>
      </motion.div>
      
      {/* Main Content Container - This now uses flexbox correctly */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-3xl text-center py-8 sm:py-12">
        
        {/* Header: Company Branding */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center"
        >
          {link.companyLogoUrl && 
            <img src={link.companyLogoUrl} alt={`${link.companyName} Logo`} className="w-24 h-24 rounded-2xl object-contain bg-white p-2 shadow-lg" />
          }
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mt-6 tracking-tight mb-2">{link.companyName || "Welcome"}</h1>
          {/* <p className="text-lg text-slate-600 mt-2 max-w-xl">{link.name}</p> */}
        </motion.div>
        
        {/* Tagline & Timer Controls */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full max-w-md text-center p-2 mb-8"
        >
            <a href={destination} rel="noopener noreferrer" className="group">
                <p className="text-2xl font-semibold text-blue-700">{link.ctaText || `You are being redirected to ${domain}`}</p>
                <div className="h-0.5 w-16 bg-blue-300 mx-auto mt-2 transition-all duration-300 group-hover:w-24"></div>
            </a>
            <div className="flex items-center justify-center gap-4 mt-8">
                <button onClick={() => setIsPaused(!isPaused)} className="cursor-pointer p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors" title={isPaused ? "Resume" : "Pause"}>
                    {isPaused ? <Play className="text-slate-700" size={20} /> : <Pause className="text-slate-700" size={20} />}
                </button>
                <span className="text-2xl font-bold text-slate-700 w-12">{countdown}s</span>
                <button onClick={handleSkip} className="cursor-pointer p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors" title="Skip">
                    <SkipForward className="text-slate-700" size={20} />
                </button>
            </div>
        </motion.div>

        {/* Footer Public Links */}
        {publicLinks && publicLinks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
              <p className="text-xs font-semibold text-slate-500 mb-3">More links from the creator</p>
              <div className="flex items-center justify-center flex-wrap gap-4">
                  {publicLinks.map((plink) => (
                  <motion.a 
                      key={plink.id}
                      href={`${import.meta.env.VITE_LINKS_BASE_URL}/${plink.shortCode}`}
                      title={plink.name}
                      className="group"
                      whileHover={{ scale: 1.15, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                      <div className="w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-full shadow-md border-2 border-transparent transition-all group-hover:shadow-lg group-hover:border-white">
                      {plink.iconUrl ? 
                          <img src={plink.iconUrl} alt={plink.name} className="w-6 h-6 object-contain" /> :
                          <LinkIcon size={20} className="text-slate-500" />
                      }
                      </div>
                  </motion.a>
                  ))}
              </div>
          </motion.div>
        )}
        <p className='fixed bottom-2 text-sm text-slate-500'>&copy; {new Date().getFullYear()} <span className='font-semibold'>Sibi Siddharth S</span>. All rights reserved.</p>
      </div>
    </div>
  );
};

export default CompanyDesign;