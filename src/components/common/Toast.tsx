import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all transform duration-300">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl border text-sm font-medium ${
          toast.type === 'error'
            ? 'bg-rose-50 text-rose-900 border-rose-200'
            : toast.type === 'info'
            ? 'bg-stone-900 text-[#FCF9EA] border-stone-800'
            : 'bg-[#97A87A]/15 text-[#2d421d] border-[#97A87A]/40 bg-white backdrop-blur-md'
        }`}
      >
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-[#DB9558] shrink-0" />}
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#97A87A] shrink-0" />}
        <span>{toast.text}</span>
      </div>
    </div>
  );
};
