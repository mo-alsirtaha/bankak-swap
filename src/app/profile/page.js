"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, MapPin, Save, LogOut, Shield, Phone, Briefcase, ChevronLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CITIES = ["الخرطوم", "أم درمان", "بحرى", "بورتسودان", "كسلا", "عطبرة", "ود مدني", "دنقلا"]

// مكون التنبيه المخصص
function CustomAlert({ title, message, type = 'error', onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 text-right" dir="rtl">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-4 ${type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
            {type === 'error' ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
          </div>
          <h2 className="text-xl font-black text-white mb-2 italic uppercase tracking-tighter">{title}</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">{message}</p>
          <button onClick={onClose} className="w-full bg-orange-500 text-black font-black py-4 rounded-2xl transition-all active:scale-95">حسناً</button>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [profession, setProfession] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [alertInfo, setAlertInfo] = useState({ visible: false, title: '', message: '', type: 'error' })
  const router = useRouter()

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
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

  // الدالة المحدثة التي تطلب الموقع وتخزنه مع البيانات
  const updateProfile = async () => {
    if (!name || !city || !phone) {
      setAlertInfo({ visible: true, title: "بيانات ناقصة", message: "يرجى إكمال الاسم والمدينة ورقم الهاتف لنتمكن من توثيق حسابك.", type: 'error' });
      return;
    }
    
    setLoading(true)

    // الحصول على الموقع الجغرافي قبل الحفظ
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await saveToDatabase(latitude, longitude);
      },
      async (err) => {
        console.error("GPS Error:", err.message);
        // في حال فشل الـ GPS (مثلاً المستخدم رفض)، نحفظ البيانات بدون إحداثيات أو نعتمد على المدينة فقط
        await saveToDatabase(null, null);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  // دالة الحفظ الفعلية في قاعدة البيانات
  const saveToDatabase = async (lat, lng) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: name,
      city: city,
      phone: phone,
      profession: profession,
      lat: lat, // تخزين خط العرض
      lng: lng, // تخزين خط الطول
      updated_at: new Date(),
    }, { onConflict: ['id'] })

    setLoading(false)
    if (error) {
      setAlertInfo({ visible: true, title: "خطأ", message: "حدث خطأ أثناء الحفظ: " + error.message, type: 'error' });
    } else {
      setAlertInfo({ visible: true, title: "تم التحديث", message: "تم حفظ بياناتك وموقعك الجغرافي بنجاح.", type: 'success' });
      setSaved(true)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="h-screen bg-black text-white p-4 font-sans flex flex-col justify-between" dir="rtl">
      {alertInfo.visible && <CustomAlert title={alertInfo.title} message={alertInfo.message} type={alertInfo.type} onClose={() => setAlertInfo({ ...alertInfo, visible: false })} />}

      <div className="max-w-md mx-auto w-full space-y-4 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-4 border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <User size={24} className="text-black" />
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black italic tracking-tighter text-white">الملف الشخصي</h2>
              <p className="text-zinc-500 text-[10px]">بياناتك تدعم مصداقية تعاملاتك</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-black text-[10px] font-bold px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-md hover:bg-red-500/20 hover:text-red-500 transition-all flex items-center gap-1">
            <LogOut size={12}/> خروج
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'الاسم الكامل', val: name, set: setName, icon: User, placeholder: 'اسمك الثلاثي' },
            { label: 'رقم الواتساب', val: phone, set: setPhone, icon: Phone, placeholder: '09xxxxxxx' },
            { label: 'المهنة', val: profession, set: setProfession, icon: Briefcase, placeholder: 'مثلاً: تاجر، مهندس' }
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mr-1">
                <item.icon size={12} /> {item.label}
              </label>
              <input 
                value={item.val}
                onChange={(e) => item.set(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl focus:border-orange-500 outline-none text-sm text-right transition-all"
                placeholder={item.placeholder}
              />
            </div>
          ))}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mr-1">
              <MapPin size={12} /> المدينة
            </label>
            <select 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl focus:border-orange-500 outline-none text-sm appearance-none"
            >
              <option value="">اختر المدينة</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div onClick={() => router.push('/terms')} className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl cursor-pointer">
            <div className="flex items-center gap-2">
               <Shield size={16} className="text-blue-500" />
               <span className="text-[11px] font-bold">الشروط والقوانين</span>
            </div>
            <ChevronLeft size={14} className="text-zinc-600" />
          </div>
        </div>

      <div className="max-w-md mx-auto w-full space-y-2 pb-6 pt-4">
        <button 
          onClick={saved ? () => router.push('/requests') : updateProfile}
          disabled={loading}
          className={`w-full text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 text-sm active:scale-95 shadow-lg transition-all duration-300 ${
            saved ? 'bg-green-500' : 'bg-orange-500'
          }`}
        >
          {loading 
            ? <Loader2 className="animate-spin" size={18} /> 
            : saved 
              ? "متابعة للطلبات" 
              : "حفظ وتوثيق الموقع"}
        </button>
      </div>
    </div>
    </div>
  );
}