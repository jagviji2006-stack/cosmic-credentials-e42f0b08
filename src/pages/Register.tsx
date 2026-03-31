import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RegistrationForm } from '@/components/RegistrationForm';
import { SearchRegistration } from '@/components/SearchRegistration';
import { ArrowLeft, Sparkles, Rocket, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const branchNames: Record<string, string> = {
  'cse': 'CSE',
  'cse-ai': 'CSE AI',
  'cse-ai-ds': 'CSE AI-DS',
  'cse-cs': 'CSE CS',
  'it': 'IT',
  'ecm': 'ECM',
  'cse-ds': 'CSE DS',
};

const planetBackgrounds: Record<string, { 
  gradient: string; 
  particles: string; 
  glow: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}> = {
  'cse': {
    gradient: 'from-blue-900/80 via-cyan-800/60 to-green-900/40',
    particles: 'bg-blue-400',
    glow: 'bg-cyan-500/30',
    primaryColor: '#4A90D9',
    secondaryColor: '#87CEEB',
    accentColor: '#2D6B3F',
  },
  'cse-ai': {
    gradient: 'from-red-900/80 via-orange-800/60 to-amber-900/40',
    particles: 'bg-orange-400',
    glow: 'bg-red-500/30',
    primaryColor: '#CD5C5C',
    secondaryColor: '#DEB887',
    accentColor: '#8B4513',
  },
  'cse-ai-ds': {
    gradient: 'from-amber-900/80 via-orange-700/60 to-red-800/40',
    particles: 'bg-amber-400',
    glow: 'bg-orange-500/30',
    primaryColor: '#D4A574',
    secondaryColor: '#F4A460',
    accentColor: '#8B6914',
  },
  'cse-cs': {
    gradient: 'from-yellow-900/80 via-amber-700/60 to-orange-800/40',
    particles: 'bg-yellow-400',
    glow: 'bg-yellow-500/30',
    primaryColor: '#F4D03F',
    secondaryColor: '#FAD02C',
    accentColor: '#D4A84B',
  },
  'it': {
    gradient: 'from-yellow-800/80 via-orange-600/60 to-amber-700/40',
    particles: 'bg-yellow-300',
    glow: 'bg-amber-500/30',
    primaryColor: '#E6C47A',
    secondaryColor: '#FFD89B',
    accentColor: '#D4A84B',
  },
  'ecm': {
    gradient: 'from-blue-950/80 via-indigo-800/60 to-purple-900/40',
    particles: 'bg-blue-400',
    glow: 'bg-indigo-500/30',
    primaryColor: '#4169E1',
    secondaryColor: '#6495ED',
    accentColor: '#1E3A8A',
  },
  'cse-ds': {
    gradient: 'from-cyan-900/80 via-teal-700/60 to-blue-800/40',
    particles: 'bg-cyan-400',
    glow: 'bg-teal-500/30',
    primaryColor: '#72CFF8',
    secondaryColor: '#AFEEEE',
    accentColor: '#4AB8E8',
  },
};

// Animated Robot pointing to the form
const AnimatedRobot = ({ color }: { color: string }) => (
  <motion.div
    className="hidden lg:flex flex-col items-center"
    initial={{ opacity: 0, x: -100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
  >
    {/* Speech bubble */}
    <motion.div
      className="relative mb-4 px-4 py-3 rounded-2xl text-sm font-display max-w-[180px] text-center"
      style={{
        background: `linear-gradient(135deg, ${color}30, ${color}15)`,
        border: `1px solid ${color}60`,
        boxShadow: `0 0 20px ${color}20`,
        color: '#fff',
      }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span>Register here! 👉</span>
      {/* Arrow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
        style={{ background: `${color}20`, borderRight: `1px solid ${color}60`, borderBottom: `1px solid ${color}60` }} />
    </motion.div>

    {/* Robot body */}
    <motion.div className="relative" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
      {/* Antenna */}
      <motion.div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="w-0.5 h-4" style={{ background: color }} />
      </motion.div>

      {/* Head */}
      <div className="w-16 h-14 rounded-xl relative mx-auto" style={{
        background: `linear-gradient(135deg, #2a2a3e, #1a1a2e)`,
        border: `2px solid ${color}60`,
        boxShadow: `0 0 15px ${color}20`,
      }}>
        {/* Eyes */}
        <motion.div className="absolute top-3 left-2 w-4 h-4 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.div className="absolute top-3 right-2 w-4 h-4 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1.5 rounded-full" style={{ background: color }} />
      </div>

      {/* Body */}
      <div className="w-20 h-16 rounded-xl mt-1 mx-auto relative" style={{
        background: 'linear-gradient(135deg, #2a2a3e, #1a1a2e)',
        border: `2px solid ${color}40`,
      }}>
        {/* Chest light */}
        <motion.div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
          style={{ background: color, boxShadow: `0 0 12px ${color}` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {/* Circuit lines */}
        <div className="absolute bottom-2 left-2 right-2 flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="flex-1 h-0.5 rounded" style={{ background: color }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Right arm pointing → */}
      <motion.div
        className="absolute top-[70px] -right-10"
        style={{ transformOrigin: 'left center' }}
        animate={{ rotate: [0, 10, 0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-10 h-3 rounded-full" style={{ background: `linear-gradient(to right, #2a2a3e, ${color}80)` }} />
        {/* Hand pointing */}
        <motion.div className="absolute -right-3 -top-1 text-xl"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >👉</motion.div>
      </motion.div>

      {/* Left arm */}
      <motion.div
        className="absolute top-[70px] -left-8"
        style={{ transformOrigin: 'right center' }}
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-8 h-3 rounded-full" style={{ background: '#2a2a3e', border: `1px solid ${color}40` }} />
      </motion.div>

      {/* Legs */}
      <div className="flex justify-center gap-3 mt-1">
        <motion.div className="w-4 h-8 rounded-b-lg"
          style={{ background: '#2a2a3e', border: `1px solid ${color}30` }}
          animate={{ rotateX: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div className="w-4 h-8 rounded-b-lg"
          style={{ background: '#2a2a3e', border: `1px solid ${color}30` }}
          animate={{ rotateX: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
        />
      </div>
    </motion.div>

    {/* Ground glow under robot */}
    <motion.div
      className="w-20 h-2 rounded-full mt-1"
      style={{ background: color, filter: 'blur(6px)' }}
      animate={{ opacity: [0.2, 0.5, 0.2], scaleX: [0.8, 1.2, 0.8] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </motion.div>
);

// Floating cosmic debris
const CosmicDebris = ({ color, delay }: { color: string; delay: number }) => (
  <motion.div
    className="absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      x: [0, Math.random() * 200 - 100, 0],
      y: [0, Math.random() * 200 - 100, 0],
      rotate: [0, 360],
      opacity: [0.2, 0.6, 0.2],
    }}
    transition={{ duration: 12 + Math.random() * 8, repeat: Infinity, delay, ease: 'easeInOut' }}
  >
    <div style={{
      width: 3 + Math.random() * 5,
      height: 3 + Math.random() * 5,
      background: color,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      boxShadow: `0 0 6px ${color}`,
    }} />
  </motion.div>
);

// Moving atmospheric bands
const AtmosphericBand = ({ color, y, speed, direction }: { color: string; y: number; speed: number; direction: number }) => (
  <motion.div
    className="absolute left-0 right-0 pointer-events-none"
    style={{
      top: `${y}%`,
      height: 40 + Math.random() * 60,
      background: `linear-gradient(90deg, transparent, ${color}15, ${color}25, ${color}15, transparent)`,
      filter: 'blur(8px)',
    }}
    animate={{ x: [direction * -200, direction * 200, direction * -200] }}
    transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
  />
);

// Lightning / energy bolt
const EnergyBolt = ({ color, delay }: { color: string; delay: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      left: `${20 + Math.random() * 60}%`,
      top: `${10 + Math.random() * 80}%`,
      width: 2,
      height: 60 + Math.random() * 100,
      background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
      filter: 'blur(1px)',
      transform: `rotate(${Math.random() * 30 - 15}deg)`,
    }}
    animate={{
      opacity: [0, 0.8, 0],
      scaleY: [0.5, 1, 0.5],
    }}
    transition={{ duration: 0.3, delay, repeat: Infinity, repeatDelay: 6 + Math.random() * 8 }}
  />
);

// Vortex swirl
const Vortex = ({ color, x, y, size }: { color: string; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      border: `1px solid ${color}30`,
      transform: 'translate(-50%, -50%)',
    }}
    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
    transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 5, repeat: Infinity } }}
  >
    <motion.div className="absolute inset-2 rounded-full" style={{ border: `1px solid ${color}20` }}
      animate={{ rotate: -360 }}
      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
    />
    <motion.div className="absolute inset-4 rounded-full" style={{ border: `1px solid ${color}15` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
    />
  </motion.div>
);

const Register = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  
  const branchName = (location.state as { branchName?: string })?.branchName || 
    branchNames[branchId || ''] || 
    'Unknown Branch';

  const bgStyle = planetBackgrounds[branchId || ''] || planetBackgrounds['cse'];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced moving planet atmosphere background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-b ${bgStyle.gradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Moving atmospheric bands */}
        <AtmosphericBand color={bgStyle.primaryColor} y={10} speed={30} direction={1} />
        <AtmosphericBand color={bgStyle.secondaryColor} y={25} speed={40} direction={-1} />
        <AtmosphericBand color={bgStyle.accentColor} y={45} speed={35} direction={1} />
        <AtmosphericBand color={bgStyle.primaryColor} y={65} speed={45} direction={-1} />
        <AtmosphericBand color={bgStyle.secondaryColor} y={80} speed={25} direction={1} />

        {/* Swirling vortexes */}
        <Vortex color={bgStyle.primaryColor} x={15} y={25} size={250} />
        <Vortex color={bgStyle.secondaryColor} x={85} y={70} size={300} />
        <Vortex color={bgStyle.accentColor} x={50} y={50} size={400} />

        {/* Pulsing nebula glows */}
        <motion.div 
          className="absolute rounded-full blur-[100px]"
          style={{
            width: 600, height: 600,
            top: '-10%', left: '10%',
            background: `radial-gradient(circle, ${bgStyle.primaryColor}40 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 500, height: 500,
            bottom: '-5%', right: '5%',
            background: `radial-gradient(circle, ${bgStyle.secondaryColor}35 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -40, 0],
            y: [0, -20, 0],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Energy bolts */}
        {Array.from({ length: 4 }).map((_, i) => (
          <EnergyBolt key={`bolt-${i}`} color={bgStyle.primaryColor} delay={i * 3} />
        ))}

        {/* Cosmic debris floating around */}
        {Array.from({ length: 25 }).map((_, i) => (
          <CosmicDebris
            key={`debris-${i}`}
            color={i % 3 === 0 ? bgStyle.primaryColor : i % 3 === 1 ? bgStyle.secondaryColor : '#ffffff'}
            delay={i * 0.5}
          />
        ))}

        {/* Twinkling stars */}
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 4 + 2}px white`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}

        {/* Drifting cosmic dust */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 40%, ${bgStyle.primaryColor}15 0%, transparent 50%),
                         radial-gradient(circle at 70% 60%, ${bgStyle.secondaryColor}10 0%, transparent 40%)`,
          }}
          animate={{ opacity: [0.5, 0.8, 0.5], rotate: [0, 3, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating ring particles */}
        {[600, 800, 1000].map((size, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute left-1/2 top-1/2 rounded-full border pointer-events-none"
            style={{
              width: size, height: size,
              borderColor: `${bgStyle.primaryColor}15`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 60 + i * 30, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div 
            className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-between mb-8"
            >
              <button
                onClick={() => navigate('/codeathon')}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body group"
              >
                <motion.div whileHover={{ x: -5 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <ArrowLeft className="w-5 h-5" />
                </motion.div>
                <span className="group-hover:underline">Back to Solar System</span>
              </button>
              <motion.h1 
                className="font-display text-xl gradient-text-animated"
                animate={{ textShadow: [`0 0 20px ${bgStyle.primaryColor}`, `0 0 40px ${bgStyle.primaryColor}`, `0 0 20px ${bgStyle.primaryColor}`] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                CODEATHON <span className="text-accent">2K25</span>
              </motion.h1>
            </motion.header>

            {/* Main content area with robot */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-start gap-8">
                {/* Robot on the left */}
                <AnimatedRobot color={bgStyle.primaryColor} />

                {/* Form area */}
                <div className="w-full max-w-md">
                  {/* Branch badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="text-center mb-8"
                  >
                    <motion.div 
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full border mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${bgStyle.primaryColor}30, ${bgStyle.secondaryColor}20)`,
                        borderColor: `${bgStyle.primaryColor}80`,
                        boxShadow: `0 0 30px ${bgStyle.primaryColor}40`,
                      }}
                      animate={{
                        boxShadow: [`0 0 30px ${bgStyle.primaryColor}40`, `0 0 50px ${bgStyle.primaryColor}60`, `0 0 30px ${bgStyle.primaryColor}40`],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Rocket className="w-5 h-5" style={{ color: bgStyle.primaryColor }} />
                      </motion.div>
                      <span className="font-display text-xl" style={{ color: bgStyle.primaryColor, textShadow: `0 0 20px ${bgStyle.primaryColor}` }}>
                        {branchName}
                      </span>
                      <motion.div
                        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                        transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
                      >
                        <Star className="w-5 h-5" style={{ color: bgStyle.secondaryColor }} fill={bgStyle.secondaryColor} />
                      </motion.div>
                    </motion.div>
                    
                    <motion.h2 className="font-display text-2xl text-foreground"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    >
                      Registration Portal
                    </motion.h2>
                    <motion.p className="text-muted-foreground mt-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    >
                      Join the coding revolution
                    </motion.p>
                  </motion.div>

                  {/* Registration form */}
                  <motion.div 
                    className="glass-panel p-6 md:p-8 relative overflow-hidden"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    style={{ boxShadow: `0 0 40px ${bgStyle.primaryColor}20, inset 0 1px 0 0 ${bgStyle.primaryColor}20` }}
                  >
                    <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ border: `1px solid ${bgStyle.primaryColor}50` }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <RegistrationForm branch={branchId || ''} branchName={branchName} />
                  </motion.div>

                  {/* Search */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <SearchRegistration />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
