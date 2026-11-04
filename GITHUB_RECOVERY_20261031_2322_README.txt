STAY SELECT 2026-10-31 23:22 JST GitHub-only offline recovery

1. Keep 2026-10-31 22:22 audited cumulative ZIP as immutable baseline.
2. Get the pinned main commit's recursive tree JSON and GitHub source archive ZIP.
3. Run tools/merge_github_only_safe.py using the command shown in stay-github-recovery.html.
4. The script verifies ALL GitHub archive blob SHA1 values against the tree, ALL old local ZIP bytes against optional manifest, and CRC for both ZIPs.
5. GitHub-only files are appended; existing local paths are never overwritten. Four known same-path conflicts are preserved and reported.
6. Without --preserve-local-conflicts the script refuses output if ANY conflicts exist.
7. Even if a ZIP is produced, manual conflict resolution and deployment review are still required. No GitHub writes.
8. Do not add booking CTAs for unverified Rakuten search URLs; preserve 33 existing affiliate links and all 12,254 original JSON records.

Current GitHub HEAD (start audit): 88979175bd151bdba6949c517f0e50c653eb053e
Tree snapshot: 1268 entries, 1258 blobs, truncated=false, FNV1a32=1522b89e
Previously observed missing GitHub-only 247 (provisional), same-path conflicts 4.
This run does not claim the 247 missing files have been restored. The script needs the GitHub commit archive and tree JSON as input.
