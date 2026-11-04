STAY SELECT 2026-11-02 17:00 JST / GitHub 競合4件・三者マージ方針
GitHub main HEAD=88979175bd151bdba6949c517f0e50c653eb053e。recursive tree 1268 entries/1258 blobs/truncated=false、FNV1a32=1522b89e。
今回GitHub側の最新treeを取得し指紋を再計算。既存1258 path/SHA CSVとの同一性が成立したため全件照合値を再利用。
競合: data/stays.json, index.html, new-arrivals.html, sitemap.xml。
1. mainの4ファイルの生バイトと共通祖先コミットの同ファイルをすべて取得する。
2. data/stays.json: base/local/mainをID・名称・県・全フィールドの値と順序で三者比較。ローカル12765旧レコードの原文を保存し、main独自の変更はID単位で慎重に統合。衝突時は自動解決しない。
3. index.html: main独自のリンク・SEO・スクリプト・導線を失わないようDOM構造を比較し、ローカル新着カードだけ選択追加。
4. new-arrivals.html: main独自の文言・掲載を確認し、今回新着38施設を重複なく掲載。
5. sitemap.xml: URL集合をマージ。main独自URLの削除なし。重複URLとlastmodを検査。
6. 4ファイルを含む全1258 GitHub blob SHAを再照合し、変更前main HEAD一致を確認してから、別ブランチ/PRで差分レビュー。main一括上書き禁止。
今回は共通祖先の全バイトが取得できていないため三者マージ未実行。GitHub未公開。
