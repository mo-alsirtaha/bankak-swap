"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { supabase } from "@/lib/supabase"; // تأكد من المسار

export default function NotificationSetup() {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

        if (!appId) {
          console.error("OneSignal App ID غير موجود في .env.local");
          return;
        }

        await OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: { enable: false },
        });

        // ربط المستخدم الحالي بـ OneSignal
        const {
          data: { user },
        } = await supabase.auth.getUser();

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