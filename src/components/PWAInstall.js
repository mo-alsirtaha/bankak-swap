"use client"; // ضروري جداً هنا
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // منع ظهور الإشعار التلقائي للمتصفح
      e.preventDefault();
      // تخزين الحدث لاستخدامه لاحقاً
      setDeferredPrompt(e);
      // إظهار الزر الخاص بك
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // إظهار نافذة التثبيت
    deferredPrompt.prompt();
    
    // معرفة قرار المستخدم
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('تم تثبيت التطبيق بنجاح');
    }
    
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] animate-bounce">
      <button
        onClick={handleInstall}
        className="w-full bg-orange-500 text-black font-black p-4 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-orange-500/20"
      >
        <Download size={20} />
        تثبيت تطبيق bankak Swap على هاتفك
      </button>
    </div>
  );
}