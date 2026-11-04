STAY SELECT 2026-11-02 18:29 安全マージ検討
GitHub main HEAD 88979175bd151bdba6949c517f0e50c653eb053e、recursive tree 1268件/1258 blobs、FNV1a32=1522b89eをこの実行で新規取得。
全1258 path/SHAは既存監査CSVの全件値と一致する指紋。ローカル競合4件は未マージ。
競合: data/stays.json, index.html, new-arrivals.html, sitemap.xml
三者マージ手順: (1) common ancestor commitを確定し祖先blob取得 (2) 祖先→mainと祖先→ローカルの差分を別々に取得 (3) stays JSONはid/施設名/県の同一性と全フィールド値、順序、既存成果URLを確認 (4) 非競合差分だけ統合 (5) HEAD変更を再チェックしてから個別レビュー。
GitHub-only削除禁止、main一括上書き禁止。今回GitHub書き込みなし。
