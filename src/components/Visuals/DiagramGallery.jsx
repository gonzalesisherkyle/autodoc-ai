import React from 'react';
import MermaidRenderer from './MermaidRenderer';
import { Share2, Download, RefreshCw, AlertCircle } from 'lucide-react';

const DiagramGallery = ({ diagrams, onRegenerate }) => {
  if (!diagrams || diagrams.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No diagrams generated yet.</p>
        <button 
          onClick={onRegenerate}
          className="mt-4 text-primary-600 hover:underline font-semibold"
        >
          Generate diagrams now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {diagrams.map(diagram => {
        const [showSource, setShowSource] = React.useState(false);
        const [copied, setCopied] = React.useState(false);

        const copySource = () => {
          navigator.clipboard.writeText(diagram.mermaidCode);
          setCopied(true);
          setTimeout(() => setCopied(null), 2000);
        };

        return (
          <div key={diagram._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-1 block">
                  {diagram.diagramType}
                </span>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{diagram.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowSource(!showSource)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${showSource ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                >
                  {showSource ? 'Hide Source' : 'Show Source'}
                </button>
                <button 
                  onClick={copySource}
                  className="p-2 text-slate-400 hover:text-primary-600 transition-colors" 
                  title="Copy Mermaid"
                >
                  {copied ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="p-8">
              {showSource ? (
                <div className="bg-slate-950 rounded-2xl p-6 overflow-x-auto border border-white/5 font-mono text-sm text-slate-300">
                  <pre>{diagram.mermaidCode}</pre>
                </div>
              ) : (
                <MermaidRenderer chart={diagram.mermaidCode} />
              )}
              {diagram.description && (
                <p className="mt-6 text-sm text-slate-500 leading-relaxed italic">
                  {diagram.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiagramGallery;
