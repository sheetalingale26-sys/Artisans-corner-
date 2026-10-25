import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-[#2A2521] text-white border-[#443B34]';
        let icon = <Info className="w-4 h-4 text-[#D8A45F] shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-[#2A2521] text-[#FDFBF7] border-[#6B7A52]';
          icon = <CheckCircle2 className="w-4 h-4 text-[#8A9A6E] shrink-0" />;
        } else if (toast.type === 'warning' || toast.type === 'error') {
          bg = 'bg-[#3D251C] text-[#FDFBF7] border-[#A86F47]';
          icon = <AlertCircle className="w-4 h-4 text-[#E69363] shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl text-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${bg}`}
          >
            {icon}
            <span className="flex-1 font-medium leading-snug">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
