# My Gym Next v2

筋トレの記録を「日付 × 種目 × セット」で管理するための Web アプリです。  
カレンダーから日付を選び、その日ごとのトレーニング種目とセット内容を素早く記録できます。

## 🎯 コンセプト

- カレンダー中心の筋トレログアプリ
- 「いつ・どの種目を・どれくらい」やったかを日付ベースで管理
- 前回記録（Last Record）を見ながら、成長を意識してトレーニングできる

---

## 🧱 画面構成 / ルーティング
/
→app/page.tsx(カレンダー) 

/logs/2025-12-14
→ app/logs/[date]/page.tsx

/logs/2025-12-14/select
→ app/logs/[date]/select/page.tsx（種目選択）

/logs/2025-12-14/bench_press
→ app/logs/[date]/[exerciseId]/page.tsx


### `/` ホーム（カレンダー画面）

- 月カレンダーを表示
- トレーニングした日にマークを表示（実装予定）
- 日付をクリックすると、その日のログ画面へ遷移  
  → `/logs/[date]`

### `/logs/[date]` 日別ログ画面

- 指定した日付のトレーニング記録一覧を表示
- 種目ごとのカードを表示（例：ベンチプレス、ラットプルダウンなど）
- 各カードをクリックすると、その種目の記録画面へ遷移  
  → `/logs/[date]/[exerciseId]`

- 画面右下に「＋ボタン（フローティングアクションボタン）」を表示
  - まだ記録がない場合：  
    - 「まだ記録がありません」のメッセージ + 右下に「＋」
  - 記録がある場合：  
    - 種目カード一覧 + 右下に「＋」
  - ＋ボタンを押すと「種目選択画面」が開く（モーダル or 別ページ）  
    → 種目選択後に、種目記録画面へ

### `/logs/[date]/select` 種目選択画面（予定）

- 部位ごとに種目カードを一覧表示
  - 胸：ベンチプレス、ダンベルプレス、インクラインダンベル など
  - 背中：ラットプルダウン、ローイング など
  - 脚：スクワット、レッグプレス など
- 種目カードをクリックすると、その日のその種目の記録画面へ遷移  
  → `/logs/[date]/[exerciseId]`

### `/logs/[date]/[exerciseId]` 種目記録画面（メイン機能）

- 対象日付 + 対象種目の記録画面
- 上部に「Last Record（前回記録）」を表示
  - 同じ種目の直近の記録を表示（例：前回の日付と4セット分）
- 「今日の記録」として 1〜4 セットぶんの入力欄を表示
  - 1セット分の入力項目：
    - 重量（weight）
    - 回数（reps）
    - メモ（memo）
  - 入力フォームは 4行分（4セット分）をあらかじめ用意
- 保存ボタンを押すと：
  1. その日 × その種目の既存ログを一度すべて削除
  2. 画面上の 4 セットのうち、「重量と回数が両方入力されている行だけ」新しく保存
  3. 保存完了後、日別ログ画面 `/logs/[date]` に戻る

---

## 🗂️ データモデル（Supabase）

### `exercises` テーブル（種目マスタ）

筋トレ種目の一覧を管理するテーブル。

| カラム名     | 型           | 説明                        |
| ------------ | ------------ | --------------------------- |
| id           | text (PK)    | 種目 ID (`"bench_press"` など) |
| name         | text         | 種目名（例：ベンチプレス） |
| part         | text         | 部位（例：胸 / 背中 / 脚） |
| order_index  | int          | 表示順                      |
| created_at   | timestamptz  | 作成日時                    |

### `logs` テーブル（1セット = 1行）

1セットごとのトレーニング記録を保存するテーブル。

| カラム名     | 型           | 説明                                         |
| ------------ | ------------ | -------------------------------------------- |
| id           | uuid (PK)    | 一意なログ ID                               |
| date         | date         | トレーニング日（例：2025-12-06）            |
| exercise_id  | text (FK)    | 対象種目の ID（`exercises.id`）             |
| set_index    | int          | 何セット目か（1〜4）                         |
| weight       | numeric      | 重量                                         |
| reps         | int          | 回数                                         |
| memo         | text         | メモ（任意）                                |
| user_id      | uuid or text | ユーザー ID（将来的に Supabase Auth と連携予定） |
| created_at   | timestamptz  | 作成日時                                     |
| updated_at   | timestamptz  | 更新日時                                     |

**保存ルール：**

- 1セット = 1レコード（1行）
- 最大 4 セットまで保存
- 「重量と回数のどちらか、または両方が空」のセットは保存しない
- 保存のたびに：
  - 対象日付 & 対象種目の既存レコードを DELETE
  - 画面の入力内容から再度 INSERT し直す

---

## 🧩 実装メモ（種目記録画面）

- `SetRow` 型で 1 セットぶんの入力を表現

  ```ts
  type SetRow = {
    weight: string;
    reps: string;
    memo: string;
  };





This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# my-gym-next.js-app
