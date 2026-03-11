"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, User, List, MessageCircle } from "lucide-react"

export default function BottomNav() {

  const pathname = usePathname()

  // اخفاء الشريط في الصفحة الرئيسية
  if (pathname === "/") return null

  const navItems = [
    { name: "الطلبات", icon: Home, path: "/requests" },
    { name: "طلب جديد", icon: PlusCircle, path: "/create" },
    { name: "الدردشة", icon: MessageCircle, path: "/chats" },
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
            className="flex flex-col items-center gap-1 text-xs font-black"
          >
            <Icon
              size={24}
              className={isActive ? "text-orange-500 scale-110" : "text-zinc-500"}
            />

            <span className={isActive ? "text-orange-500" : "text-zinc-500"}>
              {item.name}
            </span>
          </Link>
        )
      })}

    </nav>
  )
}