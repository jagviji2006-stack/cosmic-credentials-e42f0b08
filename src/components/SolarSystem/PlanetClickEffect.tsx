import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PlanetClickEffectProps {
  isActive: boolean;
  branchName: string | null;
  planetColor?: string;
}

// Particle component for explosions
const Particle = ({ delay, angle, color }: { delay: number; angle: number; color: string }) => {
  const distance = 200 + Math.random() * 300;
  const size = 4 + Math.random() * 8;
  
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
      animate={{
        scale: [0, 1.5, 0.5],
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 1.2,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
};

// Star trail component
const StarTrail = ({ index }: { index: number }) => {
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  
  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        boxShadow: '0 0 10px #fff, 0 0 20px #4fc3f7',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1.5, 0],
        x: [0, (50 - startX) * 10],
        y: [0, (50 - startY) * 10],
      }}
      transition={{
        duration: 1.5,
        delay: index * 0.02,
        ease: "easeIn",
      }}
    />
  );
};

// Rocket component
const Rocket = ({ isLaunching }: { isLaunching: boolean }) => {
  return (
    <motion.div
      className="absolute left-1/2 bottom-0 -translate-x-1/2"
      initial={{ y: 100, opacity: 0, scale: 0.5 }}
      animate={isLaunching ? {
        y: [-100, -800],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 0.8],
        rotate: [0, 0, -5, 5, 0],
      } : {}}
      transition={{
        duration: 1.5,
        ease: "easeIn",
      }}
    >
      {/* Rocket body */}
      <div className="relative">
        <div className="text-6xl filter drop-shadow-[0_0_20px_rgba(255,180,50,0.8)]">
          🚀
        </div>
        
        {/* Rocket flames */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2"
          animate={{
            scaleY: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
          }}
        >
          <div className="w-8 h-16 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent blur-sm rounded-full" />
        </motion.div>
        
        {/* Smoke trail */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: -20 - i * 15 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1 + i * 0.3, 2 + i * 0.5],
              y: [0, 50 + i * 20],
            }}
            transition={{
              duration: 1,
              delay: i * 0.05,
              repeat: Infinity,
            }}
          >
            <div className="w-6 h-6 bg-gradient-radial from-orange-300/60 to-transparent rounded-full blur-md" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Warp speed lines
const WarpLine = ({ index, total }: { index: number; total: number }) => {
  const angle = (index / total) * Math.PI * 2;
  const length = 100 + Math.random() * 200;
  
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-left"
      style={{
        rotate: `${(angle * 180) / Math.PI}deg`,
        width: 2,
        height: length,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{
        scaleX: [0, 1, 20],
        opacity: [0, 1, 0],
        x: [0, Math.cos(angle) * 500],
        y: [0, Math.sin(angle) * 500],
      }}
      transition={{
        duration: 0.8,
        delay: 0.3 + Math.random() * 0.2,
        ease: "easeIn",
      }}
    >
      <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-white to-transparent rounded-full" />
    </motion.div>
  );
};

// Shockwave ring
const ShockwaveRing = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
    style={{
      border: `3px solid ${color}`,
      boxShadow: `0 0 30px ${color}, inset 0 0 30px ${color}`,
    }}
    initial={{ width: 0, height: 0, opacity: 1 }}
    animate={{
      width: [0, 600, 1200],
      height: [0, 600, 1200],
      opacity: [1, 0.6, 0],
    }}
    transition={{
      duration: 1,
      delay,
      ease: "easeOut",
    }}
  />
);

// Energy burst
const EnergyBurst = ({ color }: { color: string }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    initial={{ scale: 0, opacity: 1 }}
    animate={{
      scale: [0, 3, 6],
      opacity: [1, 0.5, 0],
    }}
    transition={{
      duration: 0.6,
      ease: "easeOut",
    }}
  >
    <div
      className="w-48 h-48 rounded-full blur-xl"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  </motion.div>
);

// Planet portal effect
const PlanetPortal = ({ color }: { color: string }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    initial={{ scale: 0, rotate: 0, opacity: 0 }}
    animate={{
      scale: [0, 1, 1.5],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 1.2,
      ease: "easeInOut",
    }}
  >
    <div
      className="w-64 h-64 rounded-full"
      style={{
        background: `conic-gradient(from 0deg, ${color}, transparent, ${color}, transparent, ${color})`,
        filter: 'blur(4px)',
      }}
    />
  </motion.div>
);

export const PlanetClickEffect = ({ isActive, branchName, planetColor = '#4fc3f7' }: PlanetClickEffectProps) => {
  const [showRocket, setShowRocket] = useState(false);
  const [phase, setPhase] = useState<'explosion' | 'warp' | 'portal'>('explosion');

  useEffect(() => {
    if (isActive) {
      setPhase('explosion');
      setShowRocket(true);
      
      const warpTimer = setTimeout(() => setPhase('warp'), 400);
      const portalTimer = setTimeout(() => setPhase('portal'), 700);
      
      return () => {
        clearTimeout(warpTimer);
        clearTimeout(portalTimer);
      };
    } else {
      setShowRocket(false);
      setPhase('explosion');
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Dark overlay with radial gradient */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.9) 100%)`,
            }}
          />

          {/* Star trails converging to center */}
          {[...Array(60)].map((_, i) => (
            <StarTrail key={`star-${i}`} index={i} />
          ))}

          {/* Energy burst at center */}
          <EnergyBurst color={planetColor} />

          {/* Shockwave rings */}
          <ShockwaveRing delay={0} color={planetColor} />
          <ShockwaveRing delay={0.15} color="#ffffff" />
          <ShockwaveRing delay={0.3} color={planetColor} />

          {/* Particle explosion */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(40)].map((_, i) => (
              <Particle
                key={i}
                delay={i * 0.02}
                angle={(i / 40) * Math.PI * 2}
                color={i % 2 === 0 ? planetColor : '#ffffff'}
              />
            ))}
          </div>

          {/* Planet portal */}
          {phase === 'portal' && <PlanetPortal color={planetColor} />}

          {/* Warp speed lines */}
          {phase === 'warp' && (
            <>
              {[...Array(50)].map((_, i) => (
                <WarpLine key={i} index={i} total={50} />
              ))}
            </>
          )}

          {/* Rocket launch */}
          <Rocket isLaunching={showRocket} />

          {/* Branch name with glow */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8],
            }}
            transition={{
              duration: 1,
              times: [0, 0.3, 0.7, 1],
            }}
          >
            <h2 
              className="font-display text-4xl md:text-6xl font-bold tracking-wider"
              style={{
                color: planetColor,
                textShadow: `0 0 20px ${planetColor}, 0 0 40px ${planetColor}, 0 0 60px ${planetColor}`,
              }}
            >
              {branchName}
            </h2>
            <motion.p
              className="text-white/80 mt-2 font-body text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Initiating warp drive...
            </motion.p>
          </motion.div>

          {/* Lens flare effect */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white"
            style={{
              boxShadow: `0 0 60px 30px white, 0 0 100px 60px ${planetColor}`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: "easeIn",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
