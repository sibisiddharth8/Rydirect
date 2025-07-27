import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyLinkPassword, getPublicProfile, getPublicLinks } from '../../api/publicService';
import Button from '../../components/ui/Button';
import { Lock, Link as LinkIcon, ArrowRight } from 'lucide-react';
import Loader from '../../components/ui/Loader';

const UnlockPage = () => {
  const [searchParams] = useSearchParams();
  const shortCode = searchParams.get('link');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [user, setUser] = useState(null);
  const [publicLinks, setPublicLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, linksData] = await Promise.all([ getPublicProfile(), getPublicLinks() ]);
        setUser(userData);
        setPublicLinks(linksData);
      } catch (err) {
        console.error("Failed to load public data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await verifyLinkPassword(shortCode, password);
      // Add a slight delay before redirecting to show success
      setTimeout(() => {
        window.location.href = data.redirectTo;
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect password.');
      // Trigger shake animation on error
      const input = document.getElementById('password-input');
      if (input) {
        input.classList.add('animate-shake');
        setTimeout(() => input.classList.remove('animate-shake'), 500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shortCode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Invalid Link</h2>
            <p className="text-slate-600">No link specified. Please check the URL.</p>
        </div>
      </div>
    );
  }
  
  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-100"><Loader /></div>;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-slate-100">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 h-full w-full">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-300 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between h-full w-full max-w-3xl text-center py-8 sm:py-12">
            
            {/* Header: Your Profile */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center text-center"
            >
                <img 
                    src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.name || 'S'}&background=3b82f6&color=fff&size=96`}
                    alt="Profile"
                    className="w-28 h-28 rounded-full mb-4 border-4 border-white/80 shadow-lg"
                />
                <h1 className="text-2xl font-bold text-slate-800">{user?.name || "MyMind"}</h1>
            </motion.div>

            {/* Center Content: Password Form */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full max-w-sm"
            >
                <div className="mx-auto w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow">
                    <Lock className="text-slate-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Link Locked</h2>
                <p className="text-slate-600 text-sm mt-1">This content is password protected.</p>
                
                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="relative">
                      <input
                          id="password-input"
                          type="password"
                          required
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-4 pr-12 py-3 text-center text-lg font-semibold bg-white border border-slate-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <button type="submit" disabled={isSubmitting} className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-blue-400">
                          {isSubmitting ? (
                              <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                          ) : (
                              <ArrowRight size={20} />
                          )}
                      </button>
                  </div>
                  <AnimatePresence>
                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-600 text-center pt-2"
                        >
                            {error}
                        </motion.p>
                    )}
                  </AnimatePresence>
                </form>
            </motion.div>

            {/* Footer: Your Public Links */}
            {publicLinks && publicLinks.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-semibold text-slate-500 mb-3">Or explore other public links</p>
                    <div className="flex items-center justify-center flex-wrap gap-4">
                        {publicLinks.slice(0, 5).map((plink) => (
                        <a key={plink.id} href={`${import.meta.env.VITE_LINKS_BASE_URL}/${plink.shortCode}`} title={plink.name} className="group">
                            <div className="w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-full shadow-md border-2 border-transparent transition-all hover:shadow-lg hover:border-white">
                            {plink.iconUrl ? 
                                <img src={plink.iconUrl} alt={plink.name} className="w-6 h-6 object-contain" /> :
                                <LinkIcon size={20} className="text-slate-500" />
                            }
                            </div>
                        </a>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    </div>
  );
};

export default UnlockPage;