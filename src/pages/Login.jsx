import React from 'react';
import { Terminal, GitBranch, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE}/auth/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10 px-6"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-primary-500 via-secondary-500 to-primary-500"></div>
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-slate-950 border border-slate-800 rounded-md mb-6 text-primary-500">
              <Terminal className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3 font-display">
              GitOps<span className="text-primary-500">Docs</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              Synchronize your infrastructure knowledge.
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-4 bg-white text-slate-950 py-4 px-6 rounded-md font-bold transition-all hover:bg-slate-100 active:scale-[0.98] shadow-lg"
            >
              <GitBranch className="w-6 h-6" />
              Authorize with GitHub
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-slate-950/50 rounded-md border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-secondary-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">RBAC Secured</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-950/50 rounded-md border border-slate-800">
                <Activity className="w-4 h-4 text-primary-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Real-time Sync</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-center gap-6">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Enterprise Ready</span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Audit Trails</span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">SAML SSO</span>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600 font-medium">
          v4.2.0-stable | Licensed under Apache 2.0
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
