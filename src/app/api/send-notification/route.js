import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { receiverId, message, chatId } = body

    if (!receiverId || !message || !chatId) {
      return NextResponse.json(
        { error: 'بيانات ناقصة' },
        { status: 400 }
      )
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        include_external_user_ids: [receiverId],
        contents: {
          en: message,
          ar: message,
        },
        headings: {
          en: 'رسالة جديدة',
          ar: 'رسالة جديدة',
        },
        data: {
          chatId,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/chat/${chatId}`,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'فشل إرسال الإشعار' },
      { status: 500 }
    )
  }
}