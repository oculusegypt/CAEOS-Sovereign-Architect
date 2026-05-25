import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS = {
  intro: 7000,
  layers: 8000,
  pipeline: 8000,
  laws: 8000,
  outro: 7000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  layers: Scene2,
  pipeline: Scene3,
  laws: Scene4,
  outro: Scene5,
};

const scenePos = [
  { x: '45vw', y: '40vh', scale: 2.5, opacity: 0.7 },
  { x: '10vw', y: '20vh', scale: 1.5, opacity: 0.8 },
  { x: '70vw', y: '60vh', scale: 1.2, opacity: 0.6 },
  { x: '20vw', y: '70vh', scale: 0.8, opacity: 0.5 },
  { x: '50vw', y: '50vh', scale: 2.0, opacity: 0.3 },
];

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  const topValues = ['50%', '80%', '20%', '90%', '50%'];
  const opacityValues = [0.5, 0.2, 0.3, 0.1, 0.6];

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)', opacity: 0.15 }}
          animate={{ x: ['-20%', '80%', '-10%'], y: ['-10%', '60%', '20%'], scale: [1, 1.2, 0.9] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)', opacity: 0.1 }}
          animate={{ x: ['80%', '-20%', '40%'], y: ['60%', '-10%', '50%'], scale: [0.8, 1.5, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hex grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.92304845413264' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Cpath d='M30 103.923048l-30-17.320508v-34.641016L30 34.641016l30 17.320508v34.641016L30 103.923048zm0-3.464102L57 84.87049v-31.176914L30 38.105128 3 53.693576v31.176914L30 100.458946zM30 69.282032l-30-17.320508V17.320508L30 0l30 17.320508v34.641016L30 69.282032zm0-3.464102L57 49.330814V19.052564L30 3.464102 3 19.052564v30.27825L30 65.81793z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px'
        }} />
      </div>

      {/* Persistent Midground Layer */}
      <motion.div
        className="absolute w-64 h-64 border border-primary/20 rounded-full flex items-center justify-center pointer-events-none"
        animate={scenePos[sceneIndex] ?? scenePos[0]}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div className="w-3/4 h-3/4 border border-accent/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Persistent Horizon Line */}
      <motion.div
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none"
        animate={{
          top: topValues[sceneIndex] ?? '50%',
          left: '10%',
          right: '10%',
          opacity: opacityValues[sceneIndex] ?? 0.5,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
