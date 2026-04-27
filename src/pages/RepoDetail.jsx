import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeft, FileText, Code, Folder, Search, CornerDownRight, Book, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE;

const RepoDetail = () => {
  const { id } = useParams();
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: () => axios.post(`${API_BASE}/docs/analyze-file`, {
      repoId: id,
      fileId: selectedFileId
    }, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['repo', id]);
      queryClient.invalidateQueries(['docs', id]);
      queryClient.invalidateQueries(['structure', id]);
    }
  });

  const { data: repo } = useQuery({
    queryKey: ['repo', id],
    queryFn: () => axios.get(`${API_BASE}/repos`, { withCredentials: true }).then(res => res.data.find(r => r._id === id)),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return ['syncing', 'analyzing', 'generating'].includes(status) ? 2000 : false;
    }
  });

  const { data: structure } = useQuery({
    queryKey: ['structure', id],
    queryFn: () => axios.get(`${API_BASE}/docs/structure/${id}`, { withCredentials: true }).then(res => res.data),
    refetchInterval: (query) => {
      const isSyncing = query.state.data?.some(s => ['syncing', 'analyzing'].includes(s.status));
      return isSyncing ? 2000 : false;
    }
  });

  const { data: docs } = useQuery({
    queryKey: ['docs', id],
    queryFn: () => axios.get(`${API_BASE}/docs/${id}`, { withCredentials: true }).then(res => res.data),
    refetchInterval: () => {
      const isAnyBusy = ['syncing', 'analyzing', 'generating'].includes(repo?.status) || 
                        structure?.some(s => ['syncing', 'analyzing'].includes(s.status));
      return isAnyBusy ? 2000 : false;
    }
  });

  const filteredDocs = docs?.filter(doc =>
    doc.file?.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.content.toLowerCase().includes(search.toLowerCase())
  );

  const selectedFileDocs = docs?.filter(d => d.file?._id.toString() === selectedFileId?.toString());

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - File Explorer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between lg:block">
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>
          <h2 className="font-bold text-lg truncate">{repo?.name}</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search docs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {structure?.filter(s => s.type === 'file').map(file => (
            <button
              key={file._id}
              onClick={() => {
                setSelectedFileId(file._id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm transition-all ${selectedFileId === file._id ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            >
              <FileText className="w-4 h-4 opacity-70" />
              <span className="truncate">{file.path}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Doc Viewer */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-12">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm"
            >
              <Folder className="w-6 h-6 text-primary-600" />
            </button>
            <h2 className="font-bold truncate px-4">{repo?.name}</h2>
            <div className="w-10"></div> {/* Spacer */}
          </div>

          {selectedFileId ? (
            <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={selectedFileId}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <Code className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{structure?.find(s => s._id === selectedFileId)?.name}</h1>
                  <p className="text-slate-500">{structure?.find(s => s._id === selectedFileId)?.path}</p>
                </div>
              </div>

              <div className="space-y-12">
                {selectedFileDocs?.length > 0 ? (
                  selectedFileDocs.map(doc => (
                    <div key={doc._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                      <div className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                          {doc.type === 'entity_doc' ? (
                            <><CornerDownRight className="w-3.5 h-3.5" /> Entity: {doc.ir?.name}</>
                          ) : (
                            <><FileText className="w-3.5 h-3.5" /> File Summary</>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">v{doc.version}</span>
                      </div>
                      <div className="p-4 md:p-8 prose dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                          {doc.content}
                        </div>
                        {doc.ir?.codeSnippet && (
                          <div className="mt-6 md:mt-8 bg-slate-950 rounded-xl md:rounded-2xl p-4 md:p-6 overflow-x-auto shadow-inner border border-white/5">
                            <pre className="text-xs md:text-sm font-mono text-slate-300">
                              <code>{doc.ir.codeSnippet}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <p className="text-slate-400">No documentation generated for this file yet.</p>
                    <button 
                      onClick={() => syncMutation.mutate()}
                      disabled={syncMutation.isPending || ['syncing', 'analyzing'].includes(structure?.find(s => s._id.toString() === selectedFileId?.toString())?.status)}
                      className="mt-4 text-primary-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {syncMutation.isPending || ['syncing', 'analyzing'].includes(structure?.find(s => s._id.toString() === selectedFileId?.toString())?.status) 
                        ? 'Analyzing...' 
                        : 'Trigger analysis'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <Book className="w-16 h-16 mb-4 text-slate-300" />
            <h2 className="text-xl font-bold">Select a file to view documentation</h2>
            <p>Automatic documentation is generated for each function and class.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default RepoDetail;
