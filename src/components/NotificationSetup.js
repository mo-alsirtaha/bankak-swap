"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { supabase } from "@/lib/supabase";

export default function NotificationSetup() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkFirstUse = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // تحقق من علم محلي إذا كان المستخدم قد فعّل الإشعارات سابقًا
      const key = `notifications_enabled_${user.id}`;
      const enabled = localStorage.getItem(key);

      if (!enabled) {
        setShowPrompt(true); // أظهر الزر
      }
    };

    checkFirstUse();
  }, []);

  const handleEnableNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // تهيئة OneSignal
      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: { enable: false },
      });

      // اطلب إذن الإشعارات
      await OneSignal.Slidedown.promptPush();

      // سجل المستخدم مع OneSignal
      await OneSignal.login(user.id);

      // علم محليًا أنه تم تفعيل الإشعارات
      localStorage.setItem(`notifications_enabled_${user.id}`, "true");

      // أخفِ الزر
      setShowPrompt(false);

      console.log("تم تفعيل الإشعارات للمستخدم:", user.id);
    } catch (err) {
      console.error("خطأ في تفعيل الإشعارات:", err);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-orange-500 text-black rounded-xl shadow-lg z-50 animate-slide-up">
      <button
        onClick={handleEnableNotifications}
        className="font-bold text-sm"
      >
        تفعيل الإشعارات
      </button>
    </div>
  );
}