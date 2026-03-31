import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Animated tree component
const Tree = ({ x, height, delay }: { x: number; height: number; delay: number }) => (
  <motion.div
    className="absolute bottom-0"
    style={{ left: `${x}%` }}
    initial={{ scaleY: 0, originY: 1 }}
    animate={{ scaleY: 1 }}
    transition={{ delay, duration: 1.5, ease: 'easeOut' }}
  >
    {/* Trunk */}
    <div 
      className="mx-auto rounded-sm"
      style={{ width: 6, height: height * 0.4, background: 'linear-gradient(to top, #5D4037, #795548)' }} 
    />
    {/* Canopy layers */}
    <motion.div
      animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      style={{ marginTop: -8 }}
    >
      <div style={{ 
        width: height * 0.6, height: height * 0.5, 
        borderRadius: '50%', 
        background: `radial-gradient(circle at 40% 40%, #66BB6A, #2E7D32, #1B5E20)`,
        boxShadow: '0 4px 15px rgba(46, 125, 50, 0.4)',
        margin: '0 auto',
      }} />
      <div style={{ 
        width: height * 0.45, height: height * 0.35, 
        borderRadius: '50%', 
        background: `radial-gradient(circle at 60% 30%, #81C784, #43A047)`,
        margin: '-15px auto 0',
        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
      }} />
    </motion.div>
  </motion.div>
);

// Animated flower
const Flower = ({ x, delay, color }: { x: number; delay: number; color: string }) => (
  <motion.div
    className="absolute bottom-1"
    style={{ left: `${x}%` }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: delay + 1, duration: 0.8 }}
  >
    <motion.div
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Stem */}
      <div style={{ width: 2, height: 16, background: '#4CAF50', margin: '0 auto' }} />
      {/* Petals */}
      <div className="relative" style={{ width: 14, height: 14, margin: '-2px auto 0' }}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <div key={angle} style={{
            position: 'absolute', width: 6, height: 6, borderRadius: '50%',
            background: color, top: '50%', left: '50%',
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-4px)`,
          }} />
        ))}
        <div style={{ position: 'absolute', width: 5, height: 5, borderRadius: '50%', background: '#FFD54F', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      </div>
    </motion.div>
  </motion.div>
);

// Walking animal (simple silhouette)
const Animal = ({ type, startX, y, speed, delay }: { type: 'deer' | 'rabbit' | 'bird'; startX: number; y: number; speed: number; delay: number }) => (
  <motion.div
    className="absolute"
    style={{ bottom: `${y}%` }}
    initial={{ x: startX }}
    animate={{ x: startX + 800 }}
    transition={{ duration: speed, repeat: Infinity, delay, ease: 'linear' }}
  >
    {type === 'deer' && (
      <div className="text-2xl opacity-80" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🦌</div>
    )}
    {type === 'rabbit' && (
      <motion.div 
        className="text-lg opacity-80"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      >🐇</motion.div>
    )}
    {type === 'bird' && (
      <motion.div 
        className="text-xl opacity-70"
        animate={{ y: [0, -15, 0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      >🕊️</motion.div>
    )}
  </motion.div>
);

// Walking person
const Person = ({ startX, speed, delay, emoji }: { startX: number; speed: number; delay: number; emoji: string }) => (
  <motion.div
    className="absolute bottom-2"
    initial={{ x: startX }}
    animate={{ x: startX + 600 }}
    transition={{ duration: speed, repeat: Infinity, delay, ease: 'linear' }}
  >
    <motion.div 
      className="text-xl"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
    >{emoji}</motion.div>
  </motion.div>
);

// Butterfly
const Butterfly = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute text-lg"
    initial={{ x: Math.random() * 300, y: Math.random() * 200 + 100 }}
    animate={{ 
      x: [Math.random() * 300, Math.random() * 800, Math.random() * 500, Math.random() * 300],
      y: [Math.random() * 200 + 100, Math.random() * 150 + 80, Math.random() * 250 + 50, Math.random() * 200 + 100],
    }}
    transition={{ duration: 12 + delay * 2, repeat: Infinity, ease: 'easeInOut' }}
    style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }}
  >
    🦋
  </motion.div>
);

// Cloud component
const Cloud = ({ x, y, size, speed }: { x: number; y: number; size: number; speed: number }) => (
  <motion.div
    className="absolute opacity-60"
    style={{ top: `${y}%` }}
    initial={{ x: -200 }}
    animate={{ x: [x, x + 1200] }}
    transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
  >
    <div style={{
      width: size, height: size * 0.4,
      background: 'radial-gradient(ellipse, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
      borderRadius: '50%',
      filter: 'blur(2px)',
    }} />
  </motion.div>
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
      {/* Sky gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1a237e 0%, #283593 15%, #42A5F5 35%, #64B5F6 50%, #81D4FA 65%, #B3E5FC 80%, #87C98F 90%, #4CAF50 100%)',
      }} />

      {/* Sun in the sky */}
      <motion.div
        className="absolute"
        style={{ top: '8%', right: '12%' }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle, #FFF9C4, #FFD54F, #FF8F00)',
          boxShadow: '0 0 40px 20px rgba(255, 213, 79, 0.4), 0 0 80px 40px rgba(255, 143, 0, 0.2)',
        }} />
      </motion.div>

      {/* Clouds */}
      <Cloud x={100} y={5} size={120} speed={45} />
      <Cloud x={400} y={12} size={90} speed={55} />
      <Cloud x={700} y={8} size={100} speed={50} />
      <Cloud x={200} y={18} size={70} speed={60} />

      {/* Rainbow */}
      <div className="absolute" style={{
        top: '20%', left: '5%', width: 350, height: 175,
        borderRadius: '175px 175px 0 0',
        border: '3px solid transparent',
        borderTop: 'none',
        background: 'transparent',
        boxShadow: `
          inset 0 -3px 0 0 #FF0000,
          inset 0 -6px 0 0 #FF7F00,
          inset 0 -9px 0 0 #FFFF00,
          inset 0 -12px 0 0 #00FF00,
          inset 0 -15px 0 0 #0000FF,
          inset 0 -18px 0 0 #4B0082,
          inset 0 -21px 0 0 #9400D3
        `,
        opacity: 0.4,
        transform: 'rotate(10deg)',
      }} />

      {/* Ground with grass texture */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '18%' }}>
        {/* Hills */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: '100%',
          background: `
            radial-gradient(ellipse 300px 80px at 15% 80%, #388E3C, transparent),
            radial-gradient(ellipse 400px 100px at 50% 85%, #2E7D32, transparent),
            radial-gradient(ellipse 350px 90px at 85% 80%, #388E3C, transparent),
            linear-gradient(to top, #1B5E20, #2E7D32, #43A047, transparent)
          `,
        }} />
        
        {/* Grass blades */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around" style={{ height: 20 }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={i}
              style={{ width: 2, height: 8 + Math.random() * 12, background: '#66BB6A', borderRadius: '50% 50% 0 0' }}
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() }}
            />
          ))}
        </div>

        {/* Trees */}
        <Tree x={5} height={70} delay={0.2} />
        <Tree x={12} height={55} delay={0.4} />
        <Tree x={22} height={65} delay={0.3} />
        <Tree x={78} height={60} delay={0.5} />
        <Tree x={88} height={72} delay={0.2} />
        <Tree x={95} height={50} delay={0.6} />

        {/* Flowers */}
        <Flower x={8} delay={0.3} color="#E91E63" />
        <Flower x={15} delay={0.5} color="#FF9800" />
        <Flower x={28} delay={0.7} color="#9C27B0" />
        <Flower x={35} delay={0.4} color="#F44336" />
        <Flower x={65} delay={0.6} color="#E91E63" />
        <Flower x={72} delay={0.8} color="#FF5722" />
        <Flower x={82} delay={0.3} color="#9C27B0" />
        <Flower x={92} delay={0.5} color="#FF9800" />

        {/* Animals */}
        <Animal type="deer" startX={-100} y={4} speed={25} delay={2} />
        <Animal type="rabbit" startX={-50} y={2} speed={18} delay={5} />
        <Animal type="rabbit" startX={-80} y={3} speed={20} delay={8} />

        {/* People walking */}
        <Person startX={-60} speed={22} delay={1} emoji="🚶" />
        <Person startX={-120} speed={28} delay={6} emoji="🚶‍♀️" />
        <Person startX={-90} speed={24} delay={10} emoji="🏃" />
      </div>

      {/* Birds flying */}
      <Animal type="bird" startX={-100} y={60} speed={15} delay={0} />
      <Animal type="bird" startX={-200} y={70} speed={18} delay={3} />
      <Animal type="bird" startX={-150} y={55} speed={12} delay={6} />

      {/* Butterflies */}
      <Butterfly delay={0} />
      <Butterfly delay={2} />
      <Butterfly delay={4} />

      {/* Floating particles / pollen */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`pollen-${i}`}
          className="absolute rounded-full"
          style={{
            width: 3, height: 3,
            background: i % 2 === 0 ? '#FFF9C4' : '#C8E6C9',
            left: `${Math.random() * 100}%`,
            top: `${30 + Math.random() * 50}%`,
          }}
          animate={{
            y: [-20, -60, -20],
            x: [0, 20, -10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/codeathon')}
          className="flex items-center gap-2 mb-8 px-3 py-1.5 rounded-lg transition-colors font-body"
          style={{ 
            color: '#1B5E20', 
            background: 'rgba(255,255,255,0.7)', 
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(27, 94, 32, 0.3)',
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
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(200,230,201,0.8), rgba(255,255,255,0.85))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 40px rgba(76, 175, 80, 0.1)',
          }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #66BB6A, #2E7D32)',
                boxShadow: '0 4px 20px rgba(46, 125, 50, 0.4)',
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold" style={{ 
              background: 'linear-gradient(135deg, #1B5E20, #4CAF50, #1B5E20)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Admin Portal
            </h1>
            <p className="text-sm mt-2" style={{ color: '#558B2F' }}>
              🌍 Earth Mission Control
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-display text-sm mb-2 font-semibold" style={{ color: '#2E7D32' }}>
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#66BB6A' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2"
                  style={{ 
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    color: '#1B5E20',
                  }}
                  required
                  maxLength={50}
                />
              </div>
            </div>

            <div>
              <label className="block font-display text-sm mb-2 font-semibold" style={{ color: '#2E7D32' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#66BB6A' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2"
                  style={{ 
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    color: '#1B5E20',
                  }}
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-display font-bold text-white transition-all duration-300"
              style={{ 
                background: isLoading 
                  ? '#A5D6A7' 
                  : 'linear-gradient(135deg, #43A047, #2E7D32, #1B5E20)',
                boxShadow: '0 4px 15px rgba(46, 125, 50, 0.4)',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 6px 25px rgba(46, 125, 50, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? '🌱 Authenticating...' : '🌿 Access Control Center'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
