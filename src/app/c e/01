"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Landmark, Banknote, ArrowRight, Loader2 } from 'lucide-react'

export default function NewRequest() {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [userProfile, setUserProfile] = useState(null)
  const router = useRouter()

  // جلب بيانات بروفايل المستخدم عند تحميل الصفحة
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setUserProfile(data)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (type) => {
    if (!amount || amount <= 0) {
      alert("الرجاء إدخال مبلغ صحيح")
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase.from('requests').insert({
        user_id: user.id,
        type: type, // 'cash_to_bank' أو 'bank_to_cash'
        amount: parseFloat(amount),
        city: userProfile?.city || 'أم درمان', // استخدام مدينة المستخدم أو أم درمان كافتراض
        status: 'pending'
      })

      if (error) throw error

      alert("تم نشر طلبك بنجاح! سيظهر الآن في القائمة الرئيسية.")
      router.push('/requests') 
    } catch (err) {
      alert("خطأ في النشر: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto pt-12 space-y-8">
        <header className="text-right">
          <h1 className="text-3xl font-black text-orange-500 underline decoration-zinc-800 underline-offset-8">نشر طلب تبديل</h1>
          <p className="text-zinc-500 mt-2">حدد المبلغ ونوع العملية التي تحتاجها</p>
        </header>

        {/* حقل إدخال المبلغ */}
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
          <label className="block text-zinc-500 text-sm mb-2 text-right">المبلغ المطلوب (SDG)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black p-5 rounded-2xl border border-zinc-800 focus:border-orange-500 text-center text-3xl font-mono outline-none transition-all"
          />
        </div>

        {/* أزرار الإجراءات */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleSubmit('bank_to_cash')}
            disabled={loading}
            className="flex flex-col items-center gap-4 bg-zinc-900 p-6 rounded-3xl border-2 border-transparent hover:border-green-500/50 transition-all active:scale-95 group"
          >
            <div className="p-4 bg-green-500/10 rounded-full group-hover:bg-green-500 group-hover:text-black transition-colors">
              <Banknote size={32} className="text-green-500 group-hover:text-inherit" />
            </div>
            <span className="font-bold text-sm">محتاج كاش</span>
          </button>

          <button 
            onClick={() => handleSubmit('cash_to_bank')}
            disabled={loading}
            className="flex flex-col items-center gap-4 bg-zinc-900 p-6 rounded-3xl border-2 border-transparent hover:border-orange-500/50 transition-all active:scale-95 group"
          >
            <div className="p-4 bg-orange-500/10 rounded-full group-hover:bg-orange-500 group-hover:text-black transition-colors">
              <Landmark size={32} className="text-orange-500 group-hover:text-inherit" />
            </div>
            <span className="font-bold text-sm">محتاج بنك</span>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center gap-2 text-zinc-500">
            <Loader2 className="animate-spin" size={20} />
            <span>جاري معالجة الطلب...</span>
          </div>
        )}
      </div>
    </div>
  )
}