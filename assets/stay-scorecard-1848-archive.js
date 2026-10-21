/* STAY SELECT | personal scorecard: user-entered values only | 2026-10-19 */
(()=>{'use strict';
const el=id=>document.getElementById(id),data=JSON.parse(el('sc-data').textContent),list=el('sc-list'),search=el('sc-search'),area=el('sc-area'),sort=el('sc-sort'),status=el('sc-status'),KEY='stayselect:my-scorecard:20261019-1848',fields=[['budget','予算の納得度'],['access','アクセス'],['meal','食事'],['onsen','温泉・設備']];
if(data.length!==38||new Set(data.map(x=>x.id)).size!==38){status.textContent='施設数・IDに不整合があります。';return;}
const norm=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
let state={};try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))state=v;}catch(_){state={};}
const known=new Map(data.map(x=>[x.id,x]));state=Object.fromEntries(Object.entries(state).filter(([id,s])=>known.has(id)&&s?.url===known.get(id).url));
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(_){status.textContent='端末に保存できませんでした。CSVで保存してください。';return false;}};
const node=(tag,cls,txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x;};
const values=x=>fields.map(([k])=>Number(state[x.id]?.[k]||0));const rated=x=>values(x).every(n=>n>=1&&n<=5);const points=x=>rated(x)?values(x).reduce((a,b)=>a+b,0):0;
const cards=new Map();
for(const x of data){
 const card=node('article','sc-card'),meta=node('div','sc-meta',x.pref+' · '+x.area+' · '+x.kind),title=node('h2','',x.name),proof=node('p','sc-source',x.direct?'宿独自公式本文を確認':'公式掲載で確認（宿独自本文未確認）'),grid=node('div','sc-score'),total=node('div','sc-total'),totalLabel=node('span','', '自分の採点'),totalNum=node('strong','', '未採点'),noteLabel=node('label','sc-note','自分用メモ（最大400字）'),note=node('textarea'),links=node('div','sc-links'),link=node('a','','公式参照URL ↗'),detail=node('a','','宿の詳細 →');
 card.dataset.id=x.id;link.href=x.url;link.target='_blank';link.rel='noopener noreferrer';detail.href='./stay/?id='+encodeURIComponent(x.id);links.append(link,detail);total.append(totalLabel,totalNum);
 for(const [key,label] of fields){const wrap=node('label','',label),select=node('select');select.setAttribute('aria-label',x.name+'の'+label);for(let i=0;i<=5;i++){const opt=node('option','',i===0?'未採点':i+'点');opt.value=String(i);select.append(opt);}select.value=String(state[x.id]?.[key]||0);select.addEventListener('change',()=>{const s=state[x.id]||{url:x.url};s[key]=Number(select.value);state[x.id]=s;save();update();});wrap.append(select);grid.append(wrap);}
 note.maxLength=400;note.value=String(state[x.id]?.note||'').slice(0,400);note.setAttribute('aria-label',x.name+'のメモ');note.addEventListener('input',()=>{const s=state[x.id]||{url:x.url};s.note=note.value;state[x.id]=s;save();});noteLabel.append(note);card.append(meta,title,proof,grid,total,noteLabel,links);list.append(card);cards.set(x.id,{card,totalNum});
}
for(const a of [...new Set(data.map(x=>x.area))]){const opt=node('option','',a);opt.value=a;area.append(opt);}
let visible=data;
function update(){
 const needle=norm(search.value),chosen=area.value;visible=data.filter(x=>(!chosen||x.area===chosen)&&(!needle||norm(x.name+' '+x.pref+' '+x.area+' '+x.kind).includes(needle)));
 if(sort.value==='score')visible.sort((a,b)=>Number(rated(b))-Number(rated(a))||points(b)-points(a)||a.name.localeCompare(b.name,'ja'));
 if(sort.value==='name')visible.sort((a,b)=>a.name.localeCompare(b.name,'ja'));
 if(sort.value==='area')visible.sort((a,b)=>a.area.localeCompare(b.area,'ja')||a.name.localeCompare(b.name,'ja'));
 for(const x of data){const {card,totalNum}=cards.get(x.id);card.hidden=!visible.includes(x);totalNum.textContent=rated(x)?points(x)+'/20点':'未採点';}
 for(const x of visible)list.append(cards.get(x.id).card);
 const count=data.filter(rated).length;el('sc-rated').textContent=String(count);el('sc-visible').textContent=String(visible.length);el('sc-empty').hidden=!!visible.length;status.textContent='表示'+visible.length+'件／採点済み'+count+'件。点数は自分で入力した値です。';
}
[search,area,sort].forEach(x=>x.addEventListener(x===search?'input':'change',update));
const csvCell=v=>{let s=String(v??'').replace(/[\r\n\t]+/g,' ').trim();if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
el('sc-export').addEventListener('click',()=>{if(!visible.length){status.textContent='表示0件のためCSVは保存しませんでした。';return;}const rows=[['施設ID','施設名','都道府県','エリア','宿タイプ','予算（自分の点数）','アクセス（自分の点数）','食事（自分の点数）','温泉設備（自分の点数）','合計（20点満点・全項目入力時のみ）','自分のメモ','公式参照URL（楽天成果対象外）']];for(const x of visible)rows.push([x.id,x.name,x.pref,x.area,x.kind,...values(x).map(n=>n||''),rated(x)?points(x):'',state[x.id]?.note||'',x.url]);const content='\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')+'\r\n';const u=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));const a=node('a');a.href=u;a.download='stay-select-my-scorecard-'+visible.length+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),10000);status.textContent=visible.length+'件の自分の評価をCSVに保存しました。';});
el('sc-clear').addEventListener('click',()=>{if(!visible.length)return;for(const x of visible)delete state[x.id];save();for(const x of visible){const c=cards.get(x.id).card;c.querySelectorAll('select').forEach(t=>t.value='0');c.querySelector('textarea').value='';}update();status.textContent='表示中の宿の採点とメモをリセットしました。';});
update();
})();
