import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRightCircle } from 'react-icons/fi';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import RydirectLogo from '../../assets/Rydirect Logo 256x256.png';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const [init, setInit] = useState(false);
  const tagline = "Revolutionizing Links.".split(" ");

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(() => ({
    background: { color: { value: '#f1f5f9' } }, // bg-slate-100
    fpsLimit: 90,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
      },
      modes: {
        repulse: { distance: 80, duration: 0.5 },
      },
    },
    particles: {
      color: { value: '#94a3b8' }, // slate-400
      links: {
        color: '#3b82f6', // blue-500
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: 'out',
        random: false,
        speed: 1,
        straight: false,
      },
      number: { density: { enable: true }, value: 80 },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 4 } },
    },
  }), []);

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden flex-1">
        {init && <Particles id="tsparticles-auth" options={particlesOptions} />}
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="flex flex-col justify-center items-center z-10 p-12"
        >
          <img src={RydirectLogo} alt="Rydirect Logo" className="w-24 h-24 mb-2 rounded-full" />
          <h1 className="mt-6 text-5xl font-bold text-slate-800">Rydirect</h1>
          <div className="mt-3 text-lg text-slate-500">
            {tagline.map((el, i) => (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: i / 10 + 0.5,
                }}
                key={i}
              >
                {el}{" "}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Right Panel (Form Area) */}
      <div className="flex items-center justify-center p-2 sm:p-12 z-100 bg-white/10 flex-1">
        {children}
        {/* copyrights */}
        <div className="text-sm text-center text-slate-500 bottom-2 absolute">
          &copy; {new Date().getFullYear()} <Link to={"https://www.sibisiddharth.me"} target='_blank' className="font-medium hover:underline">Sibi Siddharth S</Link> All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;