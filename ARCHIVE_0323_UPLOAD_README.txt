STAY SELECT | 2026-10-20 03:23 JST | 2回分累積・安全な差分パッチ（サイト全体ZIPではありません）

【重要：完全な累積ZIPは今回も作成できません】
指定された最優先起点：STAY_SELECT_20261020_0123_CUMULATIVE_2495_STAYS_CHECKOUT_REVIEW.zip（721ファイル、SHA256=cab110914952c67270e032a9d32b81788c88158b5f2f6167a69cefc9babb3a21）と、同prefixの11ファイルが実行環境にもLibrary検索にもありません。指定された721/721 Git blob SHAの検証、2495版との重複照合、全変更の継承は不可能です。
起点を古い2457版に置き換えて2495版と偽ることはしません。新規候補のID採番や本番data/stays.jsonへの追加も行いません。

【今回の新機能】
・stay-payment-ledger.html + assets/stay-payment-ledger.css + assets/stay-payment-ledger.js
・宿泊支払い台帳：宿名検索、前金・残金・追加料金・返金、期限・支払状態、未払い/期限超過/返金待ち集計、localStorage保存、CSV/JSONダウンロード・JSON復元、390px対応。
・公式料金や決済状況は取得しません。決済、予約、通知、外部同期なし。カード番号などは入力しないでください。
・data/stays.jsonを動的取得。旧2457施設版で全件読み込みと1件検索のブラウザ検証済み。最新2495版での実HTTP検証は未実施。

【前回2026-10-20 02:26分の差分も同梱】
・stay-readiness-board.html + assets/stay-readiness-board.css/js
・data/candidate-38-20261020-0226.json/csv/summary（38候補）
・前回の検証記録と基礎照合ツールを保持。前回ZIPの12エントリはREADMEをアーカイブ名に変更した以外バイト完全一致。

【今回の新規候補38施設（全件本番未統合）】
・奥日光湯元温泉旅館協同組合（栃木県）12件：https://www.nikkoyumoto.com/yado/
・伊豆高原ペンション協同組合（静岡県）8件：https://www.izu-pension.com/stay/
・下関旅館ホテル協同組合（山口県）9件：https://www.shimonoseki-ryokan.com/list
・野沢温泉旅館組合（長野県）4件：https://nozawa.jp/
・長門湯本温泉旅館協同組合（山口県）5件：https://ryokan.yumotoonsen.com/ryokan/
・宿独自公式本文直接取得：0件。38件すべて組合・協会の公式掲載のみで名称/所在県確認。
・ビジネスホテル新規：0件。料金/営業/空室/キャンセル規定は未確認。
・2457既存施設+前回候補38+今回候補38の2533名称についてNFKC+Unicode空白/句読点/記号除去の正規化重複0。ただし2495版との重複未検証。
・2回分の候補76件を本番へ統合する前に、2495版の存在確認と名前重複検証が必要。

【GitHub】
開始/終了 main HEAD=727d6f1c9480e6de62e7ae2c3c348ff3fa73131f、recursive tree355件/345blob、truncated=false、全345 path+SHAのFNV1a32=3493b1a5（同一アルゴリズムで開始終了一致）。mainは先行変更なし。
最新2495版はGitHub mainに存在しません。mainにのみ存在する25 blobは絶対削除しないこと。

【手動反映（差分のみ）】
・このパッチZIPを解凍し、まず stay-payment-ledger.html と assets/stay-payment-ledger.css / assets/stay-payment-ledger.js の3ファイルのみを既存リポジトリへ追加可能。前回機能も必要なら stay-readiness-board.html と assets/配下2ファイルを追加可能。
・data/candidate-38-* のJSON/CSVは調査候補の保管用。既存の data/stays.json を上書きしない。予約CTAも付けない。
・既存ファイルを削除・上書きしない。新規フォルダ作成不要（assets/とdata/は既存）。もし今後新規フォルダが必要なら GitHub Add file → Create new file → 「フォルダ名/.gitkeep」 → Commit changes。
・2495 ZIPとSHA_DIFFを回収できた場合は `python verify_merge_2495_0323.py BASE_2495.zip 0123_GITHUB_SHA_DIFF.txt THIS_PATCH.zip [OUTPUT.zip]` で安全性を検証。オプションOUTPUT指定時もサイトの2495施設データは変えず、パッチの新規ファイルだけを追加したZIPを生成する。候補76件は未統合。

【検証制限】
本番HTTP統合動作・実サイトlocalStorage永続性・実施設の営業/料金/空室/キャンセル規定・楽天成果計測は未検証。localhostはブラウザ管理者ポリシーでアクセス遮断。
