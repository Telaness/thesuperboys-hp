import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { lastName, firstName, email, message } = await req.json();

    if (!lastName || !firstName || !email || !message) {
      return NextResponse.json({ error: "すべての項目を入力してください。" }, { status: 400 });
    }

    await resend.emails.send({
      from: "THE超BOYS お問い合わせ <contact@thesuperboys.jp>",
      to: "taichi.murakami@telaness.com",
      replyTo: email,
      subject: `【お問い合わせ】${lastName} ${firstName} 様`,
      html: `
        <h2>お問い合わせがありました</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;width:120px;">お名前</td>
            <td style="padding:8px 12px;border:1px solid #ddd;">${lastName} ${firstName}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">メールアドレス</td>
            <td style="padding:8px 12px;border:1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">メッセージ</td>
            <td style="padding:8px 12px;border:1px solid #ddd;white-space:pre-wrap;">${message}</td>
          </tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json({ error: "送信に失敗しました。時間をおいて再度お試しください。" }, { status: 500 });
  }
}
