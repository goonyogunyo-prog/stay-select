STAY SELECT GitHub main 4競合の安全な三者マージ方針（2026-11-03 05:18 JST）
main HEAD前回確認: 88979175bd151bdba6949c517f0e50c653eb053e。今回GitHubコネクタで4件のblob SHA再確認（旧監査値一致）。
競合4: data/stays.json, index.html, new-arrivals.html, sitemap.xml。
1. main最新HEAD/treeを毎回取り直し、旧監査1,258 path/SHAの再利用可否を判定。GitHub-onlyを消さない。
2. data/stays.json: main 4,965件の値・順序は過去検証でローカル先頭4,965件と一致。ただしヘッダーメタデータ相違。共通祖先を確定するまではmainへの書込み禁止。
3. index.html: main側先行の構造・広告・ナビゲーションを保持し、ローカル側の新着リンクと新機能導線のみ選択的に統合。DOM重複・予約CTAをレビュー。
4. new-arrivals.html: 公式6件の情報をmain最新のページ構造に移植。未照合予約CTAを作らない。
5. sitemap.xml: 両側URL集合の和集合、重複除去、lastmodは根拠ある変更分のみ。GitHub-only URLを削除しない。
6. 共通祖先・GitHub本文を全件取得し三者差分を機械生成後、人手レビュー→別ブランチ→CI→PR。main一括上書き禁止。
今回のZIPはローカル累積成果であり、GitHub mainに直接上書きしない。
