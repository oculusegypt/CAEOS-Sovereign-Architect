import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 6500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const layers = Array.from({ length: 5 });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-between px-[10vw]"
      {...sceneTransitions.clipPolygon}
    >
      <div className="w-1/2 relative z-10">
        <motion.div
          className="w-12 h-1 bg-primary mb-8"
          initial={{ width: 0 }}
          animate={phase >= 1 ? { width: 48 } : { width: 0 }}
          transition={{ duration: 0.6 }}
        />
        
        <motion.h2
          className="text-[5vw] font-bold text-white leading-none uppercase"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          15 Sovereign<br/><span className="text-primary">Layers</span>
        </motion.h2>
        
        <motion.p
          className="text-[1.8vw] text-white/70 mt-6 max-w-lg"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          Architectural protection against collapse and security regressions.
        </motion.p>
      </div>

      <div className="w-1/2 h-full flex items-center justify-center relative perspective-[1000px]">
        {layers.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[25vw] h-[25vw] border border-primary/40 rounded-2xl bg-bg-dark/50 backdrop-blur-sm shadow-[0_0_30px_rgba(37,99,235,0.1)] flex items-center justify-center overflow-hidden"
            initial={{ 
              opacity: 0, 
              rotateX: 60, 
              rotateZ: -45, 
              y: 200, 
              z: -500 
            }}
            animate={phase >= 2 ? { 
              opacity: 1 - (i * 0.15), 
              rotateX: 60, 
              rotateZ: -45, 
              y: i * -40,
              z: i * -100
            } : { 
              opacity: 0, 
              rotateX: 60, 
              rotateZ: -45, 
              y: 200, 
              z: -500 
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 20, 
              delay: phase >= 2 ? i * 0.1 : 0 
            }}
          >
            {i === 0 && (
              <motion.div 
                className="w-full h-full relative"
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 0.5 } : { opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                <div className="w-full h-full border-[0.5px] border-primary/30 m-4 rounded" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
