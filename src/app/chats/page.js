"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageSquare, User, ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ChatsList() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [myId, setMyId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return router.push('/login')
        setMyId(user.id)

        // جلب المحادثات مع بيانات الطرف الآخر والطلب المرتبط بها
        const { data, error } = await supabase
          .from('chats')
          .select(`
            id,
            created_at,
            user_1:profiles!user_1 (id, full_name), 
            user_2:profiles!user_2 (id, full_name),
            requests (type, amount)
          `)
          .or(`user_1.eq.${user.id},user_2.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setChats(data || []);
      } catch (error) {
        console.error("تفاصيل الخطأ:", error.message);
      } finally {
        // هذا السطر هو الذي يخفي الدائرة البرتقالية
        setLoading(false); 
      }
    }

    fetchChats()
  }, [])

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-zinc-900 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black italic text-orange-500 uppercase">المحادثات</h1>
      </div>

      <div className="space-y-3">
        {chats.length > 0 ? chats.map((chat) => {
          // منطق تحديد الطرف الآخر (لأنك قد تكون user_1 أو user_2)
          const partner = chat.user_1?.id === myId ? chat.user_2 : chat.user_1
          
          return (
            <div 
              key={chat.id}
              onClick={() => router.push(`/chat/${chat.id}`)} // نعم، نستخدم هذه الصفحة للدردشة
              className="bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-[2rem] flex items-center gap-4 hover:border-orange-500/50 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-orange-500/10">
                <User size={28} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-black text-sm tracking-tight">{partner?.full_name || 'مستخدم غير معروف'}</h3>
                  <span className="text-[10px] font-bold text-zinc-600">
                    {new Date(chat.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 font-medium">
                   بخصوص: {chat.requests?.type === 'bank_to_cash' ? 'تحويل بنكك مقابل كاش' : 'كاش مقابل بنكك'} 
                   <span className="text-orange-500/80 mr-1">
                     ({Number(chat.requests?.amount).toLocaleString()} ج.س)
                   </span>
                </p>
              </div>
            </div>
          )
        }) : (
          <div className="text-center py-24 opacity-40">
            <MessageSquare size={64} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">لا توجد محادثات نشطة</p>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-6 left-4 right-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-4 rounded-[2.5rem] flex justify-around items-center shadow-2xl z-50">
         <button onClick={() => router.push('/requests')} className="text-zinc-500 text-xs font-black uppercase">الطلبات</button>
         <button className="text-orange-500 text-xs font-black uppercase relative">
           المحادثات
           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
         </button>
         <button onClick={() => router.push('/profile')} className="text-zinc-500 text-xs font-black uppercase">الملف</button>
      </div>
    </div>
  )
}