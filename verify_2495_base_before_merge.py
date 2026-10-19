#!/usr/bin/env python3
"""Fail-closed integrity check. Does NOT modify or merge any site files.
Usage: python verify_2495_base_before_merge.py BASE_2495.zip GITHUB_SHA_DIFF.txt
"""
import sys,zipfile,json,hashlib,re,unicodedata,pathlib
EXPECTED_SHA='cab110914952c67270e032a9d32b81788c88158b5f2f6167a69cefc9babb3a21'
EXPECTED_FILES=721; EXPECTED_STAYS=2495

def norm(s):
 return ''.join(c for c in unicodedata.normalize('NFKC',s).casefold() if not c.isspace() and unicodedata.category(c)[0] not in 'ZPS')

def gitsha(data):return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()

def main():
 if len(sys.argv)!=3:raise SystemExit('Usage: python verify_2495_base_before_merge.py BASE_2495.zip GITHUB_SHA_DIFF.txt')
 zpath,diffpath=map(pathlib.Path,sys.argv[1:]); assert zpath.is_file() and diffpath.is_file(),'Required source files missing'
 assert hashlib.sha256(zpath.read_bytes()).hexdigest()==EXPECTED_SHA,'Base ZIP SHA256 mismatch; STOP'
 lines=diffpath.read_text(encoding='utf-8').splitlines(); expected={}
 for line in lines:
  p=[x.strip() for x in line.split('|')]
  if len(p)==4 and re.fullmatch('[0-9a-f]{40}',p[-1]):expected[p[1]]=p[-1]
 assert len(expected)==EXPECTED_FILES,f'Expected {EXPECTED_FILES} Git blob SHA rows; found {len(expected)}; STOP'
 with zipfile.ZipFile(zpath) as z:
  files=[i for i in z.infolist() if not i.is_dir()];assert len(files)==EXPECTED_FILES,'ZIP file count mismatch'
  assert len({i.filename for i in files})==EXPECTED_FILES,'Duplicate ZIP filenames'
  assert z.testzip() is None,'CRC failure'
  for i in files:
   assert not i.filename.startswith('/') and '..' not in pathlib.PurePosixPath(i.filename).parts,'Unsafe ZIP path'
   assert gitsha(z.read(i))==expected.get(i.filename),f'Git blob mismatch: {i.filename}'
  stays=json.loads(z.read('data/stays.json'))['stays'];assert len(stays)==EXPECTED_STAYS,'Stay count mismatch'
  assert all(s['id']==f'stay-{i:03d}' for i,s in enumerate(stays,1)),'ID continuity failure'
  candidates=json.loads((pathlib.Path(__file__).parent/'data'/'candidate-38-20261020-0226.json').read_text(encoding='utf-8'))
  assert len(candidates)==38,'Candidate count mismatch'
  norms=[norm(s['name']) for s in stays]+[norm(s['name']) for s in candidates]
  assert len(set(norms))==len(norms),'Normalized duplicate with latest base; STOP'
  assert all(not x['business_hotel'] and not x['independent_hotel_official_body_fetched'] for x in candidates)
 print('PASS: 721/721 ZIP Git blob SHA; CRC; SHA256; 2495 base stays; 38 candidate names collision-free (2533 total).')
if __name__=='__main__':main()
