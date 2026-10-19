/* STAY SELECT | new arrivals compare notes, stored only on device | 2026-10-19 */
(()=>{'use strict';
const root=document.getElementById('na-list'),out=document.getElementById('na-notes-items'),status=document.getElementById('na-notes-status'),count=document.getElementById('na-notes-count'),csv=document.getElementById('na-notes-csv'),clear=document.getElementById('na-notes-clear');
if(!root||!out||!status||!count||!csv||!clear)return;
const cards=[...root.querySelectorAll('.na-card[data-id]')];
if(cards.length!==38){status.textContent='新着件数の不整合で比較メモを停止しました。';return;}
const KEY='stayselect:new-arrivals-notes:20261019-1122',known=new Map(cards.map(c=>[c.dataset.id,c]));
let data={};try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))data=v;}catch(_){}
data=Object.fromEntries(Object.entries(data).filter(([id,x])=>known.has(id)&&x&&typeof x==='object'&&x.url===known.get(id).dataset.url).slice(0,3));
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));return true;}catch(_){status.textContent='端末への保存に失敗しました。ブラウザ設定をご確認ください。';return false;}};
const el=(tag,cls,txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x;};
const cell=v=>{let s=String(v??'').replace(/[\r\n\t]+/g,' ').trim();if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
const buttons=new Map();
function render(){
 out.replaceChildren();const ids=Object.keys(data);count.textContent=ids.length+'/3件';csv.disabled=!ids.length;clear.disabled=!ids.length;
 for(const [id,button] of buttons){const on=ids.includes(id);button.setAttribute('aria-pressed',String(on));button.textContent=on?'比較メモから外す':'比較メモに追加';button.disabled=!on&&ids.length>=3;}
 for(const id of ids){
  const c=known.get(id),name=c.querySelector('h3')?.textContent||'',item=el('article','na-notes-item'),h=el('h3','',name),meta=el('small','',c.dataset.pref+' / '+c.dataset.kind),a=el('a','','公式情報を確認 ↗'),label=el('label','','気になる点・予約前に確認すること'),ta=el('textarea'),remove=el('button','na-notes-remove','候補から外す');
  a.href=c.dataset.url;a.target='_blank';a.rel='noopener noreferrer';ta.value=String(data[id].note||'').slice(0,1000);ta.maxLength=1000;ta.setAttribute('aria-label',name+'の比較メモ');
  ta.addEventListener('input',()=>{data[id].note=ta.value;save();});remove.type='button';remove.addEventListener('click',()=>{delete data[id];save();render();status.textContent='比較候補を解除しました。';});
  label.append(ta);item.append(h,meta,a,label,remove);out.append(item);
 }
}
for(const c of cards){const a=c.querySelector('.na-actions');if(!a)continue;const b=el('button','na-notes-pick','比較メモに追加');b.type='button';b.addEventListener('click',()=>{
 const id=c.dataset.id;if(data[id]){delete data[id];status.textContent='比較候補を解除しました。';}else if(Object.keys(data).length>=3){status.textContent='比較候補は最大3件です。先に候補を解除してください。';return;}else{data[id]={url:c.dataset.url,note:''};status.textContent='比較候補に追加しました。';}save();render();
});a.append(b);buttons.set(c.dataset.id,b);}
csv.addEventListener('click',()=>{
 const ids=Object.keys(data);if(!ids.length){status.textContent='候補が0件のため保存しませんでした。';return;}
 const rows=[['施設ID','施設名','都道府県','宿タイプ','公式参照URL','自分のメモ']];for(const id of ids){const c=known.get(id);rows.push([id,c.querySelector('h3')?.textContent||'',c.dataset.pref,c.dataset.kind,c.dataset.url,data[id].note||'']);}
 const blob=new Blob(['\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='stay-select-compare-notes-'+ids.length+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);status.textContent=ids.length+'件の比較メモをCSV保存しました。';
});
clear.addEventListener('click',()=>{data={};save();render();status.textContent='比較候補をすべて解除しました。';});
save();render();
})();
