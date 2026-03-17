// استيراد وظيفة التخديم من Deno
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

const apiKey = Deno.env.get("ONESIGNAL_REST_API_KEY");
const appId = Deno.env.get("ONESIGNAL_APP_ID");

serve(async (req) => {
  try {
    // استلام البيانات القادمة من قاعدة البيانات (Webhook)
    const payload = await req.json();
    const record = payload.record; // هذا هو سطر الرسالة الجديد

    // إرسال الإشعار لـ OneSignal
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_external_user_ids: [record.receiver_id], // المستلم
        contents: { "ar": record.content },
        headings: { "ar": "رسالة جديدة" },
        data: { url: `/chat/${record.chat_id}` },
      }),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { 
      headers: { "Content-Type": "application/json" },
      status: 200 
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500 
    });
  }
})