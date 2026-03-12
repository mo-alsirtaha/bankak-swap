'use client'
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 p-6 pb-20 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-8 text-right">
        <h1 className="text-2xl font-black text-orange-500 border-b border-zinc-800 pb-4">اتفاقية الاستخدام والأمان</h1>
        
        <section>
          <h2 className="text-white font-bold mb-2">1. طبيعة الخدمة (الوساطة التقنية)</h2>
          <p className="text-sm leading-relaxed">
            تطبيق bankak swap هو منصة تقنية تهدف لحل مشكلة السيولة عبر ربط المستخدمين ببعضهم للتبادل المباشر. نحن لسنا طرفاً في المعاملة المالية، ولا نقوم باستلام أو تحويل أي أموال. المسؤولية تقع بالكامل على عاتق المستخدمين في التأكد من استلام المبالغ.
          </p>
        </section>

        <section className="bg-orange-500/5 p-4 rounded-2xl border border-orange-500/20">
          <h2 className="text-orange-500 font-bold mb-2">2. تحذيرات منع الاحتيال</h2>
          <ul className="text-sm list-disc list-inside space-y-2">
            <li>يُمنع منعاً باتاً تحويل مبالغ "عربون" أو دفع مسبق قبل المقابلة الشخصية.</li>
            <li>تأكد من فحص إشعار البنك (بنكك) من التطبيق الرسمي قبل تسليم الكاش.</li>
            <li>يفضل إجراء المقابلات في أماكن عامة ومزدحمة لضمان الأمان.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold mb-2">3. ضوابط شرعية (منع الربا)</h2>
          <p className="text-sm leading-relaxed">
            يُحظر استخدام التطبيق لأي معاملات تتضمن فوائد ربوية. التبادل يجب أن يكون "يداً بيد" وبالقيمة المتساوية المتعارف عليها. أي بلاغ عن طلب "زيادة" مقابل التبديل سيؤدي لحظر الحساب نهائياً.
          </p>
        </section>

        <button onClick={() => window.history.back()} className="w-full bg-zinc-900 text-white p-4 rounded-2xl font-bold">
          العودة للخلف
        </button>
      </div>
    </div>
  )
}
