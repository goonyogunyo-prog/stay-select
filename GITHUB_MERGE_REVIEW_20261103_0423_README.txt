GITHUB 4 CONFLICT REVIEW 2026-11-03 04:23 JST
main HEAD 88979175bd151bdba6949c517f0e50c653eb053e; recursive tree 1258 blobs; FNV1a32=1522b89e.
競合: data/stays.json, index.html, new-arrivals.html, sitemap.xml. 変更前4ファイルはarchive-20261103-0423へ全バイト保全。
main data/stays.json 4965 records vs local先頭4965は前回FNV1a32=5a7f61a8一致。ただしheader差異あり。
main 3競合本文はconnectorで取得して冒頭・末尾を確認。mainは古い4965施設構成。共通祖先3ファイルの全値比較・三者マージは未実施。
推奨手順: 1.共通祖先をgit merge-baseで特定 2.各ファイルBASE/OURS/THEIRSを全バイト保存 3.共通祖先からの差分を解析 4.ローカル13139レコード保全・GitHub-only252件保全・現行HEAD再検証 5.別ブランチで手動レビュー後に公開。main一括上書き禁止。
