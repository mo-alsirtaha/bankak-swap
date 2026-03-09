"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, MapPin, Save } from 'lucide-react'

const CITIES = ["الخرطوم", "أم درمان", "بحرى", "بورتسودان", "كسلا", "عطبرة", "ود مدني", "دنقلا"]

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

  // جلب بيانات المستخدم الحالية
  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          setName(data.full_name || '')
          setCity(data.city || '')
        }
      }
    }
    getProfile()
  }, [])

  const updateProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: name,
      city: city,
      updated_at: new Date(),
    })
    
    if (!error) alert("تم تحديث ملفك بنجاح! ✅")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-8 border-r-4 border-orange-500 pr-4">إكمال الملف الشخصي</h2>
      
      <div className="space-y-6 max-w-md mx-auto">
        {/* الاسم */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-500 flex items-center gap-2"><User size={16}/> الاسم الكامل</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none"
            placeholder="مثلاً: محمد أحمد"
          />
        </div>

        {/* المدينة */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-500 flex items-center gap-2"><MapPin size={16}/> المدينة</label>
          <select 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none appearance-none"
          >
            <option value="">اختر المدينة</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button 
          onClick={updateProfile}
          disabled={loading}
          className="w-full bg-orange-500 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-400 transition-all"
        >
          {loading ? "جاري الحفظ..." : <><Save size={20}/> حفظ البيانات</>}
        </button>
      </div>
    </div>
  )
}
