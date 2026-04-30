import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Settings as SettingsIcon, User, Bell, Save, CheckCircle, Shield, Globe } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

const Settings = () => {
  const { user } = useAuth();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setWebhookUrl(user.discordWebhookUrl || '');
      setNotificationsEnabled(user.notificationsEnabled || false);
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await axios.patch(`${API_BASE}/auth/settings`, {
        discordWebhookUrl: webhookUrl,
        notificationsEnabled
      }, { withCredentials: true });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto pb-20 bg-slate-950 min-h-screen text-slate-200">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-500 font-bold tracking-[0.2em] text-[10px] uppercase">
            <SettingsIcon className="w-4 h-4" />
            System Configuration
          </div>
          <h1 className="text-4xl font-bold text-white font-display">
            Control <span className="text-primary-500">Center</span>
          </h1>
          <p className="text-slate-400 max-w-lg">Manage your environment preferences, notification webhooks, and security settings.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${saveSuccess
            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
            : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-500/20'
            } disabled:opacity-50`}
        >
          {saveSuccess ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'UPDATING...' : saveSuccess ? 'CONFIG_SAVED' : 'SAVE_CHANGES'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 backdrop-blur-sm border border-white/5 p-8 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-3 font-display uppercase tracking-widest text-sm">
                <User className="w-5 h-5 text-primary-500" />
                Identity Profile
              </h2>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800 uppercase tracking-tighter">Auth: OAuth2</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity" />
                <img src={user?.avatarUrl} alt={user?.username} className="relative w-24 h-24 rounded-full border-2 border-white/10 shadow-2xl" />
              </div>
              <div className="space-y-4 text-center sm:text-left flex-1">
                <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Authenticated Account</p>
                  <p className="text-2xl font-bold text-white">{user?.username}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Primary Email</p>
                  <p className="text-slate-400 font-mono text-sm">{user?.email || 'unreachable_entity@github.com'}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded w-fit mx-auto sm:mx-0">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Connection Secure</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Notifications Section */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/40 backdrop-blur-sm border border-white/5 p-8 rounded-2xl shadow-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3 font-display uppercase tracking-widest text-sm">
              <Bell className="w-5 h-5 text-primary-500" />
              Observability Webhooks
            </h2>
            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <p className="font-bold text-white text-sm uppercase tracking-wide">Sync Notifications</p>
                  <p className="text-xs text-slate-500 mt-1">Receive automated alerts upon system analysis completion.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  />
                  <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-600 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600 peer-checked:after:bg-white"></div>
                </label>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Discord Payload Destination</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-xs font-mono text-primary-300/80"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>
                <div className="flex items-start gap-2 text-[10px] text-slate-600 bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <p>Webhooks are stored securely and only used for operational alerts. Ensure the URL contains the appropriate token for your destination channel.</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-2xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Security Stats</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Two-Factor Auth</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Via GitHub</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Session State</span>
                <span className="text-[10px] font-bold text-primary-500 uppercase">Active_Dev</span>
              </div>
              <div className="pt-6 border-t border-slate-800">
                <p className="text-[10px] text-slate-600 leading-relaxed uppercase tracking-tighter">Last Login: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
