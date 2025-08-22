# TODO

## 1. プロジェクトセットアップ

- [x] Next.js + TypeScript プロジェクトを初期化する (`npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`)
- [x] `next.config.mjs` に `output: 'export'` を設定し、静的エクスポートを有効にする
- [x] shadcn/ui を初期化し、必要なコンポーネントをセットアップする (`npx shadcn-ui@latest init`)
- [x] Firebase プロジェクトをコンソールで作成する (これは手動タスク)
- [x] Firebase SDK をプロジェクトにインストールする (`npm install firebase`)
- [x] Firebase の設定情報 (`firebaseConfig`) を環境変数としてアプリケーションに読み込ませる (`.env.local` ファイルを作成)
- [x] Prettier をインストールし、コーディング規約に合わせた設定ファイルを作成する

## 2. 認証機能

- [x] Firebase Authentication を有効にし、Google ログインプロバイダを設定する (手動タスク)
- [x] Google ログイン・ログアウト機能を実装した `AuthService` モジュールを作成する
- [x] 認証状態（ユーザー情報）をグローバルに管理するための `AuthContext` を `React Context` と `useReducer` を用いて作成する
- [x] ログイン状態に応じて表示を切り替えるヘッダーコンポーネントを作成する (ログインボタン/ユーザー情報・ログアウトボタン)
- [x] ログインしていないユーザーがアクセスした場合にログインページにリダイレクトする処理を実装する (ミドルウェアまたは高階コンポーネントを使用)

## 3. データモデルと Firestore Rules

- [x] `design.md` に基づいて、Firestore のデータモデルの TypeScript 型定義ファイル (`src/types/firestore.ts`) を作成する
- [x] `firestore.rules` ファイルを作成し、認証済みユーザーのみが自身のデータ (`/users/{uid}`) に読み書きできるようにセキュリティルールを記述する
- [x] Firestore Rules を Firebase プロジェクトにデプロイする

## 4. 貯金目標のコア機能 (CRUD)

- [x] 貯金目標の一覧を Firestore から取得し、表示する `GoalList` コンポーネントを作成する
- [x] 貯金目標カード (`GoalCard`) コンポーネントを作成し、目標名、目標金額などを表示する
- [x] 貯金目標の新規作成モーダル (またはページ) を作成する
    - [x] 目標名、説明、初期費用、目標金額を入力するフォームを作成する
    - [ ] 「毎月の貯金額」と「達成期間」のどちらかを入力すると、もう一方が自動計算されるロジックを実装する
    - [x] フォームの入力内容を Firestore に保存するロジックを実装する
- [x] 貯金目標の編集モーダル (またはページ) を作成し、既存のデータを更新する機能を実装する
- [ ] 貯金目標を論理削除する機能を実装する (`isDeleted` フラグを `true` に更新)

## 5. 一覧画面の高度化

- [x] `GoalCard` コンポーネントに、進捗率 (プログレスバー) を表示する
- [ ] `GoalCard` コンポーネントに、残り期間を表示する
- [ ] ドラッグアンドドロップによる並び替え機能を実装する (ライブラリ例: `dnd-kit`)
    - [ ] PCではドラッグ＆ドロップ、モバイルでは長押しで並び替えモードになるように実装する
    - [ ] 並び替え結果を Firestore の `sortOrder` フィールドに保存する

## 6. 手動入金と履歴表示

- [ ] 手動入金フォームコンポーネントを作成し、ボーナスなどの臨時収入を記録できるようにする
- [ ] 手動入金データを `transactions` サブコレクションに保存するロジックを実装する
- [ ] 貯金目標の詳細画面 (編集画面と兼用) を作成する
- [ ] 詳細画面内に、`transactions` サブコレクションから積立履歴を取得して表示する `TransactionList` コンポーネントを作成する

## 7. 自動積立機能 (Cloud Functions)

- [ ] `functions` ディレクトリを作成し、Firebase Functions のプロジェクトを初期化する (`firebase init functions`)
- [ ] `design.md` と `requirements.md` に基づき、ユーザーが設定した積立日に `monthlyAmount` を `currentAmount` に加算し、`transactions` に履歴を追加する Cloud Functions (`autoDeposit`) を TypeScript で作成する
- [ ] Cloud Scheduler を設定し、`autoDeposit` 関数を毎日定時 (例: JST 0:00) にトリガーするように設定する (デプロイ時に設定)
- [ ] ユーザーが積立日 (`depositDay`) を設定できる UI を作成し、Firestore の `users/{uid}` ドキュメントに保存する機能を実装する

## 8. PWA対応

- [ ] `@ducanh2912/next-pwa` をインストールし、Next.js の設定ファイル (`next.config.mjs`) にPWAの設定を追記する
- [ ] `public` ディレクトリに `manifest.json` ファイルとアプリアイコンを配置する
- [ ] オフラインでも基本的な表示ができるようにサービスワーカーを設定する

## 9. デプロイ

- [ ] Firebase Hosting をセットアップする (`firebase init hosting`)
- [ ] `firebase.json` の `hosting.public` を `out` に設定する
- [ ] フロントエンドアプリケーションをビルドし、Firebase Hosting にデプロイする (`next build && firebase deploy --only hosting`)
- [ ] Cloud Functions をデプロイする (`firebase deploy --only functions`)
