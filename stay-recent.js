/* STAY SELECT | 2026-10-17 08:18 | browser-only recently viewed stays */
(()=>{'use strict';
const KEY='stayselect:recent:v1',MAX=8;
const panel=document.getElementById('ss-recent-panel');
const list=document.getElementById('ss-recent-list');
const clear=document.getElementById('ss-recent-clear');
const count=document.getElementById('ss-recent-count');
if(!panel||!list||!clear||!count)return;
const cards=[...document.querySelectorAll('#stay-list .ss-stay[data-stay-id]')];
const byId=new Map(cards.map(card=>[card.dataset.stayId,card]));
function read(){
 try{
  const raw=JSON.parse(localStorage.getItem(KEY)||'[]');
  if(!Array.isArray(raw))return [];
  return [...new Set(raw.filter(id=>typeof id==='string'&&byId.has(id)))].slice(0,MAX);
 }catch(_){return []}
}
function render(){
 const ids=read();list.replaceChildren();panel.hidden=ids.length===0;
 count.textContent=`${ids.length}施設`;
 for(const id of ids){
  const card=byId.get(id);
  const title=card.querySelector('h2')?.textContent?.trim()||'宿泊施設';
  const pref=card.dataset.pref||'所在地未確認';
  const kind=card.dataset.kind||'宿泊施設';
  const a=document.createElement('a');a.className='ss-recent-card';
  a.href='../stay/?id='+encodeURIComponent(id);
  const meta=document.createElement('small');meta.textContent=`${pref} / ${kind}`;
  const name=document.createElement('strong');name.textContent=title;
  const arrow=document.createElement('span');arrow.textContent='詳細・確認事項を見る →';
  a.append(meta,name,arrow);list.appendChild(a);
 }
}
clear.addEventListener('click',()=>{
 try{localStorage.removeItem(KEY)}catch(_){/* Storage unavailable. */}
 render();
});
window.addEventListener('pageshow',render);
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null)render()});
render();
})();
