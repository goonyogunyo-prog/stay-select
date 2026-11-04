STAY SELECT 2026-11-02 06:22 JST / GitHub main 安全マージ方針（未実施）
起点: 05:22 JST 12,596施設 / 2,375ファイル。全件CRC/bytes/SHA256/Git blob SHA1照合後に更新。
GitHub main tree SHA 88979175bd151bdba6949c517f0e50c653eb053e、1,258 blobs、既知1,254一致、競合4、不足0。
競合4:
- data/stays.json: main原文が現行ローカルより古い可能性。旧12,596レコードと順序・成果URLを保持。main独自のレコード/フィールドの差分を別途抽出するまで置換禁止。
- index.html: main独自導線とローカル追記セクションを DOM レベルで比較。重複や壊れたリンクを除去してから差分パッチ。
- new-arrivals.html: mainの2026-10-22新着38件は過去アーカイブとして扱う。現行2026-11-02新着4件へ無条件上書き禁止。
- sitemap.xml: XML URL集合で差分比較しローカルURL・main URLの和集合を作成する。lastmodは確認できた値のみ。
開始・終了HEAD一致確認の上、path別三者マージを検討。GitHub-only削除・main一括上書き・公開は行わない。
