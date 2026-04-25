import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Settings as SettingsIcon, User, Bell, Shield, Key } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-on-surface-variant mt-2">Manage your account preferences and integrations.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl border border-outline/20"
        >
          <h2 className="text-xl font-semibold text-on-surface mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            Profile Information
          </h2>
          <div className="flex items-center gap-6">
            <img src={user?.avatarUrl} alt={user?.username} className="w-20 h-20 rounded-full border-2 border-primary/30" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-on-surface">{user?.username}</p>
              <p className="text-on-surface-variant">{user?.email || 'No email provided'}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
                GitHub Connected
              </span>
            </div>
          </div>
        </motion.section>

        {/* API Keys */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl border border-outline/20"
        >
          <h2 className="text-xl font-semibold text-on-surface mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-tertiary" />
            API & Integrations
          </h2>
          <p className="text-on-surface-variant text-sm mb-4">
            Manage webhooks and external access to your generated documentation.
          </p>
          <div className="p-4 bg-surface-container rounded-xl border border-outline/10 flex items-center justify-between">
            <div>
              <p className="font-medium text-on-surface">AutoDoc API Key</p>
              <p className="text-xs text-on-surface-variant font-mono mt-1">sk_test_••••••••••••••••</p>
            </div>
            <button className="px-4 py-2 bg-surface text-on-surface border border-outline/20 rounded-lg text-sm hover:bg-surface-bright transition-colors">
              Regenerate
            </button>
          </div>
        </motion.section>

        {/* Preferences */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl border border-outline/20"
        >
          <h2 className="text-xl font-semibold text-on-surface mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-surface/50 rounded-lg border border-outline/10 cursor-pointer hover:bg-surface transition-colors">
              <div>
                <p className="font-medium text-on-surface">Sync Completions</p>
                <p className="text-xs text-on-surface-variant">Get notified when a repository finishes analyzing.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-primary rounded bg-surface border-outline" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 bg-surface/50 rounded-lg border border-outline/10 cursor-pointer hover:bg-surface transition-colors">
              <div>
                <p className="font-medium text-on-surface">PR Documentation Updates</p>
                <p className="text-xs text-on-surface-variant">Notify when AutoDoc comments on a GitHub PR.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-primary rounded bg-surface border-outline" defaultChecked />
            </label>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Settings;
