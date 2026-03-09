"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { DollarSign, Landmark, Send } from 'lucide-react'

export default function CreateRequest() {
  const [type, setType] = useState('cash') // 'cash' or 'bankak'
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 1. جلب بيانات المستخدم والموقع
    const { data: { user } } = await supabase.auth.getUser()
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords

      // 2. جلب المدينة من بروفايل المستخدم
      const { data: profile } = await supabase.from('profiles').select('city, phone_number').eq('id', user.id).single()

      // 3. إرسال الطلب
      const { error } = await supabase.from('requests').insert([
        {
          user_id: user.id,
          type: type,
          amount: parseFloat(amount),
          lat: latitude,
          lng: longitude,
          city: profile?.city || "غير محدد",
          phone: profile?.phone_number || user.phone
        }
      ])

      if (error) alert(error.message)
      else router.push('/requests')
      setLoading(false)
    })
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-8 text-orange-500">نشر طلب تبديل</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* اختيار النوع */}
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => setType('cash')}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all ${type === 'cash' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-zinc-800 text-zinc-500'}`}
          >
            <DollarSign className="mx-auto mb-2" />
            أنا محتاج كاش
          </button>
          <button 
            type="button"
            onClick={() => setType('bankak')}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all ${type === 'bankak' ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-zinc-800 text-zinc-500'}`}
          >
            <Landmark className="mx-auto mb-2" />
            أنا محتاج بنكك
          </button>
        </div>

        {/* المبلغ */}
        <div className="space-y-2">
          <label className="text-zinc-500 text-sm">المبلغ (بالجنيه السوداني)</label>
          <input 
            type="number" 
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="أدخل المبلغ..."
            className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-2xl font-mono focus:border-orange-500 outline-none"
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-white text-black font-black py-5 rounded-2xl text-xl flex items-center justify-center gap-2 hover:bg-orange-500 transition-all"
        >
          {loading ? "جاري النشر..." : <><Send size={24} /> انشر الطلب الآن</>}
        </button>
      </form>
    </div>
  )
}
