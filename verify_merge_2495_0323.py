#!/usr/bin/env python3
"""STAY SELECT: fail-closed integrity validation + NON-DESTRUCTIVE optional merge.
Usage:
 python verify_merge_2495_0323.py 2495_base.zip 0123_GITHUB_SHA_DIFF.txt 0323_SAFE_PATCH.zip [output.zip]
Without output.zip this performs verification only. It never changes data/stays.json.
"""
from __future__ import annotations
import hashlib,json,re,sys,zipfile,unicodedata
from pathlib import Path
EXPECTED_BASE_SHA='cab110914952c67270e032a9d32b81788c88158b5f2f6167a69cefc9babb3a21'
EXPECTED_COUNT=721

def blob(data:bytes)->str:return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
def norm(s:str)->str:return ''.join(c for c in unicodedata.normalize('NFKC',s).casefold() if not c.isspace() and unicodedata.category(c)[0] not in 'ZPS')
def checked_zip(path:Path)->dict[str,bytes]:
 with zipfile.ZipFile(path) as z:
  assert z.testzip() is None,f'CRC failure {path}'
  names=z.namelist();assert len(names)==len(set(names)),'duplicate ZIP names'
  assert all(not x.startswith('/') and '..' not in Path(x).parts and not x.endswith('/') for x in names),'unsafe ZIP path'
  return {n:z.read(n) for n in names}
def main():
 if len(sys.argv) not in (4,5):raise SystemExit(__doc__)
 base,diff,patch=map(Path,sys.argv[1:4]);out=Path(sys.argv[4]) if len(sys.argv)==5 else None
 assert all(p.is_file() for p in [base,diff,patch]),'Missing file; STOP'
 assert hashlib.sha256(base.read_bytes()).hexdigest()==EXPECTED_BASE_SHA,'2495 base SHA256 mismatch; STOP'
 original=checked_zip(base);assert len(original)==EXPECTED_COUNT,'2495 base file count mismatch; STOP'
 sha_map={}
 for line in diff.read_text('utf-8').splitlines():
  p=[s.strip() for s in line.split('|')]
  if len(p)==4 and re.fullmatch(r'[0-9a-f]{40}',p[-1]):sha_map[p[1]]=p[-1]
 assert len(sha_map)==EXPECTED_COUNT,'0123 SHA_DIFF missing/invalid entries; STOP'
 assert set(sha_map)==set(original),'0123 SHA_DIFF file paths differ; STOP'
 for n,b in original.items():assert blob(b)==sha_map[n],f'0123 Git blob mismatch: {n}; STOP'
 stays=json.loads(original['data/stays.json'])['stays'];assert len(stays)==2495,'2495 stays count mismatch; STOP'
 assert all(x['id']==f'stay-{i:03d}' for i,x in enumerate(stays,1)),'ID continuity failure; STOP'
 assert len({norm(x['name']) for x in stays})==len(stays),'Base normalized name duplicate; STOP'
 addon=checked_zip(patch)
 staged=[]
 for n in ('data/candidate-38-20261020-0226.json','data/candidate-38-20261020-0323.json'):
  assert n in addon,n+' missing';items=json.loads(addon[n]);assert len(items)==38
  assert all(x['verification_level']=='association_or_ryokan_union_official_listing_only' and x['independent_hotel_official_body_fetched'] is False and x['business_hotel'] is False for x in items)
  staged+=items
 norm_all=[norm(x['name']) for x in stays+staged]
 if len(set(norm_all))!=len(norm_all):
  seen={};dups=[]
  for x in stays+staged:
   k=norm(x['name'])
   if k in seen:dups.append((seen[k],x['name']))
   else:seen[k]=x['name']
  raise RuntimeError(f'Staged candidate duplicate against 2495 base or each other: {dups[:20]}; STOP. Remove/replace candidates only after re-verification.')
 # No existing file is overwritten, and no hotel candidate is silently inserted into live data.
 allowed={k:v for k,v in addon.items() if k not in original}
 assert all(k not in original for k in allowed)
 if out:
  assert not out.exists(),'Output already exists; STOP'
  with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
   for n,b in original.items():z.writestr(n,b)
   for n,b in allowed.items():z.writestr(n,b)
  check=checked_zip(out)
  assert all(check[n]==b for n,b in original.items()),'Base bytes not preserved; STOP'
  print(f'PASS: created {out}; {len(original)} original files byte-identical; {len(allowed)} additive files; live stays still 2495; 76 candidates staged only.')
 else:print('PASS: 2495 ZIP SHA256/CRC/721 Git blob SHA, NFKC uniqueness, 76 staged candidates collision-free. No writes.')
if __name__=='__main__':main()
