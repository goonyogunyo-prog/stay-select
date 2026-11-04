# GitHub競合4件の安全な統合方針（2026-11-03 07:27 JST）
GitHub main HEAD 88979175bd151bdba6949c517f0e50c653eb053e、recursive tree 1268 entries / 1258 blobs / truncated=false / FNV1a32=1522b89e。全1258 path/blob SHAを再利用しローカルZIPと比較：1254一致・GitHub-only不足0・競合4。
競合: data/stays.json, index.html, new-arrivals.html, sitemap.xml。前回原文はarchive-20261103-0727にバイト単位保存。
data/stays.jsonのGitHub先頭4965レコードの値・順序は過去監査でローカルと一致。ただしメタデータ差と、他3ファイルの全値比較は未完了。
安全手順：1. GitHub mainの最新HEADを再確認。2. 4ファイルのGitHub blob全文を取得してSHA検証。3. 共通祖先commitを確定し、ancestor/main/localの三者比較をファイル単位で行う。4. data/stays.jsonは既存GitHubレコードとローカル旧レコードをID/全値/順序で突合し、未公開追加レコードのみ順序を保ち統合。5. index/new-arrivals/sitemapは要素・URL単位で衝突解消。6. 1258 pathの削除・GitHub-only復元済252件の消失を禁止。7. 別ブランチとPRで差分・テストを検証してから明示承認後に公開。
共通祖先全値比較とGitHub全1258 blob本文の個別取得は未完了。三者マージ未実施。main一括上書き・GitHubへの書き込みなし。
