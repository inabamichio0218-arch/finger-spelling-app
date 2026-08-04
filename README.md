# AI動画で学ぶ 指文字

PowerPointでデザインしたボタンと、生成AIを活用して制作した動画を使った、スマートフォン向けの指文字学習Webアプリです。

## GitHub Pagesで公開する手順

1. GitHubで新しいリポジトリを作成します（例：`finger-spelling-app`）。
2. このフォルダー内のファイルとフォルダーを、リポジトリの一番上の階層へアップロードします。
3. GitHubのリポジトリで **Settings → Pages** を開きます。
4. **Build and deployment** の Source を **Deploy from a branch** にします。
5. Branch は **main**、フォルダーは **/(root)** を選び、保存します。
6. 公開処理が終わると、GitHub PagesのURLが表示されます。

## ファイル構成

- `index.html`：画面の構造
- `style.css`：レイアウトと背景色
- `app.js`：ボタン、動画再生、トップへ戻る処理
- `images/`：PowerPointから書き出したタイトルとボタン
- `videos/`：各行のMP4動画
- `manifest.webmanifest`：ホーム画面追加用の設定
- `service-worker.js`：トップ画面の軽量なオフラインキャッシュ

## 動画について

動画は選択された1本だけを読み込みます。PWAのインストール時に10本すべてをダウンロードする構成にはしていません。

## 背景色・著作権表記の変更

- 背景色：`style.css` 冒頭の `--background: #304B32;`
- 著作権表記：`index.html` の `© 2026 Michio Inaba | I Love PowerPoint`
