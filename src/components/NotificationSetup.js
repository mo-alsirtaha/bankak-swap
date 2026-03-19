"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { supabase } from "@/lib/supabase";

export default function NotificationSetup() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const setupNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      try {
        // 1) تهيئة OneSignal دائمًا
        await OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: { enable: false },
        });

        // 2) اربط المستخدم الحالي دائمًا بـ external_id
        await OneSignal.login(user.id);

        console.log("OneSignal linked to user:", user.id);

        // 3) افحص هل طلبنا الإذن سابقًا
        const key = `notifications_enabled_${user.id}`;
        const enabled = localStorage.getItem(key);

        // 4) افحص إذن المتصفح الحقيقي
        const permission = Notification.permission;

        // إذا لم نطلب من قبل أو الإذن ليس granted → أظهر الزر
        if (!enabled || permission !== "granted") {
          setShowPrompt(true);
        }
      } catch (err) {
        console.error("خطأ في تهيئة OneSignal:", err);
      }
    };

    setupNotifications();
  }, []);

  const handleEnableNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    try {
      // اطلب إذن الإشعارات
      await OneSignal.Slidedown.promptPush();

      // أعد الربط احتياطياً بعد الإذن
      await OneSignal.login(user.id);

      // خزّن محليًا أنه تم التفعيل
      localStorage.setItem(`notifications_enabled_${user.id}`, "true");

      setShowPrompt(false);

      console.log("تم تفعيل الإشعارات للمستخدم:", user.id);
      console.log("Notification.permission:", Notification.permission);
    } catch (err) {
      console.error("خطأ في تفعيل الإشعارات:", err);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-orange-500 text-black rounded-xl shadow-lg z-50">
      <button
        onClick={handleEnableNotifications}
        className="font-bold text-sm"
      >
        تفعيل الإشعارات
      </button>
    </div>
  );
}