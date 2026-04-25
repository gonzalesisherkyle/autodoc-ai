import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeft, FileText, Code, Folder, Search, CornerDownRight, Book } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE;

const RepoDetail = () => {
  const { id } = useParams();
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [search, setSearch] = useState('');

  const { data: repo } = useQuery({
    queryKey: ['repo', id],
    queryFn: () => axios.get(`${API_BASE}/repos`, { withCredentials: true }).then(res => res.data.find(r => r._id === id))
  });

  const { data: structure } = useQuery({
    queryKey: ['structure', id],
    queryFn: () => axios.get(`${API_BASE}/docs/structure/${id}`, { withCredentials: true }).then(res => res.data)
  });

  const { data: docs } = useQuery({
    queryKey: ['docs', id],
    queryFn: () => axios.get(`${API_BASE}/docs/${id}`, { withCredentials: true }).then(res => res.data)
  });

  const filteredDocs = docs?.filter(doc =>
    doc.file?.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.content.toLowerCase().includes(search.toLowerCase())
  );

  const selectedFileDocs = docs?.filter(d => d.file?._id === selectedFileId);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar - File Explorer */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
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
              onClick={() => setSelectedFileId(file._id)}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm transition-all ${selectedFileId === file._id ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            >
              <FileText className="w-4 h-4 opacity-70" />
              <span className="truncate">{file.path}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Doc Viewer */}
      <div className="flex-1 overflow-y-auto p-12">
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
                      <div className="p-8 prose dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                          {doc.content}
                        </div>
                        {doc.ir?.codeSnippet && (
                          <div className="mt-8 bg-slate-950 rounded-2xl p-6 overflow-x-auto shadow-inner border border-white/5">
                            <pre className="text-sm font-mono text-slate-300">
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
                    <button className="mt-4 text-primary-600 font-semibold hover:underline">Trigger analysis</button>
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
  );
};

export default RepoDetail;
