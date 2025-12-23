import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SolarSystemScene } from '@/components/SolarSystem/SolarSystemScene';
import { PlanetClickEffect } from '@/components/SolarSystem/PlanetClickEffect';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const quotations = [
  "Code is poetry written in logic.",
  "Innovation distinguishes between a leader and a follower.",
  "The best way to predict the future is to create it.",
  "Dream big, code bigger!",
  "Every expert was once a beginner.",
  "Where innovation meets education.",
];

// Planet colors for effects
const planetColors: Record<string, string> = {
  'CSE': '#4A90D9',
  'CSE AI': '#CD5C5C',
  'CSE AI-DS': '#D4A574',
  'CSE CS': '#F4D03F',
  'IT': '#E6C47A',
  'ECM': '#4169E1',
  'CSE DS': '#72CFF8',
};

const Index = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePlanetClick = useCallback((branchId: string, branchName: string) => {
    setSelectedBranch(branchName);
    setSelectedBranchId(branchId);
    setIsTransitioning(true);
    
    // Navigate after the effect completes
    setTimeout(() => {
      navigate(`/register/${branchId}`, { state: { branchName } });
    }, 1200);
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Planet click effect overlay */}
      <PlanetClickEffect 
        isActive={isTransitioning} 
        branchName={selectedBranch}
        planetColor={selectedBranch ? planetColors[selectedBranch] : '#4fc3f7'}
      />

      {/* Go Back Button - Top Left */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-lg glass-panel text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 font-body text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Home</span>
      </motion.button>

      {/* Admin Portal - Top Right */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/admin')}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 px-4 py-2 rounded-lg glass-panel text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 font-display text-xs"
      >
        Admin Portal
      </motion.button>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 pt-16 md:pt-20"
      >
        <div className="container mx-auto flex flex-col items-center gap-2">
          {/* Institute Name */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-sm md:text-lg lg:text-xl text-center tracking-wider"
          >
            <span className="vibrant-text">VIGNAN'S INSTITUTE OF INFORMATION TECHNOLOGY</span>
          </motion.h1>
          
          {/* Event Name */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold">
              <span className="gradient-text-animated">CODEATHON</span>
              <span className="text-accent glow-text-sun ml-2">2K25</span>
            </h2>
          </motion.div>
          
          {/* Quotations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 h-8"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="font-body text-sm md:text-base text-muted-foreground italic text-center"
              >
                "{quotations[currentQuote]}"
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.header>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center"
      >
        <div className="glass-panel px-6 py-4">
          <p className="font-display text-primary text-sm md:text-base glow-text">
            SELECT YOUR BRANCH
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Click on a planet to register
          </p>
        </div>
      </motion.div>

      {/* 3D Scene */}
      <SolarSystemScene 
        onPlanetClick={handlePlanetClick}
        isTransitioning={isTransitioning}
      />
    </div>
  );
};

export default Index;
