"use client"
import { X, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function CustomAlert({ title, message, type = 'error', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          
          {/* الأيقونة حسب نوع التنبيه */}
          <div className={`p-4 rounded-full mb-4 ${type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
            {type === 'error' ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
          </div>

          <h2 className="text-xl font-black text-white mb-2 italic uppercase tracking-tighter">
            {title || (type === 'error' ? 'تنبيه' : 'نجاح')}
          </h2>
          
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-4 rounded-2xl transition-all active:scale-95"
          >
            حسناً، فهمت
          </button>
        </div>
      </div>
    </div>
  )
}