"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Landmark, Banknote, Loader2, MapPin } from 'lucide-react'

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

  // دالة لجلب الموقع الجغرافي وتحديث البروفايل
  const updateLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('profiles').update({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            }).eq('id', user.id);
          }
          resolve(pos.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          resolve(null);
        },
        { enableHighAccuracy: true }
      );
    });
  };
  const [comment, setComment] = useState('') // 1. إضافة حالة للتعليق
  const handleSubmit = async (type) => {
    if (!amount || amount <= 0) {
      alert("الرجاء إدخال مبلغ صحيح");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. جلب الموقع الجغرافي "الآن" قبل إرسال الطلب
      let currentLat = null;
      let currentLng = null;

      const coords = await updateLocation(); // ننتظر تحديث الموقع في البروفايل أولاً
      if (coords) {
        currentLat = coords.latitude;
        currentLng = coords.longitude;
      }

      // 2. إرسال الطلب مع الإحداثيات مباشرة لجدول requests
      const { error } = await supabase.from('requests').insert({
        user_id: user.id,
        type: type, 
        amount: parseFloat(amount),
        comment: comment, // ارسال التعليق هنا 
        city: userProfile?.city || 'أم درمان', 
        lat: currentLat, // إرسال خط العرض هنا
        lng: currentLng, // إرسال خط الطول هنا
        status: 'pending'
      });

      if (error) throw error;

      alert("تم نشر طلبك بنجاح! سيظهر الآن للمستخدمين القريبين منك.");
      router.push('/requests'); 
    } catch (err) {
      alert("خطأ في النشر: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <div className="max-w-md mx-auto pt-12 space-y-8">
        <header className="text-right">
          <h1 className="text-3xl font-black text-orange-500 underline decoration-zinc-800 underline-offset-8 uppercase italic">Mishcat Swap</h1>
          <p className="text-zinc-500 mt-2 font-medium">نظام التبادل الذكي في السودان</p>
        </header>

        {/* حقل إدخال المبلغ */}
        <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30"></div>
          <label className="block text-zinc-500 text-xs mb-4 text-right font-bold uppercase tracking-widest">المبلغ المطلوب (SDG)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-center text-5xl font-black font-mono outline-none text-white placeholder:text-zinc-800"
          />
        </div>
       {/* 3. حقل التعليق الجديد - مستطيل صغير */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl px-4 py-2">
          <input 
            type="text"
            placeholder="أضف الوصف موقع الحي الشارع (معلم بارز)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={50}
            className="w-full bg-transparent text-right text-xs outline-none text-zinc-300 placeholder:text-zinc-600 font-medium"
          />
        </div>
       <p className="text-[10px] text-zinc-500 text-center px-4">
  بضغطك على أزرار التبادل، أنت توافق على <a href="/terms" className="text-orange-500 underline">شروط الاستخدام</a> وتقر بأن التطبيق وسيط لا يتحمل مسؤولية التبادل المالي.
</p>

        {/* أزرار الإجراءات */}
        <div className="grid grid-cols-2 gap-5">
          <button 
            onClick={() => handleSubmit('bank_to_cash')}
            disabled={loading}
            className="flex flex-col items-center gap-4 bg-zinc-900 p-8 rounded-[2rem] border-2 border-transparent hover:border-green-500/50 transition-all active:scale-95 group relative"
          >
             <div className="absolute top-2 right-4 text-[10px] font-black text-green-500/50">CASH</div>
            <div className="p-4 bg-green-500/10 rounded-2xl group-hover:bg-green-500 group-hover:text-black transition-all">
              <Banknote size={36} className="text-green-500 group-hover:text-inherit" />
            </div>
            <span className="font-black text-sm">أنا محتاج كاش</span>
          </button>

          <button 
            onClick={() => handleSubmit('cash_to_bank')}
            disabled={loading}
            className="flex flex-col items-center gap-4 bg-zinc-900 p-8 rounded-[2rem] border-2 border-transparent hover:border-orange-500/50 transition-all active:scale-95 group relative"
          >
            <div className="absolute top-2 right-4 text-[10px] font-black text-orange-500/50">BANKAK</div>
            <div className="p-4 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500 group-hover:text-black transition-all">
              <Landmark size={36} className="text-orange-500 group-hover:text-inherit" />
            </div>
            <span className="font-black text-sm">أنا محتاج بنك</span>
          </button>
        </div>

        {/* تنبيه الموقع الجغرافي */}
        <div className="flex items-center justify-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-tighter">
          <MapPin size={12} />
          <span>سيتم تحديد موقعك بدقة لضمان سرعة التبادل</span>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center gap-4 z-50">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="text-orange-500 font-black animate-pulse">جاري تأمين الطلب وتحديد موقعك...</p>
          </div>
        )}
      </div>
    </div>
  )
}