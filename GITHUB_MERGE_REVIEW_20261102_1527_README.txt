STAY SELECT 2026-11-02 15:27 JST GitHub競合4件の安全な三者マージ検討
main HEAD 88979175bd151bdba6949c517f0e50c653eb053e、tree 1,268 entries/1,258 blobs、FNV1a32=1522b89e。
GitHub main data/stays.json の全文をGitHubコネクタで取得・JSON解析できた（4965施設）。ただし旧共通祖先を完全特定して差分検証するまで自動マージしない。
競合: data/stays.json / index.html / new-arrivals.html / sitemap.xml。ローカル旧原文はarchive-20261102-1426へ全バイト保存。
方針: (1) HEADとGit blob SHAを再確認 (2) 共通祖先を特定 (3) stays ID/値/順序を双方から検証し追加分だけマージ (4) index/新着/sitemapの手修正を個別比較 (5) JS/ブラウザ/全件監査 (6) 本番反映は別途確認。
今回マージ・GitHub公開ともに未実施。main一括上書き禁止、GitHub-only削除禁止。
