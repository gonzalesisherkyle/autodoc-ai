import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Settings as SettingsIcon, User, Bell, Shield, Key } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-on-surface-variant mt-2 text-sm md:text-base">Manage your account preferences and integrations.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 md:p-6 rounded-2xl border border-outline/20"
        >
          <h2 className="text-lg md:text-xl font-semibold text-on-surface mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            Profile Information
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-center sm:text-left">
            <img src={user?.avatarUrl} alt={user?.username} className="w-20 h-20 rounded-full border-2 border-primary/30" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-on-surface">{user?.username}</p>
              <p className="text-sm md:text-base text-on-surface-variant">{user?.email || 'No email provided'}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] md:text-xs font-semibold">
                GitHub Connected
              </span>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default Settings;
