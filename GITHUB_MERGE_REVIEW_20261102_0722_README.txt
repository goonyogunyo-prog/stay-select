STAY SELECT 2026-11-02 07:22 JST GitHub main 三者マージ方針（未実行）
main HEAD: 88979175bd151bdba6949c517f0e50c653eb053e
GitHub-only不足0（前回1,258 blob監査を起点にmain HEAD不変を今回再確認）。
競合4件: data/stays.json, index.html, new-arrivals.html, sitemap.xml
1. GitHub mainの4ファイルはローカル累積ZIPの内容とSHAが異なる。GitHub mainを直接上書きしない。
2. data/stays.json: main 5,250,625 bytes、ローカル約13MB。main由来の変更・施設ID・配列順を精査してから手動マージ。12,600件の原文保持が優先。
3. index.html: main 47,083 bytes、ローカル約205KB。main側独自のUI・リンク・SEO要素を比較してから選択的に取り込む。
4. new-arrivals.html: main 18,088 bytes。新着掲載の差分と重複を確認して統合。
5. sitemap.xml: main 29,198 bytes。公開実体があるURLのみを集合和し、古いURLや未公開URLは混ぜない。
6. 原文は archive-20261102-0622 に全バイト保存。GitHub側ファイルは今回変更していない。
7. 推奨: 別作業ブランチ上でGitHub main・共通祖先・ローカル累積版の3者を比較、レビュー後にPR。main一括上書き禁止。
