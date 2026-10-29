import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface PythonCodeBlockProps {
  code: string;
  title?: string;
  expectedOutput?: string;
  notes?: string;
}

export const PythonCodeBlock: React.FC<PythonCodeBlockProps> = ({
  code,
  title = 'Python Implementation',
  expectedOutput,
  notes
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden font-mono text-xs shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300 font-sans">{title}</span>
          <span className="text-[11px] text-slate-500 font-mono">python3</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Copy Python Code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[11px] font-sans">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code contents with subtle syntax highlighting */}
      <div className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
        <pre className="font-mono text-xs">
          <code>
            {code.split('\n').map((line, idx) => {
              // Basic regex highlight for Python keywords
              const isComment = line.trim().startsWith('#');
              return (
                <div key={idx} className="table-row">
                  <span className="table-cell pr-4 text-slate-600 select-none text-right tabular-nums w-8">
                    {idx + 1}
                  </span>
                  <span className={`table-cell ${isComment ? 'text-slate-500 italic' : ''}`}>
                    {line}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Expected Output block if provided */}
      {expectedOutput && (
        <div className="border-t border-slate-800/80 bg-slate-900/50 p-3">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-sans">
            Expected Console Output:
          </div>
          <pre className="text-emerald-400 font-mono text-xs whitespace-pre-wrap">
            {expectedOutput}
          </pre>
        </div>
      )}

      {/* Distinction notice between Python code and JS visualizer */}
      <div className="px-4 py-2 bg-slate-900/30 border-t border-slate-800 text-[11px] text-slate-400 font-sans flex items-center justify-between">
        <span>Runs natively in Python 3.10+ (Standard Library)</span>
        {notes && <span className="text-slate-500">{notes}</span>}
      </div>
    </div>
  );
};
