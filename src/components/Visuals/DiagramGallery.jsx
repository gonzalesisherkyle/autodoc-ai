import React, { useState } from 'react';
import MermaidRenderer from './MermaidRenderer';
import { Share2, Download, RefreshCw, AlertCircle, Code, Eye } from 'lucide-react';

const DiagramCard = ({ diagram }) => {
  const [showSource, setShowSource] = useState(false);
  const [copied, setCopied] = useState(false);

  const copySource = () => {
    navigator.clipboard.writeText(diagram.mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface-card border border-surface-elevated rounded-lg overflow-hidden transition-all hover:border-primary/30">
      <div className="px-6 py-4 border-b border-surface-elevated flex justify-between items-center bg-surface-card/50">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
            {diagram.diagramType || 'Infrastructure Map'}
          </span>
          <h3 className="font-bold text-white">{diagram.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSource(!showSource)}
            className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold rounded transition-all border ${showSource
              ? 'bg-primary border-primary text-ink'
              : 'bg-surface border-surface-elevated text-muted hover:text-white'
              }`}
          >
            {showSource ? <Eye className="w-3 h-3" /> : <Code className="w-3 h-3" />}
            {showSource ? 'VIEW DIAGRAM' : 'VIEW SOURCE'}
          </button>
          <button
            onClick={copySource}
            className="p-2 text-muted hover:text-primary transition-colors"
            title="Copy Mermaid"
          >
            {copied ? <RefreshCw className="w-4 h-4 animate-spin text-trading-up" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="p-6">
        {showSource ? (
          <div className="bg-surface rounded-lg p-6 overflow-x-auto border border-surface-elevated font-mono text-sm text-primary/80">
            <pre><code>{diagram.mermaidCode}</code></pre>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-4 md:p-8">
            <MermaidRenderer chart={diagram.mermaidCode} />
          </div>
        )}
        {diagram.description && !showSource && (
          <p className="mt-6 text-sm text-slate-400 leading-relaxed italic border-l-2 border-slate-800 pl-4">
            {diagram.description}
          </p>
        )}
      </div>
    </div>
  );
};

const DiagramGallery = ({ diagrams, onRegenerate, isRegenerating = false }) => {
  if (!diagrams || diagrams.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-lg">
        <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <p className="text-slate-400 font-medium">No system diagrams generated yet.</p>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="mt-4 bg-primary hover:bg-primary-active text-ink px-6 py-2 rounded-md text-sm font-bold transition-all disabled:opacity-50"
        >
          {isRegenerating ? 'Generating...' : 'Generate Infrastructure Map'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {diagrams.map(diagram => (
        <DiagramCard key={diagram._id} diagram={diagram} />
      ))}
    </div>
  );
};

export default DiagramGallery;
