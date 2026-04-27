import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, RefreshCcw, ExternalLink, Book, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch connected repos
  const { data: connectedRepos, isLoading: isLoadingConnected } = useQuery({
    queryKey: ['repos'],
    queryFn: () => axios.get(`${API_BASE}/repos`, { withCredentials: true }).then(res => res.data),
    refetchInterval: (query) => {
      const isAnyBusy = query.state.data?.some(r => ['syncing', 'analyzing', 'generating'].includes(r.status));
      return isAnyBusy ? 3000 : false;
    }
  });

  // Fetch user's GitHub repos (for modal)
  const { data: githubRepos, isLoading: isLoadingGithub } = useQuery({
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
      queryClient.invalidateQueries(['repos']);
      setIsModalOpen(false);
    }
  });

  const syncMutation = useMutation({
    mutationFn: (id) => axios.post(`${API_BASE}/repos/${id}/sync`, {}, { withCredentials: true }),
    onSuccess: () => queryClient.invalidateQueries(['repos'])
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Your Repositories</h1>
          <p className="text-slate-500 text-sm md:text-base">Manage and sync your codebase documentation.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-5 rounded-xl font-medium transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Connect Repository
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingConnected ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"></div>)
        ) : (
          connectedRepos?.map(repo => (
            <motion.div
              layout
              key={repo._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-2.5 rounded-xl text-primary-600">
                  <Book className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={repo.status} />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{repo.name}</h3>
              <p className="text-sm text-slate-500 mb-6 truncate">{repo.fullName}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <Link 
                  to={`/repo/${repo._id}`}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View Docs <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => syncMutation.mutate(repo._id)}
                  disabled={syncMutation.isLoading || repo.status === 'syncing'}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <RefreshCcw className={`w-4 h-4 ${repo.status === 'syncing' ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Connect Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold">Select a Repository</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {isLoadingGithub ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {githubRepos?.map(repo => (
                      <div 
                        key={repo.id}
                        className="flex justify-between items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-900/50 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all cursor-pointer group"
                        onClick={() => connectMutation.mutate(repo)}
                      >
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{repo.name}</p>
                          <p className="text-sm text-slate-500">{repo.full_name}</p>
                        </div>
                        <Plus className="w-5 h-5 text-slate-300 group-hover:text-primary-600 transition-colors" />
                      </div>
                    ))}
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

const StatusBadge = ({ status }) => {
  const configs = {
    idle: { icon: Clock, text: 'Idle', color: 'text-slate-400 bg-slate-100 dark:bg-slate-800' },
    syncing: { icon: RefreshCcw, text: 'Syncing', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    analyzing: { icon: RefreshCcw, text: 'Analyzing', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
    generating: { icon: RefreshCcw, text: 'Generating', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    completed: { icon: CheckCircle2, text: 'Ready', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    failed: { icon: Book, text: 'Failed', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' }
  };

  const config = configs[status] || configs.idle;
  const Icon = config.icon;

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.color}`}>
      <Icon className={`w-3.5 h-3.5 ${status.includes('ing') ? 'animate-spin' : ''}`} />
      {config.text}
    </span>
  );
};

export default Dashboard;
