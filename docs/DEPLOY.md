# アプリケーションのデプロイ手順

このドキュメントでは、本アプリケーションをFirebaseにデプロイする手順について説明します。

## 1. 前提条件

デプロイを始める前に、以下のツールがインストールされ、設定済みであることを確認してください。

- **Node.js** (v18 以降を推奨)
- **npm** (Node.js に同梱)
- **Firebase CLI**: インストールされていない場合は、以下のコマンドでグローバルにインストールしてください。
  ```bash
  npm install -g firebase-tools
  ```

また、Firebaseプロジェクトが作成済みである必要があります。

## 2. 初回セットアップ

プロジェクトを初めてデプロイする場合、以下の初期設定が必要です。

### a. 環境変数の設定

アプリケーションがFirebaseプロジェクトに接続するための設定を行います。

1.  プロジェクトのルートにある `.env.example` ファイルをコピーして、`.env.local` という名前のファイルを作成します。

    ```bash
    cp .env.example .env.local
    ```

2.  [Firebaseコンソール](https://console.firebase.google.com/)にアクセスし、ご自身のプロジェクトを選択します。

3.  左上の歯車アイコンから「プロジェクトの設定」を開きます。

4.  「マイアプリ」セクションで対象のウェブアプリを選択し、「SDK の設定と構成」から`firebaseConfig`の各値を取得します。

5.  取得した値を `.env.local` ファイルに転記し、保存します。

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    # ... 他のキーも同様に設定
    ```

### b. Firebase プロジェクトの初期化

ローカル環境とFirebaseプロジェクトを連携させます。

1.  Firebaseにログインします。

    ```bash
    firebase login
    ```

2.  プロジェクトのルートディレクトリで、以下のコマンドを実行して初期化します。

    ```bash
    firebase init
    ```

3.  プロンプトが表示されたら、以下のサービスを選択します（スペースキーで選択、Enterキーで確定）。
    - `Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys`
    - `Firestore: Configure security rules and indexes files for Firestore`

4.  各サービスの設定を以下のように進めます。
    - **Hosting**:
      - `What do you want to use as your public directory?` -> `out`
      - `Configure as a single-page app (rewrite all urls to /index.html)?` -> `Yes`
      - `Set up automatic builds and deploys with GitHub?` -> `No`
    - **Firestore**:
      - `What file should be used for Firestore Rules?` -> `firestore.rules` (デフォルト)
      - `What file should be used for Firestore indexes?` -> `firestore.indexes.json` (デフォルト)

## 3. デプロイの実行

セットアップ完了後、以下の手順でデプロイを実行できます。

### a. 手動でのデプロイ

1.  Next.jsアプリケーションを静的ファイルとしてビルドします。

    ```bash
    npm run build
    ```

2.  Firebaseにデプロイします。`--only`フラグでデプロイ対象（Hosting）を指定します。

    ```bash
    firebase deploy --only hosting
    ```

### b. スクリプトを使ったデプロイ

プロジェクトルートに用意された `deploy.sh` を使うと、ビルドからデプロイまでを一度に実行できます。

1.  初回のみ、スクリプトに実行権限を付与します。

    ```bash
    chmod +x deploy.sh
    ```

2.  スクリプトを実行してデプロイします。

    ```bash
    ./deploy.sh
    ```
