import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

const MermaidRenderer = ({ chart }) => {
  const ref = useRef(null);
  const renderCount = useRef(0);
  const containerId = useRef(`mermaid-svg-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    let isMounted = true;

    const render = async () => {
      if (!ref.current || !chart) return;
      
      try {
        // Increment count to ensure unique ID per render if needed, 
        // but Mermaid.render needs a clean target
        ref.current.innerHTML = '<div class="flex items-center justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>';
        
        const { svg } = await mermaid.render(`${containerId.current}-${renderCount.current++}`, chart);
        
        if (isMounted && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid render error:', error);
        if (isMounted && ref.current) {
          ref.current.innerHTML = `<div class="text-red-500 text-xs p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex flex-col gap-2">
            <span class="font-bold">Syntax Error:</span>
            <pre class="whitespace-pre-wrap">${error.message || 'Invalid Mermaid code'}</pre>
          </div>`;
        }
      }
    };

    // Small timeout to allow DOM to settle
    const timeoutId = setTimeout(render, 50);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [chart]);

  return (
    <div 
      className="mermaid-container overflow-x-auto flex justify-center py-4" 
      ref={ref} 
    />
  );
};

export default MermaidRenderer;
