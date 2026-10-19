STAY SELECT | 2026-10-20 02:26 JST | 安全な部分納品（累積ZIPではありません）

【重要：未取得の起点】
ユーザー指定の最優先起点：STAY_SELECT_20261020_0123_CUMULATIVE_2495_STAYS_CHECKOUT_REVIEW.zip（721件）と、同prefixの11ファイルが、この実行環境に存在しません。
前回起点を勝手に2457施設版へ戻すと、2495施設版の38件および改修が失われます。そのため今回「2533施設版の累積ZIPが完成」とは主張しません。

【今回、実際に完成したファイル】
1. stay-readiness-board.html
2. assets/stay-readiness-board.css
3. assets/stay-readiness-board.js
   → 既存 data/stays.json を動的に読み込み、全国の宿から選んで8項目を確認。検索/都道府県/進捗フィルター、ブラウザ保存、CSV/JSON実ダウンロード、JSON復元、印刷。予約/公式条件取得なし。
4. data/candidate-38-20261020-0226.json と CSV
   → 5公式ネットワークから38施設の名称/県を確認し、2457施設版に対するNFKC+Unicode空白・句読点・記号除去の正規化重複0を検証。
   → 最新2495施設版との重複は起点不在につき未検証。よって新規38件は「統合待ち候補」であり、本番の data/stays.json に追加していません。
5. verify_2495_base_before_merge.py
   → 2495起点ZIPとSHA_DIFFが揃った時、SHA256、721件CRC/全バイト/Git blob SHA、ID連続、38候補の正規化名重複を検証。書込みなし・不一致で停止。

【手動反映】
新機能だけを先行公開する場合：ZIPから stay-readiness-board.html と assets/配下のCSS/JSの計3ファイルだけをGitHub mainに追加。既存のファイルを削除しない。URLは https://goonyogunyo-prog.github.io/stay-select/stay-readiness-board.html
ただし今回の追加でGitHub mainが変更されるため、次回はその変更を先行変更として慎重にマージする必要があります。
データ候補JSON/CSVは本番 data/stays.json へまだ統合しないこと。

【フォルダ】assets/ と data/ は既存。新規フォルダ作成不要。
将来もし新規フォルダが必要なら、GitHub Add file → Create new file → フォルダ名/.gitkeep → Commit changes。

【検証】
起点として実在する最新ZIP：20261020_0020_2457施設/671ファイル。CRCとSHA256一致。
候補38件は5ネットワーク・2457既存全件との正規化名重複0。宿独自本文直接取得0、協会・組合公式掲載のみ38。
新JS Node構文成功。Chromium（/usr/bin/chromium）で2457件ロード、検索、チェック、保存、CSV/JSON実ダウンロード、390px横はみ出し0、JS例外0。
公開HTTPと実サイトの永続保存、2495 ZIPに対する整合性は未検証。

【次回の必須処理】
指定された2495 ZIPおよび11補助ファイルの実在と整合性を確認できるまで、2457起点の累積ZIPで置き換えないこと。起点が復旧したら38候補を全2495件と照合し、必要に応じて差し替え、旧変更を全継承して新機能とともに2533施設版の単一累積ZIPを生成すること。
