"use client";
import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { supabase } from "@/lib/supabase";

export default function NotificationSetup() {
  useEffect(() => {
    const initOneSignal = async () => {
      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
      if (!appId) return;

      await OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: { enable: false },
      });

      const permission = OneSignal.Notifications.permission;
      if (permission === "default") {
        OneSignal.Slidedown.promptPush();
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await OneSignal.login(user.id);
        console.log("تم ربط المستخدم بالإشعارات:", user.id);
      }
    };

    initOneSignal();
  }, []);

  return null;
} 