"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function NotificationSetup({ userId }) {
  useEffect(() => {
    const initOneSignal = async () => {
      // تأكد أننا داخل المتصفح
      if (typeof window === "undefined") return;

      try {
        // لا تعيد التهيئة أكثر من مرة
        if (!window.__oneSignalInitialized) {
          await OneSignal.init({
            appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: true,
            notifyButton: {
              enable: false,
            },
          });

          window.__oneSignalInitialized = true;
        }

        // ربط المستخدم الحالي مع OneSignal
        if (userId) {
          await OneSignal.login(userId.toString());
        }

        // اسأل عن الإذن فقط إذا لم يتم منحه أو رفضه سابقاً
        const permission = await OneSignal.Notifications.permission;

        if (permission !== "granted") {
          await OneSignal.Slidedown.promptPush();
        }
      } catch (error) {
        console.error("OneSignal init error:", error);
      }
    };

    initOneSignal();
  }, [userId]);

  return null;
}