"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MapPin, Navigation, Building2, Search, PlusCircle, MessageCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from "next/link";
import { useRouter } from "next/navigation";
import PWAInstall from '@/components/PWAInstall';
import LocationPermissionOverlay from '@/components/LocationPermissionOverlay'
import FeedbackModal from '@/components/FeedbackModal'

const CITIES = ["الخرطوم", "أم درمان", "بحرى", "بورتسودان", "كسلا", "عطبرة", "ود مدني", "دنقلا"]

export default function RequestsFeed() {
  const [filterType, setFilterType] = useState('gps')
  const [selectedCity, setSelectedCity] = useState('')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [showProfileReminder, setShowProfileReminder] = useState(false) // حالة التنبيه
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false)

  // 1. دالة التحقق من اكتمال الملف الشخصي
  const checkProfileStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .single();

    // إذا كان أحد الحقول ناقصاً، نظهر التنبيه
    if (!profile?.full_name || !profile?.phone) {
      setShowProfileReminder(true);
    } else {
      setShowProfileReminder(false);
    }
  };

  // 2. التحقق من الحظر واكتمال الملف عند التحميل
  useEffect(() => {
    const initChecks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // فحص الحظر
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_banned')
          .eq('id', user.id)
          .single();

        if (profile?.is_banned) {
          alert("تم حظر حسابك لمخالفتك شروط الاستخدام والأمان.");
          await supabase.auth.signOut();
          window.location.href = '/login';
          return;
        }
        
        // فحص اكتمال الملف
        checkProfileStatus();
      }
    };
    initChecks();
  }, []);

  // دالة جلب الطلبات (كما هي في كودك)
  const fetchRequests = async () => {
    setLoading(true)
    if (filterType === 'gps') {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { data, error } = await supabase.rpc('get_nearby_requests', {
          user_lat: pos.coords.latitude,
          user_lng: pos.coords.longitude,
          dist_limit_km: 100
        })
        if (!error) setRequests(data || [])
        setLoading(false)
      }, (err) => {
        setFilterType('city') 
        setLoading(false)
      })
    } else {
      let query = supabase.from('requests').select('*').eq('status', 'pending')
      if (selectedCity) query = query.eq('city', selectedCity)
      const { data } = await query.order('created_at', { ascending: false })
      setRequests(data || [])
      setLoading(false)
    }
  }

  //مكون التقيم

  useEffect(() => {
    const now = Date.now()

    const FIRST_USE_KEY = 'feedback_first_use_at'
    const LAST_SHOWN_KEY = 'feedback_last_shown'
    const LAST_ACTION_KEY = 'feedback_last_action'

    const FIRST_SHOW_DELAY = 24 * 60 * 60 *1000      // 24 ساعة
    const SKIP_DELAY = 72 * 60 * 60 * 1000            // 72 ساعة
    const SUBMIT_DELAY = 7 * 24 * 60 * 60 * 1000      // 7 أيام

    let firstUseAt = localStorage.getItem(FIRST_USE_KEY)
    const lastShown = localStorage.getItem(LAST_SHOWN_KEY)
    const lastAction = localStorage.getItem(LAST_ACTION_KEY)

    // أول دخول للتطبيق
    if (!firstUseAt) {
      localStorage.setItem(FIRST_USE_KEY, now.toString())
      firstUseAt = now.toString()
    }

    let shouldShow = false

    // أول مرة: بعد 24 ساعة من أول استخدام
    if (!lastShown) {
      if (now - Number(firstUseAt) >= FIRST_SHOW_DELAY) {
        shouldShow = true
      }
    } else {
      // إذا كان آخر إجراء = إرسال
      if (lastAction === 'submitted') {
        if (now - Number(lastShown) >= SUBMIT_DELAY) {
          shouldShow = true
        }
      }
      // إذا كان آخر إجراء = لاحقًا / إغلاق
      else {
        if (now - Number(lastShown) >= SKIP_DELAY) {
          shouldShow = true
        }
      }
    }

    if (shouldShow) {
      const timer = setTimeout(() => {
        setShowFeedback(true)
      }, 4000) // يظهر بعد 4 ثواني من فتح الصفحة

      return () => clearTimeout(timer)
    }
  }, [])

  

      


  useEffect(() => {
    fetchRequests()
  }, [filterType, selectedCity])

  const acceptRequest = async (request) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("الرجاء تسجيل الدخول أولاً");

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          request_id: request.id,
          user_1: request.user_id,
          user_2: user.id
        })
        .select().single();

      if (error) throw error;
      if (data) router.push(`/chat/${data.id}`);
    } catch (error) {
      alert("عذراً، تعذر فتح المحادثة حالياً");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-32">
      
  
      {/* 3. التنبيه يظهر هنا في الأعلى */}
      {showProfileReminder && (
        <div className="mb-6 animate-in slide-in-from-top duration-500">
          <Link href="/profile" className="flex items-center justify-between bg-orange-500 p-4 rounded-[2rem] shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-black/10 p-2 rounded-full">
                <AlertCircle size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-black font-black text-xs">أكمل ملفك الشخصي</h3>
                <p className="text-black/70 text-[9px] font-bold">يجب إضافة اسمك ورقمك لتتمكن من استخدام التطبيق</p>
              </div>
            </div>
            <ArrowLeft size={18} className="text-black/40" />
          </Link>
        </div>
      )}
    
      {/* التبويبات العلوية */}
      <div className="flex bg-zinc-900 p-1 rounded-2xl mb-6 border border-zinc-800">
        <button onClick={() => setFilterType('gps')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${filterType === 'gps' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-500'}`}>
          <Navigation size={18}/> حولي (GPS)
        </button>
        <button onClick={() => setFilterType('city')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${filterType === 'city' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-500'}`}>
          <Building2 size={18}/> بالمدينة
        </button>
      </div>
  
    
      <PWAInstall />

      {/* اختيارات المدينة */}
      {filterType === 'city' && (
        <div className="mb-6">
          <select onChange={(e) => setSelectedCity(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none text-right">
            <option value="">كل المدن السودانية...</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {/* قائمة الطلبات (كما هي في كودك الأصلي) */}
      <div className="space-y-4 text-right">
        {loading ? (
          <p className="text-center text-zinc-500 py-10 font-bold animate-pulse text-[10px] uppercase">جاري البحث عن طلبات قريبة...</p>
        ) : requests.length > 0 ? (
          requests.map(req => (
            <div key={req.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem] relative overflow-hidden group">
              <div className={`absolute top-0 left-0 px-4 py-1 text-[10px] font-black rounded-br-xl ${req.type === 'bank_to_cash' ? 'bg-green-500 text-black' : 'bg-orange-500 text-black'}`}>  
                {req.type === 'bank_to_cash' ? 'محتاج كاش' : 'محتاج بنكك'}  
              </div>  
              
              <div className="mb-4 mt-2 px-1">
                <span className="text-zinc-600 text-[10px] font-bold uppercase">المبلغ المطلوب</span>
                <div className="text-3xl font-black font-mono text-white tracking-tighter">
                  {Number(req.amount).toLocaleString()} <span className="text-xs font-normal text-zinc-500">SDG</span>
                </div>
              </div>

              {req.comment && (
                <div className="bg-black/40 border-r-4 border-orange-500 px-3 py-2 my-4 rounded-lg">
                   <p className="text-[14px] text-zinc-300 text-right leading-tight font-medium italic">{req.comment}</p>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-zinc-800/50 pt-4">
                <button onClick={() => acceptRequest(req)} className="bg-white text-black px-6 py-2.5 rounded-2xl font-black text-sm active:scale-95 transition-all flex items-center gap-2">
                  <MessageCircle size={18} /> قبول الطلب
                </button>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs bg-black/30 px-3 py-1.5 rounded-xl border border-zinc-800/50">
                    <Navigation size={12} className={`${req.dist_meters < 1000 ? 'text-green-500 animate-pulse' : 'text-blue-500'}`} />
                    <span className={`font-bold ${req.dist_meters < 1000 ? 'text-green-400' : 'text-zinc-300'}`}>
                      {req.dist_meters !== undefined ? (
                        req.dist_meters < 1000 ? `${Math.round(req.dist_meters)} متر` : `${(req.dist_meters / 1000).toFixed(1)} كم`
                      ) : (req.city || "أم درمان")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-zinc-900/20 rounded-[2.5rem] border-2 border-dashed border-zinc-800 text-zinc-500">
             <Search size={48} className="mx-auto mb-4 opacity-20"/>
             <p className="font-bold">لا توجد طلبات حالياً</p>
          </div>
        )}
      </div>

      <Link href="/new-request" className="fixed bottom-28 left-6 bg-orange-500 p-4 rounded-full shadow-2xl text-black z-50 animate-bounce">
        <PlusCircle size={32} />
      </Link>
   <FeedbackModal
  isOpen={showFeedback}
  onClose={() => setShowFeedback(false)}
/>
    </div>
  )
}