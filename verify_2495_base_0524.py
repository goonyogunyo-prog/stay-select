"""STAY SELECT 2495件起点の復旧確認専用。検証のみ、上書き・自動マージしない。"""
import hashlib,json,zipfile,unicodedata,sys
from pathlib import Path
EXPECTED='cab110914952c67270e032a9d32b81788c88158b5f2f6167a69cefc9babb3a21'
if len(sys.argv)!=3:
 print('Usage: python verify_2495_base_0524.py <2495-base.zip> <staged-patch.zip>');sys.exit(2)
base,patch=map(Path,sys.argv[1:]);assert base.is_file() and patch.is_file(),'ZIP missing'
assert hashlib.sha256(base.read_bytes()).hexdigest()==EXPECTED,'base SHA256 mismatch'
def norm(s):return ''.join(c for c in unicodedata.normalize('NFKC',s).casefold() if not(c.isspace() or unicodedata.category(c)[0] in ('P','S')))
with zipfile.ZipFile(base) as z:
 assert z.testzip() is None and len(z.namelist())==721,'base ZIP CRC or count mismatch'
 data=json.loads(z.read('data/stays.json'));assert len(data['stays'])==2495
 existing=data['stays']
with zipfile.ZipFile(patch) as z:
 assert z.testzip() is None
 staged=[]
 for tm in ('0226','0323','0419','0524'):
  data=json.loads(z.read(f'data/candidate-38-20261020-{tm}.json'))
  a=data['stays'] if isinstance(data,dict) else data
  assert len(a)==38
  staged.extend(a)
 assert len(staged)==152
names={};dups=[]
for x in existing+staged:
 k=norm(x['name'])
 if k in names:dups.append((x['name'],names[k]))
 else:names[k]=x['name']
print(json.dumps({'base_2495_sha256_verified':True,'base_721_crc_verified':True,'candidate_count':len(staged),'all_names':len(existing)+len(staged),'normalized_duplicates':dups,'safe_to_merge':not dups},ensure_ascii=False,indent=2))
if dups:sys.exit(1)
print('名前照合成功。施設の営業状況・同一住所による別名重複・URL・楽天成果URLは別途確認してください。')
