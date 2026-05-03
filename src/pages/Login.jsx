import React from 'react';
import { Terminal, GitBranch, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE}/auth/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden font-body">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/5 to-transparent"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10 px-6"
      >
        <div className="bg-surface-card border border-surface-elevated rounded-xl p-10 shadow-2xl relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-surface rounded-full mb-6 text-primary">
              <Terminal className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3 font-display uppercase">
              AutoDoc<span className="text-primary">AI</span>
            </h1>
            <p className="text-muted text-lg font-medium">
              Authoritative Infrastructure Intelligence.
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-4 bg-primary text-ink py-4 px-6 rounded-md font-bold transition-all hover:bg-primary-active active:scale-[0.98] shadow-lg"
            >
              <GitBranch className="w-6 h-6" />
              Authorize with GitHub
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-surface/50 rounded-md border border-surface-elevated">
                <ShieldCheck className="w-4 h-4 text-trading-up" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">RBAC SECURED</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-surface/50 rounded-md border border-surface-elevated">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">REAL-TIME SYNC</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-surface-elevated flex items-center justify-center gap-6">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Enterprise Ready</span>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Audit Trails</span>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">SAML SSO</span>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted font-mono uppercase tracking-widest">
          v4.2.0-stable | Licensed under Apache 2.0
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
