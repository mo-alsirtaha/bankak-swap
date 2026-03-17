"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'

// --- مكون التنبيه المخصص ---
function CustomAlert({ title, message, type = 'error', onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 text-right" dir="rtl">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-4 ${type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
            {type === 'error' ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
          </div>
          <h2 className="text-xl font-black text-white mb-2 italic uppercase tracking-tighter">{title}</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">{message}</p>
          <button onClick={onClose} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 border border-zinc-700">
            حسناً
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HybridLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState({ type: null }) // لتحديد أي زر هو الذي يحمل
  const [alertInfo, setAlertInfo] = useState({ visible: false, title: '', message: '', type: 'error' })
 const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
// داخل useEffect في صفحة الدخول
useEffect(() => {
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // إذا وجدنا جلسة فعالة، نرسله فوراً لصفحة الطلبات
      router.push('/requests');
    }
  };
  checkUser();
}, []);
  const showAlert = (title, message, type = 'error') => {
    setAlertInfo({ visible: true, title, message, type });
  }



  // دالة موحدة للتعامل مع العمليتين
  const handleAuth = async (action) => {
    if (!formData.email || !formData.password) {
        showAlert("بيانات ناقصة", "يا غالي، يرجى ملء البريد وكلمة المرور أولاً.");
        return;
    }

    setLoading({ type: action })

    try {
      if (action === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw new Error("تأكد من البيانات، يبدو أن هناك خطأ في البريد أو الباسورد.");
        router.push('/requests')
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })
        if (authError) {
          if (authError.message.includes("already registered")) throw new Error("الحساب موجود فعلاً، جرب تسجيل الدخول.");
          throw authError;
        }

        if (authData.user) {
          await supabase.from('profiles').upsert({ id: authData.user.id, verified: false })
          showAlert("مبروك!", "تم إنشاء حسابك بنجاح، جاري توجيهك للبروفايل.", "success");
          setTimeout(() => router.push('/requests'), 2000);
        }
      }
    } catch (err) {
      showAlert("تنبيه", err.message);
    } finally {
      setLoading({ type: null })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col justify-center font-sans">
      {alertInfo.visible && (
        <CustomAlert 
          title={alertInfo.title}
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={() => setAlertInfo({ ...alertInfo, visible: false })}
        />
      )}

      <div className="max-w-md mx-auto w-full space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
           <h1 className="text-6xl font-black tracking-tighter">
          BANKAK <span className="text-orange-500 italic">SWAP</span>
        </h1>
          <p className="text-zinc-500 text-xs mt-4">حل مشكلة السيولة.. تبادل بكل ثقة</p>
        </div>

  {/* <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-zinc-600" size={18} />
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              className="w-full bg-zinc-900/50 p-4 pl-12 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all text-left placeholder:text-right text-sm"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

<div className="relative">
            <Lock className="absolute left-4 top-4 text-zinc-600" size={18} />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              className="w-full bg-zinc-900/50 p-4 pl-12 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all text-left placeholder:text-right text-sm"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          */}
    
<div className="space-y-4">
  {/* حقل البريد الإلكتروني مع دعم الإكمال التلقائي */}
  <div className="relative">
    <Mail className="absolute left-4 top-4 text-zinc-600" size={18} />
    <input 
      name="email"                // ضروري لتعريف النظام بنوع الحقل
      type="email" 
      autoComplete="email"        // تفعيل ميزة الإكمال التلقائي للبريد
      required
      placeholder="البريد الإلكتروني" 
      className="w-full bg-zinc-900/50 p-4 pl-12 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all text-left placeholder:text-right text-sm"
      onChange={(e) => setFormData({...formData, email: e.target.value})}
    />
  </div>

  {/* حقل كلمة المرور مع دعم الإكمال التلقائي */}
  <div className="relative">
    <Lock className="absolute left-4 top-4 text-zinc-600" size={18} />
    <input 
      name="password"             // ضروري لتعريف النظام بنوع الحقل
      type={showPassword ? "text" : "password"} // يتغير النوع حسب الحالة
      autoComplete="current-password" // تفعيل ميزة الإكمال التلقائي لكلمة المرور
      required
      placeholder="كلمة المرور" 
      className="w-full bg-zinc-900/50 p-4 pl-12 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all text-left placeholder:text-right text-sm"
      onChange={(e) => setFormData({...formData, password: e.target.value})}
    />
  {/* زر العين لإظهار/إخفاء الباسورد */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-4 text-zinc-600 hover:text-orange-500 transition-colors focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
  </div>


          {/* أزرار الإجراءات - الأخضر يمين والبرتقالي يسار */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => handleAuth('signin')}
              disabled={loading.type !== null}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm active:scale-95 shadow-lg shadow-orange-500/10"
            >
              {loading.type === 'signin' ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={18} />}
              تسجيل دخول
            </button>

            <button 
              onClick={() => handleAuth('signup')}
              disabled={loading.type !== null}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm active:scale-95 shadow-lg shadow-green-600/10"
            >
              {loading.type === 'signup' ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={18} />}
              إنشاء حساب
            </button>
          </div>

          <div className="flex items-center gap-4 py-4">
            <div className="h-[1px] bg-zinc-800 flex-1"></div>
            <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">أو عبر</span>
            <div className="h-[1px] bg-zinc-800 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl border border-zinc-800 flex items-center justify-center gap-3 text-xs transition-all active:scale-95 font-bold"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-70" alt="google" />
            الدخول بواسطة Google
          </button>
        </div>
      </div>
    </div>
  )
}