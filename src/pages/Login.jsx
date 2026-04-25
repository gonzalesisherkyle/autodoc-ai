import React from 'react';
import { Code } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE}/auth/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-tertiary/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-3xl shadow-2xl w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">AutoDoc AI</h1>
          <p className="text-on-surface-variant">Automate your documentation with AST-level intelligence.</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary py-4 px-6 rounded-xl font-semibold transition-all hover:brightness-110 active:scale-[0.98] shadow-[0_0_15px_rgba(173,198,255,0.3)]"
        >
          <Code className="w-6 h-6" />
          Continue with GitHub
        </button>

        <p className="mt-8 text-center text-xs text-slate-400">
          By connecting your GitHub account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
