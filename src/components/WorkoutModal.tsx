import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Dumbbell, ChevronRight, Play, Pause, RotateCcw, CheckCircle2, ArrowLeft } from 'lucide-react';
import VideoAd from './VideoAd';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  videoUrl?: string;
}

interface WorkoutCategory {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface WorkoutModalProps {
  category: WorkoutCategory | null;
  onClose: () => void;
}

function Timer({ onComplete }: { onComplete?: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-950 rounded-3xl p-6 border border-zinc-800 flex flex-col items-center gap-4">
      <div className="text-5xl font-black font-mono tracking-tighter text-orange-500">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`p-4 rounded-2xl transition-all ${
            isActive ? 'bg-zinc-800 text-zinc-400' : 'bg-orange-500 text-white'
          }`}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            setSeconds(0);
          }}
          className="p-4 bg-zinc-800 text-zinc-400 rounded-2xl hover:text-white transition-all"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}

export default function WorkoutModal({ category, onClose }: WorkoutModalProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  // Reset active index when modal closes
  useEffect(() => {
    if (!category) {
      setActiveIndex(null);
      setIsAdShowing(false);
      setPendingIndex(null);
    }
  }, [category]);

  const handleExerciseClick = (index: number) => {
    setPendingIndex(index);
    setIsAdShowing(true);
  };

  const handleAdComplete = () => {
    if (pendingIndex !== null) {
      setActiveIndex(pendingIndex);
    }
    setIsAdShowing(false);
    setPendingIndex(null);
  };

  const activeExercise = activeIndex !== null ? category?.exercises[activeIndex] : null;

  return (
    <AnimatePresence mode="wait">
      {isAdShowing && (
        <VideoAd 
          key="modal-ad"
          onComplete={handleAdComplete}
          onClose={handleAdComplete}
        />
      )}
      {category && (
        <div key="modal-content" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  {activeIndex !== null ? (
                    <button 
                      onClick={() => setActiveIndex(null)}
                      className="p-3 bg-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={24} />
                    </button>
                  ) : (
                    <div className="p-3 bg-orange-500 rounded-2xl">
                      <Dumbbell size={24} className="text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                      {activeIndex !== null ? activeExercise?.name : category.name} 
                      <span className="text-orange-500 ml-2">{activeIndex !== null ? 'Active' : 'Workout'}</span>
                    </h2>
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                      {activeIndex !== null ? `Exercise ${activeIndex + 1} of ${category.exercises.length}` : `${category.exercises.length} Exercises Total`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content Area */}
              <div className="space-y-6">
                {activeIndex === null ? (
                  /* List View */
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {category.exercises.map((exercise, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleExerciseClick(index)}
                        className="group flex items-center justify-between p-5 bg-zinc-950 rounded-3xl border border-zinc-800/50 hover:border-orange-500/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl text-zinc-500 group-hover:text-orange-500 transition-colors font-black italic">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-orange-500 transition-colors">
                              {exercise.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded">
                                {exercise.sets} Sets
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded">
                                {exercise.reps} Reps
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-zinc-800 group-hover:text-orange-500 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* Active Exercise View */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Video Placeholder */}
                    <div className="relative aspect-video bg-zinc-950 rounded-[2rem] overflow-hidden border border-zinc-800 group">
                      <img 
                        src={`https://picsum.photos/seed/${activeExercise?.name}/800/450`} 
                        alt={activeExercise?.name}
                        className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/20">
                          <Play size={32} className="text-white fill-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                          Instructional Video
                        </span>
                      </div>
                    </div>

                    {/* Stats & Timer */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-950 p-4 rounded-3xl border border-zinc-800 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Target Sets</p>
                        <p className="text-2xl font-black text-white">{activeExercise?.sets}</p>
                      </div>
                      <div className="bg-zinc-950 p-4 rounded-3xl border border-zinc-800 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Target Reps</p>
                        <p className="text-2xl font-black text-white">{activeExercise?.reps}</p>
                      </div>
                    </div>

                    <Timer />

                    <div className="flex gap-3">
                      <button
                        onClick={() => setActiveIndex(null)}
                        className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase italic tracking-tighter rounded-2xl transition-all"
                      >
                        Back to List
                      </button>
                      <button
                        onClick={() => {
                          if (activeIndex < category.exercises.length - 1) {
                            handleExerciseClick(activeIndex + 1);
                          } else {
                            setActiveIndex(null);
                          }
                        }}
                        className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase italic tracking-tighter rounded-2xl transition-all flex items-center justify-center gap-2"
                      >
                        {activeIndex < category.exercises.length - 1 ? (
                          <>Next Exercise <ChevronRight size={20} /></>
                        ) : (
                          <>Finish Workout <CheckCircle2 size={20} /></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeIndex === null && (
                    <button
                      onClick={() => handleExerciseClick(0)}
                      className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase italic tracking-tighter rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                    <Play size={20} className="fill-white" /> Start Session
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
