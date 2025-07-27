import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Pause, Play, SkipForward } from 'lucide-react';

const MinimalDesign = ({ destination, duration, user, publicLinks }) => {
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
  const progressPercentage = (countdown / duration) * 100;

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    window.location.href = destination;
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-100 text-center p-4 sm:p-8">
      <div className="w-full max-w-lg flex flex-col items-center">
        
        {/* --- Profile Section --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <motion.img 
            src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.name || 'S'}&background=e2e8f0&color=64748b&size=128`} 
            alt="Profile" 
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
          />
          <h2 className="text-2xl font-bold text-slate-800 mt-4">{user.name || "MyMind"}</h2>
          <p className="text-slate-500 text-sm">is redirecting you to...</p>
        </motion.div>

        {/* --- Main Redirect Content --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full mt-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-600 mt-1 break-all">{domain}</h1>
          
          <div className="relative w-full mx-auto mt-6 bg-slate-200 rounded-full h-2">
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
              style={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={() => setIsPaused(!isPaused)} className="p-3 text-slate-500 hover:text-blue-600 hover:bg-slate-200 rounded-full transition-colors" title={isPaused ? "Resume" : "Pause"}>
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <span className="text-lg font-semibold text-slate-700 w-12">{countdown}s</span>
            <button onClick={handleSkip} className="p-3 text-slate-500 hover:text-blue-600 hover:bg-slate-200 rounded-full transition-colors" title="Skip">
              <SkipForward size={20} />
            </button>
          </div>
        </motion.div>

        {/* --- Redesigned Footer Links --- */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full mt-12"
        >
          <p className="text-sm font-semibold text-slate-600 mb-4">Explore my other links</p>
          <div className="flex items-center justify-center flex-wrap gap-5">
            {publicLinks.slice(0, 5).map((link, i) => (
              <motion.a 
                key={link.id}
                href={`${import.meta.env.VITE_LINKS_BASE_URL}/${link.shortCode}`}
                title={link.name}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.15, y: -5, transition: { type: 'spring', stiffness: 300 } }}
              >
                <div className="w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-md border-2 border-transparent transition-all group-hover:shadow-lg group-hover:border-blue-500">
                  {link.iconUrl ? 
                    <img src={link.iconUrl} alt={link.name} className="w-8 h-8 object-contain" /> :
                    <LinkIcon size={24} className="text-slate-400" />
                  }
                </div>
                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-600 transition-opacity opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {link.name}
                 </span>
              </motion.a>
            ))}
          </div>
        </motion.footer>
        {/* copyrights */}
        <div className="text-center text-sm text-slate-500 mt-8 fixed bottom-2 w-full">
          <p>&copy; {new Date().getFullYear()} <span className='font-semibold'>Sibi Siddharth S</span>. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default MinimalDesign;