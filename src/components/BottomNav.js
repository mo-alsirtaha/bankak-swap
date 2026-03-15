"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, User, List, MessageCircle } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()
  const [unreadTotal, setUnreadTotal] = useState(0)

  // جلب عدد الرسائل غير المقروءة
  const fetchUnreadCount = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false)

    if (!error) setUnreadTotal(count || 0)
  }

  useEffect(() => {
    fetchUnreadCount()

    // الاشتراك في التغييرات اللحظية (لسماع الرسائل الجديدة وتحديث العداد)
    const channel = supabase
      .channel('global_unread_count')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      }, () => {
        fetchUnreadCount() // إعادة جلب العد عند أي تغيير في جدول الرسائل
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // إخفاء الشريط في الصفحات المحددة
  const hiddenPaths = ["/", "/login", "/profile", "/terms", "/privacy", "/verify-waiting"]
  if (hiddenPaths.includes(pathname) || pathname.startsWith("/chat/")) return null

  const navItems = [
    { name: "الطلبات", icon: Home, path: "/requests" },
    { name: "طلب جديد", icon: PlusCircle, path: "/new-request" },
    { name: "الدردشة", icon: MessageCircle, path: "/chats", badge: unreadTotal }, // أضفنا الـ badge هنا
    { name: "طلباتي", icon: List, path: "/my-requests" },
    { name: "حسابي", icon: User, path: "/profile" },
  ]

  return (
    <nav className="fixed bottom-6 left-4 right-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-4 rounded-[2.5rem] flex justify-around items-center shadow-2xl z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.path

        return (
          <Link
            key={item.path}
            href={item.path}
            className="flex flex-col items-center gap-1 text-xs font-black relative"
          >
            <div className="relative">
              <Icon
                size={24}
                className={isActive ? "text-orange-500 scale-110" : "text-zinc-500"}
              />
              
              {/* دائرة الإشعارات */}
              {item.name === "الدردشة" && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-900 animate-pulse">
                  {item.badge > 9 ? '+9' : item.badge}
                </span>
              )}
            </div>

            <span className={isActive ? "text-orange-500" : "text-zinc-500"}>
              {item.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}