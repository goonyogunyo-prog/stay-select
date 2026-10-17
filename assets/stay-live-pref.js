(()=>{'use strict';
const container=document.getElementById('ss-live-pref-buttons');
const caption=document.getElementById('ss-live-pref-caption');
const prefSelect=document.getElementById('pref');
if(!container||!caption||!prefSelect)return;
const cards=new Map([...document.querySelectorAll('.ss-stay[data-stay-id]')].map(c=>[c.dataset.stayId,c]));
const collator=new Intl.Collator('ja');
function render(ids){
 if(!Array.isArray(ids))return;
 const totals=new Map();
 for(const id of ids){const card=cards.get(id);if(!card)continue;const pref=card.dataset.pref||'不明';totals.set(pref,(totals.get(pref)||0)+1)}
 const ordered=[...totals].sort((a,b)=>b[1]-a[1]||collator.compare(a[0],b[0]));
 const chosen=prefSelect.value;
 caption.textContent=ids.length?`${ids.length}施設・${ordered.length}都道府県が一致（表示上限24件より多い場合も全件集計）。県名を押すと絞り込めます。`:'一致する施設がありません。条件を変更してください。';
 container.replaceChildren();
 if(chosen){const reset=document.createElement('button');reset.type='button';reset.className='ss-live-pref-chip ss-live-pref-clear';reset.textContent=`${chosen}の絞り込みを解除`;reset.addEventListener('click',()=>{prefSelect.value='';prefSelect.dispatchEvent(new Event('change',{bubbles:true}));});container.appendChild(reset)}
 for(const [name,count] of ordered.slice(0,10)){
  const b=document.createElement('button');b.type='button';b.className='ss-live-pref-chip';b.textContent=`${name} ${count}件`;b.setAttribute('aria-label',`${name}の${count}施設に絞り込む`);b.setAttribute('aria-pressed',String(chosen===name));b.addEventListener('click',()=>{prefSelect.value=name;prefSelect.dispatchEvent(new Event('change',{bubbles:true}));prefSelect.focus({preventScroll:true});});container.appendChild(b)
 }
 if(ordered.length>10){const rest=document.createElement('span');rest.className='ss-live-pref-rest';rest.textContent=`ほか${ordered.length-10}都道府県（都道府県メニューから選択）`;container.appendChild(rest)}
}
window.addEventListener('ss:results',e=>render(e.detail?.ids));
render(window.SSCurrentResults||[...cards.keys()]);
})();
