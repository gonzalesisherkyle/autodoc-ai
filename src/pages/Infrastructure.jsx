import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  ChevronLeft, 
  FileText, 
  Code, 
  Folder, 
  Search, 
  CornerDownRight, 
  Book, 
  X, 
  Cpu, 
  Layers, 
  Hash, 
  Zap,
  Activity,
  Copy,
  RefreshCcw,
  Menu,
  FileCode,
  Image as ImageIcon,
  Layout,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DiagramGallery from '../components/Visuals/DiagramGallery';

const API_BASE = import.meta.env.VITE_API_BASE;

const Infrastructure = () => {
  const { id } = useParams();
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('docs'); // 'docs' or 'diagrams'
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: () => axios.post(`${API_BASE}/docs/analyze-file`, {
      repoId: id,
      fileId: selectedFileId
    }, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['repo', id]);
      queryClient.invalidateQueries(['structure', id]);
      queryClient.invalidateQueries(['docs', id]);
    }
  });

  const repoSyncMutation = useMutation({
    mutationFn: () => axios.post(`${API_BASE}/repos/${id}/sync`, {}, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['repo', id]);
    }
  });

  const analyzeVisualsMutation = useMutation({
    mutationFn: () => axios.post(`${API_BASE}/visuals/${id}/analyze`, {}, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['diagrams', id]);
    }
  });

  const { data: diagrams, isLoading: diagramsLoading } = useQuery({
    queryKey: ['diagrams', id],
    queryFn: () => axios.get(`${API_BASE}/visuals/${id}/diagrams`, { withCredentials: true }).then(res => res.data),
    enabled: activeTab === 'diagrams'
  });

  const { data: repo } = useQuery({
    queryKey: ['repo', id],
    queryFn: () => axios.get(`${API_BASE}/repos`, { withCredentials: true }).then(res => res.data.find(r => r._id === id)),
  });

  const { data: structure } = useQuery({
    queryKey: ['structure', id],
    queryFn: () => axios.get(`${API_BASE}/docs/structure/${id}`, { withCredentials: true }).then(res => res.data),
  });

  const { data: docs } = useQuery({
    queryKey: ['docs', id],
    queryFn: () => axios.get(`${API_BASE}/docs/${id}`, { withCredentials: true }).then(res => res.data),
  });

  const selectedFileDocs = docs?.filter(d => d.file?._id.toString() === selectedFileId?.toString());
  const selectedFileInfo = structure?.find(s => s._id === selectedFileId);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Sidebar - File Explorer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 space-y-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-primary-400 transition-colors text-xs font-bold uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" /> Back to Fleet
          </Link>
          <div className="space-y-1">
            <h2 className="font-bold text-xl text-white font-display truncate">{repo?.name}</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Cluster Sync</span>
            </div>
          </div>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              placeholder="Filter manifests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none placeholder:text-slate-700"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin">
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Source Tree</p>
          </div>
          {structure?.filter(s => s.type === 'file').map(file => (
            <button
              key={file._id}
              onClick={() => {
                setSelectedFileId(file._id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-xs font-medium transition-all group ${selectedFileId === file._id ? 'bg-primary-500/10 text-primary-400 border-l-2 border-primary-500' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              <FileText className={`w-4 h-4 ${selectedFileId === file._id ? 'text-primary-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
              <span className="truncate text-left font-mono">{file.path}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Doc Viewer */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="font-bold text-sm text-white font-display truncate">{repo?.name}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('docs')} className={`p-2 ${activeTab === 'docs' ? 'text-primary-500' : 'text-slate-400'}`}>
              <FileCode className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('diagrams')} className={`p-2 ${activeTab === 'diagrams' ? 'text-primary-500' : 'text-slate-400'}`}>
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 md:p-12 max-w-5xl mx-auto">
          {/* Tab Navigation */}
          <div className="hidden lg:flex items-center gap-6 mb-12 border-b border-slate-800/50">
            <button 
              onClick={() => setActiveTab('docs')}
              className={`pb-4 text-sm font-bold tracking-widest transition-all border-b-2 ${
                activeTab === 'docs' 
                  ? 'text-white border-primary-500' 
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              MANIFEST EXPLORER
            </button>
            <button 
              onClick={() => setActiveTab('diagrams')}
              className={`pb-4 text-sm font-bold tracking-widest transition-all border-b-2 ${
                activeTab === 'diagrams' 
                  ? 'text-white border-primary-500' 
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              INFRASTRUCTURE MAPS
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'docs' ? (
              <motion.div
                key="docs-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                {selectedFileId ? (
                  <motion.div 
                    key={selectedFileId}
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    {/* File Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-900 border border-slate-800 rounded text-primary-500">
                            <Cpu className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Infrastructure Artifact</span>
                            <h1 className="text-3xl font-bold text-white font-display leading-none">{selectedFileInfo?.name}</h1>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                          <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {selectedFileInfo?.path}</span>
                          <span className="flex items-center gap-1.5 text-primary-500/80"><Zap className="w-3.5 h-3.5" /> High Impact</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => repoSyncMutation.mutate()}
                          disabled={repoSyncMutation.isPending}
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-400 transition-colors border border-slate-700 disabled:opacity-50"
                          title="Sync Infrastructure"
                        >
                          <RefreshCcw className={`w-4 h-4 ${repoSyncMutation.isPending ? 'animate-spin' : ''}`} />
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white py-2.5 px-5 rounded-md text-xs font-bold transition-all shadow-lg shadow-primary-500/10">
                          <Activity className="w-4 h-4" />
                          Monitor Deployment
                        </button>
                      </div>
                    </div>

                    {/* Docs Sections */}
                    <div className="space-y-12">
                      {selectedFileDocs?.length > 0 ? (
                        selectedFileDocs.map((doc, idx) => (
                          <div key={doc._id} className="space-y-4 group">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs font-bold">
                                  {idx + 1}
                                </div>
                                <h3 className="font-bold text-lg text-slate-200 group-hover:text-primary-400 transition-colors">
                                  {doc.type === 'entity_doc' ? `Component: ${doc.ir?.name}` : 'Resource Specification'}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded tracking-tighter uppercase">v{doc.version}.0.2</span>
                                <button className="p-1.5 hover:bg-slate-800 rounded text-slate-600 transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                              <div className="lg:col-span-3 space-y-8">
                                <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity text-white">
                                    <Book className="w-24 h-24 -mr-8 -mt-8" />
                                  </div>
                                  <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6 text-primary-500/60">
                                      <FileText className="w-4 h-4" />
                                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Automated Technical Specification</span>
                                    </div>
                                    <div className="text-slate-300 leading-relaxed space-y-4 text-sm md:text-base">
                                      {doc.content.split('\n').map((line, i) => (
                                        line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {doc.ir?.codeSnippet && (
                                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                                    <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Hash className="w-3 h-3" /> Source Fragment
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500/50" />
                                        <span className="w-2 h-2 rounded-full bg-amber-500/50" />
                                        <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                      </div>
                                    </div>
                                    <div className="p-4 md:p-8 overflow-x-auto scrollbar-thin bg-black/20">
                                      <pre className="text-xs md:text-sm font-mono text-primary-300/90 leading-relaxed">
                                        <code>{doc.ir.codeSnippet}</code>
                                      </pre>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Meta Sidebar for each doc */}
                              <div className="lg:col-span-1 space-y-6">
                                <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-4">
                                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Resource Meta</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-[10px] text-slate-600 uppercase font-bold">Status</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <span className="text-xs text-slate-300 font-medium uppercase tracking-tighter">Verified Artifact</span>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-slate-600 uppercase font-bold">Last Analyzed</p>
                                      <p className="text-xs text-slate-400 mt-0.5">{new Date(doc.lastUpdated || doc.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-slate-600 uppercase font-bold">Version</p>
                                      <p className="text-xs font-mono text-primary-500/80 mt-0.5">SHA-{doc._id.substring(0, 7)}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-bold border border-slate-700 transition-all">
                                  <Share2 className="w-3.5 h-3.5" />
                                  EXPORT DOCS
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-24 bg-slate-900/30 border border-dashed border-slate-800 rounded-lg">
                          <div className="p-4 bg-slate-900 w-fit mx-auto rounded-full mb-6 text-slate-700">
                            <Book className="w-10 h-10" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">No active documentation</h3>
                          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                            The AI engine has not yet mapped the infrastructure dependencies for this resource.
                          </p>
                          <button 
                            onClick={() => syncMutation.mutate()}
                            disabled={syncMutation.isPending}
                            className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-6 rounded-md text-xs font-bold transition-all border border-slate-700 disabled:opacity-50"
                          >
                            {syncMutation.isPending ? 'MAPPING_ARTIFACTS...' : 'Trigger Analysis Pipeline'}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-[70vh] flex flex-col items-center justify-center text-center">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full" />
                      <div className="relative p-8 bg-slate-900 border border-slate-800 rounded-2xl text-primary-500">
                        <Layers className="w-16 h-16" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3 font-display">System Explorer</h2>
                    <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                      Select an infrastructure resource from the navigation tree to explore its automated documentation and deployment state.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="diagrams-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white font-display">Infrastructure Maps</h2>
                    <p className="text-slate-500 text-sm mt-1">AI-generated visual representations of your system architecture.</p>
                  </div>
                  <button 
                    onClick={() => analyzeVisualsMutation.mutate()}
                    disabled={analyzeVisualsMutation.isPending}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-xs font-bold border border-slate-700 transition-all disabled:opacity-50"
                  >
                    <RefreshCcw className={`w-3.5 h-3.5 ${analyzeVisualsMutation.isPending ? 'animate-spin' : ''}`} />
                    REGENERATE MAPS
                  </button>
                </div>
                
                {diagramsLoading ? (
                  <div className="space-y-6">
                    {[1, 2].map(i => (
                      <div key={i} className="h-64 bg-slate-900/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <DiagramGallery 
                    diagrams={diagrams} 
                    onRegenerate={() => analyzeVisualsMutation.mutate()} 
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
