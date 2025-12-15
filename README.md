<div id="top"></div>
My Gym Next

筋トレの記録を 「日付 × 種目 × セット（重量・回数・メモ）」 で管理する Web アプリです。
カレンダーから日付を選び、その日のトレーニング内容を素早く記録できます。

使用技術一覧
<p style="display: inline"> <img src="https://img.shields.io/badge/-Node.js-000000.svg?logo=node.js&style=for-the-badge"> <img src="https://img.shields.io/badge/-TypeScript-000000.svg?logo=typescript&style=for-the-badge"> <img src="https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"> <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=for-the-badge"> <img src="https://img.shields.io/badge/-TailwindCSS-000000.svg?logo=tailwindcss&style=for-the-badge"> <img src="https://img.shields.io/badge/-Supabase-000000.svg?logo=supabase&style=for-the-badge"> <img src="https://img.shields.io/badge/-Vercel-000000.svg?logo=vercel&style=for-the-badge"> </p> <p align="right">(<a href="#top">トップへ</a>)</p>
目次

プロジェクトについて

主な機能

画面構成--ルーティング

ディレクトリ構成

データモデルsupabase

開発環境構築

トラブルシューティング

<p align="right">(<a href="#top">トップへ</a>)</p>
プロジェクトについて

コンセプト

カレンダー中心で「いつトレーニングしたか」が一目で分かる

日付ベースで「どの種目を・どれくらい」やったかを管理

Last Record（前回記録） を見ながら前回の自分と比較できる

<p align="right">(<a href="#top">トップへ</a>)</p>
主な機能

月カレンダー表示（トレーニング日マーク表示）

日付ごとのログ一覧（種目ごとにグルーピング）

種目選択 → セット追加（重量 / 回数 / メモ）

セットの編集・削除

同種目の直近記録（Last Record）の表示

<p align="right">(<a href="#top">トップへ</a>)</p>
画面構成 / ルーティング
/                         → app/page.tsx（カレンダー）
/logs/[date]              → app/logs/[date]/page.tsx（日別ログ一覧）
/logs/[date]/select       → app/logs/[date]/select/page.tsx（種目選択）
/logs/[date]/[exerciseId] → app/logs/[date]/[exerciseId]/page.tsx（種目別ログ）

ホーム（カレンダー） /

日付をクリックすると日別ログへ遷移 → /logs/[date]

ログがある日にはマーク（●）を表示

日別ログ /logs/[date]

その日の記録を種目単位で表示

右下の「＋」から種目選択へ → /logs/[date]/select

種目選択 /logs/[date]/select

種目を選ぶと種目別ログへ → /logs/[date]/[exerciseId]

種目別ログ /logs/[date]/[exerciseId]

今日のセット追加・編集・削除

同種目の直近記録（Last Record）を表示

<p align="right">(<a href="#top">トップへ</a>)</p>
ディレクトリ構成

（例）※必要なら tree の結果に合わせて更新してください

app/
  layout.tsx
  page.tsx
  CalendarClient.tsx
  logs/
    [date]/
      page.tsx
      select/
        page.tsx
      [exerciseId]/
        page.tsx
        AddSetForm.tsx
        EditSetRow.tsx
        DeleteSetButton.tsx

lib/
  supabaseClient.ts

<p align="right">(<a href="#top">トップへ</a>)</p>
データモデル（Supabase）
logs テーブル（1セット = 1行）
カラム名	型	説明
id	uuid (PK)	一意なログID
created_at	timestamptz	作成日時
exercise_id	text	種目ID（例：bench_press）
set_index	int	何セット目か
weight	numeric	重量
reps	int	回数
date	date	トレーニング日（例：2025-12-06）
memo	text	メモ（任意）
<p align="right">(<a href="#top">トップへ</a>)</p>
開発環境構築
1. 依存関係のインストール
npm install

2. 環境変数（Supabase）

プロジェクトルートに .env.local を作成して、以下を設定します。

NEXT_PUBLIC_SUPABASE_URL=xxxxxxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxx

3. 起動
npm run dev

<p align="right">(<a href="#top">トップへ</a>)</p>
トラブルシューティング
画面が更新されない / ルーティングが変（HMR周り）

開発サーバーを再起動してください
（Next.js/Turbopackでまれに表示が古いままになることがあります）

Supabase 接続エラーになる

.env.local の値が入っているか確認

Vercel にデプロイしている場合は Vercel の Environment Variables にも同じ値を設定

Vercel で build が落ちる

package-lock.json をコミットしているか確認

npm install → npm run build がローカルで通るか確認

<p align="right">(<a href="#top">トップへ</a>)</p>
今後の実装予定

Volume最大更新時の通知表示

部位（胸・背中・脚など）で種目を分類

layoutヘッダーからの画面遷移改善

API Route を使ったデータ操作の整理（リファクタリング）

<p align="right">(<a href="#top">トップへ</a>)</p>













# My Gym

My Gymは、筋トレの記録を「日付ｘ種目ｘセット（重量・回数・メモ）」で管理する
Next.js + Supabase製のWebアプリです。

カレンダーから日付を選択し、
その日のトレーニング内容を素早く・直感的に記録出来ます。

-----------------------------------------------------------------------

## コンセプト

- カレンダー中心でわかりやすく、操作がしやすい。
- 「いつ・どの種目を・どれくらい」やったかを日付ベースで管理
- 前回記録（Last Record）を確認しながら、前回の自分と比較できる。

-----------------------------------------------------------------------

## 画面構成 / ルーティング

/
→app/page.tsx(カレンダー) 

/logs/2025-12-14
→ app/logs/[date]/page.tsx

/logs/2025-12-14/select
→ app/logs/[date]/select/page.tsx（種目選択）

/logs/2025-12-14/bench_press
→ app/logs/[date]/[exerciseId]/page.tsx (重量・回数・メモ 入力)

-----------------------------------------------------------------------

### ホーム（カレンダー画面）

- 月カレンダーを表示
- トレーニングした日にマークを表示
- 日付をクリックすると、その日のログ画面へ遷移  
  → `/logs/[date]`

-----------------------------------------------------------------------

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
  - ＋ボタンを押すと「種目選択画面」が開く
    → 種目選択後に、種目記録画面へ

-----------------------------------------------------------------------    

### `/logs/[date]/select` 種目選択画面

  - 胸：ベンチプレス、ダンベルプレス、インクラインダンベル など
  - 背中：ラットプルダウン、ローイング など
  - 脚：スクワット、レッグプレス など
- 種目カードをクリックすると、その日のその種目の記録画面へ遷移  
  → `/logs/[date]/[exerciseId]`

-----------------------------------------------------------------------  

### `/logs/[date]/[exerciseId]` 種目記録画面（メイン機能）

- 対象日付 + 対象種目の記録画面
- 上部に「Last Record（前回記録）」を表示
  - 同じ種目の直近の記録を表示（例：前回の日付と4セット分）
- 「今日の記録」として 1〜4 セットぶんの入力欄を表示
  - 1セット分の入力項目：
    - 重量（weight）
    - 回数（reps）
    - メモ（memo）
- 保存ボタンを押すと：

-----------------------------------------------------------------------

### 実装予定

- 1セットの最大Volumeが出た場合に、「max更新中！」というログを追加する
- 部位ごとに種目カードを一覧表示
  - 胸を押すと、ベンチプレス、ダンベルプレス、インクラインダンベル　など種目の種類を追加する
  - 背中：ラットプルダウン、ローイング など
  - 脚：スクワット、レッグプレス など
- layoutのヘッダーで画面遷移をより簡単に自在にする
- APIをそれぞれのファイルから直接ではなく、routeを使ってコード改修をやりやすくする

-----------------------------------------------------------------------

## 🗂️ データモデル（Supabase）

### `logs` テーブル（1セット = 1行）

1セットごとのトレーニング記録を保存するテーブル。

| カラム名     | 型           | 説明                                         |
| ------------ | ------------ | -------------------------------------------- |
| id           | uuid (PK)    | 一意なログ ID                               |
| created_at   | timestamptz  | 作成日時                                     |
| exercise_id  | text (FK)    | 対象種目の ID（`exercises.id`）             |
| set_index    | int          | 何セット目か                      　　　　　 |
| weight       | numeric      | 重量                                         |
| reps         | int          | 回数                                         |
| date         | date         | トレーニング日（例：2025-12-06）            |
| memo         | text         | メモ（任意）                                |


-----------------------------------------------------------------------






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
