/* STAY SELECT: safely add saved favorites to existing comparison tray */
(()=>{'use strict';
const trigger=document.getElementById('ss-favorites-compare'),status=document.getElementById('ss-favorites-compare-status');
if(!trigger||!status)return;
const key='stayselect:favorites:v1';
const cards=[...document.querySelectorAll('.ss-stay[data-stay-id]')];
const byId=new Map(cards.map(c=>[c.dataset.stayId,c]));
trigger.addEventListener('click',()=>{
 let favorites=[];
 try{const parsed=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(parsed))favorites=[...new Set(parsed.filter(id=>typeof id==='string'&&byId.has(id)))];}
 catch(_){status.textContent='端末内の保存データを読み込めませんでした。';return;}
 if(!favorites.length){status.textContent='保存済みの宿がありません。先に「☆ あとで見る」で宿を保存してください。';return;}
 let added=0,already=0;
 for(const id of favorites){
  const button=byId.get(id)?.querySelector('.ss-compare-pick');
  if(!button)continue;
  if(button.getAttribute('aria-pressed')==='true'){already++;continue;}
  if(button.disabled)break;
  button.click();added++;
 }
 const chosen=cards.filter(c=>c.querySelector('.ss-compare-pick')?.getAttribute('aria-pressed')==='true').length;
 status.textContent=added?`${added}施設を比較候補に追加しました（現在${chosen}/4施設）。比較するボタンから確認できます。`:
  (chosen>=4?'比較候補は最大4施設です。先に候補を外してください。':'保存済みの宿は比較候補に追加済みです。');
});
})();