"use client"
import { useRouter } from 'next/navigation'
import { ArrowRight, ShieldCheck, Lock, EyeOff, MapPin } from 'lucide-react'


export default function PrivacyPolicy() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-6 pb-20">
      <div className="max-w-2xl mx-auto space-y-8 text-right">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-zinc-800 pb-6">
          <button onClick={() => router.back()} className="p-2 bg-zinc-900 rounded-full text-white">
            <ArrowRight size={20} />
          </button>
          <h1 className="text-2xl font-black text-orange-500 italic uppercase">سياسة الخصوصية</h1>
        </header>

        {/* Intro */}
        <section className="bg-zinc-900/30 p-6 rounded-[2rem] border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-3 mb-4 text-white">
            <ShieldCheck className="text-orange-500" />
            <h2 className="font-bold text-lg">التزامنا تجاهك</h2>
          </div>
          <p className="text-sm leading-relaxed">
            نحن في Bankak Swap ندرك أهمية خصوصيتك. تم تصميم هذا التطبيق ليكون وسيطاً تقنياً يسهل عملية التبادل المالي بين الأفراد في السودان، ونحن نلتزم بحماية بياناتك الشخصية واستخدامها فقط للغرض الذي جُمعت من أجله.
          </p>
        </section>

        {/* Data Points */}
        <div className="space-y-4">
          
          <div className="p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex gap-4 items-start">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">بيانات الموقع الجغرافي</h3>
              <p className="text-xs leading-relaxed">
                نطلب الوصول إلى موقعك الجغرافي (GPS) لغرض وحيد وهو عرض الطلبات القريبة منك وتسهيل عملية الالتقاء بالطرف الآخر. لا نقوم بتتبع موقعك في الخلفية أو بيع هذه البيانات لأي جهة.
              </p>
            </div>
          </div>

          <div className="p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex gap-4 items-start">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">أمن المعلومات</h3>
              <p className="text-xs leading-relaxed">
                يتم تشفير جميع المحادثات والبيانات الشخصية عبر خوادم Supabase الآمنة. لا يمكن لأي مستخدم آخر رؤية رقم هاتفك أو تفاصيلك إلا إذا وافقت أنت على قبول الطلب وبدء المحادثة.
              </p>
            </div>
          </div>

          <div className="p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex gap-4 items-start">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
              <EyeOff size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">مشاركة البيانات مع أطراف ثالثة</h3>
              <p className="text-xs leading-relaxed">
                نحن لا نقوم ببيع أو تأجير أو مشاركة بياناتك الشخصية مع شركات إعلانية أو جهات خارجية. بياناتك تُستخدم فقط داخل منصة Bankak Swap لتحسين تجربتك.
              </p>
            </div>
          </div>

        </div>

        {/* Important Note */}
        <section className="bg-orange-500 p-6 rounded-[2rem] text-black">
          <h2 className="font-black mb-2 uppercase italic text-sm">ملاحظة هامة جداً</h2>
          <p className="text-xs font-bold leading-relaxed">
            التطبيق لا يقوم بتخزين أي تفاصيل تتعلق بكلمات مرور تطبيقك البنكي (بنكك) أو أرقام حساباتك السرية. جميع عمليات التحويل البنكي تتم عبر تطبيق البنك الرسمي الخاص بك بعيداً عن نظامنا.
          </p>
        </section>

        <footer className="text-center text-[10px] text-zinc-600 pt-10">
          آخر تحديث: مارس 2026 <br />
          جميع الحقوق محفوظة لـ Bankak Swap
        </footer>
      </div>
    </div>
  )
}