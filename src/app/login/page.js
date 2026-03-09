"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, LogIn, Loader2 } from 'lucide-react'

export default function HybridLogin() {
  const [isLogin, setIsLogin] = useState(false) 
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // تسجيل الدخول
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        router.push('/requests')
      } else {
        // إنشاء حساب جديد (إيميل وباسورد فقط)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })
        if (authError) throw authError

        if (authData.user) {
          // إنشاء صف فارغ في البروفايل للمستخدم الجديد ليتجنب مشاكل الربط لاحقاً
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            verified: false
          })
          
          alert("تم إنشاء الحساب بنجاح!")
          router.push('/profile') 
        }
      }
    } catch (err) {
      alert("خطأ: " + err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`
      }
    })
    if (error) alert(error.message)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col justify-center font-sans">
      <div className="max-w-md mx-auto w-full space-y-8 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-orange-500 mb-2 italic tracking-tighter uppercase">Bankak Swap</h1>
          <p className="text-zinc-500 text-sm">
            {isLogin ? 'مرحباً بك مجدداً، سجل دخولك' : 'أنشئ حسابك للبدء في تبادل الأموال'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input 
              required
              type="email" 
              placeholder="البريد الإلكتروني" 
              className="w-full bg-zinc-900 p-4 pl-12 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all text-left"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input 
              required
              type="password" 
              placeholder="كلمة المرور" 
              className="w-full bg-zinc-900 p-4 pl-12 rounded-2xl border border-zinc-800 focus:border-orange-500 outline-none transition-all text-left"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl border border-zinc-800 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 font-bold"
          >
            <LogIn size={18} />
            {isLogin ? "تسجيل الدخول بواسطة Google" : "التسجيل بواسطة Google"}
          </button>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (isLogin ? "تسجيل الدخول" : "إنشاء الحساب")}
            {!loading && <ArrowRight size={22} />}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 hover:text-white transition-colors text-sm underline underline-offset-8 font-bold decoration-zinc-800"
          >
            {isLogin ? "لا تملك حساباً؟ سجل الآن" : "لديك حساب بالفعل؟ سجل دخولك"}
          </button>
        </div>
      </div>
      
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-20"></div>
    </div>
  )
}