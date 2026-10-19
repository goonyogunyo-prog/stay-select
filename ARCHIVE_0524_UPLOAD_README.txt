STAY SELECT｜2026-10-20 05:24 JST｜安全な累積パッチ（4機能・152施設候補）

最優先起点 STAY_SELECT_20261020_0123_CUMULATIVE_2495_STAYS_CHECKOUT_REVIEW.zip が作業環境・ファイルライブラリに見つからないため、2495件版721ファイルとのCRC/Git blob SHA照合は実施不可。
本パッチを「全施設版」や「2609施設を公開した」と表現しないこと。宿候補152件は data/candidate-38-* に隔離し、本番 data/stays.json / 宿一覧HTMLは一切上書きしない。

今回新規の実用機能:
  stay-transport-budget.html
  assets/stay-transport-budget.css
  assets/stay-transport-budget.js
施設JSON data/stays.json を実行時に読み込み、宿名検索・交通費の総額/人数割・localStorage保存・CSV/JSONダウンロード・JSON復元・絞り込み・印刷を行う。
料金は利用者入力の概算のみ。公式交通費/空室/料金/営業状況/予約は未検証・非取得。

累積パッチには過去3回の機能「宿泊前確認ボード」「支払い管理台帳」「宿泊後感想ノート」と候補114件を全件継承。
旧35ファイルのうち34は同名同バイト、UPLOAD_README.txt は ARCHIVE_0419_UPLOAD_README.txt に旧バイト完全保存。

GitHubアップロード:
・2495件版が復旧するまで候補CSV/JSONを data/stays.json に追加しない。
・機能のみ先行導入するなら今回のHTML1+assets内CSS/JS2の3ファイルをGitHubリポジトリの同名パスへ追加する。
・過去3機能も必要ならそれぞれHTML/CSS/JSを追加する。既存ファイルは削除しない。
・新規フォルダ作成は不要（assets/ は既存）。フォルダが必要になった場合 GitHub Add file → Create new file → フォルダ名/.gitkeep → Commit changes。
・現行GitHub mainのHEADとtreeがアップロード前に変わっていないか必ず再確認する。

本番未確認：全2495件との照合、既存ページのブラウザ回帰、公開HTTP動作、localStorageの実端末永続性、宿の営業状況・空室・料金・キャンセル規定、楽天成果計測。
