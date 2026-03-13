import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "../../../lib/sanitize";

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1分
const RATE_LIMIT_MAX = 3; // 1分あたり最大3回

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// 古いエントリを定期的にクリーンアップ
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;

export async function POST(req: NextRequest) {
  try {
    // レート制限チェック
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "送信回数の上限に達しました。しばらくしてから再度お試しください。" },
        { status: 429 }
      );
    }

    // 古いレート制限エントリをクリーンアップ
    if (rateLimitMap.size > 1000) {
      cleanupRateLimitMap();
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await req.json();
    const { lastName, firstName, email, message } = body;

    // 入力バリデーション
    if (!lastName || !firstName || !email || !message) {
      return NextResponse.json({ error: "すべての項目を入力してください。" }, { status: 400 });
    }

    if (typeof lastName !== "string" || typeof firstName !== "string" ||
        typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json({ error: "不正な入力です。" }, { status: 400 });
    }

    if (lastName.length > MAX_NAME_LENGTH || firstName.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: "名前が長すぎます。" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "メールアドレスの形式が正しくありません。" }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください。` }, { status: 400 });
    }

    // HTMLエスケープしてからテンプレートに埋め込む
    const safeLastName = escapeHtml(lastName);
    const safeFirstName = escapeHtml(firstName);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    await resend.emails.send({
      from: "THE超BOYS お問い合わせ <contact@thesuperboys.jp>",
      to: "support@withhero.info",
      replyTo: email,
      subject: `【お問い合わせ】${lastName} ${firstName} 様`,
      html: `
        <h2>お問い合わせがありました</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;width:120px;">お名前</td>
            <td style="padding:8px 12px;border:1px solid #ddd;">${safeLastName} ${safeFirstName}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">メールアドレス</td>
            <td style="padding:8px 12px;border:1px solid #ddd;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;">メッセージ</td>
            <td style="padding:8px 12px;border:1px solid #ddd;white-space:pre-wrap;">${safeMessage}</td>
          </tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("メール送信エラー:", error instanceof Error ? error.message : "不明なエラー");
    return NextResponse.json({ error: "送信に失敗しました。時間をおいて再度お試しください。" }, { status: 500 });
  }
}
