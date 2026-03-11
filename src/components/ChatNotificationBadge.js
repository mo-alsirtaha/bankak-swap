"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, User, List, MessageCircle } from 'lucide-react'

export default function BottomNav({ unreadCount = 0 }) {

  const pathname = usePathname()

  // اخفاء الشريط في اللاندينج
  if (pathname === "/") return null

  const navItems = [
    { name: 'الطلبات', icon: Home, path: '/requests' },
    { name: 'طلب جديد', icon: PlusCircle, path: '/create' },
    { name: 'الدردشة', icon: MessageCircle, path: '/chats', isChat: true },
    { name: 'طلباتي', icon: List, path: '/my-requests' },
    { name: 'حسابي', icon: User, path: '/profile' },
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
                className={isActive ? 'text-orange-500 scale-110' : 'text-zinc-500'}
              />

              {item.isChat && unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}

            </div>

            <span className={isActive ? 'text-orange-500' : 'text-zinc-500'}>
              {item.name}
            </span>

          </Link>
        )
      })}

    </nav>
  )
}