import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Dumbbell } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signup');
    }, 3000); // 3 seconds splash

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, type: 'spring', stiffness: 100 }}
        className="mb-8"
      >
        <div className="p-6 bg-orange-500 rounded-full shadow-[0_0_50px_rgba(249,115,22,0.5)]">
          <Dumbbell size={80} className="text-white" />
        </div>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-5xl font-black tracking-tighter uppercase italic"
      >
        Free Gym <span className="text-orange-500">Trainer</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-4 text-zinc-500 font-mono text-sm tracking-widest uppercase"
      >
        Your Personal Fitness Revolution
      </motion.p>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="h-1 bg-orange-500 mt-8 rounded-full"
      />
    </div>
  );
}
