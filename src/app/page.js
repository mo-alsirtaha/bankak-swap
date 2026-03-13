"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Zap, ShieldCheck, MapPin, Repeat } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter(); // ✅ تعريف router
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6 pb-12">
      
      {/* القسم العلوي: الهوية البصرية */}
      <div className="mt-16 text-center space-y-4">
        <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-4 py-1 rounded-full text-orange-500 text-xs font-bold tracking-widest uppercase animate-pulse">
          Sudan's First P2P Swap
        </div>
        <h1 className="text-6xl font-black tracking-tighter">
          BANKAK <span className="text-orange-500 italic">SWAP</span>
        </h1>
        <p className="text-zinc-500 text-lg max-w-[280px] mx-auto leading-relaxed">
          بدل أموالك (كاش أو بنكك) مع أشخاص حقيقيين بالقرب منك في ثوانٍ.
        </p>
      </div>

      {/* القسم الأوسط: المميزات السريعة */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
          <Zap className="text-orange-500 mb-2" size={20} />
          <h3 className="font-bold text-sm">سرعة البرق</h3>
          <p className="text-[10px] text-zinc-500">تواصل فوري عبر واتساب</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
          <MapPin className="text-green-500 mb-2" size={20} />
          <h3 className="font-bold text-sm">موقع دقيق</h3>
          <p className="text-[10px] text-zinc-500">ابحث في نطاق 5 كم</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
          <ShieldCheck className="text-blue-500 mb-2" size={20} />
          <h3 className="font-bold text-sm">أمان عالي</h3>
          <p className="text-[10px] text-zinc-500">توثيق برقم الهاتف</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
          <Repeat className="text-purple-500 mb-2" size={20} />
          <h3 className="font-bold text-sm">عمولة 0%</h3>
          <p className="text-[10px] text-zinc-500">من المستخدم للمستخدم</p>
        </div>
      </div>

      {/* القسم السفلي: أزرار التحكم */}
      <div className="w-full max-w-sm space-y-4">
        <Link 
          href="/login" 
          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-5 rounded-2xl text-center text-xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          ابدأ التبديل الآن <ArrowLeft size={24} />
        </Link>
        
        <div className="mt-6 px-4">
  <div className="flex items-start gap-3 p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl backdrop-blur-sm">
    <div className="flex-1 text-right">
      <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
        بانضمامك إلينا، أنت تؤكد موافقتك الكاملة على 
        <button 
          onClick={() => router.push('/terms')} 
          className="text-orange-500 hover:underline mx-1 font-bold"
        >
          شروط الاستخدام
        </button> 
        و 
        <button 
          onClick={() => router.push('/privacy')} 
          className="text-orange-500 hover:underline mx-1 font-bold"
        >
          سياسة الخصوصية
        </button>
        . نحن نعمل كوسيط تقني فقط لضمان أمان تبادلك.
      </p>
    </div>
    
    {/* أيقونة حماية بسيطة */}
    <div className="p-2 bg-orange-500/10 rounded-lg">
      <ShieldCheck size={16} className="text-orange-500" />
    </div>
  </div>
</div>
      </div>

      {/* خلفية فنية خفيفة (Glow effect) */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-500/5 blur-[120px] rounded-full -z-10"></div>
    </div>
  )
}
