import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 5500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      {...sceneTransitions.scaleFade}
    >
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.img 
          src={`${import.meta.env.BASE_URL}images/layers.png`}
          alt="Layers"
          className="w-full h-full object-cover mix-blend-screen"
          animate={{ scale: [1.1, 1] }}
          transition={{ duration: 4, ease: 'easeOut' }}
        />
      </div>

      <div className="relative z-10 text-center px-8 flex flex-col items-center">
        <motion.div
          className="w-[1px] h-24 bg-gradient-to-b from-transparent to-primary mb-8"
          initial={{ scaleY: 0, transformOrigin: "bottom" }}
          animate={phase >= 1 ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        />

        <motion.div
          className="overflow-hidden"
        >
          <motion.h1
            className="text-[8vw] font-bold tracking-tighter text-white uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ y: "100%", opacity: 0 }}
            animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            CAEOS
          </motion.h1>
        </motion.div>

        <motion.div
          className="overflow-hidden mt-4"
        >
          <motion.p
            className="text-[2vw] text-accent tracking-widest uppercase font-mono"
            initial={{ opacity: 0, filter: "blur(10px)", y: -20 }}
            animate={phase >= 3 ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(10px)", y: -20 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            Constitutional AI Engineering Operating System
          </motion.p>
        </motion.div>
        
        <motion.div
          className="mt-8 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md bg-white/5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-[1vw] text-white/60 tracking-wider">SOVEREIGN PROTOCOL FOR AI</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
