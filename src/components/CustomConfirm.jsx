"use client"
import { AlertTriangle } from 'lucide-react'

export default function CustomConfirm({
  title = "تأكيد",
  message,
  onConfirm,
  onCancel
}) {
  if (!message) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="p-4 rounded-full mb-4 bg-red-500/10 text-red-500">
            <AlertTriangle size={32} />
          </div>

          <h2 className="text-xl font-black text-white mb-2 italic uppercase tracking-tighter">
            {title}
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="w-full flex gap-3">
            <button
              onClick={onCancel}
              className="w-1/2 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 rounded-2xl transition-all active:scale-95"
            >
              إلغاء
            </button>

            <button
              onClick={onConfirm}
              className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all active:scale-95"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}