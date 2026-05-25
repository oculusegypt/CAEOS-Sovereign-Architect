import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 5500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-bg-dark"
      {...sceneTransitions.morphExpand}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <motion.div
          className="w-[100vw] h-[100vw] border-[1px] border-primary rounded-full"
          initial={{ scale: 0 }}
          animate={phase >= 1 ? { scale: [0, 1.5], opacity: [0.5, 0] } : { scale: 0 }}
          transition={{ duration: 3, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
        />
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        >
          <div className="w-12 h-12 rounded-lg border-2 border-primary flex items-center justify-center bg-primary/10">
            <div className="w-6 h-6 border-2 border-accent rotate-45" />
          </div>
          <h1 className="text-[5vw] font-bold text-white tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
            CAEOS
          </h1>
        </motion.div>

        <motion.p
          className="text-[1.8vw] text-white/60 mb-12 font-mono"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          AUTHORITY • PRECISION • TRUST
        </motion.p>
        
        <motion.div
          className="flex gap-8 justify-center text-[1vw] text-white/40 tracking-widest"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span>ENGLISH</span>
          <span>•</span>
          <span>ARABIC</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
