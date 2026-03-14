# THE超BOYS 公式サイト

ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」の公式ホームページ。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS 4 |
| データベース / 認証 | Supabase |
| メール送信 | Resend |
| サニタイズ | isomorphic-dompurify |

## 画面パス一覧

### 公開ページ

| パス | ページ | 説明 |
|------|--------|------|
| `/` | トップページ | オープニングアニメーション、各セクションへの導線 |
| `/profile` | プロフィール | メンバー紹介 |
| `/live-event` | ライブ・イベント一覧 | イベントリスト |
| `/live-event/[id]` | ライブ・イベント詳細 | 個別イベントの詳細情報 |
| `/news` | ニュース一覧 | お知らせリスト |
| `/news/[id]` | ニュース詳細 | 個別ニュースの詳細 |
| `/media` | メディア一覧 | メディア出演情報リスト |
| `/media/[id]` | メディア詳細 | 個別メディア情報の詳細 |
| `/discography` | ディスコグラフィー | 楽曲・リリース情報 |
| `/movie` | ムービー | 動画コンテンツ |
| `/goods` | グッズ | グッズ販売情報 |
| `/contact` | お問い合わせ | お問い合わせフォーム |
| `/privacy` | プライバシーポリシー | 個人情報保護方針 |
| `/copyright` | 著作権表示 | 著作権に関する情報 |
| `/event-guide` | イベントガイド | イベント参加の案内 |
| `/fan-letter` | ファンレター | ファンレターの送り先案内 |
| `/photo-rules` | 撮影ルール | 撮影に関するルール |

### 管理者ページ

| パス | ページ | 説明 |
|------|--------|------|
| `/panel/[accessKey]` | 管理パネル | コンテンツ管理（認証必須） |

### API / 内部ルート

| パス | メソッド | 説明 |
|------|----------|------|
| `/api/contact` | POST | お問い合わせメール送信（レート制限あり） |
| `/auth/confirm` | GET | メール変更確認のコールバック |
| `/sitemap.xml` | GET | 動的サイトマップ生成 |

## ディレクトリ構成

```
thesuperboys/
├── app/
│   ├── layout.tsx              # ルートレイアウト（メタデータ・構造化データ）
│   ├── page.tsx                # トップページ
│   ├── HomeClient.tsx          # トップページ クライアントコンポーネント
│   ├── not-found.tsx           # 404ページ
│   ├── sitemap.ts              # 動的サイトマップ生成
│   ├── globals.css             # グローバルスタイル
│   │
│   ├── components/             # 共通コンポーネント
│   │   ├── Header.tsx          # ヘッダー・ナビゲーション
│   │   ├── Footer.tsx          # フッター
│   │   ├── AdminPanel.tsx      # 管理パネル本体
│   │   ├── RichTextEditor.tsx  # リッチテキストエディタ
│   │   ├── OpeningAnimation.tsx # オープニングアニメーション
│   │   ├── SectionHeading.tsx  # セクション見出し
│   │   ├── DocumentPage.tsx    # 静的ドキュメントページ
│   │   └── DynamicDocumentPage.tsx # 動的ドキュメントページ
│   │
│   ├── api/
│   │   └── contact/
│   │       └── route.ts        # お問い合わせAPI
│   │
│   ├── auth/
│   │   └── confirm/
│   │       └── route.ts        # メール変更確認コールバック
│   │
│   ├── panel/
│   │   └── [accessKey]/
│   │       └── page.tsx        # 管理パネルエントリーポイント
│   │
│   ├── live-event/             # ライブ・イベント
│   │   ├── page.tsx
│   │   ├── LiveEventListClient.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── news/                   # ニュース
│   │   ├── page.tsx
│   │   ├── NewsListClient.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── media/                  # メディア
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── profile/                # プロフィール
│   │   ├── page.tsx
│   │   └── ProfileClient.tsx
│   │
│   ├── contact/                # お問い合わせ
│   │   ├── page.tsx
│   │   └── ContactClient.tsx
│   │
│   ├── discography/page.tsx    # ディスコグラフィー
│   ├── movie/page.tsx          # ムービー
│   ├── goods/page.tsx          # グッズ
│   ├── privacy/page.tsx        # プライバシーポリシー
│   ├── copyright/page.tsx      # 著作権表示
│   ├── event-guide/page.tsx    # イベントガイド
│   ├── fan-letter/page.tsx     # ファンレター
│   └── photo-rules/page.tsx    # 撮影ルール
│
├── lib/
│   ├── supabase.ts             # Supabase クライアント
│   └── sanitize.ts             # HTML サニタイズユーティリティ
│
├── public/
│   └── robots.txt              # クローラー制御
│
├── middleware.ts                # セキュリティヘッダー（CSP等）
├── next.config.ts              # Next.js 設定
├── tsconfig.json               # TypeScript 設定
└── package.json                # 依存関係・スクリプト
```

## 環境変数

| 変数名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公開キー |
| `ADMIN_ACCESS_KEY` | 管理パネルアクセスキー（サーバーサイドのみ） |
| `RESEND_API_KEY` | Resend メール送信APIキー |

## セキュリティ対策

- **CSPヘッダー**: `middleware.ts` で Content-Security-Policy を設定
- **入力サニタイズ**: DOMPurify によるXSS対策
- **レート制限**: お問い合わせAPI に1分間3回の制限
- **ファイルアップロード制限**: 画像のみ、5MB上限
- **管理パネル認証**: Supabase Auth によるログイン + アクセスキーによるURL保護
- **robots.txt**: `/panel`、`/auth` をクローラーから除外

## SEO対策

- 全ページに適切な `metadata`（title / description）を設定
- Open Graph / Twitter Card メタタグ
- Schema.org 構造化データ（MusicGroup）
- 動的サイトマップ（`sitemap.ts`）で全ページ + DB上の動的コンテンツを網羅
- Canonical URL 設定
- セマンティックな見出し階層

## 開発

```bash
npm install
npm run dev
```

## ビルド・本番起動

```bash
npm run build
npm start
```
