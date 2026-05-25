import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => setPhase(4), 6500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-bg-dark"
      {...sceneTransitions.splitHorizontal}
    >
      <div className="absolute inset-0 opacity-20 flex items-center justify-center">
        <motion.img 
          src={`${import.meta.env.BASE_URL}images/circuit.png`}
          alt="Circuit"
          className="w-full h-full object-cover mix-blend-screen"
          animate={{ scale: [1, 1.05], filter: ['hue-rotate(0deg)', 'hue-rotate(20deg)'] }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 text-center w-full">
        <motion.div
          className="text-accent font-mono tracking-[0.5em] mb-4 text-[1.5vw]"
          initial={{ opacity: 0, y: -20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          DISCIPLINED WORKFLOW
        </motion.div>
        
        <motion.h2
          className="text-[7vw] font-bold text-white uppercase tracking-tighter"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          22-Phase <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Pipeline</span>
        </motion.h2>

        <div className="mt-12 relative w-[80vw] mx-auto h-[4px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary via-accent to-success"
            initial={{ width: "0%" }}
            animate={phase >= 3 ? { width: "100%" } : { width: "0%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-bg-dark border-2 border-white/30"
              style={{ left: `${(i / 21) * 100}%` }}
              animate={phase >= 3 ? { 
                borderColor: ['rgba(255,255,255,0.3)', 'var(--color-accent)', 'rgba(255,255,255,0.3)'],
                scale: [1, 1.5, 1]
              } : {}}
              transition={{ 
                duration: 0.5, 
                delay: phase >= 3 ? (i / 21) * 2 : 0,
                times: [0, 0.5, 1]
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
