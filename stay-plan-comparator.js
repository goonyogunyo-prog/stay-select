(()=>{'use strict';
const $=id=>document.getElementById(id),stays=JSON.parse($('plan-data').textContent);
if(stays.length!==38||new Set(stays.map(x=>x.id)).size!==38)throw Error('宿データ38件の整合性エラー');
const KEY='stayselect:plan-comparator:20261019-2344',map=new Map(stays.map(x=>[x.id,x]));
const fields=['trip-date','people','a-name','a-price','a-meals','a-cancel','b-name','b-price','b-meals','b-cancel'];
let saved={},current=stays[0].id;
const cleanText=(x,n)=>String(x??'').slice(0,n),money=x=>Number.isFinite(x)?Math.round(x).toLocaleString('ja-JP')+'円':'未入力';
function clean(v){
 v=v&&typeof v==='object'&&!Array.isArray(v)?v:{};const x={};
 for(const f of fields)x[f]=cleanText(v[f],f.endsWith('cancel')?600:240);
 const num=Number(x.people);x.people=String(Number.isInteger(num)&&num>=1&&num<=30?num:2);
 for(const f of ['a-price','b-price']){const n=Number(x[f]);if(!/^[0-9]+$/.test(x[f])||!Number.isSafeInteger(n)||n>10000000)x[f]='';}
 if(x['trip-date']&&!/^\d{4}-\d{2}-\d{2}$/.test(x['trip-date']))x['trip-date']='';return x;
}
try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))for(const [k,x]of Object.entries(v))if(map.has(k))saved[k]=clean(x)}catch(_){}
const get=id=>clean(saved[id]||{});
function notify(s){$('status').textContent=s}
function store(){try{localStorage.setItem(KEY,JSON.stringify(saved));return true}catch(_){notify('保存できませんでした。JSONバックアップをお試しください。');return false}}
function read(){const v={};for(const f of fields)v[f]=$(f).value;return clean(v)}
function populated(v){return ['a-name','a-price','a-meals','a-cancel','b-name','b-price','b-meals','b-cancel'].some(k=>v[k]!=='')}
function stats(){$('stat-total').textContent=stays.length;$('stat-written').textContent=stays.filter(s=>populated(get(s.id))).length;$('stat-paired').textContent=stays.filter(s=>get(s.id)['a-price']!==''&&get(s.id)['b-price']!=='').length}
function calc(){const v=read(),people=Number(v.people),a=v['a-price']===''?NaN:Number(v['a-price'])*people,b=v['b-price']===''?NaN:Number(v['b-price'])*people;$('total-a').textContent=money(a);$('total-b').textContent=money(b);$('difference').textContent=Number.isFinite(a)&&Number.isFinite(b)?(a===b?'2プランの総額は同じです。':`${a<b?'A':'B'}が ${money(Math.abs(a-b))} 安い（${people}人分）。`):'AとBの両方の料金を入力すると差額を表示します。'}
function draw(){const area=$('filter-area').value,q=$('filter-q').value.normalize('NFKC').toLowerCase().trim(),list=$('hotels');list.replaceChildren();let count=0;for(const s of stays){if(area&&s.area!==area)continue;if(q&&!`${s.name} ${s.pref} ${s.area}`.normalize('NFKC').toLowerCase().includes(q))continue;count++;const b=document.createElement('button');b.type='button';b.className='hotel'+(s.id===current?' active':'');b.dataset.id=s.id;const title=document.createElement('b');title.textContent=s.name;const sub=document.createElement('span');sub.textContent=s.pref+' / '+s.area;const tag=document.createElement('i');tag.textContent=populated(get(s.id))?'比較メモあり':'未入力';b.append(title,sub,tag);b.addEventListener('click',()=>{save(false);current=s.id;show();draw()});list.append(b)}$('filter-count').textContent=count+'件を表示';if(!count){const p=document.createElement('p');p.className='muted';p.textContent='一致する宿はありません。';list.append(p)}}
function show(){const s=map.get(current),v=get(current);$('selected-name').textContent=s.name;$('selected-meta').textContent=s.pref+' / '+s.area+' / '+(s.direct?'宿独自公式本文を直接取得':'協会・組合公式掲載のみ');$('official').href=s.url;for(const f of fields)$(f).value=v[f];calc()}
function save(message=true){saved[current]=read();const ok=store();stats();draw();if(message)notify(ok?'保存しました（この端末内のみ）。':'保存に失敗しました。')}
for(const f of fields)$(f).addEventListener('input',()=>{calc();saved[current]=read();store();stats()});
$('save').addEventListener('click',()=>save());$('clear').addEventListener('click',()=>{delete saved[current];store();show();draw();stats();notify('この宿の入力を消去しました。')});
$('filter-area').addEventListener('change',draw);$('filter-q').addEventListener('input',draw);
function csvCell(x){let s=String(x??'').replace(/[\r\n\t]+/g,' ').trim();if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
function download(content,name,type){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1200)}
$('csv').addEventListener('click',()=>{save(false);const header=['施設ID','施設名','都道府県','エリア','宿泊予定日','人数','Aプラン名','A料金（1人）','A食事・部屋','Aキャンセル確認','Bプラン名','B料金（1人）','B食事・部屋','Bキャンセル確認','A総額','B総額','差額（B-A）'];const rows=stays.map(s=>{const v=get(s.id),a=v['a-price']===''?'':Number(v['a-price'])*Number(v.people),b=v['b-price']===''?'':Number(v['b-price'])*Number(v.people);return [s.id,s.name,s.pref,s.area,v['trip-date'],v.people,v['a-name'],v['a-price'],v['a-meals'],v['a-cancel'],v['b-name'],v['b-price'],v['b-meals'],v['b-cancel'],a,b,a!==''&&b!==''?b-a:'']});download('\ufeff'+[header,...rows].map(r=>r.map(csvCell).join(',')).join('\r\n')+'\r\n','stay-select-plan-comparison-38.csv','text/csv;charset=utf-8');notify('38施設分のCSVを保存しました。')});
$('json').addEventListener('click',()=>{save(false);download(JSON.stringify({app:'STAY SELECT plan comparator',version:1,stays:saved},null,2),'stay-select-plan-comparison-backup.json','application/json;charset=utf-8');notify('JSONバックアップを保存しました。')});
$('import').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>2e6)throw Error('ファイルが大きすぎます');const obj=JSON.parse(await f.text());if(obj?.app!=='STAY SELECT plan comparator'||obj.version!==1||!obj.stays||typeof obj.stays!=='object'||Array.isArray(obj.stays))throw Error('バックアップ形式が異なります');let n=0;for(const [id,v]of Object.entries(obj.stays))if(map.has(id)){saved[id]=clean(v);n++}store();show();stats();draw();notify(n+'施設の記録を復元しました。')}catch(e){notify('復元できません：'+e.message)}finally{e.target.value=''}});
for(const area of [...new Set(stays.map(s=>s.area))].sort()){const o=document.createElement('option');o.value=area;o.textContent=area;$('filter-area').append(o)}show();stats();draw();
})();
