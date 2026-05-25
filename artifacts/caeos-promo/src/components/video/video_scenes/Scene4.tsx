import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 6500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-between px-[10vw] bg-bg-dark"
      {...sceneTransitions.perspectiveFlip}
    >
      <div className="w-1/2 h-full flex flex-col justify-center relative">
        <div className="absolute -left-10 top-1/4 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-warning/50 to-transparent" />
        
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-6 mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 2 ? { opacity: i === 2 ? 1 : 0.3, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: phase >= 2 ? i * 0.1 : 0 }}
          >
            <div className="text-warning font-mono text-[1.2vw] opacity-70">
              LAW {String(i + 8).padStart(2, '0')}
            </div>
            <div className={`h-[1px] ${i === 2 ? 'w-16 bg-warning' : 'w-8 bg-white/20'}`} />
            <div className={`text-[1.5vw] ${i === 2 ? 'text-white' : 'text-white/40'}`}>
              {i === 2 ? 'Prevent AI Hallucinations' : 'System Integrity Check'}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="w-1/2 text-right">
        <motion.div
          className="inline-block border border-warning/30 text-warning px-4 py-1 rounded-sm text-[1vw] mb-6 font-mono tracking-widest bg-warning/5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          GOVERNANCE KERNEL
        </motion.div>
        
        <motion.h2
          className="text-[6vw] font-bold text-white uppercase leading-none"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          21<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-amber-600">
            Constitutional<br/>Laws
          </span>
        </motion.h2>
      </div>
    </motion.div>
  );
}
