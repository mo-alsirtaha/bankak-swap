"use client"
import { useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { supabase } from '@/lib/supabase'; // تأكد من المسار

export default function NotificationSetup() {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        await OneSignal.init({ 
          appId: "3b2b3b88-3535-4024-99ed-7cffbc9120d1",
          allowLocalhostAsSecureOrigin: true,
          notifyButton: { enable: false },
        });

        // ربط المستخدم الحالي بـ OneSignal
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // هذا السطر هو الأهم: يخبر OneSignal أن هذا الجهاز يخص هذا الـ ID
          await OneSignal.login(user.id); 
          console.log("تم ربط المستخدم بالإشعارات:", user.id);
        }

        OneSignal.Slidedown.promptPush(); 
        
      } catch (err) {
        console.error("خطأ في تشغيل الإشعارات:", err);
      }
    };

    initOneSignal();
  }, []);

  return null;
}