import { motion } from 'motion/react';
import { ArrowLeft, Shield, Lock, Eye, FileText, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Shield className="text-orange-500" size={24} />,
      title: "Information Collection",
      content: "We collect information to provide better services to our users. This includes information you provide to us (like your name and email from Google Sign-In) and information we collect automatically (like device information and usage statistics via Firebase and AdMob)."
    },
    {
      icon: <Lock className="text-orange-500" size={24} />,
      title: "Data Security",
      content: "We use Firebase Authentication and Firestore to ensure your data is stored securely. We implement industry-standard security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of data."
    },
    {
      icon: <Eye className="text-orange-500" size={24} />,
      title: "Third-Party Services",
      content: "Our app uses third-party services that may collect information used to identify you. These include Google Play Services, AdMob (for advertisements), and Firebase Analytics/Crashlytics (for app performance monitoring)."
    },
    {
      icon: <FileText className="text-orange-500" size={24} />,
      title: "User Rights",
      content: "You have the right to access, update, or delete your personal information at any time. Since we use Google Sign-In, you can manage your account permissions through your Google Account settings."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="text-orange-500" size={20} />
            <span className="font-black uppercase tracking-tighter italic text-lg text-white">Privacy Policy</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-none mb-6 tracking-tighter">
            Your Privacy <br /> <span className="text-orange-500 text-4xl md:text-6xl">Matters to Us</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
            Last updated: March 24, 2026. This policy describes how Gym Trainer collects, uses, and shares your information when you use our mobile application.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 hover:border-orange-500/30 transition-all group"
            >
              <div className="mb-6 p-4 bg-zinc-950 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight italic">{section.title}</h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <section className="bg-orange-500 rounded-[3rem] p-12 text-zinc-950 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black uppercase italic mb-4">Contact Us</h2>
            <p className="font-medium mb-8 max-w-md opacity-90">
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
            </p>
            <a 
              href="mailto:support@gymtrainer.app" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-950 text-white rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-xl"
            >
              <Mail size={20} />
              support@gymtrainer.app
            </a>
          </div>
          <Shield size={200} className="absolute -bottom-10 -right-10 text-zinc-950/10 rotate-12" />
        </section>

        <footer className="mt-20 pt-12 border-t border-zinc-800 text-center">
          <p className="text-zinc-600 text-xs uppercase tracking-[0.2em] font-bold">
            &copy; 2026 Gym Trainer App. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
