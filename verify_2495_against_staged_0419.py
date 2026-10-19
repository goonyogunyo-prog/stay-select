#!/usr/bin/env python3
"""Validate a recovered 2495 ZIP and 114 staged candidate names before merging.
Usage: python verify_2495_against_staged_0419.py FULL_2495.zip 0123_GITHUB_SHA_DIFF.txt PATCH_0419.zip
Read-only: does not modify inputs or production stays.json.
"""
import sys,zipfile,json,csv,io,hashlib,unicodedata
if len(sys.argv)!=4: raise SystemExit(__doc__)
full,diff,patch=sys.argv[1:]
def norm(s):return ''.join(c for c in unicodedata.normalize('NFKC',s).casefold() if unicodedata.category(c)[0] not in 'ZPS')
def git(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
expected='cab110914952c67270e032a9d32b81788c88158b5f2f6167a69cefc9babb3a21'
assert hashlib.sha256(open(full,'rb').read()).hexdigest()==expected,'Wrong full base SHA256'
rows={}
for line in open(diff,encoding='utf-8'):
 p=line.rstrip('\n').split(' | ')
 if len(p)==4 and p[0] in ('一致','変更','未存在'):
  rows[p[1]]=p[3]
assert len(rows)==721,f'SHA_DIFF has {len(rows)} entries, expected 721'
with zipfile.ZipFile(full) as z:
 assert z.testzip() is None and len(z.namelist())==721
 assert len(set(z.namelist()))==721
 assert set(z.namelist())==set(rows)
 assert all(git(z.read(n))==rows[n] for n in z.namelist()),'Full ZIP Git blob SHA mismatch'
 full_names=[x['name'] for x in json.loads(z.read('data/stays.json'))['stays']]
 assert len(full_names)==2495
with zipfile.ZipFile(patch) as z:
 assert z.testzip() is None
 stage=[]
 for stamp in ('0226','0323','0419'):
  f='data/candidate-38-20261020-'+stamp+'.csv'
  stage.extend(list(csv.DictReader(io.StringIO(z.read(f).decode('utf-8-sig')))))
 assert len(stage)==114
 keys=[norm(x) for x in full_names]+[norm(x['name']) for x in stage]
 assert len(keys)==len(set(keys)),'DUPLICATE: DO NOT MERGE'
 print('PASS: 721/721 full base Git blob SHA and 2495 full base + 114 staged normalized names all unique')
 print('NOTE: alias review, official conditions, and current GitHub HEAD check still required')
