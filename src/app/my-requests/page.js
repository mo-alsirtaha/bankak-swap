"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Trash2, Clock, AlertCircle } from 'lucide-react'

export default function MyRequests() {
  const [myRequests, setMyRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMyRequests(data || [])
    } catch (err) {
      console.error("Error fetching requests:", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (requestId) => {
    const confirmDelete = confirm("هل أنت متأكد من رغبتك في حذف هذا الطلب؟");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      // التحديث الصحيح للحالة: نستخدم myRequests بدلاً من requests
      setMyRequests(myRequests.filter(req => req.id !== requestId));
      alert("تم حذف الطلب بنجاح");
    } catch (err) {
      alert("خطأ أثناء الحذف: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="mb-8 text-right">
        <h2 className="text-3xl font-black text-orange-500">طلباتي النشطة</h2>
        <p className="text-zinc-500 text-sm mt-1">إدارة طلبات التبادل الخاصة بك</p>
      </header>

      <div className="space-y-4">
        {myRequests.length > 0 ? (
          myRequests.map(req => (
            <div key={req.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] relative group transition-all hover:border-zinc-700">
              
              {/* زر الحذف - يظهر بوضوح وسهل اللمس في الموبايل */}
              <button 
                onClick={() => handleDelete(req.id)}
                className="absolute top-16 left-4 p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                title="حذف الطلب"
              >
                <Trash2 size={20} />
              </button>

              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
                  <Clock size={12}/> {new Date(req.created_at).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}
                </span>
                
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  req.type === 'bank_to_cash' 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-orange-500/20 text-orange-500'
                }`}>
                  {req.type === 'bank_to_cash' ? 'أنا محتاج كاش' : 'أنا محتاج بنكك'}
                </span>
              </div>

              <div className="text-right space-y-2">
                <div className="text-3xl font-black font-mono text-white">
                  {Number(req.amount).toLocaleString()} <span className="text-sm text-zinc-500">SDG</span>
                </div>
                <div className="flex items-center justify-end gap-1 text-zinc-400 text-sm">
                  <span>{req.city}</span>
                  <AlertCircle size={14} className="text-zinc-600" />
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[2.5rem]">
            <div className="text-zinc-700 mb-2">🏷️</div>
            <p className="text-zinc-500 font-medium">ليس لديك طلبات نشطة حالياً</p>
            <button 
               onClick={() => window.location.href = '/new-request'}
               className="mt-4 text-orange-500 text-sm underline underline-offset-4"
            >
              انشر طلبك الأول الآن
            </button>
          </div>
        )}
      </div>
    </div>
  )
}