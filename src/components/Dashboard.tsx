import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Dumbbell, LogOut, User as UserIcon, Calendar, TrendingUp, ChevronRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import WorkoutModal from './WorkoutModal';
import VideoAd from './VideoAd';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

interface WorkoutCategory {
  id: string;
  name: string;
  exercises: Exercise[];
  image: string;
}

const WORKOUT_CATEGORIES: WorkoutCategory[] = [
  {
    id: 'chest',
    name: 'Chest',
    image: 'https://picsum.photos/seed/chest/400/300',
    exercises: [
      { name: 'Barbell Bench Press', sets: '4', reps: '8-10' },
      { name: 'Incline Barbell Press', sets: '3', reps: '10-12' },
      { name: 'Dumbbell Bench Press', sets: '3', reps: '10-12' },
      { name: 'Incline Dumbbell Press', sets: '3', reps: '10-12' },
      { name: 'Parallel Bar Dips', sets: '3', reps: 'Failure' },
      { name: 'Cable Crossover Fly', sets: '3', reps: '15' },
      { name: 'Dumbbell Flys', sets: '3', reps: '12-15' },
      { name: 'Pec Deck Flys', sets: '3', reps: '15' },
      { name: 'Decline Pushups', sets: '3', reps: 'Failure' },
    ],
  },
  {
    id: 'back',
    name: 'Back',
    image: 'https://picsum.photos/seed/back/400/300',
    exercises: [
      { name: 'Lat Pulldown', sets: '4', reps: '10-12' },
      { name: 'Deadlifts', sets: '3', reps: '5-8' },
      { name: 'Seated Row', sets: '3', reps: '12' },
      { name: 'Chin Ups', sets: '3', reps: 'Failure' },
      { name: 'One Arm Dumbbell Row', sets: '3', reps: '10-12 per arm' },
      { name: 'Barbell Shrugs', sets: '4', reps: '12-15' },
      { name: 'Bent Over Row', sets: '3', reps: '10' },
      { name: 'Dumbbell Bent Over Row', sets: '3', reps: '12' },
    ],
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    image: 'https://picsum.photos/seed/shoulders/400/300',
    exercises: [
      { name: 'Overhead Press', sets: '4', reps: '8-10' },
      { name: 'Back Presses', sets: '3', reps: '10-12' },
      { name: 'Seated Front Presses', sets: '3', reps: '10-12' },
      { name: 'Seated Dumbbell Presses', sets: '3', reps: '10-12' },
      { name: 'Low Pulley Lateral Raises', sets: '3', reps: '12-15' },
      { name: 'Upright Row', sets: '3', reps: '10-12' },
      { name: 'Dumbbell Rear Deltoid Raises', sets: '3', reps: '12-15' },
      { name: 'Lateral Raises', sets: '3', reps: '15' },
      { name: 'Front Raises', sets: '3', reps: '12' },
      { name: 'Face Pulls', sets: '3', reps: '15' },
    ],
  },
  {
    id: 'legs',
    name: 'Legs',
    image: 'https://picsum.photos/seed/legs/400/300',
    exercises: [
      { name: 'Squats', sets: '4', reps: '8-10' },
      { name: 'Angled Leg Presses', sets: '3', reps: '10-12' },
      { name: 'Leg Extensions', sets: '3', reps: '12-15' },
      { name: 'Dumbbell Lunges', sets: '3', reps: '12 per leg' },
      { name: 'Dumbbell Squats', sets: '3', reps: '12-15' },
      { name: 'Front Squats', sets: '3', reps: '8-10' },
      { name: 'Power Squats', sets: '3', reps: '8-10' },
      { name: 'Hack Squats', sets: '3', reps: '10-12' },
      { name: 'Seated Leg Curls', sets: '3', reps: '12-15' },
      { name: 'Calf Raises', sets: '4', reps: '20' },
    ],
  },
  {
    id: 'arms',
    name: 'Arms',
    image: 'https://picsum.photos/seed/arms/400/300',
    exercises: [
      { name: 'Curls', sets: '3', reps: '12' },
      { name: 'Barbell Curls', sets: '3', reps: '10-12' },
      { name: 'Preacher Curls', sets: '3', reps: '10-12' },
      { name: 'Hammer Curls', sets: '3', reps: '12' },
      { name: 'Concentration Curls', sets: '3', reps: '12-15' },
      { name: 'Reverse Curls', sets: '3', reps: '12-15' },
      { name: 'Close Grip Bench Presses', sets: '3', reps: '8-10' },
      { name: 'Push Downs', sets: '3', reps: '12-15' },
      { name: 'Triceps Extension', sets: '3', reps: '12-15' },
      { name: 'Triceps Kick Backs', sets: '3', reps: '15' },
      { name: 'One Arm Dumbbell Extension', sets: '3', reps: '12' },
      { name: 'Triceps Pushdown', sets: '3', reps: '15' },
    ],
  },
  {
    id: 'abs',
    name: 'Abs',
    image: 'https://picsum.photos/seed/abs/400/300',
    exercises: [
      { name: 'Incline Bench Sit ups', sets: '3', reps: '15-20' },
      { name: 'Dumbbell Side Bends', sets: '3', reps: '15 per side' },
      { name: 'Crunches', sets: '3', reps: '20' },
      { name: 'Sit ups', sets: '3', reps: '20' },
      { name: 'Seated Jackknife', sets: '3', reps: '15-20' },
      { name: 'Plank', sets: '3', reps: '60 sec' },
      { name: 'Leg Raises', sets: '3', reps: '15' },
      { name: 'Russian Twists', sets: '3', reps: '20' },
    ],
  },
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | null>(null);
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<WorkoutCategory | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  const handleCategoryClick = (category: WorkoutCategory) => {
    setPendingCategory(category);
    setIsAdShowing(true);
  };

  const handleAdComplete = () => {
    if (pendingCategory) {
      setSelectedCategory(pendingCategory);
    }
    setIsAdShowing(false);
    setPendingCategory(null);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AnimatePresence mode="wait">
        {isAdShowing && (
          <VideoAd 
            key="dashboard-ad"
            onComplete={handleAdComplete}
            onClose={handleAdComplete}
          />
        )}
      </AnimatePresence>
      {/* Navigation */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-zinc-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-orange-500" />
          <span className="font-black uppercase tracking-tighter italic text-xl">Gym Trainer</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">
            <img 
              src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} 
              alt="Profile" 
              className="w-6 h-6 rounded-full"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-medium hidden sm:inline">{user.displayName?.split(' ')[0]}</span>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase italic mb-2">Welcome back, <span className="text-orange-500">{user.displayName?.split(' ')[0]}</span></h1>
          <p className="text-zinc-500">Ready to crush your workout today?</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Workouts', value: '12', icon: Dumbbell, color: 'text-orange-500' },
            { label: 'Active Streak', value: '5 Days', icon: Calendar, color: 'text-blue-500' },
            { label: 'Total Reps', value: '1,240', icon: TrendingUp, color: 'text-green-500' },
          ].map((stat) => (
            <div 
              key={stat.label} 
              className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex items-center justify-between group transition-all"
            >
              <div>
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              </div>
              <div className={`p-4 bg-zinc-950 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Workout Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Workout <span className="text-orange-500">Categories</span>
            </h2>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Select a muscle group</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {WORKOUT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group relative h-48 bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all active:scale-[0.98]"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <p className="text-xs font-mono text-orange-500 uppercase tracking-widest mb-1">
                    {category.exercises.length} Exercises
                  </p>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">
                    {category.name}
                  </h3>
                </div>
                <div className="absolute top-4 right-4 p-2 bg-zinc-950/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                  <ChevronRight size={16} className="text-orange-500" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-orange-500" size={20} />
              Today's Schedule
            </h3>
            <div className="space-y-4">
              {[
                { time: '08:00 AM', activity: 'Morning Cardio', duration: '30 min' },
                { time: '05:00 PM', activity: 'Upper Body Strength', duration: '60 min' },
              ].map((item) => (
                <div key={`${item.activity}-${item.time}`} className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                  <div>
                    <p className="font-bold">{item.activity}</p>
                    <p className="text-xs text-zinc-500">{item.time}</p>
                  </div>
                  <span className="text-xs font-mono bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full border border-orange-500/20">
                    {item.duration}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-orange-500" size={20} />
              Recent Achievements
            </h3>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                <UserIcon className="text-zinc-700" />
              </div>
              <p className="text-zinc-500 text-sm max-w-xs">
                Keep training to unlock badges and track your personal records here.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto p-6 border-t border-zinc-900 mt-12 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 opacity-30 grayscale">
          <Dumbbell size={16} />
          <span className="text-xs font-black uppercase tracking-tighter italic">Gym Trainer</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/privacy-policy" className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-orange-500 transition-colors flex items-center gap-2">
            <Shield size={12} />
            Privacy Policy
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-800">
            &copy; 2026
          </span>
        </div>
      </footer>

      <WorkoutModal 
        category={selectedCategory} 
        onClose={() => setSelectedCategory(null)} 
      />
    </div>
  );
}
