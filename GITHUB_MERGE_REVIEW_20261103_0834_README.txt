GitHub main HEAD 88979175bd151bdba6949c517f0e50c653eb053e
2026-11-03 08:34 JST GitHub live HEAD/tree再確認、1258 blobs, FNV1a32 1522b89e
GitHub path SHA一致1254、GitHub-only不足0、競合4。
競合 data/stays.json,index.html,new-arrivals.html,sitemap.xml
main data/stays.json は4965件、ローカル先頭4965値・順序は過去に一致確認、ヘッダーは異なる。
index/new-arrivals/sitemapはmain側先行変更がある。共通祖先全値比較未完了。
安全手順：main HEADを再取得→各競合の共通祖先を確定→差分を意味単位で検証→旧GitHub版と旧ローカル版を全バイト退避→GitHub-onlyと33成果URLの保持検査→別ブランチPRでレビュー→mainへは無条件上書きしない。
今回三者マージ未実行。全1258 blob本文個別取得未実施。
