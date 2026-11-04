STAY SELECT GitHub conflict review / 2026-11-02 20:23 JST
GitHub HEAD: 88979175bd151bdba6949c517f0e50c653eb053e; recursive tree 1268 entries / 1258 blobs / truncated=false; FNV1a32=1522b89e.
4 conflicts: data/stays.json, index.html, new-arrivals.html, sitemap.xml.
Local old versions archived as archive-20261102-1922/<path>.
GitHub main data/stays.json has 4,965 records (previously parsed); cumulative local 12928 records.
No reliable full common ancestor record-by-record comparison; do not auto-merge.
Safe future plan: fetch GitHub main exact bytes at pinned HEAD; verify blob SHA; identify common ancestor and compare all IDs/values/order; union only distinct facility IDs with verified origin; retain GitHub-only records and UI; regenerate index/new-arrivals/sitemap; verify all blob SHA, JS and CSV; commit only after human review.
Do not overwrite main wholesale. No GitHub writes this run.
