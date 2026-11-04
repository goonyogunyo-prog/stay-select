STAY SELECT 2026-11-02 05:22 JST GitHub main安全マージ方針（実行前レビュー）
GitHub main HEAD: 88979175bd151bdba6949c517f0e50c653eb053e
競合4パス: data/stays.json, index.html, new-arrivals.html, sitemap.xml
安全方針:
1. GitHub mainのHEADとrecursive treeを開始・終了で確認し、変化があれば中止して再比較。
2. mainをZIPで一括上書きしない。GitHub-onlyの同名・別名ファイルは削除しない。
3. mainの4パスと今回ローカル4パスを三者比較。共通祖先が特定できない場合は自動マージしない。
4. data/stays.jsonはmainに存在するレコードをID・値・順序で比較し、localの12,596件と手動統合。既存33成果URLを保持。
5. index.htmlはGitHub独自セクションとローカル更新セクションを両方残し、重複/古い告知を除去。
6. new-arrivals.htmlは公開日・出典・施設数を再構成し、sitemap.xmlはURL集合の和集合を取り重複除去。
7. GitHubへの変更は今回なし。次回も先行変更があれば保留し、差分を明示。
