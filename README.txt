STAY SELECT サイト更新セット（2026年10月15日）

【今回の重要な修正】
GitHub上で、guides/value.html に「クラブラウンジ」の記事が入るなど、ファイル名と本文がずれていました。
このZIPは、正しいファイル名・フォルダ構成に直した完全版です。

【新規追加】
・guides/booking-comparison.html：ホテル予約サイトの比較ガイド
・sitemap.xml：検索エンジン用サイトマップ
・404.html：リンク切れ時の案内

【変更】
・index.html：新記事へのリンク追加
・guides/value.html / guides/anniversary.html：関連記事へのリンク
・全ページ：canonical URLの設定
・robots.txt：サイトマップの場所を追記
・誤配置されていた記事内容を各正しいファイル名に復元

【GitHubへ反映する手順】
1. このZIPを解凍する。
2. GitHubで goonyogunyo-prog/stay-select の Code 画面を開く。
3. Add file → Upload files を選ぶ。
4. 解凍したフォルダの「中身」をすべてドラッグ＆ドロップする。
   guidesフォルダは必ず「フォルダのまま」ドラッグし、
   guides/anniversary.html などの階層を維持する。
5. Commit changes を押す。既存ファイルは上書き更新する。
6. Actionsで pages build and deployment が緑色になったら、
   https://goonyogunyo-prog.github.io/stay-select/ を開く。
7. guides/booking-comparison.html と guides/tokyo-club-lounge.html も確認する。

【注意】
GitHub上にあるGoogle Search Consoleの認証ファイル
（googleで始まるhtmlなど）は削除しないでください。
このZIPには認証ファイルは含めていません。
GitHubのアップロード操作は通常、ZIPにない既存ファイルを削除しません。
GitHub Pagesの公開設定は main / (root) にしてください。
404が続く場合は Settings → Pages の公開URLとソースを確認してください。

【Search Console】
サイト公開が確認できたら、サイトマップとして
https://goonyogunyo-prog.github.io/stay-select/sitemap.xml
を送信してください。新記事は必要ならURL検査も行います。

【広告について】
未承認のアフィリエイトリンクは設置していません。
宿泊料金、空室、口コミの未確認情報は掲載していません。
