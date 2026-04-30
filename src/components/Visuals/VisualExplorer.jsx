import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VisualExplorer = ({ tree, onNodeClick, selectedPath, filter = 'all' }) => {
  const getFilteredTree = (nodes) => {
    return nodes.map(node => {
      const children = node.children ? getFilteredTree(node.children) : [];
      
      let matches = false;
      if (filter === 'all') {
        matches = true; // Show everything if 'all' is explicitly selected
      } else if (filter === 'dirs') {
        matches = node.type === 'dir';
      } else if (filter === 'models') {
        matches = node.metadata?.modelInfo !== null;
      } else if (filter === 'routes') {
        matches = node.metadata?.routeInfo !== null;
      } else {
        // DEFAULT: Show folders and architectural files only
        matches = node.type === 'dir' || 
                  node.metadata?.modelInfo !== null || 
                  node.metadata?.routeInfo !== null;
      }

      if (matches || children.length > 0) {
        return { ...node, children };
      }
      return null;
    }).filter(Boolean);
  };

  const filteredTree = getFilteredTree(tree);

  return (
    <div className="space-y-1">
      {filteredTree.map(node => (
        <TreeNode 
          key={node.path} 
          node={node} 
          onNodeClick={onNodeClick} 
          selectedPath={selectedPath}
          level={0}
        />
      ))}
    </div>
  );
};

const TreeNode = ({ node, onNodeClick, selectedPath, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setIsOpen(!isOpen);
          onNodeClick(node);
        }}
        className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
          isSelected 
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        ) : (
          <div className="w-4" />
        )}
        {node.type === 'dir' ? (
          <Folder className="w-4 h-4 text-amber-500" />
        ) : (
          <File className="w-4 h-4 text-blue-500" />
        )}
        <span className="truncate">{node.name}</span>
        {node.summary && <Info className="w-3 h-3 text-primary-500 ml-auto opacity-50" />}
      </button>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children.map(child => (
              <TreeNode 
                key={child.path} 
                node={child} 
                onNodeClick={onNodeClick} 
                selectedPath={selectedPath}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisualExplorer;
