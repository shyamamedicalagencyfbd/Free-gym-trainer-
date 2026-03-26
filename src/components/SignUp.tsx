import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Dumbbell, ShieldCheck } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      navigate('/dashboard'); // Redirect to dashboard after success
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      {/* Left Side - Branding/Image */}
      <div className="hidden md:flex md:w-1/2 bg-orange-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <Dumbbell key={i} size={100} className="rotate-45" />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-white max-w-md">
          <h2 className="text-7xl font-black italic uppercase leading-none mb-6">
            Push Your <br /> Limits.
          </h2>
          <p className="text-xl font-medium opacity-90">
            Join thousands of athletes who transformed their lives with our free training programs.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`}
                  alt="User"
                  className="w-12 h-12 rounded-full border-4 border-orange-600"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <p className="text-sm font-bold uppercase tracking-wider">
              +10k Active Users
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950">
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex p-3 bg-zinc-900 rounded-2xl mb-4 border border-zinc-800">
              <Dumbbell className="text-orange-500" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-zinc-500">Start your fitness journey today</p>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-zinc-100 text-black font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-zinc-300 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-600 font-mono">Secure Access</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
              <ShieldCheck className="text-orange-500 shrink-0" size={20} />
              <p className="text-xs text-zinc-500 leading-relaxed">
                By signing up, you agree to our <Link to="/privacy-policy" className="text-orange-500 hover:underline">Terms of Service and Privacy Policy</Link>. We use Google to securely manage your account.
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-zinc-600 text-sm">
            Already have an account? <span className="text-orange-500 font-bold cursor-pointer hover:underline">Log In</span>
          </p>
        </div>
      </div>
    </div>
  );
}
