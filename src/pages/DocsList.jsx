import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Search, Code, Loader2 } from 'lucide-react';

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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Global Documentation
          </h1>
          <p className="text-on-surface-variant mt-2">All generated documentation across your connected repositories.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg border border-outline/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-outline"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>Loading documentation database...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-outline/10">
          <FileText className="w-12 h-12 text-outline mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-on-surface mb-2">No documentation found</h3>
          <p className="text-on-surface-variant">
            {search ? 'Try adjusting your search terms.' : 'Connect a repository and sync it to generate documentation.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDocs.map((doc, idx) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-5 rounded-xl border border-outline/20 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-surface-bright rounded text-xs font-mono text-secondary truncate">
                      {doc.repository?.name}
                    </span>
                    <span className="text-outline">/</span>
                    <span className="text-sm font-mono text-on-surface truncate">
                      {doc.file?.path || 'Unknown file'}
                    </span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-on-surface-variant line-clamp-3">
                    {doc.content || 'No summary available.'}
                  </div>
                </div>
                <Link 
                  to={`/repo/${doc.repository?._id}`}
                  className="shrink-0 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="View in Repository"
                >
                  <Code className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocsList;
