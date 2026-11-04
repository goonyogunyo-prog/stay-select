STAY SELECT 09:22 GitHub 競合4件・三者マージ検討
main HEAD: 88979175bd151bdba6949c517f0e50c653eb053e（branch/tree APIで開始時確認、後述の終了時確認が必要）
GitHub-only不足0・main 1258 blobs・ローカル版との競合4。mainへの書き込みなし。
1 data/stays.json: mainの既存レコードをID・名称・県・順序で比較し、両方にしかないレコードは人手確認。ローカル12633件をmainへ丸ごと上書きしない。
2 index.html: main固有のSEO/メニュー/広告リンクを保存し、ローカル追加sectionだけ選択的に統合。CSS/JS依存と内部リンクを確認。
3 new-arrivals.html: mainの2026-10-22新着38施設紹介を別アーカイブ保存し、今回の2026-11-02新着29件は別ページで共存可能な設計を検討。先行記事を削除しない。
4 sitemap.xml: mainとローカルのloc集合和を取り重複排除、lastmodを根拠なく更新しない。
マージ前条件: HEAD再取得一致、4件main blob SHA再取得、GitHub-only 1258 blob全パス存在、差分レビューと実ブラウザ確認。全条件未達なら未公開維持。
