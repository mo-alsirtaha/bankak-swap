"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, User, List } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'الطلبات', icon: Home, path: '/requests' },
    { name: 'طلب جديد', icon: PlusCircle, path: '/create' },
    { name: 'طلباتي', icon: List, path: '/my-requests' },
    { name: 'حسابي', icon: User, path: '/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-zinc-900 px-6 py-3 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          
          return (
            <Link key={item.path} href={item.path} className="flex flex-col items-center gap-1">
              <Icon size={24} className={isActive ? 'text-orange-500 scale-110' : 'text-zinc-500'} />
              <span className={`text-[10px] ${isActive ? 'text-orange-500 font-bold' : 'text-zinc-500'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
