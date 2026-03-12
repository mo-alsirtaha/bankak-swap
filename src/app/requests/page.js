"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MapPin, Navigation, Building2, Search, PlusCircle, MessageCircle } from 'lucide-react'
import Link from "next/link";
import { useRouter } from "next/navigation";

const CITIES = ["الخرطوم", "أم درمان", "بحرى", "بورتسودان", "كسلا", "عطبرة", "ود مدني", "دنقلا"]



export default function RequestsFeed() {
  const [filterType, setFilterType] = useState('gps') // 'gps' or 'city'
  const [selectedCity, setSelectedCity] = useState('')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const fetchRequests = async () => {
    setLoading(true)
    
    let query = supabase.from('requests').select('*').eq('status', 'pending')

    if (filterType === 'gps') {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        // استدعاء الدالة الجغرافية المحدثة التي تحسب الأمتار
        const { data, error } = await supabase.rpc('get_nearby_requests', {
          user_lat: pos.coords.latitude,
          user_lng: pos.coords.longitude,
          dist_limit_km: 100 // نطاق بحث واسع مع ترتيب بالأمتار
        })
        if (!error) setRequests(data || [])
        setLoading(false)
      }, (err) => {
        console.error("GPS Error:", err)
        setFilterType('city') 
        setLoading(false)
      })
    } else {
      let cityQuery = query;
      if (selectedCity) {
        cityQuery = cityQuery.eq('city', selectedCity)
      }
      const { data } = await cityQuery.order('created_at', { ascending: false })
      setRequests(data || [])
      setLoading(false)
    }
  }

  useEffect(() => {
  const syncLocation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      
      // تحديث قاعدة البيانات فوراً
      const { error } = await supabase
        .from('profiles')
        .update({ lat: latitude, lng: longitude })
        .eq('id', user.id);

      if (!error) {
        console.log("تم تحديث موقعك بدقة:", latitude, longitude);
        // إعادة جلب الطلبات بعد تحديث الموقع
        fetchRequests(); 
      }
    }, (err) => {
      console.error("لم نتمكن من الوصول للموقع:", err.message);
    }, { enableHighAccuracy: true });
  };

  syncLocation();
}, []);


  useEffect(() => {
    fetchRequests()
  }, [filterType, selectedCity])


//دالة انشاء السجلات في جدول شات
  const acceptRequest = async (requestId, creatorId) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  console.log("requestId:", requestId);
  console.log("creatorId:", creatorId);

  if (!user) {
    alert("الرجاء تسجيل الدخول أولاً");
    return;
  }

  // محاولة إنشاء المحادثة
  const { data, error } = await supabase
    .from('chats')
    .insert({
      request_id: requestId,
      user_1: creatorId, // صاحب الطلب
      user_2: user.id    // الشخص الحالي (المستلم)
    })
    .select()
    .single();

  if (error) {
    console.log("تفاصيل الخطأ:", error);
    alert("فشل قبول الطلب: " + error.message);
    return;
  }

  if (data) {
    router.push(`/chat/${data.id}`);
  }

}; 

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-32">
      {/* التبويبات العلوية */}
      <div className="flex bg-zinc-900 p-1 rounded-2xl mb-6 border border-zinc-800">
        <button 
          onClick={() => setFilterType('gps')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${filterType === 'gps' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-500'}`}
        >
          <Navigation size={18}/> حولي (GPS)
        </button>
        <button 
          onClick={() => setFilterType('city')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${filterType === 'city' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-500'}`}
        >
          <Building2 size={18}/> بالمدينة
        </button>
      </div>
      
      {filterType === 'city' && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2">
          <select 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none appearance-none text-right"
          >
            <option value="">كل المدن السودانية...</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      <Link
  href="/new-request"
  className="fixed bottom-28 left-6 bg-orange-500 p-4 rounded-full shadow-2xl text-black z-50 hover:scale-110 active:scale-90 transition-all animate-bounce"
>
  <PlusCircle size={32} />
</Link>

      {/* قائمة الطلبات */}
      <div className="space-y-4 text-right">
        {loading ? (
       <p className="text-center text-zinc-500 py-10 font-bold animate-pulse text-sm uppercase tracking-widest">جاري تحديد موقعك وجلب أقرب الطلبات...</p>
      ) 
       : requests.length > 0 ? (
          requests.map(req => (
            <div key={req.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem] relative overflow-hidden group hover:border-zinc-700 transition-all">
              
                     
            <div className={`absolute top-0 left-0 px-4 py-1 text-[10px] font-black rounded-br-xl ${req.type === 'bank_to_cash' ? 'bg-green-500 text-black' : 'bg-orange-500 text-black'}`}>  
              {req.type === 'bank_to_cash' ? 'محتاج كاش' : 'محتاج بنكك'}  
            </div>  
              
              <div className="mb-4 mt-2 px-1">
                <span clasame="text-zinc-600 text-[10px] font-bold uppercase tracking-wider">المبلغ المطلوب</span>
                <div className="text-3xl font-black font-mono text-white tracking-tighter">
                  {Number(req.amount).toLocaleString()} <span className="text-xs font-normal text-zinc-500">SDG</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-zinc-800/50 pt-4">
        
                <button
  onClick={() => acceptRequest(req.id, req.user_id)}
  className="bg-white text-black px-6 py-2.5 rounded-2xl font-black text-sm hover:bg-green-500 transition-all flex items-center gap-2 active:scale-90"
>
  <MessageCircle size={18} /> قبول الطلب
</button>

                <div className="flex flex-col items-end gap-1">
                  {/* الخطوة 2 المدمجة: عرض المسافة بدقة الأمتار */}
                  <div className="flex items-center gap-2 text-zinc-400 text-xs bg-black/30 px-3 py-1.5 rounded-xl border border-zinc-800/50">
                    <Navigation size={12} className={`${req.dist_meters < 1000 ? 'text-green-500 animate-pulse' : 'text-blue-500'}`} />
                    <span className={`font-bold ${req.dist_meters < 1000 ? 'text-green-400' : 'text-zinc-300'}`}>
                      {req.dist_meters !== undefined ? (
                        req.dist_meters < 1000 
                        ? `${Math.round(req.dist_meters)} متر` 
                        : `${(req.dist_meters / 1000).toFixed(1)} كم`
                      ) : (req.city || "أم درمان")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-600 mr-1">
                    <MapPin size={10} />
                    <span>{req.city || "موقع تقريبي"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-zinc-900/20 rounded-[2.5rem] border-2 border-dashed border-zinc-800">
             <Search size={48} className="mx-auto mb-4 text-zinc-800 opacity-20"/>
             <p className="text-zinc-500 font-bold">لا توجد طلبات في هذا النطاق</p>
             <p className="text-zinc-700 text-xs mt-1 italic">جرب البحث في مدينة أخرى أو وسّع نطاق البحث</p>
          </div>
        )}
      </div>
    </div>
  )
}