import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Pause, Play, SkipForward, Info } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const BrandedDesign = ({ destination, duration, user, publicLinks, link }) => {
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-100">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-300 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-300 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-purple-300 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content Container - Uses gap for responsive spacing */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-3xl text-center">
        
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center py-8"
        >
          <img 
            src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.name || 'S'}&background=3b82f6&color=fff&size=128`}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 border-4 border-white/80 shadow-lg"
          />
          <h1 className="text-3xl font-bold text-slate-800" style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>{user?.name || "MyMind"}</h1>
          <p className="text-slate-600 mt-1" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.1)' }}>is sending you to:</p>
        </motion.div>
        
        {/* Center Content */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full text-center pb-8"
        >
            <div className="relative inline-block group">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-700 break-words tracking-tight" style={{ textShadow: '0px 2px 5px rgba(0,0,0,0.1)' }}>
                    {domain}
                </h2>
                <div className="absolute -top-2 -right-8">
                    <Info size={20} className="text-slate-400 cursor-pointer" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-slate-800 text-white text-xs rounded-md py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {link?.name || 'Link Details'}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-8">
                <button onClick={() => setIsPaused(!isPaused)} className="p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors" title={isPaused ? "Resume" : "Pause"}>
                    {isPaused ? <Play className="text-slate-700" size={20} /> : <Pause className="text-slate-700" size={20} />}
                </button>
                <span className="text-2xl font-bold text-slate-700 w-12" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.1)' }}>{countdown}s</span>
                <button onClick={handleSkip} className="p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors" title="Skip">
                    <SkipForward className="text-slate-700" size={20} />
                </button>
            </div>
        </motion.div>

        {/* Footer */}
        {publicLinks && publicLinks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center pb-8"
          >
              <p className="text-sm font-semibold text-slate-600 mb-4">Explore my other links</p>
              <div className="flex items-center justify-center flex-wrap gap-5">
                  {publicLinks.slice(0, 5).map((link) => (
                  <motion.a 
                      key={link.id}
                      href={`${import.meta.env.VITE_LINKS_BASE_URL}/${link.shortCode}`}
                      title={link.name}
                      className="group"
                      whileHover={{ scale: 1.15, y: -5, transition: { type: 'spring', stiffness: 300 } }}
                  >
                      <div className="w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-md border-2 border-transparent transition-all group-hover:shadow-lg group-hover:border-blue-500">
                      {link.iconUrl ? 
                          <img src={link.iconUrl} alt={link.name} className="w-8 h-8 object-contain" /> :
                          <LinkIcon size={24} className="text-slate-400" />
                      }
                      </div>
                  </motion.a>
                  ))}
              </div>
          </motion.div>
        )}
        {/* Copyright */}
        <div className="text-center text-xs text-slate-500 pt-8">
          <p>&copy; {new Date().getFullYear()} <span className='font-semibold'>{user?.name || "Rydirect"}</span>. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default BrandedDesign;