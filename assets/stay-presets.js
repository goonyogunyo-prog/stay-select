/* STAY SELECT | saved searches | 2026-10-17 10:25 JST */
(()=>{'use strict';
const root=document.getElementById('ss-search-presets');
const form=document.getElementById('stay-filters');
if(!root||!form)return;
const KEY='stayselect:search-presets:v1',MAX=5;
const fields=['q','region','pref','kind','detail','access','booking'];
const nameInput=document.getElementById('ss-preset-name');
const saveButton=document.getElementById('ss-preset-save');
const list=document.getElementById('ss-preset-list');
const status=document.getElementById('ss-preset-status');
const sort=document.getElementById('ss-sort');
const favoritesOnly=document.getElementById('ss-favorites-only');
const allowedSort=new Set(['default','name','pref','matched','affiliate','detail','saved']);
let entries=[];
let storageWorks=true;
function normalize(raw){
 if(!Array.isArray(raw))return [];
 return raw.filter(x=>x&&typeof x==='object'&&typeof x.id==='string'&&typeof x.name==='string'&&x.filters&&typeof x.filters==='object').slice(0,MAX).map(x=>({
  id:x.id.slice(0,70),name:x.name.slice(0,24),
  filters:Object.fromEntries(fields.map(k=>[k,typeof x.filters[k]==='string'?x.filters[k].slice(0,120):''])),
  sort:allowedSort.has(x.sort)?x.sort:'default',saved:x.saved===true
 }));
}
try{entries=normalize(JSON.parse(localStorage.getItem(KEY)||'[]'))}catch(_){storageWorks=false;entries=[];}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(entries));storageWorks=true;return true}catch(_){storageWorks=false;return false}}
function snapshot(){return {filters:Object.fromEntries(fields.map(k=>[k,document.getElementById(k)?.value||''])),sort:sort?.value||'default',saved:!!favoritesOnly?.checked}}
function defaultName(state){const a=[];for(const k of ['pref','region','kind','q']){const value=state.filters[k]?.trim();if(value)a.push(value)}if(state.filters.booking==='affiliate')a.push('PR');else if(state.filters.booking==='matched')a.push('楽天照合');if(state.saved)a.push('保存済み');return a.join('・').slice(0,24)||'全国の宿';}
function announce(message){status.textContent=message;}
function render(){
 list.replaceChildren();
 for(const entry of entries){
  const row=document.createElement('li');row.className='ss-preset-row';
  const open=document.createElement('button');open.type='button';open.className='ss-preset-open';open.textContent=entry.name;open.setAttribute('aria-label',`保存した検索条件「${entry.name}」を呼び出す`);
  open.addEventListener('click',()=>restore(entry));
  const del=document.createElement('button');del.type='button';del.className='ss-preset-remove';del.textContent='削除';del.setAttribute('aria-label',`保存した検索条件「${entry.name}」を削除する`);
  del.addEventListener('click',()=>{entries=entries.filter(e=>e.id!==entry.id);const saved=persist();render();announce(`「${entry.name}」を削除しました。${saved?'':'端末への保存はできていません。'}`)});
  row.append(open,del);list.appendChild(row);
 }
 root.dataset.hasPresets=String(entries.length>0);
 document.getElementById('ss-preset-count').textContent=`${entries.length}/${MAX}件保存中`;
}
function restore(entry){
 for(const k of fields){const el=document.getElementById(k);if(!el)continue;
  const v=entry.filters[k]||'';
  if(el.tagName==='SELECT')el.value=[...el.options].some(o=>o.value===v)?v:'';
  else el.value=v;
 }
 if(sort)sort.value=entry.sort;
 if(favoritesOnly)favoritesOnly.checked=entry.saved;
 // Directory, filter chips, discovery counters and URL share all listen to these events.
 form.dispatchEvent(new Event('change',{bubbles:true}));
 sort?.dispatchEvent(new Event('change',{bubbles:true}));
 favoritesOnly?.dispatchEvent(new Event('change',{bubbles:true}));
 announce(`「${entry.name}」の検索条件を呼び出しました。`);
}
saveButton.addEventListener('click',()=>{
 const state=snapshot();const name=(nameInput.value.trim().replace(/\s+/g,' ').slice(0,24)||defaultName(state));
 const signature=JSON.stringify({filters:state.filters,sort:state.sort,saved:state.saved});
 const duplicate=entries.find(x=>JSON.stringify({filters:x.filters,sort:x.sort,saved:x.saved})===signature);
 if(duplicate){entries=entries.filter(x=>x.id!==duplicate.id)}
 entries.unshift({id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,8),name, ...state});
 entries=entries.slice(0,MAX);const saved=persist();render();nameInput.value='';
 announce(`「${name}」を保存しました。${saved?'':'このページを閉じると消える可能性があります。'}`);
});
render();
if(!storageWorks)announce('この端末の保存領域を読み込めませんでした。保存した条件は引き継げない場合があります。');
})();
