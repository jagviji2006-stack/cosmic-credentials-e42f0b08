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

// Realistic planet backgrounds matching each branch's planet atmosphere
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

// Shooting star component
const ShootingStar = ({ delay }: { delay: number }) => {
  const startX = Math.random() * 100;
  const startY = Math.random() * 50;
  
  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        boxShadow: '0 0 6px #fff, 0 0 12px #4fc3f7, -20px 0 30px #4fc3f7',
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, 200],
        y: [0, 150],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 5 + Math.random() * 10,
      }}
    />
  );
};

// Floating particle with glow
const FloatingParticle = ({ color, delay, size }: { color: string; delay: number; size: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      boxShadow: `0 0 ${size * 2}px ${color}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -50, 0],
      x: [0, Math.random() * 30 - 15, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  />
);

// Nebula cloud
const NebulaCloud = ({ color, position, size }: { color: string; position: { x: number; y: number }; size: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)',
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Orbital ring decoration
const OrbitalRing = ({ size, duration, color }: { size: number; duration: number; color: string }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 rounded-full border opacity-20"
    style={{
      width: size,
      height: size,
      borderColor: color,
      transform: 'translate(-50%, -50%)',
    }}
    animate={{
      rotate: 360,
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

// Energy wave
const EnergyWave = ({ color, delay }: { color: string; delay: number }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
    style={{
      border: `1px solid ${color}`,
    }}
    initial={{ width: 0, height: 0, opacity: 0.8 }}
    animate={{
      width: [0, 400, 800],
      height: [0, 400, 800],
      opacity: [0.8, 0.3, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
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

  // Entry animation delay
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced realistic 3D planet atmosphere background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient matching planet */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-b ${bgStyle.gradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Nebula clouds */}
        <NebulaCloud color={bgStyle.primaryColor} position={{ x: 20, y: 30 }} size={500} />
        <NebulaCloud color={bgStyle.secondaryColor} position={{ x: 80, y: 70 }} size={400} />
        <NebulaCloud color={bgStyle.accentColor} position={{ x: 50, y: 20 }} size={350} />
        
        {/* Animated orbital rings */}
        <OrbitalRing size={600} duration={60} color={bgStyle.primaryColor} />
        <OrbitalRing size={800} duration={90} color={bgStyle.secondaryColor} />
        <OrbitalRing size={1000} duration={120} color={bgStyle.accentColor} />
        
        {/* Energy waves pulsing from center */}
        <EnergyWave color={bgStyle.primaryColor} delay={0} />
        <EnergyWave color={bgStyle.secondaryColor} delay={1.5} />
        <EnergyWave color={bgStyle.primaryColor} delay={3} />
        
        {/* Primary nebula glows */}
        <motion.div 
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] ${bgStyle.glow} rounded-full blur-[100px]`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] ${bgStyle.glow} rounded-full blur-[120px]`}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        
        {/* Floating glowing particles */}
        {[...Array(40)].map((_, i) => (
          <FloatingParticle
            key={`particle-${i}`}
            color={i % 3 === 0 ? bgStyle.primaryColor : i % 3 === 1 ? bgStyle.secondaryColor : '#ffffff'}
            delay={i * 0.2}
            size={4 + Math.random() * 8}
          />
        ))}
        
        {/* Shooting stars */}
        {[...Array(5)].map((_, i) => (
          <ShootingStar key={`shooting-${i}`} delay={i * 3} />
        ))}
        
        {/* Stars with twinkling effect */}
        {[...Array(80)].map((_, i) => (
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
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Cosmic dust layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 40%, ${bgStyle.primaryColor}15 0%, transparent 50%),
                         radial-gradient(circle at 70% 60%, ${bgStyle.secondaryColor}10 0%, transparent 40%)`,
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
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
                <motion.div
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.div>
                <span className="group-hover:underline">Back to Solar System</span>
              </button>
              <motion.h1 
                className="font-display text-xl gradient-text-animated"
                animate={{
                  textShadow: [
                    `0 0 20px ${bgStyle.primaryColor}`,
                    `0 0 40px ${bgStyle.primaryColor}`,
                    `0 0 20px ${bgStyle.primaryColor}`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                CODEATHON <span className="text-accent">2K25</span>
              </motion.h1>
            </motion.header>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md">
                {/* Branch badge with rocket */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
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
                      boxShadow: [
                        `0 0 30px ${bgStyle.primaryColor}40`,
                        `0 0 50px ${bgStyle.primaryColor}60`,
                        `0 0 30px ${bgStyle.primaryColor}40`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Rocket className="w-5 h-5" style={{ color: bgStyle.primaryColor }} />
                    </motion.div>
                    <span 
                      className="font-display text-xl"
                      style={{ 
                        color: bgStyle.primaryColor,
                        textShadow: `0 0 20px ${bgStyle.primaryColor}`,
                      }}
                    >
                      {branchName}
                    </span>
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity },
                      }}
                    >
                      <Star className="w-5 h-5" style={{ color: bgStyle.secondaryColor }} fill={bgStyle.secondaryColor} />
                    </motion.div>
                  </motion.div>
                  
                  <motion.h2 
                    className="font-display text-2xl text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Registration Portal
                  </motion.h2>
                  <motion.p 
                    className="text-muted-foreground mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Join the coding revolution
                  </motion.p>
                </motion.div>

                {/* Registration form with glow effect */}
                <motion.div 
                  className="glass-panel p-6 md:p-8 relative overflow-hidden"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  style={{
                    boxShadow: `0 0 40px ${bgStyle.primaryColor}20, inset 0 1px 0 0 ${bgStyle.primaryColor}20`,
                  }}
                >
                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      border: `1px solid ${bgStyle.primaryColor}50`,
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <RegistrationForm branch={branchId || ''} branchName={branchName} />
                </motion.div>

                {/* Search registration */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <SearchRegistration />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
