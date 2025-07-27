import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getPublicLinks, getPublicProfile } from '../../api/publicService';
import Loader from '../../components/ui/Loader';
import { Link as LinkIcon } from 'lucide-react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import { Link } from 'react-router-dom';

// A single "star" in our constellation
const LinkStar = ({ link }) => {
  return (
    <motion.a
      href={`${import.meta.env.VITE_LINKS_BASE_URL}/${link.shortCode}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative z-20"
      title={link.name}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1, zIndex: 50 }} // Hover scale is now smaller
    >
      <div className="w-14 h-14 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full shadow-lg border-2 border-white/50 transition-all group-hover:border-blue-300">
        {link.iconUrl ? 
          <img src={link.iconUrl} alt={link.name} className="w-8 h-8 object-contain" /> :
          <LinkIcon size={24} className="text-slate-400" />
        }
      </div>
      <div className="absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded-md py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap left-1/2 -translate-x-1/2">
        {link.name}
      </div>
    </motion.a>
  );
};

const PublicProfilePage = () => {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    const fetchData = async () => {
      try {
        const [userData, linksData] = await Promise.all([ getPublicProfile(), getPublicLinks() ]);
        setUser(userData);
        setLinks(linksData);
      } catch (error) { console.error("Failed to load public data", error); }
    };
    fetchData();
  }, []);
  
  // Updated particle options for a light theme
  const particlesOptions = useMemo(() => ({
    background: { color: { value: '#f8fafc' } }, // bg-slate-50
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.8 } },
      },
    },
    particles: {
      color: { value: '#94a3b8' }, // slate-400
      links: {
        color: '#60a5fa', // blue-400
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: 'out',
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: { density: { enable: true }, value: 60 },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
  }), []);

  if (!init || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader text="Initializing..." /></div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Particles id="tsparticles" options={particlesOptions} />
      
      <div className="relative z-10 text-center flex flex-col h-full justify-around py-12">
        {/* Central Profile Monolith */}
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="flex flex-col items-center"
        >
          <img 
            src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.name || 'S'}&background=3b82f6&color=fff&size=128`} 
            alt="Profile" 
            className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" 
          />
          <h1 className="text-4xl font-bold text-slate-800">{user.name || "Sibi Siddharth"}</h1>
          <p className="text-slate-600 mt-2 max-w-md">{user.bio || "Welcome to my digital collection of links."}</p>
        </motion.div>

        {/* The Link "Stars" */}
        <motion.div
            className="w-full mx-auto p-6 flex flex-wrap justify-center gap-y-6 gap-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
            {links.map((link) => (
                <LinkStar key={link.id} link={link} />
            ))}
        </motion.div>
      </div>
      {/* copyrights */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-slate-500 py-4">
        <p>© {new Date().getFullYear()} <Link to={"https://www.sibisiddharth.me"} target='_blank' className="font-semibold hover:underline cursor-pointer">Sibi Siddharth S</Link>. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PublicProfilePage;