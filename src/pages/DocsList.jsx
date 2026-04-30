import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Search, 
  Code, 
  Loader2, 
  FileCode, 
  Hash, 
  Calendar,
  ChevronRight,
  Filter
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE;

const DocsList = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/docs`, { withCredentials: true });
        setDocs(data);
      } catch (err) {
        console.error('Failed to fetch docs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const filteredDocs = docs.filter(doc => 
    doc.content?.toLowerCase().includes(search.toLowerCase()) ||
    doc.file?.path?.toLowerCase().includes(search.toLowerCase()) ||
    doc.repository?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-500 font-bold tracking-widest text-xs uppercase">
            <BookOpen className="w-4 h-4" />
            Central Knowledge Base
          </div>
          <h1 className="text-4xl font-bold text-white font-display">
            Operational <span className="text-primary-500">Docs</span>
          </h1>
          <p className="text-slate-400 max-w-lg">
            Semantic documentation extracted directly from your infrastructure code and Git history.
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search manifests, guides, or logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900 rounded-md border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <div className="hidden lg:block space-y-8">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              Resource Type
            </h3>
            <div className="space-y-2">
              {['K8s Manifests', 'Deployment Guides', 'API References', 'Infrastructure Specs'].map(type => (
                <label key={type} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-900 cursor-pointer transition-colors group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-offset-slate-950" />
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['ingress', 'redis', 'auth', 'scaling', 'ci-cd', 'metrics'].map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-400 hover:text-primary-400 hover:border-primary-500/50 cursor-pointer transition-all uppercase tracking-tighter">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Docs Content */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
              <p className="text-slate-500 font-medium font-mono text-sm">INDEXING_RESOURCES...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-24 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
              <FileText className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No documentation artifacts found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                {search ? 'No results matched your search criteria.' : 'Infrastructure sync required to generate documentation.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDocs.map((doc, idx) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-primary-500/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                        <div className="flex items-center gap-2 px-2 py-1 bg-primary-500/10 border border-primary-500/20 rounded text-[10px] font-bold text-primary-400 uppercase tracking-wider">
                          <FileCode className="w-3 h-3" />
                          {doc.repository?.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono truncate">
                          <Hash className="w-3 h-3" />
                          {doc.file?.path}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                          <Calendar className="w-3 h-3" />
                          Last Sync: 2h ago
                        </div>
                      </div>
                      
                      <div className="prose prose-invert prose-sm max-w-none text-slate-400 line-clamp-2 font-medium leading-relaxed">
                        {doc.content || 'No automated summary available for this infrastructure artifact.'}
                      </div>
                    </div>
                    
                    <Link 
                      to={`/infrastructure/${doc.repository?._id}`}
                      className="shrink-0 p-3 bg-slate-800 hover:bg-primary-500 hover:text-white rounded text-slate-400 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsList;
