"use client"
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, Phone, ArrowRight, User } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function ChatPage() {
  const { id: chatId } = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [myId, setMyId] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const setupChat = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return router.push('/login')
  setMyId(user.id)

  // جلب بيانات المحادثة والرسائل في استدعاءات منظمة
  // لاحظ أننا عرفنا المتغير مرة واحدة فقط هنا
  const { data: chatInfo, error: chatError } = await supabase
  .from('chats')
  .select(`
    *,
    user_1:profiles!user_1 (id, full_name),
    user_2:profiles!user_2 (id, full_name)
  `)
  .eq('id', chatId)
  .single();

if (chatInfo) {
  // استخدام الارتباط الاختياري لمنع الانهيار
  const partner = chatInfo.user_1?.id === myId ? chatInfo.user_2 : chatInfo.user_1;
  setOtherUser(partner || { full_name: "مستخدم غير معروف" });
}

  // جلب الرسائل القديمة
  const { data: oldMessages } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
  
  setMessages(oldMessages || [])
}

    setupChat()

    // 3. الاشتراك في الرسائل اللحظية (Realtime)
    const channel = supabase
      .channel(`chat_${chatId}`)
      .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages', 
          filter: `chat_id=eq.${chatId}` 
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [chatId])

  // التمرير للأسفل تلقائياً عند وصول رسالة
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
  if (!newMessage.trim()) return;

  const { error } = await supabase.from('messages').insert({
    chat_id: chatId,
    sender_id: myId,
    receiver_id: otherUser.id, // هذا السطر ضروري جداً لتفعيل الإشعار عند الطرف الآخر
    content: newMessage,
    is_read: false
  });
  
  setNewMessage('');
};

  const shareMyPhone = async () => {
    const { data: profile } = await supabase.from('profiles').select('phone').eq('id', myId).single()
    if (profile?.phone) {
      setNewMessage(`رقم هاتفي للتواصل: ${profile.phone}`)
    }
  }

  const handleReport = async () => {
  const reason = prompt("يرجى كتابة سبب البلاغ (مثال: طلب زيادة مالية، سلوك مشبوه، عدم الحضور):");
  
  if (!reason) return;

  const { error } = await supabase.from('reports').insert({
    reporter_id: myId,
    reported_user_id: otherUser.id,
    chat_id: chatId,
    reason: reason
  });

  if (error) {
    alert("فشل إرسال البلاغ");
  } else {
    alert("تم استلام بلاغك بنجاح، سيقوم فريق العمل بمراجعته واتخاذ الإجراء اللازم.");
  }
};

  return (
  <div className="flex flex-col h-screen bg-black text-white">
     {/* Header */}
   <div className="bg-orange-500/10 p-2 text-[9px] text-orange-500 text-center font-bold">
  تنبيه: لا تقم بتحويل الأموال إلا عند المقابلة الشخصية والتأكد من استلام الكاش.
</div>
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shadow-xl">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-white">
          <ArrowRight size={24} />
        </button>
        <div className="text-center flex flex-col items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mb-1">
            <User size={18} className="text-black" />
          </div>
          <span className="font-bold text-sm">{otherUser?.full_name || 'جارِ التحميل...'}</span>
 {/* // في الـ JSX (أعلى الصفحة)*/}
<button onClick={handleReport} className="text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full font-bold">
  إبلاغ عن مخالفة
</button>
        </div>
        <button onClick={shareMyPhone} className="bg-zinc-800 p-2 rounded-xl text-orange-500 hover:bg-orange-500 hover:text-black transition-all">
          <Phone size={20} />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === myId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-4 rounded-3xl text-sm ${
              msg.sender_id === myId 
                ? 'bg-orange-500 text-black font-medium rounded-br-none' 
                : 'bg-zinc-900 text-zinc-100 rounded-bl-none border border-zinc-800'
            }`}>
              {msg.content}
              <div className="text-[10px] mt-1 opacity-50 text-left">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm"
        />
        <button type="submit" className="bg-orange-500 text-black p-4 rounded-2xl hover:scale-105 transition-transform active:scale-95 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
          < Send size={20} />
        </button>
      </form>
    </div>
  )
}