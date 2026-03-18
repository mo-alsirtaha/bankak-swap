"use client"
import { useState, useEffect } from 'react'
import { MapPinOff, RefreshCw } from 'lucide-react'

export default function LocationPermissionOverlay() {
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [checking, setChecking] = useState(true);

  const checkLocation = () => {
    if (!navigator.geolocation) {
      setIsLocationEnabled(false);
      setChecking(false);
      return;
    }

    setChecking(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocationEnabled(true);
        setChecking(false);
      },
      (error) => {
        // إذا كان الخطأ هو رفض الإذن أو الموقع مغلق
        if (error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE) {
          setIsLocationEnabled(false);
        }
        setChecking(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  useEffect(() => {
    checkLocation();
  }, []);

  if (checking) return null; // لا تظهر شيئاً أثناء الفحص السريع

  if (!isLocationEnabled) {
    return (
      <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-right" dir="rtl">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <MapPinOff size={40} className="text-red-500" />
          </div>
          
          <h2 className="text-xl font-black text-white mb-3 italic uppercase">الموقع الجغرافي مغلق!</h2>
          
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            يا غالي، تطبيق Bankak Swap يعتمد كلياً على موقعك ليعرض لك أقرب الطلبات ويضمن سلامة التعاملات. يرجى تفعيل الـ GPS ومنح الإذن للمتصفح.
          </p>

          <button 
            onClick={checkLocation}
            className="w-full bg-orange-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RefreshCw size={18} />
            إعادة المحاولة بعد التشغيل
          </button>
          
          <p className="mt-4 text-[10px] text-zinc-600 font-bold">إعدادات الهاتف {'>'} الخصوصية {'>'} خدمات الموقع</p>
        </div>
      </div>
    );
  }

  return null; // إذا كان الموقع مفعلاً، لا يظهر شيء
}