(()=>{'use strict';
const $=id=>document.getElementById(id),rows=JSON.parse($('cc-data').textContent),KEY='stayselect:conditions-check:20261019-2140',list=$('cc-list'),status=$('cc-status');
const fields=[['child','子ども・乳幼児'],['pet','ペット同伴'],['meal','食事制限・アレルギー'],['barrier','段差・バリアフリー'],['parking','駐車場'],['privatebath','貸切風呂']];
const choices=[['','未確認'],['yes','対応可と確認'],['no','対応不可と確認'],['na','該当なし']];
if(rows.length!==38||new Set(rows.map(x=>x.id)).size!==38){status.textContent='施設データの不整合';return;}
const byId=new Map(rows.map(x=>[x.id,x]));let saved={};
try{const o=JSON.parse(localStorage.getItem(KEY)||'{}');if(o&&typeof o==='object'&&!Array.isArray(o))saved=o}catch(_){status.textContent='保存済みデータを読み込めませんでした。'}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=v=>{const o={};for(const [f] of fields)o[f]=choices.some(x=>x[0]===v?.[f])?v[f]:'';o.note=String(v?.note||'').slice(0,2000);o.date=/^\d{4}-\d{2}-\d{2}$/.test(String(v?.date||''))?v.date:'';return o};
for(const [id,val] of Object.entries(saved)){if(byId.has(id))saved[id]=clean(val);else delete saved[id]}
const get=id=>saved[id]||clean({});
const done=o=>fields.every(([f])=>o[f]!==''),touched=o=>fields.some(([f])=>o[f]!=='')||!!o.note||!!o.date;
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(saved));status.textContent='この端末に保存しました。予約や問い合わせは送信していません。'}catch(e){status.textContent='保存できません。ブラウザ設定・空き容量を確認してください。'}};
for(const a of [...new Set(rows.map(x=>x.area))]){const opt=document.createElement('option');opt.value=a;opt.textContent=a;$('cc-area').append(opt)}
const norm=s=>String(s||'').normalize('NFKC').toLowerCase();
const filtered=()=>rows.filter(x=>{const o=get(x.id),f=$('cc-filter').value;return (!$('cc-area').value||x.area===$('cc-area').value)&&(!$('cc-q').value||norm([x.name,x.pref,x.area,x.kind].join(' ')).includes(norm($('cc-q').value)))&&(!f||(f==='untouched'?!touched(o):f==='pending'?!done(o):done(o)))});
function card(x){const o=get(x.id),complete=done(o),opts=(field)=>choices.map(([v,l])=>`<option value="${v}"${o[field]===v?' selected':''}>${l}</option>`).join('');return `<article class="card" data-id="${esc(x.id)}"><div class="card-top"><div><div class="meta">${esc(x.pref)} · ${esc(x.area)} · ${esc(x.kind)}</div><h2>${esc(x.name)}</h2></div><span class="badge ${complete?'':'pending'}">${complete?'6項目確認済み':'確認途中'}</span></div><div class="grid">${fields.map(([f,label])=>`<label>${esc(label)}<select data-field="${f}" aria-label="${esc(x.name)}の${esc(label)}">${opts(f)}</select></label>`).join('')}</div><div class="notes"><label>確認内容・注意事項<textarea data-field="note" maxlength="2000" placeholder="宿に確認した条件・注意事項（個人情報は入力しない）">${esc(o.note)}</textarea></label></div><div class="date"><label>確認した日 <input type="date" data-field="date" value="${esc(o.date)}"></label></div><div class="bottom"><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${x.direct?'宿公式本文':'協会・組合公式掲載'}で再確認 ↗</a><a href="./stay/?id=${encodeURIComponent(x.id)}">施設の詳細 →</a></div></article>`}
function render(){const view=filtered();list.innerHTML=view.map(card).join('');$('cc-visible').textContent=view.length;$('cc-done').textContent=rows.filter(x=>done(get(x.id))).length;$('cc-noted').textContent=rows.filter(x=>touched(get(x.id))).length;$('cc-empty').hidden=view.length!==0;}
list.addEventListener('change',ev=>{const el=ev.target,id=el.closest('[data-id]')?.dataset.id,f=el.dataset.field;if(!id||!byId.has(id)||!f)return;const o=get(id);o[f]=f==='date'?el.value:el.value;saved[id]=clean(o);persist();render()});
list.addEventListener('input',ev=>{const el=ev.target,id=el.closest('[data-id]')?.dataset.id;if(el.dataset.field!=='note'||!id||!byId.has(id))return;const o=get(id);o.note=el.value;saved[id]=clean(o);persist();$('cc-noted').textContent=rows.filter(x=>touched(get(x.id))).length;});
for(const id of ['cc-q','cc-area','cc-filter'])$(id).addEventListener(id==='cc-q'?'input':'change',render);
$('cc-reset').addEventListener('click',()=>{$('cc-q').value='';$('cc-area').value='';$('cc-filter').value='';render()});
const cell=v=>{const s=String(v??'');return /^[=+\-@\t\r]/.test(s)?'\''+s:s};
const csv=arr=>{const all=[['施設ID','施設名','都道府県','エリア','宿タイプ',...fields.map(x=>x[1]),'確認日','確認メモ','公式参照URL','宿独自公式本文直接確認'],...arr.map(x=>{const o=get(x.id);return [x.id,x.name,x.pref,x.area,x.kind,...fields.map(([f])=>choices.find(v=>v[0]===o[f])?.[1]||'未確認'),o.date,o.note,x.url,x.direct?'確認済み':'未確認']})];return '\uFEFF'+all.map(r=>r.map(v=>'"'+cell(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n'};
const download=(name,content,type)=>{const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)};
$('cc-csv').addEventListener('click',()=>{const a=filtered();download('stay-select-conditions-'+a.length+'.csv',csv(a),'text/csv;charset=utf-8');status.textContent=a.length+'施設のCSVを保存しました。'});
$('cc-json').addEventListener('click',()=>{download('stay-select-conditions-backup.json',JSON.stringify({schema:'stayselect-conditions-v1',exported_at:new Date().toISOString(),entries:saved},null,2),'application/json;charset=utf-8');status.textContent='JSONを保存しました。個人メモが含まれるため共有に注意してください。'});
$('cc-import').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>1000000)throw Error('1MBを超えるファイルは読み込めません');const d=JSON.parse(await file.text());if(d.schema!=='stayselect-conditions-v1'||!d.entries||typeof d.entries!=='object'||Array.isArray(d.entries))throw Error('形式が違います');let count=0;for(const [id,o] of Object.entries(d.entries)){if(byId.has(id)){saved[id]=clean(o);count++}}persist();render();status.textContent=count+'施設の記録を復元しました。'}catch(err){status.textContent='読み込みに失敗しました：'+err.message}finally{e.target.value=''}});
render();
})();
