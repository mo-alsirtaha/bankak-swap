"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'

export default function WaitingPage() {
  const router = useRouter()

  useEffect(() => {
    // بعد 3 ثواني، التوجيه إلى الصفحة المطلوبة
    const timeout = setTimeout(() => {
      router.push('/requests') // غير '/requests' لأي صفحة تريدها
    }, 3000) // 3000 مللي ثانية = 3 ثواني

    return () => clearTimeout(timeout) // تنظيف المؤقت
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
          <Clock className="absolute inset-0 m-auto text-orange-500" size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">جاري التحويل...</h1>
          <p className="text-zinc-500 text-sm max-w-[250px] mx-auto">
            سيتم توجيهك تلقائيًا بعد ثوانٍ قليلة.
          </p>
        </div>
      </div>
    </div>
  )
}