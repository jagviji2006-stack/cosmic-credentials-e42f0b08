import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Solar flare particle
const SolarFlare = ({ delay, angle }: { delay: number; angle: number }) => (
  <motion.div
    className="absolute left-1/2 top-1/2"
    style={{
      width: 3,
      height: 80 + Math.random() * 120,
      background: `linear-gradient(to top, #FF4500, #FF8C00, #FFD700, transparent)`,
      transformOrigin: 'bottom center',
      transform: `rotate(${angle}deg)`,
      filter: 'blur(2px)',
      borderRadius: '50%',
    }}
    animate={{
      height: [80, 120 + Math.random() * 80, 80],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

// Floating ember/spark
const Ember = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: 4 + Math.random() * 4,
      height: 4 + Math.random() * 4,
      background: `radial-gradient(circle, #FFD700, #FF6B00)`,
      boxShadow: '0 0 8px #FF8C00, 0 0 16px #FF4500',
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 60}%`,
    }}
    animate={{
      y: [0, -200 - Math.random() * 300],
      x: [0, (Math.random() - 0.5) * 100],
      opacity: [0.8, 0],
      scale: [1, 0.3],
    }}
    transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay, ease: 'easeOut' }}
  />
);

// Plasma wave
const PlasmaWave = ({ delay, y }: { delay: number; y: number }) => (
  <motion.div
    className="absolute left-0 right-0"
    style={{
      top: `${y}%`,
      height: 3,
      background: 'linear-gradient(90deg, transparent, #FF8C00, #FFD700, #FF8C00, transparent)',
      filter: 'blur(3px)',
    }}
    animate={{
      opacity: [0, 0.6, 0],
      scaleX: [0.5, 1.2, 0.5],
    }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

// Sunspot
const Sunspot = ({ x, y, size }: { x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: 'radial-gradient(circle, #8B4513 0%, #B8860B 40%, transparent 70%)',
      filter: 'blur(4px)',
    }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.4, 0.6, 0.4],
    }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// Corona arc
const CoronaArc = ({ delay, rotation }: { delay: number; rotation: number }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
    style={{
      width: 500,
      height: 500,
      border: '2px solid transparent',
      borderTopColor: '#FFD70060',
      borderRightColor: '#FF8C0040',
      filter: 'blur(1px)',
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    }}
    animate={{ rotate: [rotation, rotation + 360] }}
    transition={{ duration: 30 + delay * 5, repeat: Infinity, ease: 'linear' }}
  />
);

const Admin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        toast.error('Please enter username and password');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { 
          username: username.trim(), 
          password: password.trim(),
          action: 'login'
        }
      });

      if (error) {
        console.error('Auth error:', error);
        toast.error('Authentication failed');
        setIsLoading(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      if (data?.success && data?.token) {
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminId', data.adminId);
        toast.success('Welcome, Administrator!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Sun atmosphere base */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 50%, #FDB813 0%, #FF8C00 15%, #FF6B00 30%, #FF4500 45%, #B22222 60%, #8B0000 75%, #1a0500 100%)',
      }} />

      {/* Chromosphere layer */}
      <motion.div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 40%, rgba(255,215,0,0.3) 0%, transparent 50%)',
      }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Photosphere texture overlay */}
      <motion.div className="absolute inset-0 opacity-30" style={{
        background: `
          radial-gradient(circle at 30% 30%, #FFD700 0%, transparent 8%),
          radial-gradient(circle at 70% 40%, #FF8C00 0%, transparent 12%),
          radial-gradient(circle at 45% 70%, #FFA500 0%, transparent 10%),
          radial-gradient(circle at 80% 20%, #FFD700 0%, transparent 6%),
          radial-gradient(circle at 20% 60%, #FF6B00 0%, transparent 14%),
          radial-gradient(circle at 60% 80%, #FFD700 0%, transparent 8%)
        `,
      }}
        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Solar flares radiating outward */}
      {Array.from({ length: 24 }).map((_, i) => (
        <SolarFlare key={`flare-${i}`} delay={i * 0.3} angle={i * 15} />
      ))}

      {/* Sunspots */}
      <Sunspot x={25} y={35} size={60} />
      <Sunspot x={65} y={55} size={45} />
      <Sunspot x={40} y={70} size={35} />
      <Sunspot x={75} y={25} size={50} />

      {/* Plasma waves */}
      <PlasmaWave delay={0} y={20} />
      <PlasmaWave delay={1.5} y={45} />
      <PlasmaWave delay={3} y={70} />
      <PlasmaWave delay={4.5} y={85} />

      {/* Corona arcs */}
      <CoronaArc delay={0} rotation={0} />
      <CoronaArc delay={2} rotation={60} />
      <CoronaArc delay={4} rotation={120} />

      {/* Rising embers/sparks */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Ember key={`ember-${i}`} delay={i * 0.4} />
      ))}

      {/* Pulsing energy rings */}
      {[0, 1.5, 3].map((delay, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ border: '1px solid #FFD70050' }}
          initial={{ width: 100, height: 100, opacity: 0.8 }}
          animate={{
            width: [100, 600],
            height: [100, 600],
            opacity: [0.6, 0],
          }}
          transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Convection cell pattern */}
      <motion.div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 20%, transparent 30%, #FFD70020 50%, transparent 70%),
          radial-gradient(circle at 50% 50%, transparent 30%, #FF8C0020 50%, transparent 70%),
          radial-gradient(circle at 80% 30%, transparent 30%, #FFD70020 50%, transparent 70%),
          radial-gradient(circle at 35% 75%, transparent 30%, #FFA50020 50%, transparent 70%),
          radial-gradient(circle at 70% 70%, transparent 30%, #FFD70020 50%, transparent 70%)
        `,
      }}
        animate={{ rotate: [0, 5, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/codeathon')}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-all duration-300 font-body text-sm"
          style={{ 
            color: '#FFD700',
            background: 'rgba(139, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 0 15px rgba(255, 107, 0, 0.2)',
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Solar System
        </motion.button>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-8 shadow-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,0,0,0.7), rgba(178,34,34,0.5), rgba(139,69,19,0.4))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 0 40px rgba(255, 107, 0, 0.3), inset 0 0 30px rgba(255, 140, 0, 0.1)',
          }}
        >
          {/* Animated glow border */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ border: '1px solid rgba(255, 215, 0, 0.4)' }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="text-center mb-8">
            <motion.div 
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ 
                background: 'radial-gradient(circle, #FFD700, #FF8C00, #FF4500)',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 107, 0, 0.3)',
              }}
              animate={{ 
                boxShadow: [
                  '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 107, 0, 0.3)',
                  '0 0 50px rgba(255, 215, 0, 0.7), 0 0 80px rgba(255, 107, 0, 0.5)',
                  '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 107, 0, 0.3)',
                ],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-9 h-9 text-white drop-shadow-lg" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold" style={{ 
              color: '#FFD700',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 140, 0, 0.3)',
            }}>
              Admin Portal
            </h1>
            <motion.p 
              className="text-sm mt-2"
              style={{ color: '#FFB347' }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ☀️ Solar Command Center
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-display text-sm mb-2 font-semibold" style={{ color: '#FFD700' }}>
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#FFB347' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-yellow-500"
                  style={{ 
                    background: 'rgba(139, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    color: '#FFD700',
                  }}
                  required
                  maxLength={50}
                />
              </div>
            </div>

            <div>
              <label className="block font-display text-sm mb-2 font-semibold" style={{ color: '#FFD700' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#FFB347' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-yellow-500"
                  style={{ 
                    background: 'rgba(139, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    color: '#FFD700',
                  }}
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-display font-bold transition-all duration-300"
              style={{ 
                background: isLoading 
                  ? 'rgba(255, 140, 0, 0.3)' 
                  : 'linear-gradient(135deg, #FF4500, #FF8C00, #FFD700)',
                color: isLoading ? '#FFB347' : '#1a0500',
                boxShadow: '0 0 20px rgba(255, 140, 0, 0.4)',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(255, 215, 0, 0.6)' }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? '🔥 Authenticating...' : '☀️ Access Solar Command'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
