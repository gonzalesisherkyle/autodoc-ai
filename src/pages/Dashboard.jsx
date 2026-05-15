import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Plus,
  RefreshCcw,
  ExternalLink,
  Book,
  CheckCircle2,
  Clock,
  Activity,
  Globe,
  Server,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  History,
  Search,
  Check,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;
const ACTIVE_REPO_STATUSES = new Set(['syncing', 'analyzing', 'generating']);

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  // Fetch connected environments/repos
  const { data: environments, isLoading } = useQuery({
    queryKey: ['environments'],
    queryFn: () => axios.get(`${API_BASE}/repos`, { withCredentials: true }).then(res => res.data),
    refetchInterval: (query) => {
      const data = query.state.data;
      return Array.isArray(data) && data.some(env => ACTIVE_REPO_STATUSES.has(env.status)) ? 10000 : false;
    }
  });

  // Fetch available GitHub repos
  const { data: ghRepos, isLoading: loadingGH } = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => axios.get(`${API_BASE}/repos/github`, { withCredentials: true }).then(res => res.data),
    enabled: isModalOpen
  });

  const connectMutation = useMutation({
    mutationFn: (repo) => axios.post(`${API_BASE}/repos/connect`, {
      githubRepoId: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      url: repo.url,
      htmlUrl: repo.html_url
    }, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['environments']);
      setIsModalOpen(false);
    }
  });

  const syncMutation = useMutation({
    mutationFn: (id) => axios.post(`${API_BASE}/repos/${id}/sync`, {}, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['environments']);
    }
  });

  const filteredGHRepos = ghRepos?.filter(repo =>
    repo.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-surface text-body-dark font-body">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-white font-display uppercase">
            Infrastructure <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Monitoring Git-driven deployments & documentation
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 px-6 rounded-md font-semibold transition-all border border-slate-700">
            <Terminal className="w-5 h-5" />
            CLI Access
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary-active text-ink py-3 px-6 rounded-md font-bold transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Sync New Repo
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active Clusters', value: '03', icon: Server, color: 'text-primary' },
          { label: 'Avg Sync Time', value: '42s', icon: Clock, color: 'text-trading-up' },
          { label: 'Health Score', value: '98%', icon: ShieldCheck, color: 'text-trading-up' },
          { label: 'Alerts', value: '02', icon: AlertTriangle, color: 'text-trading-down' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-card border border-surface-elevated p-6 rounded-lg flex items-center gap-5">
            <div className={`p-3 rounded-md bg-surface ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Feed: Environments */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Environment States
            </h2>
            <button className="text-sm text-primary hover:text-primary-active font-semibold">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              [1, 2].map(i => <div key={i} className="h-64 bg-surface-card animate-pulse rounded-lg border border-surface-elevated"></div>)
            ) : environments?.length === 0 ? (
              <div className="col-span-full py-20 bg-slate-900/50 border border-slate-800 border-dashed rounded-lg text-center">
                <p className="text-slate-500 mb-4">No environments connected yet.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-primary-500 font-bold hover:underline"
                >
                  Connect your first repository
                </button>
              </div>
            ) : (
              environments?.map(env => (
                <motion.div
                  key={env._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-card border border-surface-elevated p-6 md:p-8 rounded-lg hover:border-primary/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <StatusIndicator status={env.status} />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">{env.name}</h3>
                      <p className="text-slate-500 text-sm font-mono truncate">{env.fullName}</p>
                    </div>

                    <div className="pt-4 border-t border-surface-elevated grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Cluster Type</p>
                        <p className="text-sm font-semibold text-slate-300">Production-01</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Sync Status</p>
                        <p className={`text-sm font-semibold ${env.status === 'completed' ? 'text-trading-up' : 'text-primary'}`}>
                          {env.status === 'completed' ? 'Synced' : env.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <Link
                        to={`/infrastructure/${env._id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-md text-sm font-bold transition-all"
                      >
                        <Book className="w-4 h-4" />
                        Explore Docs
                      </Link>
                      <button
                        onClick={() => syncMutation.mutate(env._id)}
                        disabled={syncMutation.isPending && syncMutation.variables === env._id}
                        className="p-2 bg-surface hover:bg-surface-elevated rounded-md text-muted transition-colors disabled:opacity-50"
                      >
                        <RefreshCcw className={`w-4 h-4 ${(syncMutation.isPending && syncMutation.variables === env._id) ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Activity Log */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Activity Log
            </h2>
            <button className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500 transition-colors">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-surface-card border border-surface-elevated rounded-lg divide-y divide-surface-elevated">
            {[
              { type: 'COMMIT', title: 'feat: update ingress rules', time: '12m ago', user: 'alex_dev', hash: '8f2a1c' },
              { type: 'SYNC', title: 'Staging sync completed', time: '45m ago', user: 'system', hash: '9b3d2e' },
              { type: 'ALERT', title: 'OOM Warning: worker-node-2', time: '1h ago', user: 'system', hash: 'ERR_02' },
              { type: 'DOCS', title: 'Updated Deployment Guide', time: '3h ago', user: 'sarah_ops', hash: '1a2b3c' },
            ].map((item, i) => (
              <div key={i} className="p-4 hover:bg-slate-800/50 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface tracking-wider ${item.type === 'ALERT' ? 'text-trading-down' :
                      item.type === 'SYNC' ? 'text-trading-up' : 'text-primary'
                    }`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-300">{item.hash}</span>
                </div>
                <p className="text-sm font-semibold text-slate-200 mb-1">{item.title}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 capitalize">
                    <div className="w-4 h-4 rounded-full bg-slate-700" />
                    {item.user}
                  </span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 text-sm font-bold text-muted hover:text-white transition-colors bg-surface-card border border-surface-elevated rounded-lg hover:border-surface-elevated">
            View Audit Trail
          </button>
        </div>
      </div>

      {/* Sync Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Connect New Infrastructure</h3>
                  <p className="text-sm text-slate-500">Select a GitHub repository to sync with AutoDoc AI.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-md text-slate-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 bg-slate-950/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Search your repositories..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-md py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary-500 outline-none text-white placeholder:text-slate-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                {loadingGH ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    <p className="text-sm text-slate-500 font-mono">FETCHING_GITHUB_RESOURCES...</p>
                  </div>
                ) : filteredGHRepos?.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-slate-600 font-medium italic">No matching repositories found.</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {filteredGHRepos?.map(repo => {
                      const isConnected = environments?.some(e => e.githubRepoId === repo.id);
                      return (
                        <div
                          key={repo.id}
                          className={`flex items-center justify-between p-4 rounded-md border transition-all ${isConnected ? 'bg-surface border-surface-elevated opacity-60' : 'bg-surface border-surface-elevated hover:border-primary/50 group'
                            }`}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-200 truncate group-hover:text-primary-400 transition-colors">{repo.name}</h4>
                            <p className="text-xs text-slate-600 font-mono truncate">{repo.full_name}</p>
                          </div>
                          {isConnected ? (
                            <div className="flex items-center gap-2 text-trading-up font-bold text-[10px] uppercase tracking-widest">
                              <Check className="w-4 h-4" />
                              Connected
                            </div>
                          ) : (
                            <button
                              onClick={() => connectMutation.mutate(repo)}
                              disabled={connectMutation.isPending}
                              className="px-4 py-2 bg-primary hover:bg-primary-active text-ink text-xs font-bold rounded transition-all disabled:opacity-50"
                            >
                              {connectMutation.isPending && connectMutation.variables?.id === repo.id ? 'Connecting...' : 'Connect'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusIndicator = ({ status }) => {
  const configs = {
    idle: 'bg-muted',
    syncing: 'bg-primary animate-pulse',
    analyzing: 'bg-primary/50 animate-pulse',
    generating: 'bg-primary/80 animate-pulse',
    completed: 'bg-trading-up',
    failed: 'bg-trading-down'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${configs[status] || configs.idle} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{status === 'completed' ? 'Healthy' : status}</span>
    </div>
  );
};

export default Dashboard;
