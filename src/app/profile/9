"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, MapPin, Save, LogOut } from 'lucide-react'
import { Shield } from "lucide-react";
import { useRouter } from 'next/navigation';

const CITIES = ["الخرطوم", "أم درمان", "بحرى", "بورتسودان", "كسلا", "عطبرة", "ود مدني", "دنقلا"]

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [profession, setProfession] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false) // تتحكم في حالة الزر بعد الحفظ
const router = useRouter();
  // جلب بيانات المستخدم
  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setName(data.full_name || '')
          setCity(data.city || '')
          setPhone(data.phone || '')
          setProfession(data.profession || '')
        }
      }
    }
    getProfile()
  }, [])

  // تحديث الملف الشخصي
  const updateProfile = async () => {
  setLoading(true)
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        full_name: name,
        city: city,
        phone: phone,
        profession: profession,
        updated_at: new Date(),
      },
      { onConflict: ['id'] }
    )

  setLoading(false)

  if (error) {
    alert("حدث خطأ أثناء الحفظ: " + error.message)
  } else {
    alert("تم تحديث ملفك بنجاح ✅")
    setSaved(true) // الزر يتحول الآن للمتابعة
  }
}

  

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert("خطأ أثناء تسجيل الخروج: " + error.message)
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-8 border-r-4 border-orange-500 pr-4">
       الملف الشخصي
      </h2>

      <div className="space-y-6 max-w-md mx-auto">

        {/* الاسم */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-500 flex items-center gap-2">
            <User size={16}/> الاسم الكامل
          </label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none"
            placeholder="الاسم "
          />
        </div>

        {/* المدينة */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-500 flex items-center gap-2">
            <MapPin size={16}/> المدينة
          </label>
          <select 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none"
          >
            <option value="">اختر المدينة</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* رقم الهاتف / واتساب */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-500 flex items-center gap-2">
            رقم الهاتف الوتساب
          </label>
          <input 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none"
            placeholder="مثلاً: 0912345678"
          />
        </div>

        {/* المهنة */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-500 flex items-center gap-2">
            المهنة
          </label>
          <input 
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none"
            placeholder="عامل / مهندس / طبيب / مدرس"
          />
        </div>

 <div onClick={() => router.push('/terms')} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer">
  <span className="text-sm font-bold">الشروط والقوانين</span>
  <Shield size={18} className="text-zinc-500" />
</div>

        {/* زر الحفظ / متابعة */}
<button 
  onClick={saved ? () => window.location.href = "/verify-waiting" : updateProfile}
  disabled={loading}
  className="w-full bg-orange-500 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
>
  {loading ? "جاري الحفظ..." : saved ? "متابعة للتطبيق" : <><Save size={20}/> حفظ البيانات</>}
</button>

        {/* زر تسجيل الخروج */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
        >
          <LogOut size={20}/> تسجيل الخروج
        </button>

      </div>
    </div>
  )
}