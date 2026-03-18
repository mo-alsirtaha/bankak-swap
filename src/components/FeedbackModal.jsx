"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageSquare, X } from 'lucide-react'

export default function FeedbackModal({ isOpen, onClose }) {
  const [foundRequest, setFoundRequest] = useState(null)
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [issues, setIssues] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (foundRequest === null) {
      alert('يرجى اختيار هل وجدت طلبك أم لا')
      return
    }

    try {
      setSubmitting(true)

      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('feedbacks')
        .insert([
          {
            user_id: user?.id || null,
            found_request: foundRequest,
            rating,
            message,
            issues
          }
        ])

      if (error) throw error

      // تم الإرسال => لا يظهر إلا بعد 7 أيام
      localStorage.setItem('feedback_last_shown', Date.now().toString())
      localStorage.setItem('feedback_last_action', 'submitted')

      onClose(true)
    } catch (err) {
      console.error('Feedback error:', err.message)
      alert('حدث خطأ أثناء إرسال الملاحظات: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSkip = () => {
    // المستخدم اختار لاحقًا => يظهر بعد 72 ساعة
    localStorage.setItem('feedback_last_shown', Date.now().toString())
    localStorage.setItem('feedback_last_action', 'skipped')
    onClose(false)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={handleSkip}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition"
          >
            <X size={18} className="text-zinc-400" />
          </button>

          <h2 className="text-lg font-black text-white text-right">
            نود سماع رأيك 💬
          </h2>
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-4 rounded-full bg-orange-500/10 text-orange-500 mb-3">
            <MessageSquare size={28} />
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            هل وجدت طلبك؟ ما رأيك بخدمات التطبيق؟ نحن نجمع الملاحظات لتطوير تجربة أفضل لك.
          </p>
        </div>

        <div className="space-y-5 text-right">
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              هل وجدت طلبك؟
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFoundRequest(true)}
                className={`py-3 rounded-2xl font-bold transition ${
                  foundRequest === true
                    ? 'bg-green-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                نعم
              </button>

              <button
                onClick={() => setFoundRequest(false)}
                className={`py-3 rounded-2xl font-bold transition ${
                  foundRequest === false
                    ? 'bg-red-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                لا
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              كيف تقيّم خدمات التطبيق؟ (1 - 5)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-4 py-3 outline-none"
            >
              <option value={5}>5 - ممتاز</option>
              <option value={4}>4 - جيد جدًا</option>
              <option value={3}>3 - جيد</option>
              <option value={2}>2 - يحتاج تحسين</option>
              <option value={1}>1 - ضعيف</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              ما رأيك بخدمات التطبيق؟
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="اكتب رأيك أو اقتراحاتك هنا..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-4 py-3 outline-none resize-none placeholder:text-zinc-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              ما المشاكل التي واجهتك؟
            </label>
            <textarea
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              rows={3}
              placeholder="مثلاً: بطء، صعوبة في نشر الطلب، مشكلة في التنقل..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-4 py-3 outline-none resize-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-black font-black py-4 rounded-2xl transition-all active:scale-95"
          >
            {submitting ? 'جاري الإرسال...' : 'إرسال الملاحظات'}
          </button>

          <button
            onClick={handleSkip}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-2xl transition-all"
          >
            لاحقًا
          </button>
        </div>
      </div>
    </div>
  )
}