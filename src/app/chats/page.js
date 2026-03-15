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

        // جلب المحادثات + الطرفين + الطلب + الرسائل
        const { data, error } = await supabase
          .from('chats')
          .select(`
            id,
            created_at,
            user_1:profiles!user_1 (id, full_name), 
            user_2:profiles!user_2 (id, full_name),
            requests (type, amount),
            messages (
              id,
              content,
              created_at,
              sender_id,
              is_read
            )
          `)
          .or(`user_1.eq.${user.id},user_2.eq.${user.id}`)
          .order('created_at', { ascending: false })

        if (error) throw error

        // تجهيز البيانات لكل محادثة
        const processedChats = (data || []).map((chat) => {
          const partner = chat.user_1?.id === user.id ? chat.user_2 : chat.user_1

          // ترتيب الرسائل حسب الوقت (احتياطيًا)
          const sortedMessages = [...(chat.messages || [])].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          )

          // آخر رسالة
          const lastMessage = sortedMessages[sortedMessages.length - 1] || null

          // عدد الرسائل غير المقروءة القادمة من الطرف الآخر فقط
          const unreadCount = sortedMessages.filter(
            (msg) => msg.sender_id !== user.id && msg.is_read === false
          ).length

          return {
            ...chat,
            partner,
            lastMessage,
            unreadCount,
          }
        })

        // ترتيب الشاتات حسب آخر رسالة (الأحدث أولاً)
        processedChats.sort((a, b) => {
          const aTime = a.lastMessage ? new Date(a.lastMessage.created_at).getTime() : new Date(a.created_at).getTime()
          const bTime = b.lastMessage ? new Date(b.lastMessage.created_at).getTime() : new Date(b.created_at).getTime()
          return bTime - aTime
        })

        setChats(processedChats)
      } catch (error) {
        console.error("تفاصيل الخطأ:", error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchChats()

    // اشتراك مباشر لتحديث القائمة عند وصول رسالة جديدة
    const channel = supabase
      .channel('realtime-chats-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async () => {
          fetchChats()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

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
          return (
            <div 
              key={chat.id}
              onClick={() => router.push(`/chat/${chat.id}`)}
              className="relative bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-[2rem] flex items-center gap-4 hover:border-orange-500/50 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
            >
              {/* الأيقونة */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-orange-500/10">
                  <User size={28} />
                </div>
              </div>
              
              {/* المحتوى */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 gap-3">
                  <h3 className="font-black text-sm tracking-tight truncate">
                    {chat.partner?.full_name || 'مستخدم غير معروف'}
                  </h3>

                  <span className="text-[10px] font-bold text-zinc-600 whitespace-nowrap">
                    {chat.lastMessage
                      ? new Date(chat.lastMessage.created_at).toLocaleTimeString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : new Date(chat.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                {/* آخر رسالة أو وصف الطلب */}
                {chat.lastMessage ? (
                  <p className="text-[11px] text-zinc-400 font-medium truncate">
                    {chat.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-[11px] text-zinc-500 font-medium truncate">
                    بخصوص: {chat.requests?.type === 'bank_to_cash' ? 'تحويل بنكك مقابل كاش' : 'كاش مقابل بنكك'} 
                    <span className="text-orange-500/80 mr-1">
                      ({Number(chat.requests?.amount || 0).toLocaleString()} ج.س)
                    </span>
                  </p>
                )}
              </div>

              {/* الدائرة البرتقالية للرسائل غير المقروءة */}
              {chat.unreadCount > 0 && (
                <div className="bg-orange-500 text-black text-[10px] font-black min-w-[24px] h-6 px-1 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.4)] animate-pulse">
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </div>
              )}
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
        <button onClick={() => router.push('/requests')} className="text-zinc-500 text-xs font-black uppercase">
          الطلبات
        </button>

        <button className="text-orange-500 text-xs font-black uppercase relative">
          المحادثات
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
        </button>

        <button onClick={() => router.push('/profile')} className="text-zinc-500 text-xs font-black uppercase">
          الملف
        </button>
      </div>
    </div>
  )
}