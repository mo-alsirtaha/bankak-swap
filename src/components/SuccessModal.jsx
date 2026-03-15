"use client"

import { CheckCircle2 } from 'lucide-react'

export default function SuccessModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl text-center relative overflow-hidden">
        {/* تأثير ضوئي خلفي */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col items-center relative z-10">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 animate-bounce">
            <CheckCircle2 size={40} className="text-black" />
          </div>
          
          <h2 className="text-2xl font-black text-white mb-3 italic tracking-tighter uppercase">
            تم النشر بنجاح
          </h2>
          
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
            {message}
          </p>
          
          <button 
            onClick={onClose}
            className="w-full bg-orange-500 text-black font-black py-4 rounded-2xl hover:bg-orange-400 transition-all active:scale-95 shadow-xl shadow-orange-500/10"
          >
            حسناً، فهمت
          </button>
        </div>
      </div>
    </div>
  );
}