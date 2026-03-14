"use client"
import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function NotificationSetup() {
  useEffect(() => {
    // التأكد من أننا في المتصفح ولدينا الـ ID
    const initOneSignal = async () => {
      try {
        await OneSignal.init({ 
          appId: "3b2b3b88-3535-4024-99ed-7cffbc9120d1", // الذي ستحصل عليه من OneSignal
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false, // لا نريد ظهور زر الجرس العائم المزعج
          },
        });
        
        // إظهار طلب الإذن تلقائياً للمستخدم
        OneSignal.Slidedown.promptPush(); 
        
      } catch (err) {
        console.error("خطأ في تشغيل الإشعارات:", err);
      }
    };

    initOneSignal();
  }, []);

  return null;
}