/* STAY SELECT | 3 candidates from current filters | 2026-10-17 */
(()=>{'use strict';
 const list=document.getElementById('stay-list');
 const pick=document.getElementById('ss-triplet-pick');
 const compare=document.getElementById('ss-triplet-compare');
 const result=document.getElementById('ss-triplet-results');
 const status=document.getElementById('ss-triplet-status');
 if(!list||!pick||!compare||!result||!status)return;
function regionMatches(card,chosen){if(!chosen)return true;let r=card.dataset.region;if(r==='北陸・甲信越')r='甲信越・北陸';if(r==='中国・四国')r=['香川県','徳島県','愛媛県','高知県'].includes(card.dataset.pref)?'四国':'中国';return r===chosen;}
 const get=id=>document.getElementById(id);
 const val=id=>get(id)?.value||'';
 const key='stayselect:favorites:v1';
 let current=[];
 function eligible(){
  const q=val('q').trim().toLocaleLowerCase();
  const latestMax=Math.max(0,...[...list.querySelectorAll('.ss-stay[data-stay-id]')].map(x=>Number(x.dataset.stayId?.split('-').pop())||0));
  let favs=new Set();
  if(get('ss-favorites-only')?.checked){try{const a=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(a))favs=new Set(a.filter(x=>typeof x==='string'))}catch(_){}}
  let notes={};try{const parsed=JSON.parse(localStorage.getItem('stayselect:notes:v1')||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))notes=parsed;}catch(_){}
  const notesOnly=Boolean(get('ss-note-only')?.checked),notesNeedle=(get('ss-note-query')?.value||'').trim().toLocaleLowerCase();
  return [...list.querySelectorAll('.ss-stay[data-stay-id]')].filter(c=>
   (!get('ss-new-only')?.checked||Number(c.dataset.stayId?.split('-').pop())>latestMax-38)&&
   (get('ss-business-toggle')?.checked||c.dataset.kind!=='ビジネスホテル')&&
   (!notesOnly||(typeof notes[c.dataset.stayId]==='string'&&notes[c.dataset.stayId].trim()))&&
   (!notesNeedle||(typeof notes[c.dataset.stayId]==='string'&&notes[c.dataset.stayId].toLocaleLowerCase().includes(notesNeedle)))&&
   (!get('ss-favorites-only')?.checked||favs.has(c.dataset.stayId))&&
   (!q||(c.dataset.search||'').toLocaleLowerCase().includes(q))&&
   regionMatches(c,val('region'))&&
   (!val('pref')||c.dataset.pref===val('pref'))&&
   (!val('kind')||c.dataset.kind===val('kind'))&&
   (!val('detail')||c.dataset.detailed===val('detail'))&&
   (!val('access')||c.dataset.access===val('access'))&&
   (!val('booking')||(val('booking')==='matched'&&!!c.dataset.booking)||(val('booking')==='affiliate'&&c.dataset.booking==='affiliate'))
  );
 }
 function shuffle(items){
  const a=items.slice();
  for(let i=a.length-1;i>0;i--){
   let j;
   if(globalThis.crypto?.getRandomValues){const n=new Uint32Array(1);globalThis.crypto.getRandomValues(n);j=n[0]%(i+1)}
   else j=Math.floor(Math.random()*(i+1));
   [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
 }
 function select(cards){
  // Prefer leisure stays unless the user explicitly requests business hotels.
  const a=shuffle(cards);
  const preferred=val('kind')?a:a.filter(c=>c.dataset.kind!=='ビジネスホテル');
  const pool=preferred.length>=3?preferred:a;
  const picked=[],prefs=new Set(),regions=new Set();
  while(picked.length<3&&pool.length){
   let i=pool.findIndex(c=>!prefs.has(c.dataset.pref)&&!regions.has(c.dataset.region));
   if(i<0)i=pool.findIndex(c=>!prefs.has(c.dataset.pref));
   if(i<0)i=0;
   const c=pool.splice(i,1)[0];picked.push(c);prefs.add(c.dataset.pref);regions.add(c.dataset.region);
  }
  return picked;
 }
 function render(){
  result.replaceChildren();
  for(const c of current){
   const li=document.createElement('li');
   const strong=document.createElement('strong');strong.textContent=c.querySelector('h2')?.textContent||'宿泊施設';
   const small=document.createElement('small');small.textContent=[c.dataset.pref,c.dataset.kind].filter(Boolean).join(' ／ ');
   const a=document.createElement('a');a.href='../stay/?id='+encodeURIComponent(c.dataset.stayId);a.textContent='宿の詳細を見る ↗';
   li.append(strong,small,a);result.append(li);
  }
  compare.disabled=!current.length;
 }
 pick.addEventListener('click',()=>{
  const all=eligible();current=select(all);render();
  status.textContent=all.length?`検索条件に一致する${all.length}施設から${current.length}施設を選びました。表示は価格・評価順ではありません。`:'検索条件に一致する宿がありません。条件を変更してください。';
 });
 compare.addEventListener('click',()=>{
  if(!current.length)return;
  let added=0,existing=0;
  let selected=[];
  try{const raw=JSON.parse(localStorage.getItem('stayselect:compare:v1')||'[]');if(Array.isArray(raw))selected=[...new Set(raw.filter(x=>typeof x==='string'))].slice(0,4)}catch(_){}
  for(const c of current){
   const id=c.dataset.stayId;
   if(selected.includes(id)){existing++;continue}
   if(selected.length>=4)break;
   const b=c.querySelector('.ss-compare-pick');
   if(!b||b.disabled)continue;
   b.click();selected.push(id);added++;
  }
  status.textContent=added?`${added}施設を比較候補に追加しました（既に登録済み${existing}施設）。最大4施設まで比較できます。`:(existing===current.length?'選んだ施設はすべて比較候補に登録済みです。':'比較候補は最大4施設です。既存候補を外してから追加してください。');
 });
 const form=get('stay-filters');
 form?.addEventListener('input',()=>{current=[];render();status.textContent='検索条件が変わりました。もう一度3施設を選んでください。'});
 form?.addEventListener('change',()=>{current=[];render();status.textContent='検索条件が変わりました。もう一度3施設を選んでください。'});
})();
