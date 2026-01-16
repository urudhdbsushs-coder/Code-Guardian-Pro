
import React from 'react';

interface EditorProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export const Editor: React.FC<EditorProps> = ({ label, value, onChange, readOnly, placeholder }) => {
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden glass shadow-2xl transition-all duration-300 hover:border-indigo-500/30">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900/50 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">{label}</span>
        </div>
        {readOnly && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight">Protected Output</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 relative min-h-[300px]">
        {/* Line Numbers Sidebar Placeholder */}
        <div className="w-10 bg-slate-900/30 border-r border-slate-700/30 flex flex-col items-center pt-4 select-none">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-[10px] text-slate-600 font-mono mb-1 leading-5">{i + 1}</span>
          ))}
        </div>
        <textarea
          className="flex-1 w-full p-4 bg-transparent text-indigo-100 font-mono text-[13px] leading-relaxed resize-none focus:outline-none focus:ring-0 placeholder-slate-600"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
