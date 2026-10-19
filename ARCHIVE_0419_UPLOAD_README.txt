STAY SELECT | 2026-10-20 04:19 JST | SAFE CUMULATIVE PATCH, NOT FULL SITE ZIP

IMPORTANT: Required 2495-stay / 721-file cumulative ZIP is missing:
STAY_SELECT_20261020_0123_CUMULATIVE_2495_STAYS_CHECKOUT_REVIEW.zip
SHA256 expected: cab110914952c67270e032a9d32b81788c88158b5f2f6167a69cefc9babb3a21
The associated 11 files are missing as well. Do not pretend that 2457 is 2495. The 2495+38 cumulative release and 721/721 Git blob verification cannot be completed. No production stays.json changes and no new stay IDs assigned.

This patch preserves all 24 entries from the previous 03:23 patch byte-for-byte, except that UPLOAD_README.txt was renamed ARCHIVE_0323_UPLOAD_README.txt to make room for this README. Earlier 02:26 patch features are also inherited through that patch.

NEW FUNCTION:
stay-posttrip-journal.html
assets/stay-posttrip-journal.css
assets/stay-posttrip-journal.js
Private post-trip journal: search stays from data/stays.json, optional manual hotel name, date, nights, people, actual cost, five subjective 1-5 ratings, revisit decision, notes, localStorage, search/filter/sort, stats, CSV/JSON export, JSON import/merge, delete. No external submission, reservation, official rating or real price lookup. Do not enter card numbers or sensitive personal information.

NEW STAGED 38 (NOT integrated):
data/candidate-38-20261020-0419.csv
data/candidate-38-20261020-0419.json
/data/candidate-38-20261020-0419-source-summary.json
NEW_38_STAGED_0419.txt
5 official listing networks: Aso 9 (Kumamoto), Bessho 8 (Nagano), Amanohashidate 8 (Kyoto), Izu-Yugawara 4 (Shizuoka), Misasa 9 (Tottori). All facilities independently operated. Hotel body directly fetched for Sozankyo and Uematsuya only; 36 association/union listings only. No business hotels added. No pricing, operating status, cancellation rules, vacancies or affiliate bookings verified.

VERIFICATION:
- Base 2457 ZIP SHA256 15c8831a5b8a5fae841c33c2e38f068812aed9337f8f860af4ed1897a5d52200, 671/671 CRC/content/Git blob SHA match with 0020 SHA_DIFF.
- Previous 0323 patch SHA256 cf838a74713b7c06221cd54408227dbaa1147ee730359a595f70c3f9af5b8428, 24/24 CRC/content verified, all inherited bytes preserved.
- 2457 base + previous staged 76 + new staged 38 = 2571 names, Unicode NFKC + Unicode Z/P/S category removal + casefold normalized duplicates = 0.
- Not verified against unavailable 2495 base, so new 38 remain staged. Potential aliases beyond exact normalized names require separate review.
- No existing GitHub main files modified or deleted by patch; Github main-only files preserved.
- Runtime tests and GitHub START/END are in TEST_REPORT_0419.txt and GITHUB_STATUS_0419.txt.

UPLOAD ONLY THE 3 NEW FEATURE FILES IF DESIRED. Do not upload candidate JSON/CSV into production stays.json or enable reservation CTA. Existing 02:26 and 03:23 feature files can be uploaded independently as documented in archived READMEs.
New folder creation is NOT required (assets/ and data/ already exist). If ever needed: GitHub Add file -> Create new file -> folder-name/.gitkeep -> Commit changes.

GitHub Desktop: pull main first; copy only new feature HTML + 2 assets into the checked-out repository; review changes; commit and push. Do not delete the 25 GitHub-only blobs. This patch is not a replacement for the complete site ZIP.

AFTER RECOVERING THE 2495 ZIP AND ITS SHA_DIFF:
python verify_2495_against_staged_0419.py FULL_2495.zip STAY_SELECT_20261020_0123_GITHUB_SHA_DIFF.txt THIS_PATCH.zip
This validates all 721 blob SHAs and 2495+114 normalized names without modifying the full base.
