GitHub main競合4ファイル 三者マージ方針 2026-11-03 03:30 JST
main HEAD（前回記録）88979175bd151bdba6949c517f0e50c653eb053e
今回GitHubコネクタで競合4件すべての現在blob SHAを確認し、前回監査CSVのSHAと一致（3件本文取得、data/stays.jsonは先頭5行取得）。
GitHub-only復元済252件を含む全2600旧ファイルの原文を保全。
競合: data/stays.json, index.html, new-arrivals.html, sitemap.xml
1) main HEADの新規更新有無を再確認し、GitHub側の全blob SHAを再監査。
2) data/stays.json: GitHub main先頭4965レコードの値・順序は過去照合済。ただしメタデータ差異と共通祖先未確認。ヘッダーを機械的上書きせず、base/main/localの全キーを比較する。
3) index.html: HTML DOMのセクションID・リンク・機能導線単位でbase/main/localを比較。main独自導線を削除しない。
4) new-arrivals.html: 新着ページは双方で内容が違うため、現行ページは最新ローカルを維持し、mainの過去新着は履歴アーカイブに残す。
5) sitemap.xml: URL集合の和集合を取り、lastmodは検証済更新のみ更新。
6) 4件すべて共通祖先を検証してから独立ブランチでPR作成。main一括上書き禁止。
GitHub本番未公開。全1258 blob本文の個別再取得未完了。
